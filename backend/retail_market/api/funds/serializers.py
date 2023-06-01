import json
import logging
import uuid
from typing import Union

from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.db.transaction import atomic
from django_q.tasks import async_task
from django.utils import timezone
from rest_framework import serializers
from slugify import slugify

from api.applications.models import Application
from api.backup.models import FundBackup, FundDocumentsBackup
from api.backup.serializers import LasalleApplicationReport, LasalleDocumentBackup, CompleteApplicationBackup
from api.comments.models import ModuleChoices
from api.comments.services.update_comment_status import UpdateCommentService
from api.companies.models import CompanyUser
from api.companies.serializers import CompanySerializer
from api.companies.services.leverage_details import GetLeverageOptionsService
from api.currencies.services.fund_currency_info import FundCurrencyDetail
from api.documents.models import FundDocument, Document, CompanyDataProtectionPolicyDocument, PublicFundDocument
from api.documents.services.upload_document import UploadedDocumentInfo, UploadDocumentService
from api.dsls.serializer_fields import FilterLangCharField
from api.funds.constants import CODE_TO_FILE_MAPPING
from api.funds.models import Fund, FundProfile, FundInterest, FundDocumentResponse, FundShareClass, \
    FundIndicationOfInterest, FundInterestQuestion, FundInterestUserAnswer, ExternalOnboarding, DocumentFilter
from api.funds.models import FundManager
from api.funds.models import FundTag
from api.funds.services.process_invite_file import ProcessInviteFileService
from api.investors.models import FundOrder
from api.investors.serializers import (
    FundInvestorSerializer, FundOrderSerializer, FundTagSerializer, RetrieveFundOrderSerializer
)
from api.investors.services.fund_investment_details_published_email import FundInvestorDetailsPublishedEmailService
from api.kyc_records.serializers import DocumentSerializer
from api.libs.sendgrid.email import SendEmailService
from api.libs.utils.identifiers import get_uuid


class FundManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundManager
        exclude = ('created_at', 'modified_at',)
        read_only_fields = ('company',)

    def create(self, validated_data):
        if 'company' not in validated_data:
            validated_data['company'] = self.context['company']

        return super().create(validated_data)


class FundSerializer(serializers.ModelSerializer):
    fund_type_name = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    fund_type_selector = serializers.SerializerMethodField()
    business_line_selector = serializers.SerializerMethodField()
    currency_selector = serializers.SerializerMethodField()
    invite_file = serializers.FileField(write_only=True, required=False, allow_null=True)
    partner_id = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    file_errors = None
    status = serializers.SerializerMethodField()
    has_eligibility_criteria = serializers.SerializerMethodField()
    can_start_accepting_applications = serializers.SerializerMethodField()
    can_finalize = serializers.SerializerMethodField()
    managers = FundManagerSerializer(many=True, required=False)
    fund_managers = serializers.JSONField(write_only=True, required=False)
    tags = FundTagSerializer(many=True, required=False)
    external_onboarding_url = serializers.URLField(required=False, allow_blank=True)
    document_filter = FilterLangCharField(allow_blank=True, required=False)

    def get_can_start_accepting_applications(self, obj: Fund) -> bool:
        try:
            has_external_onboarding = obj.external_onboarding.url is not None
        except ObjectDoesNotExist:
            has_external_onboarding = False
        return self.fund_has_elegibility_criteria(obj) or has_external_onboarding

    class Meta:
        model = Fund
        exclude = ('modified_at',)
        read_only_fields = ('slug', 'managers')

    def get_create_or_update_tags(self, tags):
        tag_ids = []
        if isinstance(tags, str):
            tags = json.loads(tags)

        for tag in tags:
            tag['company_id'] = self.context['company'].id
            tag_name = tag.get('name')
            if not tag_name:
                continue

            tag['slug'] = slugify(tag_name)

            tag_instance, created = FundTag.objects.get_or_create(
                company=self.context['company'],
                slug=tag['slug'],
                defaults={'name': tag_name}
            )
            tag_ids.append(tag_instance.pk)
        return tag_ids

    def create(self, validated_data):
        if not validated_data.get('company'):
            validated_data['company'] = self.context['company']

        if not validated_data.get('created_by'):
            validated_data['created_by'] = self.context['admin_user']

        if not validated_data.get('managed_by') and self.context.get('user'):
            validated_data['managed_by'] = self.context['user']

        if not validated_data.get('partner_id'):
            validated_data['partner_id'] = get_uuid()

        validated_data['slug'] = slugify(validated_data['name'])

        invite_file = validated_data.pop('invite_file', None)
        external_onboarding_url = validated_data.pop('external_onboarding_url', None)
        document_filter = validated_data.pop('document_filter', None)
        # validated_data['enable_internal_tax_flow'] = True
        with atomic():
            fund_managers = validated_data.pop('fund_managers', [])
            tags = getattr(self, 'initial_data', {}).get('tags', [])
            fund = super(FundSerializer, self).create(validated_data=validated_data)

            if fund_managers:
                fund.managers.set(fund_managers)

            if tags:
                fund.tags.set(self.get_create_or_update_tags(tags=tags))

            if invite_file:
                fund.is_invite_only = True
                fund.save()
                self.file_errors = ProcessInviteFileService(
                    in_memory_file=invite_file,
                    fund=fund
                ).process()
            if external_onboarding_url:
                ExternalOnboarding.objects.create(url=external_onboarding_url, fund=fund)
            if document_filter:
                DocumentFilter.objects.create(code=document_filter, fund=fund)
            return fund

    def update(self, instance, validated_data):
        invite_file = validated_data.pop('invite_file', None)

        fund_managers = validated_data.pop('fund_managers', [])
        if fund_managers:
            instance.managers.set(fund_managers)

        tags = getattr(self, 'initial_data', {}).get('tags', [])
        if tags:
            instance.tags.set(self.get_create_or_update_tags(tags=tags))

        external_onboarding_url = validated_data.pop('external_onboarding_url', None)
        document_filter = validated_data.pop('document_filter', None)
        is_finalized = validated_data.get('is_finalized', None)

        if external_onboarding_url:
            external_onboarding, created = ExternalOnboarding.objects.get_or_create(fund=instance, defaults={"url": external_onboarding_url})
            if not created:
                external_onboarding.url = external_onboarding_url
                external_onboarding.save()
        elif not self.partial or external_onboarding_url == '':
            try:
                instance.external_onboarding.delete()
            except ObjectDoesNotExist:
                logging.debug("External onboarding does not exist")

        if document_filter:
            document_filter_instance, created = DocumentFilter.objects.get_or_create(fund=instance, defaults={"code": document_filter})
            if not created:
                document_filter_instance.code = document_filter
                document_filter_instance.save()
        elif not self.partial or document_filter == '':
            try:
                instance.document_filter.delete()
            except ObjectDoesNotExist:
                logging.debug("Document filter does not exist")

        if is_finalized:
            async_task(self.application_task, fund_id=instance.id)
            async_task(self.document_list_task, fund_id=instance.id)
            async_task(self.document_task, fund_id=instance.id)
            # async_task(self.full_backup, fund_id=instance.id)

        if not invite_file:
            notify_investors = 'publish_investment_details' in validated_data \
                               and validated_data['publish_investment_details'] \
                               and instance.publish_investment_details is False
            updated_instance = super(FundSerializer, self).update(instance, validated_data)
            if notify_investors:
                # InvestmentDetailNotificationService(fund=updated_instance).process_fund()
                FundInvestorDetailsPublishedEmailService(fund_id=updated_instance.id).send_investment_published_email()
            return updated_instance

        self.file_errors = ProcessInviteFileService(
            in_memory_file=invite_file,
            fund=instance,
        ).process()
        return instance

    @staticmethod
    def application_task(fund_id):
        backup_storage = apps.get_app_config('backup').backup_storage
        fund = Fund.objects.get(pk=fund_id)
        output = fund.backup_serialized_to(LasalleApplicationReport, backup_storage)
        FundBackup.objects.create(fund_id=fund_id, storage_key=output['storage_key'])

    @staticmethod
    def document_list_task(fund_id):
        backup_storage = apps.get_app_config('backup').backup_storage
        fund = Fund.objects.get(pk=fund_id)
        output = fund.backup_serialized_documents_to(LasalleDocumentBackup, backup_storage)
        FundDocumentsBackup.objects.create(fund=fund, storage_key=output['storage_key'])

    @staticmethod
    def document_task(fund_id):
        backup_storage = apps.get_app_config('backup').backup_storage
        fund = Fund.objects.get(pk=fund_id)
        fund.backup_documents_to(backup_storage)

    @staticmethod
    def full_backup(fund_id):
        backup_storage = apps.get_app_config('backup').backup_storage
        fund = Fund.objects.get(pk=fund_id)
        output = fund.backup_serialized_to(CompleteApplicationBackup, backup_storage)

    @staticmethod
    def get_fund_type_name(obj: Fund) -> str:
        return obj.get_fund_type_display()

    @staticmethod
    def get_total(obj: Fund):
        return obj.sold + obj.unsold

    @staticmethod
    def get_fund_type_selector(obj: Fund) -> dict:
        return {
            'label': obj.get_fund_type_display(),
            'value': obj.fund_type
        }

    @staticmethod
    def get_business_line_selector(obj: Fund) -> Union[dict, None]:
        if not obj.business_line:
            return None
        return {
            'label': obj.get_business_line_display(),
            'value': obj.business_line
        }

    @staticmethod
    def get_currency_selector(obj: Fund) -> Union[dict, None]:
        if not obj.fund_currency:
            return None
        return {
            'label': obj.fund_currency.code,
            'value': obj.fund_currency_id
        }

    def format_file_errors(self):
        error_messages = []
        for error in self.file_errors:
            for field, errors in error.items():
                if field not in CODE_TO_FILE_MAPPING:
                    error_messages.append(', '.join(errors))
                    continue
                field_errors = ', '.join(errors)
                error_messages.append(
                    f'{CODE_TO_FILE_MAPPING[field]}: {field_errors}'
                )
        return ','.join(error_messages)

    def to_representation(self, instance):
        if self.file_errors:
            return {
                'id': instance.id,
                'invite_file_error': self.format_file_errors()
            }
        return super().to_representation(instance)

    def get_status(self, obj: Fund) -> str:
        if obj.publish_investment_details:
            return 'Live on Portal'

        if not (obj.is_published and obj.accept_applications):
            return 'In Draft'

        has_criteria = self.fund_has_elegibility_criteria(obj)
        if not (has_criteria or self.get_can_start_accepting_applications(obj)):
            return 'In Draft'

        if obj.close_applications:
            return 'Closed for New Applications'

        has_applications = obj.id in self.context.get('funds_with_eligibility_response', [])

        if not has_applications:
            return 'Accepting Applications'

        has_pending_applications = obj.id in self.context.get('fund_with_non_approved_eligibility_response', [])

        if has_pending_applications:
            return 'Applicant Review'

        if obj.is_finalized:
            return 'Finalized'

        return 'Live on Portal'

    def get_has_eligibility_criteria(self, obj: Fund):
        return self.fund_has_elegibility_criteria(obj)

    def fund_has_elegibility_criteria(self, obj):
        return obj.id in self.context.get('funds_with_published_criteria', [])

    @staticmethod
    def get_can_finalize(obj):
        has_applications = False
        has_pending_application = False
        for application in obj.applications.all():
            has_applications = True
            if application.status <= Application.Status.SUBMITTED:
                has_pending_application = True
                break

        return has_applications and not has_pending_application


class FundBaseInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        fields = ('id', 'name', 'slug', 'external_id', 'is_published', 'enable_internal_tax_flow', 'skip_tax')


class FundProfileSerializer(serializers.ModelSerializer):
    eligibility_criteria_headings = serializers.SerializerMethodField()

    class Meta:
        model = FundProfile
        exclude = ('created_at', 'modified_at',)

    @staticmethod
    def get_eligibility_criteria_headings(obj: FundProfile):
        criteria_keys = []
        if not obj.eligibility_criteria:
            return criteria_keys

        for criteria in obj.eligibility_criteria:
            criteria_keys.extend(criteria.keys())

        return list(set(criteria_keys))


class FundDetailSerializer(serializers.ModelSerializer):
    fund_investors = FundInvestorSerializer(many=True)
    fund_orders = FundOrderSerializer(many=True)
    company = CompanySerializer()
    fund_type_name = serializers.SerializerMethodField()
    business_line_name = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    application_period_start_date = serializers.DateField(format='%m/%d/%Y', default=None)
    application_period_end_date = serializers.DateField(format='%m/%d/%Y', default=None)
    confirmation_date = serializers.DateField(format='%B %d, %Y', default=None)
    anticipated_first_call_date = serializers.DateField(format='%m/%d/%Y', default=None)
    leverage_options = serializers.SerializerMethodField()
    user_leverage = serializers.SerializerMethodField()
    requested_allocations = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    fund_profile = FundProfileSerializer()
    tags = FundTagSerializer(many=True)
    managers = FundManagerSerializer(many=True)
    logo = serializers.SerializerMethodField()

    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_fund_type_name(obj: Fund) -> str:
        return obj.get_fund_type_display()

    @staticmethod
    def get_business_line_name(obj: Fund) -> str:
        return obj.get_business_line_display()

    @staticmethod
    def get_total(obj: Fund):
        return obj.sold + obj.unsold

    def get_company_user(self, fund: Fund):
        return CompanyUser.objects.get(
            company=fund.company,
            user=self.context['request'].user
        )

    def get_leverage_options(self, obj: Fund):
        company_user = self.get_company_user(fund=obj)
        leverage_service = GetLeverageOptionsService(company_user=company_user)
        return leverage_service.process()

    def get_user_leverage(self, obj: Fund):
        company_user = self.get_company_user(fund=obj)
        if company_user.role:
            return company_user.role.leverage_ratio
        return ''

    def get_requested_allocations(self, obj: Fund):
        company_user = self.get_company_user(fund=obj)  # type: CompanyUser
        requested_allocations = []
        for investor_id in company_user.associated_investor_profiles.values_list('investor_id', flat=True):
            try:
                requested_allocation = FundOrder.objects.filter(fund=obj, investor_id=investor_id).latest('created_at')
                requested_allocations.append(RetrieveFundOrderSerializer(requested_allocation).data)
            except FundOrder.DoesNotExist:
                continue
        return requested_allocations

    @staticmethod
    def get_currency(obj: Fund):
        fund_detail = FundCurrencyDetail(fund=obj)
        return fund_detail.process()

    @staticmethod
    def get_logo(obj: Fund):
        if obj.logo:
            return obj.logo.url
        if obj.company.logo:
            return obj.company.logo.url


class AdminFundDetailSerializer(serializers.ModelSerializer):
    fund_type_name = serializers.SerializerMethodField()
    business_line_name = serializers.SerializerMethodField()
    application_period_start_date = serializers.DateField(format='%m/%d/%Y', default=None)
    application_period_end_date = serializers.DateField(format='%m/%d/%Y', default=None)
    confirmation_date = serializers.DateField(format='%B %d, %Y', default=None)
    anticipated_first_call_date = serializers.DateField(format='%m/%d/%Y', default=None)
    currency = serializers.SerializerMethodField()
    fund_profile = FundProfileSerializer()
    tags = FundTagSerializer(many=True)
    managers = FundManagerSerializer(many=True)
    external_onboarding_url = serializers.URLField(source='external_onboarding.url', read_only=True)
    document_filter = serializers.CharField(source='document_filter.code', read_only=True)

    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_fund_type_name(obj: Fund) -> str:
        return obj.get_fund_type_display()

    @staticmethod
    def get_business_line_name(obj: Fund) -> str:
        return obj.get_business_line_display()

    @staticmethod
    def get_currency(obj: Fund):
        fund_detail = FundCurrencyDetail(fund=obj)
        return fund_detail.process()


class FundProfileDetailSerializer(serializers.ModelSerializer):
    fund_profile = FundProfileSerializer()
    company = CompanySerializer()
    fund_type = serializers.SerializerMethodField()
    currency = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
    indicated_interest = serializers.SerializerMethodField()

    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')

    @staticmethod
    def get_fund_type(obj: Fund):
        return obj.get_fund_type_display()

    @staticmethod
    def get_currency(obj: Fund):
        fund_detail = FundCurrencyDetail(fund=obj)
        return fund_detail.process()

    @staticmethod
    def get_documents(obj: Fund):
        documents = []
        for fund_doc in obj.fund_documents.all():
            document = fund_doc.document
            documents.append({
                'title': document.title,
                'document_id': document.document_id,
                'name': document.document_path.rsplit('/', 1)[-1],
                'extension': document.extension,
            })
        return documents

    def get_indicated_interest(self, obj: Fund):
        company_user = CompanyUser.objects.get(
            company=obj.company,
            user=self.context['request'].user
        )
        return FundIndicationOfInterest.objects.filter(fund=obj, user=company_user).exists()


class FundInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundInterest
        exclude = ('created_at', 'modified_at')
        read_only_fields = ('user',)

    def create(self, validated_data):
        company_user = CompanyUser.objects.get(
            company=validated_data['fund'].company,
            user=self.context['request'].user
        )
        validated_data['user'] = company_user
        return super().create(validated_data=validated_data)


class MarketingPageFundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fund
        exclude = ('created_at', 'modified_at')


class FundDocumentSerializer(serializers.ModelSerializer):
    document_name = serializers.CharField(source='document.title', default=None, read_only=True)
    document_id = serializers.CharField(source='document.document_id', default=None, read_only=True)
    doc_id = serializers.IntegerField(source='document_id', default=None, read_only=True)
    extension = serializers.CharField(source='document.extension', default=None, read_only=True)

    class Meta:
        model = FundDocument
        fields = '__all__'


class FundDocumentCreateSerializer(serializers.ModelSerializer):
    title = serializers.CharField()
    fund_external_id = serializers.CharField(write_only=True)
    document_file = serializers.FileField(write_only=True)

    class Meta:
        model = FundDocument
        fields = ('title', 'fund_external_id', 'document_file',)

    def create(self, validated_data):
        fund = Fund.objects.get(external_id=validated_data['fund_external_id'])
        uploaded_document_info = UploadDocumentService.upload(
            document_data=validated_data['document_file']
        )  # type: UploadedDocumentInfo

        document = Document.objects.create(
            title=validated_data['title'],
            content_type=uploaded_document_info.content_type,
            uploaded_by_admin=self.context['admin_user'],
            document_id=uploaded_document_info.document_id,
            document_path=uploaded_document_info.document_path,
            extension=uploaded_document_info.extension,
            partner_id=uuid.uuid4().hex,
            company=fund.company,
            access_scope=Document.AccessScopeOptions.COMPANY.value
        )
        FundDocument.objects.create(document=document, fund=fund)
        return validated_data


class FundDocumentResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundDocumentResponse
        fields = '__all__'
        read_only_fields = ('fund', 'user')

    def create(self, validated_data):
        fund_document_response, _ = FundDocumentResponse.objects.get_or_create(
            fund=self.context['fund'],
            user=self.context['company_user'],
        )
        current_response = fund_document_response.response_json
        if not current_response:
            current_response = {}

        response_json = {**current_response, **validated_data['response_json']}
        fund_document_response.response_json = response_json
        fund_document_response.save(update_fields=['response_json'])

        application = Application.objects.get(
            fund_id=self.context['fund'].id,
            user_id=self.context['company_user'].user_id
        )

        UpdateCommentService(
            module=ModuleChoices.FUND_DOCUMENTS.value,
            instance=fund_document_response,
            update_values={}
        ).update_application_module(application_id=application.id)

        return fund_document_response


class FundShareClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundShareClass
        fields = '__all__'


class FundDataProtectionPolicyDocumentSerializer(serializers.ModelSerializer):
    document = DocumentSerializer(read_only=True)

    class Meta:
        model = CompanyDataProtectionPolicyDocument
        fields = '__all__'


class FundIndicationOfInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundIndicationOfInterest
        fields = '__all__'


class BulkCreateInterestQuestionSerializer(serializers.ListSerializer):
    def create(self, validated_data):
        questions = [FundInterestQuestion(**item) for item in validated_data]
        return FundInterestQuestion.objects.bulk_create(questions)


class FundInterestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundInterestQuestion
        exclude = ('created_at', 'modified_at')
        list_serializer_class = BulkCreateInterestQuestionSerializer


class FundInterestUserAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = FundInterestUserAnswer
        exclude = ('created_at', 'modified_at')
        read_only_fields = ('user', )

    def create(self, validated_data):
        company_user = CompanyUser.objects.get(
            company=validated_data['question'].fund.company,
            user=self.context['request'].user
        )
        validated_data['user'] = company_user
        return super().create(validated_data=validated_data)


class PublicFundDocumentSerializer(serializers.ModelSerializer):
    document = DocumentSerializer(read_only=True)
    title = serializers.CharField(write_only=True)
    document_file = serializers.FileField(write_only=True)

    class Meta:
        model = PublicFundDocument
        fields = ('document', 'title', 'document_file',)

    def create(self, validated_data):
        uploaded_document_info = UploadDocumentService.upload(
            document_data=validated_data['document_file']
        )

        fund = Fund.objects.get(external_id=self.context['fund_external_id'])
        admin_user = self.context['admin_user']

        document = Document.objects.create(
            partner_id=uuid.uuid4().hex,
            content_type=uploaded_document_info.content_type,
            title=validated_data['title'],
            extension=uploaded_document_info.extension,
            document_id=uploaded_document_info.document_id,
            document_path=uploaded_document_info.document_path,
            document_type=Document.DocumentType.PUBLIC_DOCUMENT,
            file_date=timezone.now().date(),
            company=fund.company,
            access_scope=Document.AccessScopeOptions.COMPANY.value,
            uploaded_by_admin=admin_user
        )

        instance = PublicFundDocument.objects.create(
            fund=fund,
            document=document
        )

        return instance

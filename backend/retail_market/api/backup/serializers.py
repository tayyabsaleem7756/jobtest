from rest_framework.fields import SerializerMethodField, CharField, IntegerField, DateTimeField, UUIDField
from rest_framework.serializers import ModelSerializer

from api.applications.models import Application, ApplicationCompanyDocument
from api.applications.services.application_investment_details import ApplicationInvestmentDetails
from api.comments.serializers import ApplicationCommentSerializer
from api.companies.admin_views.serializers import CompanyDocumentSerializer
from api.documents.models import Document, ApplicationSupportingDocument
from api.documents.serializers import DocumentSerializer


class ApplicationSupportingDocumentBackup(ModelSerializer):
    class Meta:
        model = ApplicationSupportingDocument
        fields = '__all__'


class ApplicationCompanyDocumentBackup(ModelSerializer):
    company_document = CompanyDocumentSerializer()
    signed_document = DocumentSerializer(read_only=True)

    class Meta:
        model = ApplicationCompanyDocument
        fields = '__all__'


class CompleteApplicationBackup(ModelSerializer):
    application_comments = ApplicationCommentSerializer(many=True, allow_null=True)
    application_supporting_documents = ApplicationSupportingDocumentBackup(many=True, allow_null=True)
    application_company_documents = ApplicationCompanyDocumentBackup(many=True, allow_null=True)

    class Meta:
        model = Application
        fields = '__all__'
        depth = 3


class LasalleApplicationReport(ModelSerializer):
    uuid = UUIDField()
    account_name = SerializerMethodField()
    email = CharField(source='user.email', default=None)
    user_first_name = CharField(source='applicant_first_name')
    user_last_name = CharField(source='applicant_last_name')
    investor_account_code = CharField(source='investor.investor_account_code', default=None)
    investor_location = CharField(source='kyc_record.investor_location.name', default=None)
    risk_value = IntegerField(source='kyc_record.risk_value_kyc.risk_value', default=None)
    kyc_aml_completed_date = DateTimeField(source='kyc_record.created_at', default=None)
    fund_name = SerializerMethodField()
    investment_amount = SerializerMethodField()
    fund_currency = CharField(source='fund.fund_currency.name', default=None)
    acceptance_date = SerializerMethodField()
    vehicle_feeder = CharField(source='vehicle.name', default=None, allow_blank=True)

    @staticmethod
    def get_account_name(obj: Application):
        account_name = obj.user.full_name
        if obj.kyc_record:
            account_name = obj.kyc_record.get_display_name()
        return account_name

    @staticmethod
    def get_fund_name(obj: Application):
        return f"{obj.fund.name} {obj.share_class.legal_name if obj.share_class else ''}"

    @staticmethod
    def get_investment_amount(obj: Application):
        return ApplicationInvestmentDetails(application=obj).get()['total_investment']

    @staticmethod
    def get_acceptance_date(obj: Application):
        return obj.acceptance_date()

    class Meta:
        model = Application
        fields = ('uuid',
                  'account_name', 'user_first_name', 'user_last_name', 'email', 'vehicle_feeder', 'investor_account_code', 'investor_location',
                  'risk_value',
                  'kyc_aml_completed_date', 'fund_name', 'investment_amount', 'fund_currency', 'acceptance_date')


class LasalleDocumentBackup(ModelSerializer):

    file_name = CharField()

    class Meta:
        model = Document
        fields = '__all__'

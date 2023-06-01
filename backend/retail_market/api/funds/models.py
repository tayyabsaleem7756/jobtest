import os
from uuid import uuid4

from dateutil.utils import today
from django.db import models
from django.utils.translation import gettext_lazy as _

from api.funds.managers import PublishedFundManager

from api.libs.utils.nanoid_generator import generate_nanoid
from api.models import BaseModel


def fund_logo_upload_path(instance, filename):
    _, ext = os.path.splitext(filename)
    return 'funds/{fund_id}/logo-{uuid}{ext}'.format(
        fund_id=instance.id,
        uuid=uuid4().hex,
        ext=ext,
    )


def fund_manager_profile_image_path(instance, filename):
    return 'companies/{company_id}/fund-manager/profile-photo-{uuid}{filename}'.format(
        company_id=instance.id,
        uuid=uuid4().hex,
        filename=filename,
    )

def fund_banner_upload_path(instance, filename):
    _, ext = os.path.splitext(filename)
    return 'funds/{fund_id}/banner-{uuid}{ext}'.format(
        fund_id=instance.id,
        uuid=uuid4().hex,
        ext=ext,
    )


class FundTag(BaseModel):
    name = models.CharField(max_length=120)
    slug = models.CharField(max_length=120, db_index=True)
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='company_fund_tags'
    )

    class Meta:
        unique_together = (
            ('slug', 'company'),
        )


class FundManager(BaseModel):
    """ Fund manager model. """
    uuid = models.UUIDField(blank=False, null=False, default=uuid4, editable=False, verbose_name=_('UUID'))
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='company_fund_managers')
    full_name = models.CharField(max_length=255)
    bio = models.TextField(null=True, blank=True)
    profile_image = models.ImageField(upload_to=fund_manager_profile_image_path, null=True, blank=True)
    designation = models.CharField(max_length=250, null=True, blank=True)


class Fund(BaseModel):
    class FundTypeChoice(models.IntegerChoices):
        OPEN = 1, _('Open End, Private Equity')
        CLOSED = 2, _('Closed End, Private Equity')

    class BusinessLineChoice(models.IntegerChoices):
        AMERICAS_PRIVATE = 1, _('Americas Private')
        ASIA_PACIFIC_PRIVATE = 2, _('Asia Pacific Private')
        EUROPE_PRIVATE = 3, _('Europe Private')
        GLOBAL_PARTNER_SOLUTIONS = 4, _('Global Partner Solutions')
        GLOBAL_SECURITIES = 5, _('Global Securities')

    class StatusChoice(models.IntegerChoices):
        PUBLISH_OPPORTUNITY = 1, _('Publish Opportunity')
        ACCEPT_APPLICATIONS = 2, _('Accept Applications')
        PUBLISH_INVESTMENT_DETAILS = 3, _('Publish Investment Details')

    name = models.CharField(max_length=120)
    partner_id = models.CharField(max_length=250, unique=True, db_index=True)
    investment_product_code = models.CharField(max_length=250, null=True, blank=True)
    raw_investment_product_code = models.CharField(max_length=250, null=True, blank=True)
    vehicle_code = models.CharField(max_length=250, null=True, blank=True)
    external_id = models.CharField(max_length=14, unique=True, default=generate_nanoid, db_index=True)

    symbol = models.CharField(max_length=120, null=True, blank=True)
    slug = models.CharField(max_length=120, db_index=True)
    business_line = models.PositiveSmallIntegerField(choices=BusinessLineChoice.choices, null=True, blank=True)
    demand = models.DecimalField(max_digits=13, decimal_places=3, default=0, null=True, blank=True)
    unsold = models.DecimalField(max_digits=13, decimal_places=3, default=0, null=True, blank=True)
    sold = models.DecimalField(max_digits=13, decimal_places=3, default=0)
    existing_investors = models.DecimalField(max_digits=13, decimal_places=3, default=0)
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='company_funds'
    )
    created_by = models.ForeignKey(
        'admin_users.AdminUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_funds'
    )
    managed_by = models.ForeignKey(
        'companies.CompanyUser',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='managed_funds'
    )
    county_code = models.CharField(
        max_length=3,
        null=True,
        blank=True
    )

    deadline = models.DateField(null=True, blank=True)
    application_period_start_date = models.DateField(null=True, blank=True)
    application_period_end_date = models.DateField(null=True, blank=True)
    confirmation_date = models.DateField(null=True, blank=True)
    anticipated_first_call_date = models.DateField(null=True, blank=True)
    interest_rate = models.FloatField(null=True, blank=True)
    leverage_ratio = models.FloatField(null=True, blank=True)
    is_published = models.BooleanField(default=False)
    is_legacy = models.BooleanField(default=False)
    target_fund_size = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    firm_co_investment_commitment = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)

    domicile = models.ForeignKey(
        'geographics.Country',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='country_funds'
    )
    focus_region = models.CharField(max_length=250, null=True, blank=True)
    fund_currency = models.ForeignKey(
        'currencies.Currency',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='currency_funds'
    )
    type = models.CharField(max_length=250, null=True, blank=True)
    risk_profile = models.CharField(max_length=250, null=True, blank=True)
    investment_period = models.CharField(max_length=250, null=True, blank=True)
    fund_page = models.URLField(max_length=250, null=True, blank=True)
    minimum_investment = models.DecimalField(max_digits=13, decimal_places=3, default=0, null=True, blank=True)
    fund_type = models.PositiveSmallIntegerField(choices=FundTypeChoice.choices, null=True, blank=True)
    is_invite_only = models.BooleanField(default=False, null=True, blank=True)
    is_finalized = models.BooleanField(default=False, null=True, blank=True)
    offer_leverage = models.BooleanField(default=True)

    publish_investment_details = models.BooleanField(default=False)
    accept_applications = models.BooleanField(default=False)
    close_applications = models.BooleanField(default=False)
    open_for_indication_interest = models.BooleanField(default=False)
    logo = models.ImageField(upload_to=fund_logo_upload_path, null=True, blank=True)
    investment_description = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(FundTag, blank=True)
    is_nav_disabled = models.BooleanField(default=False, null=True, blank=True)
    target_irr = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    strategy = models.CharField(max_length=250, null=True, blank=True)
    managers = models.ManyToManyField(FundManager, blank=True, related_name='fund_managers')
    stats_json = models.JSONField(null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    long_description = models.TextField(null=True, blank=True)
    banner_image = models.ImageField(upload_to=fund_banner_upload_path, null=True, blank=True)

    enable_internal_tax_flow = models.BooleanField(default=False)
    skip_tax = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def backup_applications_to(self, backup_storage):
        applications = [application.deep_dump_flattened_instance(2, set()) for application in self.applications.all()]
        prefix = self._backup_prefix()
        application_object_key = f"{prefix}applications.csv"
        backup_storage.backup(application_object_key, applications)
        return {'prefix': prefix, 'storage_key': application_object_key}

    def approved_applications(self):
        """
            returns all approved applications, quite costly in terms of I/O operations because of the amounts of queries required to compute the status for a single application
        """
        from api.funds.services.fund_application_statuses import FundApplicationsStatusService
        active_applications = self.applications.filter(deleted=False, user__deleted=False)
        approved_applications = [app for app in active_applications if FundApplicationsStatusService(self, app).application_is_approved()]
        return approved_applications

    def backup_documents_to(self, backup_storage):
        for application in self.applications.all():
            application.backup_documents(backup_storage, self._backup_prefix())

    def _backup_prefix(self):
        prefix = f"investor-onboarding/{self.company.id}/{today().year}/{self.external_id}/"
        return prefix

    def backup_serialized_to(self, serializer, backup_storage):
        serialized = [serializer(app).data for app in self.approved_applications()]
        prefix = self._backup_prefix()
        application_object_key = f"{prefix}applications.csv"
        backup_storage.backup(application_object_key, serialized)
        return {'prefix': prefix, 'storage_key': application_object_key}

    def backup_serialized_documents_to(self, serializer, backup_storage):
        applications = self.approved_applications()
        serialized_kyc = self.compile_documents(applications, 'kyc', lambda app: app.compile_kyc_documents(serializer))
        serialized_tax = self.compile_documents(applications, 'tax', lambda app: app.compile_tax_documents(serializer))
        serialized_sup = self.compile_documents(applications, 'supporting', lambda app: app.compile_supporting_documents(serializer))
        serialized_signed_company_documents = self.compile_documents(applications,
                                                                     'signed_company_docs',
                                                                     lambda app: app.compile_signed_company_documents(serializer))

        serialized_certificate_company_documents = self.compile_documents(applications,
                                                                          'certificate_company_docs',
                                                                          lambda app: app.compile_supporting_documents(serializer))
        serialized_agreements = self.compile_documents(applications,
                                                       'agreements',
                                                       lambda app: app.compile_agreements(serializer))
        power_of_attorney_documents = self.compile_documents(applications,
                                                             'power_of_attorney',
                                                             lambda app: app.power_of_attorney_documents(serializer))
        documents = serialized_sup + \
                    serialized_tax + \
                    serialized_kyc + \
                    serialized_signed_company_documents + \
                    serialized_certificate_company_documents + \
                    power_of_attorney_documents + \
                    serialized_agreements
        prefix = self._backup_prefix()
        application_object_key = f"{prefix}documents.csv"
        backup_storage.backup(application_object_key, documents)
        return {'prefix': prefix, 'storage_key': application_object_key}

    def compile_documents(self, applications, doc_type, doc_function):
        documents = []
        for app in applications:
            for doc in doc_function(app):
                file_name = doc['file_name']
                backup_name = f"{app.applicant_full_name()}_{doc_type}_{file_name}"
                added_fields = {'application_uuid': app.uuid,
                                'type': doc_type,
                                'backup_name': backup_name}
                documents.append({**doc, **added_fields})
        return documents

class ExternalOnboarding(BaseModel):
    url = models.URLField(max_length=200)
    fund = models.OneToOneField(Fund, on_delete=models.CASCADE, related_name="external_onboarding")

    class Meta:
        db_table = 'external_onboardings'


class DocumentFilter(BaseModel):
    code = models.TextField(max_length=1000)
    fund = models.OneToOneField(Fund, on_delete=models.CASCADE, related_name="document_filter")

    class Meta:
        db_table = 'document_filter'


class PublishedFund(Fund):
    objects = PublishedFundManager()

    class Meta:
        proxy = True


class FundProfile(BaseModel):
    fund = models.OneToOneField('Fund', on_delete=models.CASCADE, related_name='fund_profile')
    investment_region = models.CharField(max_length=250, null=True, blank=True)
    target_size = models.CharField(max_length=250)
    target_investment_markets = models.CharField(max_length=250)
    target_return = models.CharField(max_length=250)
    employee_investment_period = models.CharField(max_length=250)
    allocation_request_dates = models.CharField(max_length=250, null=True, blank=True)
    intro = models.TextField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    eligibility_criteria = models.JSONField(null=True, blank=True)


class FundNav(BaseModel):
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='company_navs'
    )
    fund = models.ForeignKey(
        'Fund',
        on_delete=models.CASCADE,
        related_name='fund_navs'
    )
    nav = models.DecimalField(max_digits=21, decimal_places=9, default=0)
    as_of = models.DateField(db_index=True)


class FundInterest(BaseModel):
    fund = models.ForeignKey('Fund', on_delete=models.CASCADE, related_name='fund_interests')
    user = models.ForeignKey('companies.CompanyUser', on_delete=models.CASCADE, related_name='interested_in_funds')
    interest_details = models.JSONField(null=True, blank=True)

    # The equity portion the user is thinking to invest.
    equity_amount = models.DecimalField(max_digits=13, decimal_places=3, default=0)

    # You don't have to use leverage
    leverage_amount = models.DecimalField(max_digits=13, decimal_places=3, default=0, blank=True)


class FundDocumentResponse(BaseModel):
    fund = models.ForeignKey('Fund', on_delete=models.CASCADE, related_name='fund_document_Responses')
    user = models.ForeignKey('companies.CompanyUser', on_delete=models.CASCADE, related_name='user_document_responses')
    response_json = models.JSONField(null=True, blank=True)

    class Meta:
        unique_together = (
            ('fund', 'user'),
        )


class FundShareClass(BaseModel):
    display_name = models.CharField(max_length=120)
    legal_name = models.CharField(max_length=120)
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='company_share_fund_classes'
    )
    fund = models.ForeignKey(
        'Fund',
        on_delete=models.CASCADE,
    )
    company_fund_vehicle = models.ForeignKey(
        'companies.CompanyFundVehicle',
        on_delete=models.CASCADE,
        related_name='fund_vehicle_share_classes'
    )
    leverage = models.FloatField(null=True, blank=True)

    @property
    def name(self):
        return self.legal_name


class FundIndicationOfInterest(BaseModel):
    fund = models.ForeignKey(
        'Fund',
        on_delete=models.CASCADE,
        related_name='fund_indication_of_interest'
    )
    user = models.ForeignKey(
        'companies.CompanyUser',
        on_delete=models.CASCADE
    )
    response_json = models.JSONField(null=True, blank=True)


class FundInterestQuestion(BaseModel):
    fund = models.ForeignKey('Fund', on_delete=models.CASCADE, related_name='fund_interest_questions')
    question = models.TextField()
    question_type = models.CharField(max_length=250)
    options = models.JSONField(default=list)


class FundInterestUserAnswer(BaseModel):
    user = models.ForeignKey('companies.CompanyUser', on_delete=models.CASCADE, related_name='user_interest_answer')
    question = models.ForeignKey(
        'FundInterestQuestion',
        on_delete=models.CASCADE,
        related_name='fund_interest_question_answers'
    )
    answer = models.TextField()

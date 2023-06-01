import os
from uuid import uuid4

from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.utils.translation import gettext_lazy as _
from simple_history.models import HistoricalRecords

from api.eligibility_criteria.blocks_data.block_ids import KEY_INVESTMENT_INFORMATION_ID, APPROVAL_CHECKBOX_ID, \
    NO_LOCAL_REQUIREMENT_BLOCK_ID
from api.eligibility_criteria.utils.eligibility_criteria import get_eligibility_criteria_name
from api.investors.models import Investor
from api.models import BaseModel
from api.users.constants import FINANCIAL_ELIGIBILITY_REVIEWER, KNOWLEDGEABLE_ELIGIBILITY_REVIEWER, NO_REVIEW_REQUIRED


def block_logo_upload_path(instance, filename):
    _, ext = os.path.splitext(filename)
    return 'companies/{company_id}/block-logos/logo-{uuid}{ext}'.format(
        company_id=instance.company_id,
        uuid=uuid4().hex,
        ext=ext,
    )


def block_document_upload_path(instance, filename):
    _, ext = os.path.splitext(filename)
    return 'eligibility_docs/block_doc_id/logo-{uuid}{ext}'.format(
        block_doc_id=instance.id,
        uuid=uuid4().hex,
        ext=ext,
    )


class BlockCategory(BaseModel):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='company_block_categories')
    name = models.CharField(max_length=120)
    position = models.PositiveSmallIntegerField(default=1)


class Block(BaseModel):
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='company_blocks')
    logo = models.ImageField(upload_to=block_logo_upload_path, null=True, blank=True)
    heading = models.TextField()
    title = models.TextField(null=True, blank=True)
    description = models.TextField()
    require_file = models.BooleanField(default=False)
    allow_multiple_files = models.BooleanField(default=False)
    admin_uploaded_files = models.BooleanField(default=False)
    has_checkboxes = models.BooleanField(default=False)
    category = models.ForeignKey('BlockCategory', on_delete=models.CASCADE, related_name='category_blocks')
    options = models.JSONField(null=True, blank=True)
    block_id = models.CharField(max_length=120)
    is_admin_only = models.BooleanField(default=False)
    country = models.ForeignKey(
        'geographics.Country',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='country_blocks'
    )
    region = models.ForeignKey(
        'geographics.Region',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='region_blocks'
    )

    class Meta:
        unique_together = ('company', 'category', 'block_id')


class FundEligibilityCriteria(BaseModel):
    class CriteriaStatusChoice(models.IntegerChoices):
        DRAFT = 1, _('Draft')
        PENDING_APPROVAL = 2, _('Pending Approval')
        APPROVED = 3, _('Approved')
        PUBLISHED = 4, _('Published')

    fund = models.ForeignKey('funds.Fund', on_delete=models.CASCADE, related_name='fund_eligibility_criteria')
    created_by = models.ForeignKey(
        'admin_users.AdminUser',
        on_delete=models.SET_NULL,
        related_name='created_eligibility_criteria',
        null=True,
        blank=True
    )
    investor_type = models.PositiveSmallIntegerField(choices=Investor.VehicleTypeChoice.choices, null=True, blank=True)
    status = models.PositiveSmallIntegerField(
        choices=CriteriaStatusChoice.choices,
        default=CriteriaStatusChoice.DRAFT.value
    )
    last_modified = models.DateTimeField(null=True, blank=True)
    workflow = models.OneToOneField(
        'workflows.WorkFlow',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='workflow_eligibility_criteria'
    )
    custom_expression = models.JSONField(null=True)

    expression_override = models.TextField(blank=True, null=True)
    smart_canvas_payload = models.JSONField(null=True)
    is_smart_criteria = models.BooleanField(default=False)

    @property
    def name(self):
        return get_eligibility_criteria_name(self)

    def get_has_custom_logic_block(self):
        return self.criteria_blocks.filter(is_custom_logic_block=True).exists()

    def get_criteria_blocks_str_ids(self, criteria_blocks):
        if not self.is_smart_criteria:
            criteria_blocks = self.criteria_blocks.select_related('block').all()

        block_ids = []
        for c_block in criteria_blocks:
            if c_block.block:
                block_ids.append(c_block.block.block_id)
            elif c_block.custom_block:
                block_ids.append(str(c_block.custom_block_id))
        return block_ids

    def is_self_certified(self, criteria_blocks=None):
        if not criteria_blocks:
            criteria_blocks = []
        criteria_block_ids = self.get_criteria_blocks_str_ids(criteria_blocks=criteria_blocks)
        return len(criteria_block_ids) == 1 and any(
            _id in criteria_block_ids for _id in [
                KEY_INVESTMENT_INFORMATION_ID,
                NO_LOCAL_REQUIREMENT_BLOCK_ID,
                APPROVAL_CHECKBOX_ID
            ]
        )

    def parse_custom_expression(self):
        tokens = []
        if not self.get_has_custom_logic_block() or not self.custom_expression:
            return None
        for token in self.custom_expression:
            tokens.append(str(token['id']).lower())
        return ' '.join(tokens)


class FundCriteriaRegion(BaseModel):
    fund_criteria = models.ForeignKey(
        'FundEligibilityCriteria',
        on_delete=models.CASCADE,
        related_name='criteria_regions'
    )
    region = models.ForeignKey(
        'geographics.Region',
        on_delete=models.CASCADE,
        related_name='region_criteria'
    )


class FundCriteriaCountry(BaseModel):
    fund_criteria = models.ForeignKey(
        'FundEligibilityCriteria',
        on_delete=models.CASCADE,
        related_name='criteria_countries'
    )
    country = models.ForeignKey(
        'geographics.Country',
        on_delete=models.CASCADE,
        related_name='country_criteria'
    )


class CriteriaBlockGroup(BaseModel):
    criteria = models.ForeignKey(
        'FundEligibilityCriteria',
        on_delete=models.CASCADE,
        related_name='criteria_block_groups'
    )
    name = models.CharField(max_length=120)


class CriteriaBlock(BaseModel):
    block = models.ForeignKey('Block', on_delete=models.CASCADE, null=True, blank=True)
    custom_block = models.ForeignKey('CustomSmartBlock', on_delete=models.CASCADE, null=True, blank=True)
    criteria = models.ForeignKey('FundEligibilityCriteria', on_delete=models.CASCADE, related_name='criteria_blocks')
    position = models.PositiveSmallIntegerField(null=True, blank=True)
    group = models.ForeignKey(
        'CriteriaBlockGroup',
        on_delete=models.CASCADE,
        related_name='group_blocks',
        null=True,
        blank=True
    )
    is_final_step = models.BooleanField(default=False)
    is_country_selector = models.BooleanField(default=False)
    is_investor_type_selector = models.BooleanField(default=False)
    is_user_documents_step = models.BooleanField(default=False)
    is_custom_block = models.BooleanField(default=False)
    is_custom_logic_block = models.BooleanField(default=False)
    is_smart_block = models.BooleanField(default=False)

    auto_completed = models.BooleanField(default=False)
    payload = models.JSONField(default=dict)

    @property
    def is_eligibility_block(self):
        return not (
                self.is_custom_logic_block or
                self.is_final_step or
                self.is_country_selector or
                self.is_investor_type_selector or
                self.is_user_documents_step or (
                        self.block and self.block.is_admin_only
                )
        )

    @property
    def block_title(self):
        if self.custom_block:
            return self.custom_block.title
        if self.block:
            return self.block.heading
        return ''


class CriteriaBlockConnector(BaseModel):
    from_block = models.ForeignKey('CriteriaBlock', on_delete=models.CASCADE, related_name='block_connected_to')
    to_block = models.ForeignKey('CriteriaBlock', on_delete=models.CASCADE, related_name='block_connected_from')
    connector_color = models.CharField(max_length=120)
    condition = models.CharField(max_length=250)
    from_option = models.CharField(max_length=250, null=True, blank=True)


class CriteriaBlockGroupConnector(BaseModel):
    from_group = models.ForeignKey('CriteriaBlock', on_delete=models.CASCADE, related_name='group_connected_to')
    to_group = models.ForeignKey('CriteriaBlock', on_delete=models.CASCADE, related_name='group_connected_from')
    connector_color = models.CharField(max_length=120)
    condition = models.CharField(max_length=250)


class InvestmentAmount(BaseModel):
    history = HistoricalRecords()
    amount = models.DecimalField(decimal_places=3, default=0, max_digits=13)
    leverage_ratio = models.FloatField(default=0)
    final_amount = models.DecimalField(decimal_places=3, default=0, max_digits=13)
    final_leverage_ratio = models.FloatField(default=0)
    final_leverage = models.DecimalField(decimal_places=3, max_digits=13, null=True, blank=True)
    total_investment = models.DecimalField(decimal_places=3, max_digits=13, null=True, blank=True)
    deleted = models.BooleanField(default=False)

    def get_final_amount(self):
        if self.final_amount:
            return float(self.final_amount)
        return float(self.amount)

    def get_final_leverage_ratio(self):
        if self.final_leverage_ratio:
            return float(self.final_leverage_ratio)

        return float(self.leverage_ratio)

    def get_total_leverage(self):
        if self.final_leverage:
            return float(self.final_leverage)

        return float(self.get_final_amount()) * self.get_final_leverage_ratio()

    def get_total_investment(self):
        if self.total_investment:
            return float(self.total_investment)

        return self.get_final_amount() + self.get_total_leverage()


class EligibilityCriteriaResponse(BaseModel):
    response_by = models.ForeignKey('companies.CompanyUser', on_delete=models.CASCADE)
    criteria = models.ForeignKey('FundEligibilityCriteria', on_delete=models.CASCADE)
    last_position = models.PositiveSmallIntegerField(default=1)
    is_knowledgeable = models.BooleanField(default=False)
    is_financial = models.BooleanField(default=False)
    is_eligible = models.BooleanField(default=False)
    is_self_certified = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)
    investment_amount = models.ForeignKey(
        'InvestmentAmount',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='investment_criteria_response'
    )
    kyc_record = models.ForeignKey(
        'kyc_records.KYCRecord',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='customer_eligibility_criteria_responses'
    )
    workflow = models.OneToOneField(
        'workflows.WorkFlow',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='eligibility_response'
    )
    deleted = models.BooleanField(default=False)


class CriteriaBlockResponse(BaseModel):
    criteria_response = models.ForeignKey('EligibilityCriteriaResponse', related_name='user_block_responses',
                                          on_delete=models.CASCADE)
    block = models.ForeignKey('CriteriaBlock', related_name='user_responses', on_delete=models.CASCADE)
    response_json = models.JSONField()


class ResponseBlockDocument(BaseModel):
    response_block = models.ForeignKey(
        'CriteriaBlockResponse',
        on_delete=models.CASCADE,
        related_name='response_block_documents'
    )
    document = models.ForeignKey(
        'documents.Document',
        on_delete=models.CASCADE,
        related_name='document_response_blocks'
    )
    payload = models.JSONField(default=dict)


class CustomSmartBlock(BaseModel):
    fund = models.ForeignKey(
        'funds.Fund',
        on_delete=models.CASCADE,
        related_name='fund_custom_smart_blocks'
    )
    eligibility_criteria = models.ForeignKey(
        'FundEligibilityCriteria',
        on_delete=models.CASCADE,
        related_name='criteria_custom_smart_blocks'
    )
    company = models.ForeignKey(
        'companies.Company',
        on_delete=models.CASCADE,
        related_name='company_custom_smart_blocks'
    )
    created_by = models.ForeignKey(
        'admin_users.AdminUser',
        on_delete=models.SET_NULL,
        related_name='created_custom_smart',
        null=True,
        blank=True
    )
    title = models.TextField()
    description = models.TextField(blank=True, null=True)
    is_multiple_selection_enabled = models.BooleanField(default=True)

    class Meta:
        unique_together = ('eligibility_criteria', 'title',)


class CustomSmartBlockField(BaseModel):
    class ReviewersRequiredChoice(models.TextChoices):
        FINANCIAL_ELIGIBILITY_REVIEWER = FINANCIAL_ELIGIBILITY_REVIEWER, _('Financial Eligibility Reviewer')
        KNOWLEDGEABLE_ELIGIBILITY_REVIEWER = KNOWLEDGEABLE_ELIGIBILITY_REVIEWER, _('Knowledgeable Eligibility Reviewer')
        NO_REVIEW_REQUIRED = NO_REVIEW_REQUIRED, _('No Review Required')

    block = models.ForeignKey(
        'CustomSmartBlock',
        on_delete=models.CASCADE,
        related_name='custom_fields'
    )
    title = models.TextField()
    marks_as_eligible = models.BooleanField(default=True)
    reviewers_required = ArrayField(
        base_field=models.CharField(
            max_length=120,
            choices=ReviewersRequiredChoice.choices
        ),
        default=list,
        blank=True
    )
    required_documents = models.JSONField(default=list)

    class Meta:
        ordering = ("created_at",)

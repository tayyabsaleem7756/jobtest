import uuid

from django.db import models

from api.models import BaseModel


class CapitalCall(BaseModel):
    fund = models.ForeignKey('funds.Fund', on_delete=models.CASCADE, related_name='fund_capital_calls')
    company_user = models.ForeignKey(
        'companies.CompanyUser',
        on_delete=models.CASCADE,
        related_name='user_capital_calls'
    )
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='company_capital_calls')
    fund_investor = models.ForeignKey(
        'investors.FundInvestor',
        on_delete=models.CASCADE,
        related_name='investor_capital_calls'
    )
    due_date = models.DateField()
    call_amount = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)


class FundCapitalCall(BaseModel):
    fund = models.ForeignKey('funds.Fund', on_delete=models.CASCADE, related_name='capital_calls_funds')
    company = models.ForeignKey('companies.Company', on_delete=models.CASCADE, related_name='capital_calls_company')
    due_date = models.DateField(null=True, blank=True)
    created_timestamp = models.DateField()
    approved_at = models.DateTimeField(null=True, blank=True)
    document = models.OneToOneField(
        'documents.Document',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    workflow = models.OneToOneField(
        'workflows.WorkFlow',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='workflow_capital_call'
    )

    class Meta:
        ordering = ('-created_at',)


class CapitalCallDetail(BaseModel):
    user = models.ForeignKey(
        'users.RetailUser',
        on_delete=models.CASCADE,
        related_name='capital_call_user_detail'
    )
    amount = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    fulfilled_from_loan = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    investor_obligation = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    investment = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    management_fees = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    organization_cost = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    fund_expenses = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    total_to_date = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    partner_commitment = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    previously_contributed = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    total_amount_due = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    unpaid_commitment = models.DecimalField(max_digits=13, decimal_places=3, null=True, blank=True)
    capital_call = models.ForeignKey(
        FundCapitalCall,
        on_delete=models.CASCADE,
        related_name='capital_call_details'
    )
    notice = models.OneToOneField(
        'documents.Document',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='capital_call_detail'
    )

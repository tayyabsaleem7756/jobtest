import uuid

from django.db import models

from api.models import BaseModel
from simple_history.models import HistoricalRecords
from django.utils.translation import gettext_lazy as _


class RequestStatusChoice(models.IntegerChoices):
    PENDING = 1, _('Pending')
    ACCEPTED = 2, _('Accepted')
    DENIED = 3, _('Denied')
    COMPLETED = 4, _('Completed')


class Investor(BaseModel):
    class VehicleTypeChoice(models.IntegerChoices):
        INDIVIDUAL = 1, _('Individual')
        ENTITY = 2, _('Entity')

    leverage_used = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    name = models.CharField(max_length=120)
    partner_id = models.CharField(max_length=250, db_index=True, unique=True)
    investor_account_code = models.CharField(max_length=250, db_index=True, unique=True)
    vehicle_type = models.PositiveSmallIntegerField(
        choices=VehicleTypeChoice.choices,
        null=True,
        blank=True
    )
    history = HistoricalRecords()


class CompanyUserInvestor(BaseModel):
    class InvestorRoleChoices(models.IntegerChoices):
        MANAGER = 1, _('Manager')

    company_user = models.ForeignKey(
        'companies.CompanyUser',
        on_delete=models.CASCADE,
        related_name='associated_investor_profiles'
    )
    investor = models.ForeignKey(
        'Investor',
        on_delete=models.CASCADE,
        related_name='associated_users'
    )
    role = models.PositiveSmallIntegerField(
        choices=InvestorRoleChoices.choices,
        default=InvestorRoleChoices.MANAGER.value
    )

    class Meta:
        unique_together = ('company_user', 'investor')


class FundInvestor(BaseModel):
    fund = models.ForeignKey('funds.Fund', on_delete=models.CASCADE, related_name='fund_investors')
    investor = models.ForeignKey('Investor', on_delete=models.CASCADE, related_name='invested_funds')

    initial_leverage_ratio = models.FloatField(default=0)
    current_leverage_ratio = models.FloatField(default=0)

    latest_transaction_date = models.DateTimeField(null=True, blank=True)

    purchase_price = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    commitment_to_date = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    uncalled_amount = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    total_distributions = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    distributions_used_for_loan = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    distributions_used_for_interest = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    distributions_recallable = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    distributions_to_employee = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    pending_distributions = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    leverage_used = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    loan_balance_with_unpaid_interest = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    loan_balance = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    current_interest_rate = models.FloatField(default=0)
    interest_accrued = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    interest_paid = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    unpaid_interest = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    loan_commitment = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    gross_share_of_investment_product = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    commitment_amount = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    equity_commitment = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    equity_called = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    called_to_date = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    current_net_equity = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    fund_ownership_percent = models.FloatField(default=0)
    fund_nav_date = models.DateField(null=True, blank=True)

    nav_share = models.DecimalField(max_digits=21, decimal_places=9, default=0)
    remaining_equity = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    gain = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    unrealized_gain = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    currency = models.ForeignKey(
        'currencies.Currency',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='currency_fund_investors'
    )

    leveraged_irr = models.FloatField(default=0)
    un_leveraged_irr = models.FloatField(default=0)

    last_nav_update = models.DateTimeField(null=True, blank=True)
    capital_calls_since_last_nav = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    distributions_calls_since_last_nav = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    return_of_capital = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    profit_distributions = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    loan_drawn = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    loan_repayment = models.DecimalField(max_digits=18, decimal_places=8, default=0)
    gross_distributions_recallable_to_date = models.DecimalField(max_digits=18, decimal_places=8, default=0)

    order = models.ForeignKey(
        'FundOrder',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='order_allocations'
    )


class FundOrder(BaseModel):
    fund = models.ForeignKey('funds.Fund', on_delete=models.CASCADE, related_name='fund_orders')
    investor = models.ForeignKey('Investor', on_delete=models.CASCADE, related_name='invested_orders')
    handled_by = models.ForeignKey(
        'companies.CompanyUser',
        on_delete=models.SET_NULL,
        related_name='handled_fund_orders',
        null=True,
        blank=True
    )
    used_role_leverage = models.ForeignKey('companies.CompanyRole', null=True, blank=True, on_delete=models.SET_NULL)
    requested_allocation = models.DecimalField(max_digits=18, decimal_places=8)
    requested_leverage = models.DecimalField(max_digits=18, decimal_places=8)
    approved_allocation = models.DecimalField(max_digits=18, decimal_places=8, null=True, blank=True)
    status = models.PositiveSmallIntegerField(
        choices=RequestStatusChoice.choices,
        default=RequestStatusChoice.PENDING.value
    )

    class Meta:
        ordering = ("-created_at",)


class FundSale(BaseModel):
    sold_by = models.ForeignKey('Investor', on_delete=models.CASCADE, related_name='investor_sales')
    fund = models.ForeignKey('funds.Fund', on_delete=models.CASCADE, related_name='fund_sales')
    purchased_by = models.ForeignKey(
        'Investor',
        on_delete=models.CASCADE,
        related_name='purchased_sales',
        null=True,
        blank=True
    )
    requested_sale = models.DecimalField(max_digits=18, decimal_places=8)
    status = models.PositiveSmallIntegerField(
        choices=RequestStatusChoice.choices,
        default=RequestStatusChoice.PENDING.value
    )


class FundSaleOffer(BaseModel):
    sale = models.ForeignKey(
        'FundSale',
        on_delete=models.CASCADE,
        related_name='sale_offers'
    )
    offered_by = models.ForeignKey('Investor', on_delete=models.CASCADE, related_name='fund_purchase_offers')
    offer_amount = models.DecimalField(max_digits=18, decimal_places=8)
    leverage_requested = models.DecimalField(max_digits=18, decimal_places=8)
    status = models.PositiveSmallIntegerField(
        choices=RequestStatusChoice.choices,
        default=RequestStatusChoice.PENDING.value
    )

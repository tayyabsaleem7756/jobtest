from django.db.models.signals import post_save
from django.dispatch import receiver

from api.activities.models import FundActivity, LoanActivity
from api.activities.services.update_fund_investor import FundInvestorActivityService
from api.activities.utils.has_loan import fund_investor_has_loan


@receiver(post_save, sender=FundActivity)
def update_investment_from_fund_activity(sender, instance: FundActivity, created, **kwargs):
    if FundActivity.objects.filter(
            investor_account_code=instance.investor_account_code,
            investment_product_code=instance.investment_product_code,
            transaction_date__gt=instance.transaction_date).exists():
        return
    try:
        loan_activity = LoanActivity.objects.filter(
            company=instance.company,
            investor_account_code=instance.investor_account_code,
            investment_product_code=instance.investment_product_code
        ).latest('transaction_date')
    except LoanActivity.DoesNotExist:
        if fund_investor_has_loan(fund_activity=instance):
            return
        loan_activity = None

    try:
        investment_service = FundInvestorActivityService(fund_activity=instance, loan_activity=loan_activity)
        investment_service.update_values()
    except Exception as e:
         # TODO: Configure Logger
        print(e)


@receiver(post_save, sender=LoanActivity)
def update_investment_from_loan_activity(sender, instance: LoanActivity, created, **kwargs):
    if LoanActivity.objects.filter(
            investor_account_code=instance.investor_account_code,
            investment_product_code=instance.investment_product_code,
            transaction_date__gt=instance.transaction_date).exists():
        return
    try:
        fund_activity = FundActivity.objects.filter(
            company=instance.company,
            investment_product_code=instance.investment_product_code,
            investor_account_code=instance.investor_account_code
        ).latest('transaction_date')
    except FundActivity.DoesNotExist:
        return

    try:
        investment_service = FundInvestorActivityService(fund_activity=fund_activity, loan_activity=instance)
        investment_service.update_values()
    except Exception as e:
        #  TODO: Configure Logger
        print(e)

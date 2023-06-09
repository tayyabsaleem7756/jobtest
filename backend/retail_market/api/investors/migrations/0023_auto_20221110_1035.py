# Generated by Django 3.2.15 on 2022-11-10 10:35

from django.db import migrations

from api.companies.constants import DEMO_COMPANY_NAME
from api.investors.services.demo_investment_data.data import AWESOME_OPPORTUNITY_FUND, AWESOME_OPPORTUNITY_INVESTMENT, \
    AWESOME_CORE_FUND, AWESOME_CORE_INVESTMENT
from api.investors.services.demo_investment_data.demo_investment_service import LoadDummyDataService

USER_EMAIL = 'jen+demo@hellosidecar.com'
INVESTOR_NAME = 'Jen'
INVESTOR_ACCOUNT_CODE = 'Jen'


def setup_investment(apps, schema_editor):
    Company = apps.get_model('companies', 'Company')
    RetailUser = apps.get_model('users', 'RetailUser')
    CompanyUser = apps.get_model('companies', 'CompanyUser')
    Investor = apps.get_model('investors', 'Investor')
    CompanyUserInvestor = apps.get_model('investors', 'CompanyUserInvestor')
    FundInvestor = apps.get_model('investors', 'FundInvestor')
    Fund = apps.get_model('funds', 'Fund')
    FundNav = apps.get_model('funds', 'FundNav')
    Currency = apps.get_model('currencies', 'Currency')
    CurrencyRate = apps.get_model('currencies', 'CurrencyRate')
    Country = apps.get_model('geographics', 'Country')

    data_service = LoadDummyDataService(
        retail_user_model=RetailUser,
        fund_model=Fund,
        company_model=Company,
        company_user_model=CompanyUser,
        company_user_investor_model=CompanyUserInvestor,
        investor_model=Investor,
        fund_investor_model=FundInvestor,
        currency_model=Currency,
        country_model=Country,
        fund_nav_model=FundNav,
        currency_rate=CurrencyRate
    )

    data_service.process(
        email=USER_EMAIL,
        company_name=DEMO_COMPANY_NAME,
        fund_data=AWESOME_OPPORTUNITY_FUND,
        investment_data=AWESOME_OPPORTUNITY_INVESTMENT,
        investor_name=INVESTOR_NAME,
        investor_account_code=INVESTOR_ACCOUNT_CODE
    )

    data_service.process(
        email=USER_EMAIL,
        company_name=DEMO_COMPANY_NAME,
        fund_data=AWESOME_CORE_FUND,
        investment_data=AWESOME_CORE_INVESTMENT,
        investor_name=INVESTOR_NAME,
        investor_account_code=INVESTOR_ACCOUNT_CODE
    )


class Migration(migrations.Migration):
    dependencies = [
        ('investors', '0022_historicalinvestor'),
    ]

    operations = [
        migrations.RunPython(setup_investment, reverse_code=migrations.RunPython.noop),
    ]

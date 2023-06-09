# Generated by Django 3.2.15 on 2022-08-11 10:06
import uuid

from django.db import migrations
from django.utils import timezone
from slugify import slugify

from api.companies.constants import DEMO_COMPANY_NAME
from api.constants.currencies import CURRENCIES
from api.currencies.services.company_currency_details import DEFAULT_CURRENCY

USER_EMAIL = 'jen+demo@hellosidecar.com'
INVESTOR_NAME = 'Jen'
INVESTOR_ACCOUNT_CODE = 'Jen'
ADMIN_USER_TITLE = 'Admin'
FUND_NAME = 'Awesome Fund 01'
INVESTMENT_PRODUCT_CODE = 'af0001'
MINIMUM_INVESTMENT_AMOUNT = 1000
SYMBOL = 'AF'


def get_fund_data(company, Currency, Country):
    currency = Currency.objects.get(
        code=DEFAULT_CURRENCY,
        company=company
    )
    country, _ = Country.objects.get_or_create(iso_code='US', defaults={'name': 'United States'})
    return {
        'name': FUND_NAME,
        'slug': slugify(FUND_NAME),
        'raw_investment_product_code': INVESTMENT_PRODUCT_CODE,
        'company': company,
        'fund_currency': currency,
        'minimum_investment': MINIMUM_INVESTMENT_AMOUNT,
        'domicile': country,
        'symbol': SYMBOL,
        'partner_id': uuid.uuid4().hex,
        'is_published': True,
        'publish_investment_details': True
    }


def create_currencies(company, Currency):
    for currency_data in CURRENCIES:
        Currency.objects.get_or_create(
            code=currency_data['code'].upper(),
            company=company,
            defaults={
                'company': company,
                **currency_data
            }
        )


def create_fund_investor_and_dependencies(apps, schema_editor):
    Company = apps.get_model('companies', 'Company')
    RetailUser = apps.get_model('users', 'RetailUser')
    AdminUser = apps.get_model('admin_users', 'AdminUser')
    CompanyUser = apps.get_model('companies', 'CompanyUser')
    Investor = apps.get_model('investors', 'Investor')
    CompanyUserInvestor = apps.get_model('investors', 'CompanyUserInvestor')
    FundInvestor = apps.get_model('investors', 'FundInvestor')
    Fund = apps.get_model('funds', 'Fund')
    FundNav = apps.get_model('funds', 'FundNav')
    Currency = apps.get_model('currencies', 'Currency')
    Country = apps.get_model('geographics', 'Country')

    demo_company_slug = slugify(DEMO_COMPANY_NAME)
    company = Company.objects.get(slug=demo_company_slug)

    create_currencies(company, Currency)
    retail_user, _ = RetailUser.objects.get_or_create(
        email__iexact=USER_EMAIL,
        defaults={
            'email': USER_EMAIL,
            'username': USER_EMAIL
        }
    )

    admin_user, _ = AdminUser.objects.get_or_create(
        company=company,
        user=retail_user,
        defaults={
            'title': ADMIN_USER_TITLE
        }
    )
    company_user, _ = CompanyUser.objects.get_or_create(
        user=retail_user,
        company=company,
        defaults={
            'partner_id': uuid.uuid4().hex
        }
    )

    investor, _ = Investor.objects.get_or_create(
        investor_account_code=INVESTOR_ACCOUNT_CODE,
        defaults={
            'partner_id': uuid.uuid4().hex,
            'name': INVESTOR_NAME,
        }
    )

    CompanyUserInvestor.objects.get_or_create(
        company_user=company_user,
        investor=investor
    )

    fund_data = get_fund_data(company=company, Currency=Currency, Country=Country)
    fund, _ = Fund.objects.get_or_create(
        slug=fund_data['slug'],
        company=company,
        defaults=fund_data
    )

    FundNav.objects.create(
        company=fund.company,
        fund=fund,
        nav=1000,
        as_of=timezone.now().date()
    )

    FundInvestor.objects.get_or_create(
        fund=fund,
        investor=investor,
        defaults={
            'current_net_equity': 5000,
            'loan_balance_with_unpaid_interest': 2000,
            'nav_share': 1500,
            'remaining_equity': 1000,
            'gain': 500,
            'return_of_capital': 500,
            'profit_distributions': 500,
            'leveraged_irr': 0.25,
            'un_leveraged_irr': 0.25,
        }
    )


class Migration(migrations.Migration):
    dependencies = [
        ('companies', '0021_auto_20220808_1109'),
    ]

    operations = [
        migrations.RunPython(create_fund_investor_and_dependencies, reverse_code=migrations.RunPython.noop),
    ]

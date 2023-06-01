from django.conf import settings

from api.applications.models import Application
from api.capital_calls.models import CapitalCall
from api.companies.models import Company
from api.eligibility_criteria.models import FundEligibilityCriteria
from api.funds.models import Fund

FUNDS_BASE_URL = f'{settings.FE_APP_URL}/investor/funds'
INVESTOR_HOME_PAGE_URL = f'{settings.FE_APP_URL}/investor/start'


def get_start_page_url(company: Company):
    if company and company.is_white_labelled_company:
        return f'{settings.PUBLIC_MARKET_PLACE_FE_APP_URL}/{company.slug}'
    return INVESTOR_HOME_PAGE_URL


def get_dashboard_url():
    return '{base}/investor/ownership'.format(
        base=settings.FE_APP_URL
    )


def get_base_url(fund_external_id):
    fund = Fund.objects.only('company').get(
        external_id=fund_external_id
    )
    company = fund.company
    if not company.is_white_labelled_company:
        return FUNDS_BASE_URL
    return f'{settings.PUBLIC_MARKET_PLACE_FE_APP_URL}/{company.slug}/funds'


def get_aml_kyc_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/amlkyc'


def get_eligibility_url(fund_external_id):
    fund = Fund.objects.only('company').get(
        external_id=fund_external_id
    )
    company = fund.company
    if not company.is_white_labelled_company:
        return f'{FUNDS_BASE_URL}/{fund_external_id}/onboarding'
    return f'{settings.PUBLIC_MARKET_PLACE_FE_APP_URL}/{company.slug}/opportunity/{fund_external_id}/onBoarding'


def get_tax_record_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/tax'


def get_bank_detail_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/bank_details'


def get_review_docs_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/review_docs'


def get_program_docs_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/program_doc'


def get_agreements_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/agreements'


def get_bank_details_url(fund_external_id):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/bank_details'


def get_capital_call_url(capital_call: CapitalCall):
    return '{base}/investor/capital-call/{uuid}'.format(
        base=settings.FE_APP_URL,
        uuid=capital_call.uuid
    )


def get_fund_application_url(fund_external_id: str):
    base_url = get_base_url(fund_external_id=fund_external_id)
    return f'{base_url}/{fund_external_id}/application'


def get_admin_url():
    return '{base}/admin/tasks/'.format(
        base=settings.ADMIN_APP_URL
    )


def get_admin_application_url(application: Application):
    return f'{settings.ADMIN_APP_URL}/admin/funds/{application.fund.external_id}/applicants/{application.id}'


def get_admin_eligibility_criteria_url(eligibility_criteria: FundEligibilityCriteria):
    return f'{settings.ADMIN_APP_URL}/admin/eligibility/{eligibility_criteria.id}/edit'


def get_logo_url(company: Company):
    if not company.is_white_labelled_company:
        return "https://assets.hellosidecar.com/static/sidecar/logo.png"

    if company.logo:
        return company.logo.url

from api.companies.models import Company
from api.eligibility_criteria.models import EligibilityCriteriaResponse, FundEligibilityCriteria


def get_funds_with_eligibility_response(company: Company):
    fund_ids = EligibilityCriteriaResponse.objects.filter(
        criteria__fund__company=company
    ).values_list('criteria__fund_id', flat=True)
    return set(fund_ids)


def get_funds_with_published_criteria(company: Company):
    fund_ids = FundEligibilityCriteria.objects.filter(
        fund__company=company,
        status=FundEligibilityCriteria.CriteriaStatusChoice.PUBLISHED.value
    ).values_list('fund_id', flat=True)
    return set(fund_ids)


def get_fund_with_non_approved_eligibility_response(company: Company):
    fund_ids = EligibilityCriteriaResponse.objects.filter(
        criteria__fund__company=company,
        is_approved=False
    ).values_list('criteria__fund_id', flat=True)
    return set(fund_ids)

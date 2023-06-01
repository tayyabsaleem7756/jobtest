from django.urls import reverse
from rest_framework import status

from api.applications.tests.factories import ApplicationFactory
from api.constants.kyc_investor_types import KYCInvestorType
from api.eligibility_criteria.services.get_eligibility_criteria_user_response import \
    FundEligibilityCriteriaPreviewResponse
from api.eligibility_criteria.tests.factories import (
    ApplicationFactory, EligibilityCriteriaBlockResponseFactory,
    FundEligibilityCriteriaFactory, FundEligibilityCriteriaResponseFactory)
from api.geographics.models import Country
from api.kyc_records.tests.factories import KYCRecordFactory
from api.partners.tests.factories import FundFactory
from api.tax_records.tests.factories import TaxRecordFactory
from core.base_tests import BaseTestCase


class TestActiveApplicationViews(BaseTestCase):
    def setUp(self) -> None:
        self.create_company()
        self.create_user()
        self.client.force_authenticate(self.user)
        self.create_currency()

    def setup_application(self):
        fund = FundFactory(company=self.company, accept_applications=True)
        fund_eligibility_criteria = FundEligibilityCriteriaFactory(fund=fund)

        country = Country.objects.get(iso_code__iexact="AL")
        FundEligibilityCriteriaPreviewResponse(
            fund,
            self.user,
            country,
            'INDIVIDUAL',
            {
                'first_name': self.user.first_name,
                'last_name': self.user.last_name,
                'occupation': "Job Title",
                'eligibility_country': country,
                'department': {'label': 'Accounting', 'value': 'accounting'},
                'job_band': {'label': 'M2', 'value': 'M2'},
                'job_title': "Job Title",
                'office_location': country
            }
        )
        kyc_record = KYCRecordFactory(
                user=self.user,
                company=self.company,
                company_user=self.company_user,
                kyc_investor_type=KYCInvestorType.INDIVIDUAL.value,
            )

        fund_eligibility_criteria_response = FundEligibilityCriteriaResponseFactory(
            criteria=fund_eligibility_criteria,
            response_by=self.company_user,
            kyc_record=kyc_record
        )
        EligibilityCriteriaBlockResponseFactory(criteria_response=fund_eligibility_criteria_response)

        application = ApplicationFactory(
            fund=fund,
            company=self.company,
            user=self.user,
            kyc_record=kyc_record,
            tax_record=TaxRecordFactory(
                user=self.user,
                company=self.company,
            ),
            eligibility_response=fund_eligibility_criteria_response,
        )
        return fund, application

    def test_active_applications(self):

        fund_1, application_1 = self.setup_application()
        fund_2, application_2 = self.setup_application()

        url = reverse('active-applications')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

        actual_external_id_list = [fund_1.external_id, fund_2.external_id]
        expected_external_id_list = [d['external_id'] for d in response.data]

        self.assertEqual(sorted(actual_external_id_list), sorted(expected_external_id_list))

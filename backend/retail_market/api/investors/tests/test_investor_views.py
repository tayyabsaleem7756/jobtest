from rest_framework.test import APITestCase
from rest_framework.reverse import reverse
from rest_framework import status

from api.partners.tests.factories import InvestorFactory, FundFactory, CompanyUserInvestorFactory, CompanyUserFactory, \
    FundInvestorFactory, UserFactory, CompanyFactory
from api.admin_users.services.admin_user_service import CreateAdminUserService

class InvestorViewsTest(APITestCase):

    def setUp(self):
        self.user = UserFactory()
        self.company = CompanyFactory()
        CreateAdminUserService(email=self.user.email, company_name=self.company.name).create()
        CompanyUserFactory(user=self.user)

    def setup_fund_investor(self, publish_investment_details=False):
        fund = FundFactory(company=self.company,
                           publish_investment_details=publish_investment_details)
        investor = InvestorFactory()
        company_user = CompanyUserFactory(company=self.company)  # type: CompanyUser
        company_investor = CompanyUserInvestorFactory(investor=investor, company_user=company_user)
        FundInvestorFactory(fund=fund, investor=investor)
        return fund, company_investor

    def test_investment_details_published_funds(self):
        fund, investor_user = self.setup_fund_investor(publish_investment_details=True)
        self.client.force_authenticate(investor_user.company_user.user)
        url = reverse('investor-detail')

        response = self.client.get(url)
        invested_funds = response.data['invested_funds']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(invested_funds), 1)
        self.assertEqual(invested_funds[0]['fund']['id'], fund.id)

    def test_investment_details_unpublished_funds(self):
        fund_published, investor_user_published = self.setup_fund_investor(publish_investment_details=True)
        fund_unpublished, investor_user_unpublished = self.setup_fund_investor(publish_investment_details=False)
        self.client.force_authenticate(investor_user_published.company_user.user)
        url = reverse('investor-detail')

        response = self.client.get(url)
        invested_funds = response.data['invested_funds']
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(invested_funds), 1)
        self.assertEqual(invested_funds[0]['fund']['id'], fund_published.id)





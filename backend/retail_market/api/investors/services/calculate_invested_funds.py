import copy
from decimal import Decimal
from typing import List

from dateutil.parser import parse as dt_parse

from api.funds.models import FundNav
from api.investors.models import FundInvestor
from api.investors.serializers import RetrieveFundInvestorSerializer

SKIP_KEYS = ['id', 'fund', 'currency', 'ownership', 'order', 'investor']


class InvestedFundsService:
    def __init__(self, company_user_ids: List[int], show_unpublished_funds=False):
        self.company_user_ids = company_user_ids
        self.show_unpublished_funds = show_unpublished_funds

    def fetch_fund_investors(self):
        queryset = FundInvestor.objects.filter(investor__associated_users__company_user_id__in=self.company_user_ids)
        if not self.show_unpublished_funds:
            queryset = queryset.filter(
                fund__publish_investment_details=True
            )
        invested_funds = queryset.select_related('fund').select_related('fund__fund_currency').select_related(
            'fund__company').distinct('id')
        return RetrieveFundInvestorSerializer(invested_funds, many=True).data

    @staticmethod
    def calculate_sum(fund_totals, investment):
        fund_id = investment['fund']['id']
        current_total = fund_totals[fund_id]
        for field, value in investment.items():
            if field in SKIP_KEYS:
                continue
            if type(value) not in {float, int, Decimal}:
                continue

            current_total[field] += investment.get(field)
        fund_totals[fund_id] = current_total

    @staticmethod
    def has_data(fund_ids):
        return FundNav.objects.filter(fund_id__in=fund_ids).exists()

    @staticmethod
    def get_fund_nav_latest_dates(fund_ids):
        fund_navs = FundNav.objects.filter(fund_id__in=fund_ids).order_by('fund_id', '-as_of').distinct('fund_id')
        funds_latest_nav_date = {}
        for nav in fund_navs:
            funds_latest_nav_date[nav.fund_id] = nav.as_of.strftime('%d %b %Y')
        return funds_latest_nav_date

    def compile(self):
        multi_invested_funds = set()
        currency_rate_dates = []
        investments = {}
        compositions = {}
        invested_funds = self.fetch_fund_investors()
        fund_ids = [investment['fund']['id'] for investment in invested_funds]
        fund_nav_latest_dates = self.get_fund_nav_latest_dates(fund_ids=fund_ids)
        for investment in invested_funds:
            currency_rate_date = investment['currency'].get('rate_date')
            if currency_rate_date:
                currency_rate_dates.append(dt_parse(currency_rate_date))
            fund_id = investment['fund']['id']
            investment['latest_nav'] = fund_nav_latest_dates.get(fund_id, '')
            if fund_id not in investments:
                investments[fund_id] = investment
                compositions[fund_id] = [copy.deepcopy(investment)]
            else:
                multi_invested_funds.add(fund_id)
                self.calculate_sum(fund_totals=investments, investment=investment)
                compositions[fund_id].append(copy.deepcopy(investment))

        if currency_rate_dates:
            latest_currency_rate_date = str(max(currency_rate_dates).date())
        else:
            latest_currency_rate_date = None
        return {
            'invested_funds': list(investments.values()),
            'investment_compositions': compositions,
            'has_data': self.has_data(fund_ids=fund_ids),
            'latest_currency_rate_date': latest_currency_rate_date
        }

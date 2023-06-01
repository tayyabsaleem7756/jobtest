from django.db.models import DecimalField, FloatField

from api.agreements.services.application_data.base import ModelBasedOptions
from api.agreements.services.application_data.constants import INVESTMENT_AMOUNT_ID
from api.eligibility_criteria.models import InvestmentAmount

LEVERAGE_AMOUNT_FIELD = 'leverage_amount'
LEVERAGE_PERCENT_FIELD = 'leverage_percent'
LEVERAGE_EMPLOYEE_PERCENT_FIELD = 'employee_equity_percent'
TOTAL_INVESTMENT_FIELD = 'total_investment'


class InvestmentAmountOptions(ModelBasedOptions):
    PREFIX_ID = INVESTMENT_AMOUNT_ID
    allowed_types = (DecimalField, FloatField)
    model = InvestmentAmount
    custom_fields = (LEVERAGE_AMOUNT_FIELD, LEVERAGE_PERCENT_FIELD, LEVERAGE_EMPLOYEE_PERCENT_FIELD, TOTAL_INVESTMENT_FIELD)

    currency_format_fields = ('amount', 'final_amount', LEVERAGE_AMOUNT_FIELD, TOTAL_INVESTMENT_FIELD)

    def get_total_investment_value(self, investment_amount: InvestmentAmount):
        field = self.default_text_field(field_id=TOTAL_INVESTMENT_FIELD)
        total_investment = 0

        if investment_amount:
            total_investment = investment_amount.get_total_investment()

        field['value'] = str(total_investment)
        return field

    def get_employee_equity_percent_value(self, investment_amount: InvestmentAmount):
        field = self.default_text_field(field_id=LEVERAGE_EMPLOYEE_PERCENT_FIELD)
        leverage_percent = ''
        if investment_amount:
            if investment_amount.final_leverage_ratio:
                (equity, leverage) = self._parse_leverage_ratio(investment_amount.final_leverage_ratio)
                leverage = 1 - equity/(equity + leverage)
                leverage_percent = round((1.0 - leverage) * 100.0)

        field['value'] = str(leverage_percent)
        return field


    def get_leverage_percent_value(self, investment_amount: InvestmentAmount):
        field = self.default_text_field(field_id=LEVERAGE_PERCENT_FIELD)
        leverage_percent = 0
        if investment_amount:
            if investment_amount.final_leverage_ratio:
                (equity, leverage) = self._parse_leverage_ratio(investment_amount.final_leverage_ratio)
                leverage = 1 - equity/(equity + leverage)
                leverage_percent = round(leverage * 100.0)

        field['value'] = str(leverage_percent)
        return field

    def get_leverage_amount_value(self, investment_amount: InvestmentAmount):
        field = self.default_text_field(field_id=LEVERAGE_AMOUNT_FIELD)
        leverage_amount = ''
        if investment_amount:
            leverage_amount = investment_amount.get_total_leverage()
        field['value'] = str(leverage_amount)
        return field

    def _parse_leverage_ratio(self, leverage_ratio):
        return (1, leverage_ratio)

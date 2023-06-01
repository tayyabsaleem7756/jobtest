from api.applications.models import Application
from api.eligibility_criteria.models import EligibilityCriteriaResponse


class ApplicationInvestmentDetails:
    def __init__(self, application: Application):
        self.application = application

    @staticmethod
    def get_eligibility_status(eligibility_criteria_response: EligibilityCriteriaResponse):
        if not eligibility_criteria_response.is_eligible:
            return 'Not Eligible'
        else:
            return 'Approved' if eligibility_criteria_response.is_approved else 'Pending'

    def get(self):
        application = self.application
        eligibility_criteria_response = application.eligibility_response
        max_leverage = int(application.max_leverage_ratio) if application.max_leverage_ratio else None

        investment_detail = {
            'requested_leverage': None,
            'max_leverage': f'{max_leverage}:1' if max_leverage else None,
            'final_leverage': None,
            'requested_entity': None,
            'final_entity': None,
            'total_investment': None,
            'eligibility_decision': None,
            'final_leverage_ratio': None,
            'eligibility_type': None,
            'id': None,
        }

        if not eligibility_criteria_response and not application.investment_amount:
            return investment_detail

        if eligibility_criteria_response:
            eligibility_decision = self.get_eligibility_status(eligibility_criteria_response)
            eligibility_type = 'Knowledgeable' if eligibility_criteria_response.is_knowledgeable else 'Financial'
            investment_detail['eligibility_decision'] = eligibility_decision
            investment_detail['eligibility_type'] = eligibility_type
            investment_detail['is_eligible'] = eligibility_criteria_response.is_eligible

        investment_amount = None

        if eligibility_criteria_response:
            investment_amount = eligibility_criteria_response.investment_amount
        elif application.investment_amount:
            investment_amount = application.investment_amount

        if not investment_amount:
            return investment_detail

        requested_entity = float(investment_amount.amount)

        if not max_leverage:
            max_leverage = investment_amount.leverage_ratio

        leverage_ratio = f'{int(investment_amount.leverage_ratio)}:1'

        investment_detail['final_entity'] = investment_amount.get_final_amount()
        investment_detail['final_leverage_ratio'] = f'{int(investment_amount.get_final_leverage_ratio())}:1'

        investment_detail['id'] = investment_amount.id
        investment_detail['requested_leverage'] = leverage_ratio
        investment_detail['max_leverage'] = f'{int(max_leverage)}:1'
        investment_detail['requested_entity'] = requested_entity
        investment_detail['total_investment'] = investment_amount.get_total_investment()
        investment_detail['requested_leverage_amount'] = float(investment_amount.leverage_ratio) * requested_entity

        investment_detail['requested_total_investment'] = investment_detail[
                                                              'requested_leverage_amount'] + requested_entity

        investment_detail['final_leverage_amount'] = investment_amount.get_total_leverage()
        investment_detail['final_total_investment'] = investment_amount.get_total_investment()

        return investment_detail

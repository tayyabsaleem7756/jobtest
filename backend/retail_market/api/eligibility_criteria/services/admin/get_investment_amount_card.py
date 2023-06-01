from api.applications.models import Application
from api.applications.services.application_investment_details import ApplicationInvestmentDetails
from api.eligibility_criteria.models import EligibilityCriteriaResponse, CriteriaBlockResponse, CriteriaBlock

INVESTMENT_AMOUNT_CARD = 'Investment Amount'


class GetInvestmentAmountCard:
    def __init__(self, eligibility_criteria_response: EligibilityCriteriaResponse):
        self.eligibility_criteria_response = eligibility_criteria_response

    @staticmethod
    def get_card():
        return {
            'name': INVESTMENT_AMOUNT_CARD,
            "order": 2,
        }

    def get_application(self):
        try:
            return Application.objects.get(eligibility_response_id=self.eligibility_criteria_response.id)
        except:
            return None

    def get_leverage(self):
        leverage_ratio = self.eligibility_criteria_response.investment_amount.leverage_ratio
        if not leverage_ratio:
            return 'none'
        return f'{int(leverage_ratio)}:1'

    def get_final_amount_questions(self):
        application = self.get_application()
        if not application:
            return []
        investment_details = ApplicationInvestmentDetails(application=application).get()
        return [
            {
                "id": f'{self.eligibility_criteria_response.id}-requested-total-investment',
                "label": 'Total investment requested',
                "type": "investment_amount_response",
                'submitted_answer': {
                    'answer_values': [investment_details.get('requested_total_investment')],
                }
            },
            {
                "id": f'{self.eligibility_criteria_response.id}-final-equity',
                "label": 'Final Equity',
                "type": "investment_amount_response",
                'submitted_answer': {
                    'answer_values': [investment_details.get('final_entity')],
                }
            },
            {
                "id": f'{self.eligibility_criteria_response.id}-final-leverage',
                "label": 'Final Leverage',
                "type": "investment_amount_response",
                'submitted_answer': {
                    'answer_values': [investment_details.get('final_leverage_ratio')],
                }
            },
            {
                "id": f'{self.eligibility_criteria_response.id}-final-total-investment',
                "label": 'Final Total Investment',
                "type": "investment_amount_response",
                'submitted_answer': {
                    'answer_values': [investment_details.get('final_total_investment')],
                }
            },

        ]

    def process(self):
        card = self.get_card()
        investment_amount = self.eligibility_criteria_response.investment_amount
        if not investment_amount:
            card['schema'] = []
            return card
        schema = [
            {
                "id": f'{self.eligibility_criteria_response.id}-investment-amount',
                "label": 'How much Equity would you like to invest?',
                "type": "investment_amount_response",
                'submitted_answer': {
                    'answer_values': [investment_amount.amount if investment_amount else 0],
                }
            },
            {
                "id": f'{self.eligibility_criteria_response.id}-leverage-requested',
                "label": 'How much leverage would you like?',
                "type": "investment_amount_response",
                'submitted_answer': {
                    'answer_values': [self.get_leverage() if investment_amount else 'none'],
                }
            },
            *self.get_final_amount_questions()
        ]

        card['schema'] = schema
        return card

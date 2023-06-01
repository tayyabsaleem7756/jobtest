from django.conf import settings

from sendgrid.helpers.mail import Mail
from sendgrid import SendGridAPIClient

from api.libs.sendgrid.template_ids import NEW_INVESTMENT_TEMPLATE_ID, CAPITAL_CALL_TEMPLATE_ID


class SendEmailService:
    def __init__(self):
        self.api_key = settings.SENDGRID_API_KEY

    def _send(self, message: Mail):
        if not settings.SEND_EMAIL:
            return

        sg = SendGridAPIClient(self.api_key)
        # TODO: Track errors here
        sg.send(message)

    def _send_template(self, recipient, template_id: str, dynamic_data: dict):
        from_email_address = settings.FROM_EMAIL
        message = Mail(
            from_email=from_email_address,
            to_emails=[recipient],
        )
        message.dynamic_template_data = dynamic_data
        message.template_id = template_id

        self._send(message)

    def send_html_email(self, to: str, subject: str, body: str):
        from_email_address = settings.FROM_EMAIL

        message = Mail(
            from_email=from_email_address,
            to_emails=[to],
            subject=subject,
            html_content=body
        )
        self._send(message)

    def send_new_investment_email(self, to: str, fund_name: str):
        dynamic_data = {
            'name': fund_name
        }
        self._send_template(
            recipient=to,
            template_id=NEW_INVESTMENT_TEMPLATE_ID,
            dynamic_data=dynamic_data
        )

    def send_capital_call_email(
            self,
            to: str,
            fund_name: str,
            first_name: str,
            company_name: str,
            due_date: str,
            notification_url: str
    ):
        dynamic_data = {
            'fund_name': fund_name,
            'first_name': first_name,
            'company_name': company_name,
            'due_date': due_date,
            'notification_url': notification_url
        }
        self._send_template(
            recipient=to,
            template_id=CAPITAL_CALL_TEMPLATE_ID,
            dynamic_data=dynamic_data
        )

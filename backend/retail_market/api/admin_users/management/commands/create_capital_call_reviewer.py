import logging

from api.admin_users.services.create_reviewers import CreateReviewerService
from django.core.management.base import BaseCommand

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Create Capital Call Reviewer'

    def add_arguments(self, parser):
        parser.add_argument('--email', type=str, action='store')
        parser.add_argument('--company_name', type=str, action='store')

    def handle(self, *args, **options):
        email = options.get('email')
        company_name = options.get('company_name')
        CreateReviewerService(email=email, company_name=company_name).create_capital_call_reviewer()

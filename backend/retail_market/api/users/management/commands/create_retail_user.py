import json
import logging

from django.core.management.base import BaseCommand

from api.users.services.create_user import CreateUserService

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Create user'

    def add_arguments(self, parser):
        parser.add_argument('email', type=str)

    def handle(self, *args, **options):
        payload = {'email': options.get('email')}
        create_user_service = CreateUserService(payload=payload)
        user = create_user_service.create()
        print(json.dumps(user, indent=4))

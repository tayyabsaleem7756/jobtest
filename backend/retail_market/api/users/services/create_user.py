import uuid

from api.companies.models import Company, CompanyUser
from api.constants.companies import FIRST_COMPANY_NAME
from api.libs.auth0.management_api import Auth0ManagementAPI
from api.users.models import RetailUser


class CreateUserService:
    def __init__(self, payload, company=None):
        self.payload = payload
        self.company = company or self.get_default_company()

    @staticmethod
    def get_default_company():
        company, _ = Company.objects.get_or_create(name=FIRST_COMPANY_NAME)
        return company

    def create_company_user(self, retail_user: RetailUser):
        company_user, _ = CompanyUser.objects.get_or_create(
            user=retail_user,
            company=self.company,
            # TODO: We need a flow to assign partner id to users that are not in db and log in from okta
            defaults={'partner_id': uuid.uuid4().hex}
        )
        return company_user

    def create_retail_user(self, auth0_user):
        username = auth0_user.get('user_id').replace('|', '.')
        retail_user, _ = RetailUser.objects.get_or_create(
            username=username,
            is_active=True,
            defaults={
                'email': self.payload['email'],
                'is_active': True
            }
        )
        self.create_company_user(retail_user=retail_user)
        return retail_user

    def update_create_retail_user(self, auth0_user):
        username = auth0_user.get('user_id').replace('|', '.')
        try:
            retail_user = RetailUser.include_deleted.get(email__iexact=self.payload['email'])
            retail_user.username = username
            retail_user.is_active = True
            retail_user.deleted = False
            retail_user.save()
        except RetailUser.DoesNotExist:
            retail_user = RetailUser.objects.create(
                email=self.payload['email'],
                is_active=True,
                deleted=False,
                username=username,
            )
        self.create_company_user(retail_user=retail_user)
        return retail_user

    def create(self):
        auth0_api = Auth0ManagementAPI()
        user = auth0_api.create_user(user_info=self.payload)
        self.create_retail_user(auth0_user=user)
        return user

    def create_user(self):
        auth0_api = Auth0ManagementAPI()
        user = auth0_api.create_user(user_info=self.payload)
        return self.update_create_retail_user(auth0_user=user)

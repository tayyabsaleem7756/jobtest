import csv
import json
import os
import uuid
from io import StringIO

from django.core.files.uploadedfile import SimpleUploadedFile
import boto3
from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone
from rest_framework import status
from rest_framework.reverse import reverse
from rest_framework.test import APITestCase

from api.admin_users.services.admin_user_service import CreateAdminUserService
from api.applications.models import Application
from api.backup.models import FundDocumentsBackup, FundBackup
from api.backup.serializers import LasalleApplicationReport
from api.backup.tests.constants import SUPPORTING_DOCUMENT_CONTENT, KYC_DOCUMENT_CONTENT, TAX_DOCUMENT_CONTENT, \
    SIGNED_COMPANY_DOCUMENT_CONTENT, CERTIFICATE_CONTENT, SIGNED_POWER_OF_ATTORNEY_CONTENT, \
    SIGNED_FUND_DOCUMENT_CONTENT, FUND_CERTIFICATE_DOCUMENT_CONTENT
from api.backup.tests.test_backup_fund import CompleteApplication
from api.funds.models import Fund, FundShareClass, DocumentFilter
from api.geographics.models import Country
from api.partners.tests.factories import UserFactory, FundFactory, CompanyUserFactory, CurrencyFactory, CompanyFactory, \
    CompanyUserInvestorFactory, CompanyFundVehicleFactory, ExternalOnboardingFactory, DocumentFilterFactory


EXAMPLE_DOCUMENT_FILTER = """
                set a = '123'
                set b = 'abcd'
                if a == '123' { 
                    set a = 'hello world!' 
                }
                if b {
                    set b = "it's a mee"
                    set us_holder_field1 = fields[a]
                    require b
                }

    """


class CreateEditAPITestCaseNonAdminUser(APITestCase):
    def setUp(self) -> None:
        self.user = UserFactory()
        CompanyUserFactory(user=self.user)
        self.client.force_authenticate(self.user)

    def test_fund_create_view(self):
        payload = {
            "name": "FundPer001",
            "partner_id": uuid.uuid4().hex,
            "business_line": 2,
            "risk_profile": 1,
            "fund_type": 1,
            "fund_currency": 12,
            "demand": 0,
            "application_period_start_date": str(timezone.now().date()),
            "application_period_end_date": str(timezone.now().date()),
            "confirmation_date": str(timezone.now().date()),
            "anticipated_first_call_date": str(timezone.now().date()),
            "sold": 0
        }
        url = reverse('funds-list-create')
        response = self.client.post(url, payload=payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fund_list_view(self):
        fund = FundFactory()
        url = reverse('funds-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fund_delete_view(self):
        fund = FundFactory()
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fund_update_view(self):
        fund = FundFactory()
        payload = {'name': 'updated-fund-name'}
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response = self.client.put(url, payload)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_fund_publish_view(self):
        fund = FundFactory()
        url = reverse('publish-fund', kwargs={'pk': fund.id})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class CreateEditAPITestCaseAdminUser(APITestCase):
    USER_EMAIL_INVITED_TO_FUND = "joesmith@jll.com"
    small_gif = (
        b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x00\x00\x00\x21\xf9\x04'
        b'\x01\x0a\x00\x01\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02'
        b'\x02\x4c\x01\x00\x3b'
    )

    def setUp(self) -> None:
        Fund.objects.all().delete()
        self.user = UserFactory()
        self.company = CompanyFactory()
        self.company_vehicle_a = CompanyFundVehicleFactory(company=self.company)
        self.company_vehicle_b = CompanyFundVehicleFactory(company=self.company)
        self.country = Country.objects.get(iso_code='US')

        CreateAdminUserService(email=self.user.email, company_name=self.company.name).create()
        self.user_invited_to_fund = UserFactory(email=self.USER_EMAIL_INVITED_TO_FUND)
        self.company_user = CompanyUserFactory(user=self.user)
        self.company_user_invited_to_fund = CompanyUserFactory(user=self.user_invited_to_fund)
        self.client.force_authenticate(self.user)

        self.company_user_investor_1 = CompanyUserInvestorFactory(company_user=self.company_user)
        self.company_user_investor_2 = CompanyUserInvestorFactory(company_user=self.company_user_invited_to_fund)
        self.s3 = boto3.client("s3", endpoint_url="http://localhost:4566/")
        self.bucket_name = "investors-applications-backup"

    def test_fund_create_view(self):
        currency = CurrencyFactory(company=self.company)
        external_onboarding_url = "https://www.myexternalonboarding.com"
        payload = {
            "name": "FundPer001",
            "partner_id": uuid.uuid4().hex,
            "business_line": Fund.BusinessLineChoice.EUROPE_PRIVATE.value,
            "risk_profile": 'dummy profile',
            "fund_type": Fund.FundTypeChoice.OPEN.value,
            "fund_currency": currency.id,
            "demand": 0,
            "application_period_start_date": str(timezone.now().date()),
            "application_period_end_date": str(timezone.now().date()),
            "confirmation_date": str(timezone.now().date()),
            "anticipated_first_call_date": str(timezone.now().date()),
            "sold": 0,
            "target_irr": 3.0,
            "strategy": "Test strategy",
            "short_description": "Test short description",
            "long_description": "Test long description",
            "logo": SimpleUploadedFile('logo.gif', self.small_gif, content_type='image/gif'),
            "banner_image": SimpleUploadedFile('banner.gif', self.small_gif, content_type='image/gif'),
            "tags": json.dumps([{"name": "Test Tag 1"}]),
            "external_onboarding_url": external_onboarding_url
        }
        url = reverse('funds-list-create')
        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fund.objects.count(), 1)
        my_fund: Fund = Fund.objects.first()
        self.assertEqual(my_fund.external_onboarding.url, external_onboarding_url)
        self.assertEqual(Fund.objects.filter(company=self.company).count(), 1)
        self.assertEqual(FundShareClass.objects.filter(company=self.company).count(), 8)  # we created two vehicles.

        self.assertContains(response, my_fund.logo.url, status_code=201)
        self.assertContains(response, my_fund.banner_image.url, status_code=201)
        self.assertEqual(my_fund.target_irr, 3.0)
        self.assertEqual(my_fund.short_description, 'Test short description')
        self.assertEqual(my_fund.long_description, 'Test long description')
        self.assertEqual(my_fund.strategy, 'Test strategy')
        self.assertEqual(my_fund.tags.first().name, 'Test Tag 1')


    def test_create_funds_with_same_name(self):
        currency = CurrencyFactory(company=self.company)
        old_partner_id = uuid.uuid4().hex
        new_partner_id = uuid.uuid4().hex
        payload = {
            "name": "FundPer001",
            "partner_id": old_partner_id,
            "business_line": Fund.BusinessLineChoice.EUROPE_PRIVATE.value,
            "risk_profile": 'dummy profile',
            "fund_type": Fund.FundTypeChoice.OPEN.value,
            "fund_currency": currency.id,
            "demand": 0,
            "application_period_start_date": str(timezone.now().date()),
            "application_period_end_date": str(timezone.now().date()),
            "confirmation_date": str(timezone.now().date()),
            "anticipated_first_call_date": str(timezone.now().date()),
            "sold": 0
        }
        url = reverse('funds-list-create')
        response = self.client.post(url, data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fund.objects.count(), 1)
        self.assertEqual(Fund.objects.filter(company=self.company).count(), 1)
        self.assertEqual(FundShareClass.objects.filter(company=self.company).count(), 8)

        payload['partner_id'] = new_partner_id
        response = self.client.post(url, data=json.dumps(payload), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fund.objects.count(), 2)
        self.assertEqual(Fund.objects.filter(company=self.company).count(), 2)
        self.assertEqual(FundShareClass.objects.filter(company=self.company).count(), 16)

        self.assertEqual(Fund.objects.filter(partner_id=old_partner_id).count(), 1)
        self.assertEqual(Fund.objects.filter(partner_id=new_partner_id).count(), 1)

    @staticmethod
    def get_invites_csv(name):
        with open(os.path.join(os.path.dirname(__file__), f'data/{name}.csv')) as _file:
            return SimpleUploadedFile.from_dict({
                "filename": _file.name,
                "content": _file.read().encode('utf-8'),
                "content-type": "text/csv"
            })

    def test_invite_only_fund_create_view(self):
        user2 = UserFactory(email='joesmith2@example.com')
        currency = CurrencyFactory(company=self.company)
        # create invite only fund
        payload = {
            "name": "FundPer001",
            "partner_id": uuid.uuid4().hex,
            "business_line": Fund.BusinessLineChoice.EUROPE_PRIVATE.value,
            "risk_profile": 'Opportunistic',
            "fund_type": Fund.FundTypeChoice.OPEN.value,
            "fund_currency": currency.id,
            "demand": 0,
            "application_period_start_date": str(timezone.now().date()),
            "application_period_end_date": str(timezone.now().date()),
            "confirmation_date": str(timezone.now().date()),
            "anticipated_first_call_date": str(timezone.now().date()),
            "sold": 0,
            "invite_file": self.get_invites_csv('fund-invite-template')
        }
        url = reverse('funds-list-create')
        response = self.client.post(
            url, data=payload,
            format="multipart"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fund.objects.count(), 1)
        self.assertEqual(Fund.objects.filter(company=self.company).count(), 1)

        fund = Fund.objects.first()
        self.assertTrue(fund.is_invite_only)

        # mark created fund as published so it could be visible to investors
        self.send_publish_fund_call(fund.id)
        fund.refresh_from_db()
        self.assertTrue(fund.is_published)
        self.assertEqual(Application.objects.filter(user=self.user).count(), 0)
        self.assertEqual(Application.objects.filter(user=self.user_invited_to_fund).count(), 1)
        self.assertEqual(Application.objects.filter(user=user2).count(), 1)

        application = Application.objects.filter(user=self.user_invited_to_fund).first()
        application_file_defaults = application.defaults_from_fund_file
        self.assertEqual(application_file_defaults['first_name'], 'Joe')
        self.assertEqual(application_file_defaults['last_name'], 'Smith')
        self.assertEqual(application_file_defaults['department'], 'Long Department')
        self.assertEqual(application_file_defaults['job_band'], 'L5')
        self.assertEqual(application_file_defaults['office_location'], self.country.id)
        self.assertEqual(application.restricted_time_period, 'Q4 2022')
        self.assertEqual(application.restricted_geographic_area, 'Europe')

        application = Application.objects.filter(user=user2).first()
        application_file_defaults = application.defaults_from_fund_file
        self.assertEqual(application_file_defaults['first_name'], 'John')
        self.assertEqual(application_file_defaults['last_name'], 'Smyth')
        self.assertEqual(application_file_defaults['department'], 'General Management / Business Operations')
        self.assertEqual(application_file_defaults['job_band'], 'Leadership 1')
        self.assertEqual(application_file_defaults['office_location'], self.country.id)
        self.assertEqual(application.restricted_time_period, 'six')
        self.assertEqual(application.restricted_geographic_area, 'Europe')

        # get list of funds visible to users
        url = reverse('investor-opportunities')
        response = self.client.get(url)
        # fund should not appear in user opportunities list if user is not invited to fund
        self.assertEqual(response.data, [])

        url = reverse('non-invested-opportunities', kwargs={'company_slug': self.company.slug})
        response = self.client.get(url)
        # fund should not appear in user opportunities list if user is not invited to fund
        self.assertEqual(response.data, [])

        # login with a investor that is being invited to fund and check if fund is not visible for that investor
        self.client.force_authenticate(self.user_invited_to_fund)
        response = self.client.get(url)
        # fund should appear in user opportunities list if user is invited to fund
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], fund.id)

        # login with a investor that is being invited to fund and check if fund is not visible for that investor
        self.client.force_authenticate(self.user_invited_to_fund)
        response = self.client.get(url)
        # fund should appear in user opportunities list if user is invited to fund
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], fund.id)

    def test_invite_only_incorrect_file_fund_create_view(self):
        currency = CurrencyFactory(company=self.company)
        # create invite only fund
        payload = {
            "name": "FundPer001",
            "partner_id": uuid.uuid4().hex,
            "business_line": Fund.BusinessLineChoice.EUROPE_PRIVATE.value,
            "risk_profile": 'Opportunistic',
            "fund_type": Fund.FundTypeChoice.OPEN.value,
            "fund_currency": currency.id,
            "demand": 0,
            "application_period_start_date": str(timezone.now().date()),
            "application_period_end_date": str(timezone.now().date()),
            "confirmation_date": str(timezone.now().date()),
            "anticipated_first_call_date": str(timezone.now().date()),
            "sold": 0,
            "invite_file": self.get_invites_csv('fund-invite-incorrect-template')
        }
        url = reverse('funds-list-create')
        response = self.client.post(
            url, data=payload,
            format="multipart"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Fund.objects.count(), 1)
        self.assertEqual(Fund.objects.filter(company=self.company).count(), 1)

        fund = Fund.objects.first()
        self.assertTrue(fund.is_invite_only)

        # mark created fund as published so it could be visible to investors
        self.send_publish_fund_call(fund.id)
        fund.refresh_from_db()
        self.assertTrue(fund.is_published)
        self.assertEqual(Application.objects.filter(user=self.user).count(), 0)
        self.assertEqual(Application.objects.filter(user=self.user_invited_to_fund).count(), 1)

        application = Application.objects.filter(user=self.user_invited_to_fund).first()
        application_file_defaults = application.defaults_from_fund_file
        self.assertEqual(application_file_defaults['first_name'], 'Joe')
        self.assertEqual(application_file_defaults['last_name'], 'Smith')
        self.assertEqual(application_file_defaults['department'], 'Long Department')
        self.assertEqual(application_file_defaults['job_band'], 'L5')
        self.assertEqual(application_file_defaults['office_location'], self.country.id)
        self.assertEqual(application.restricted_time_period, 'Q4 2022')
        self.assertEqual(application.restricted_geographic_area, 'Europe')
        # validate that email does not contain spaces
        self.assertEqual(application.user.email, 'joesmith@jll.com')
        # get list of funds visible to users
        url = reverse('investor-opportunities')
        response = self.client.get(url)
        # fund should not appear in user opportunities list if user is not invited to fund
        self.assertEqual(response.data, [])

        url = reverse('non-invested-opportunities', kwargs={'company_slug': self.company.slug})
        response = self.client.get(url)
        # fund should not appear in user opportunities list if user is not invited to fund
        self.assertEqual(response.data, [])

        # login with a investor that is being invited to fund and check if fund is not visible for that investor
        self.client.force_authenticate(self.user_invited_to_fund)
        response = self.client.get(url)
        # fund should appear in user opportunities list if user is invited to fund
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], fund.id)

        # login with a investor that is being invited to fund and check if fund is not visible for that investor
        self.client.force_authenticate(self.user_invited_to_fund)
        response = self.client.get(url)
        # fund should appear in user opportunities list if user is invited to fund
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], fund.id)

    def test_fund_list_view(self):
        FundFactory(company=self.company)
        url = reverse('funds-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        d = response.json()
        self.assertEqual(len(response.data), 1)

    def test_fund_admin_retrieve_view(self):
        fund = FundFactory(company=self.company)
        external_url = "https://www.mysupercoolurl.com"
        ExternalOnboardingFactory.create(fund=fund, url=external_url)
        url = reverse('admin-funds-details-by-slug', kwargs={'fund_external_id': fund.external_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        d = response.json()
        self.assertEqual(d["name"], fund.name)
        self.assertEqual(d["target_fund_size"], fund.target_fund_size)
        self.assertEqual(d["external_onboarding_url"], external_url)

    def test_fund_delete_view(self):
        fund = FundFactory(company=self.company)
        self.assertEqual(Fund.objects.count(), 1)
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Fund.objects.count(), 0)

    def test_fund_update_view(self):
        fund = FundFactory(company=self.company)
        external_onboarding_url = "https://www.mynewonboardingurl.com"
        payload = {
            "name": 'updated-fund-name',
            "external_onboarding_url": external_onboarding_url,
            "target_irr": 2.0,
            "strategy": "Updated strategy",
            "short_description": "Updated short description",
            "long_description": "Updated long description",
            "logo": SimpleUploadedFile('logo.gif', self.small_gif, content_type='image/gif'),
            "banner_image": SimpleUploadedFile('banner.gif', self.small_gif, content_type='image/gif'),
            "tags": json.dumps([{"name": "Test Tag 2"}]),
        }
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fund.refresh_from_db()
        self.assertContains(response, fund.logo.url)
        self.assertContains(response, fund.banner_image.url)
        self.assertEqual(fund.target_irr, 2.0)
        self.assertEqual(fund.short_description, 'Updated short description')
        self.assertEqual(fund.long_description, 'Updated long description')
        self.assertEqual(fund.strategy, 'Updated strategy')
        self.assertEqual(fund.tags.first().name, 'Test Tag 2')
        self.assertEqual(fund.name, payload['name'])
        self.assertEqual(fund.external_onboarding.url, external_onboarding_url)

    def test_fund_partial_update_view(self):
        fund = FundFactory(company=self.company)
        external_url = "https://www.mysupercoolurl.com"
        DocumentFilterFactory.create(fund=fund, code=EXAMPLE_DOCUMENT_FILTER)
        ExternalOnboardingFactory.create(fund=fund, url=external_url)
        payload = {'name': 'updated-fund-name'}
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fund.refresh_from_db()
        self.assertEqual(fund.name, payload['name'])
        self.assertEqual(fund.external_onboarding.url, external_url)
        self.assertEqual(fund.document_filter.code, EXAMPLE_DOCUMENT_FILTER)

    def test_fund_edit_onboarding_url_update_view(self):
        fund = FundFactory(company=self.company)
        external_url = "https://www.mysupercoolurl.com"
        ExternalOnboardingFactory.create(fund=fund, url=external_url)
        external_onboarding_url = "https://www.mynewonboardingurl.com"
        payload = {'name': 'updated-fund-name', "external_onboarding_url": external_onboarding_url}
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fund.refresh_from_db()
        self.assertEqual(fund.name, payload['name'])
        self.assertEqual(fund.external_onboarding.url, external_onboarding_url)

    def test_fund_edit_document_filter_update_view(self):
        fund = FundFactory(company=self.company)
        DocumentFilterFactory(fund=fund, code=EXAMPLE_DOCUMENT_FILTER)
        new_code = """if d {
                set d = 'no value for me'
            }"""
        payload = {'name': 'updated-fund-name-document-filter', "document_filter": new_code}
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fund.refresh_from_db()
        self.assertEqual(fund.name, payload['name'])
        self.assertEqual(fund.document_filter.code, new_code)

    def test_fund_delete_onboarding_url_document_filter_update_view(self):
        fund = FundFactory(company=self.company)
        external_url = "https://www.mysupercoolurl.com"
        ExternalOnboardingFactory.create(fund=fund, url=external_url)
        DocumentFilterFactory.create(fund=fund, code=EXAMPLE_DOCUMENT_FILTER)
        payload = {'name': 'updated-fund-name', "external_onboarding_url": '', "document_filter": ''}
        url = reverse('funds-update', kwargs={'pk': fund.id})
        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fund.refresh_from_db()
        self.assertEqual(fund.name, payload['name'])
        self.assertRaises(ObjectDoesNotExist, lambda f: f.external_onboarding, f=fund)
        self.assertRaises(ObjectDoesNotExist, lambda f: f.document_filter, f=fund)

    def send_publish_fund_call(self, fund_id):
        url = reverse('publish-fund', kwargs={'pk': fund_id})
        return self.client.patch(url)

    def send_fund_status_update_call(self, fund_slug, payload):
        url = reverse('fund-update-status', kwargs={'fund_slug': fund_slug})
        return self.client.patch(url, payload)

    def test_fund_publish_view(self):
        fund = FundFactory(company=self.company)
        self.assertFalse(fund.is_published)
        response = self.send_publish_fund_call(fund.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        fund.refresh_from_db()
        self.assertTrue(fund.is_published)


class FinalizeFundTestCase(CompleteApplication):

    def setUp(self) -> None:
        self.company = CompanyFactory.create()
        self.create_card_workflow(self.company)
        self.user = UserFactory()
        self.admin_user = CreateAdminUserService(email=self.user.email, company_name=self.company.name).create()
        self.client.force_authenticate(self.user)
        self.currency = CurrencyFactory.create()
        self.fund = FundFactory(company=self.company, accept_applications=True)
        self.vehicle = CompanyFundVehicleFactory(company=self.company)
        self.share_class = FundShareClass.objects.create(company=self.company, company_fund_vehicle=self.vehicle, fund=self.fund, legal_name="share class", display_name='share class')
        self.create_eligibility_criteria_for_fund()
        self.setup_complete_application()
        self.document_api = apps.get_app_config('documents').document_api
        self.context = apps.get_app_config('documents').context

    def test_finalize_fund_update_view(self):
        fund = self.fund
        payload = {'is_finalized': True}
        url = reverse('funds-update', kwargs={'pk': fund.id})

        response = self.client.patch(url, payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        fund.refresh_from_db()
        self.assertTrue(fund.is_finalized)
        self.assertEqual(FundDocumentsBackup.objects.count(), 1)
        self.assertEqual(FundBackup.objects.count(), 1)

        fund_documents_backup = FundDocumentsBackup.objects.first()
        fund_backup = FundBackup.objects.first()

        fund_backup_csv = self.document_api.get_obj(context=self.context, key=fund_backup.storage_key)
        csv_file = fund_backup_csv['Body'].read().decode('utf-8')
        csv_data = csv.DictReader(StringIO(csv_file))

        data_list = []
        for row in csv_data:
            serializer = LasalleApplicationReport(data=row)
            self.assertTrue(serializer.is_valid())
            data = serializer.validated_data
            application = Application.objects.get(uuid=data['uuid'])
            self.assertIsNotNone(application)
            data_list.append(row)

        self.assertEqual(len(data_list), fund.applications.count())

        fund_documents_backup_csv = self.document_api.get_obj(context=self.context,
                                                              key=fund_documents_backup.storage_key)
        csv_file = fund_documents_backup_csv['Body'].read().decode('utf-8')
        csv_data = csv.DictReader(StringIO(csv_file))

        data_list = []
        prefix = fund._backup_prefix()
        for row in csv_data:
            application = Application.objects.get(uuid=row['application_uuid'])
            for application_supporting_document in application.application_supporting_documents.all():
                file_name = application_supporting_document.document.file_name()
                supporting_path = f"{prefix}{application.user.first_name}_{application.user.last_name}_supporting_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=supporting_path)
                body = doc['Body'].read()
                self.assertEqual(body, SUPPORTING_DOCUMENT_CONTENT)
            for kyc_document in application.kyc_record.kyc_documents.all():
                file_name = kyc_document.document.file_name()
                kyc_path = f"{prefix}{application.user.first_name}_{application.user.last_name}_kyc_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=kyc_path)
                body = doc['Body'].read()
                self.assertEqual(body, KYC_DOCUMENT_CONTENT)
            for tax_document in application.tax_record.tax_documents.all():
                file_name = tax_document.document.file_name()
                tax_path = f"{prefix}{application.user.first_name}_{application.user.last_name}_tax_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=tax_path)
                body = doc['Body'].read()
                self.assertEqual(body, TAX_DOCUMENT_CONTENT)
            for application_company_doc in application.application_company_documents.all():
                file_name = application_company_doc.signed_document.file_name()
                signed_document = f"{prefix}{application.user.first_name}_{application.user.last_name}_signed_document_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=signed_document)
                body = doc['Body'].read()
                self.assertEqual(body, SIGNED_COMPANY_DOCUMENT_CONTENT)
            for application_company_doc in application.application_company_documents.all():
                file_name = application_company_doc.certificate.file_name()
                certificate = f"{prefix}{application.user.first_name}_{application.user.last_name}_certificate_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=certificate)
                body = doc['Body'].read()
                self.assertEqual(body, CERTIFICATE_CONTENT)
            company_user = application.user.associated_company_users.first()
            signed_power_of_attorney = company_user.power_of_attorney_document
            file_name = signed_power_of_attorney.file_name()
            poa_prefix = f"{prefix}{application.user.first_name}_{application.user.last_name}_power_of_attorney_{file_name}"
            doc = self.document_api.get_obj(context=self.context, key=poa_prefix)
            body = doc['Body'].read()
            self.assertEqual(body, SIGNED_POWER_OF_ATTORNEY_CONTENT)
            data_list.append(row)

            for application_agreement in application.application_agreements.all():
                file_name = application_agreement.certificate.file_name()
                certificate = f"{prefix}{application.user.first_name}_{application.user.last_name}_agreement_certificate_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=certificate)
                body = doc['Body'].read()
                self.assertEqual(body, FUND_CERTIFICATE_DOCUMENT_CONTENT)

            for application_agreement in application.application_agreements.all():
                file_name = application_agreement.signed_document.file_name()
                signed_document = f"{prefix}{application.user.first_name}_{application.user.last_name}_signed_agreement_{file_name}"
                doc = self.document_api.get_obj(context=self.context, key=signed_document)
                body = doc['Body'].read()
                self.assertEqual(body, SIGNED_FUND_DOCUMENT_CONTENT)

        self.assertEqual(len(data_list), 7)
        fund.delete()


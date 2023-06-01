import io

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.apps import apps
from api.admin_users.tests.factories import AdminUserFactory
from api.documents.models import Document, InvestorDocument
from api.documents.tests.factories import DocumentFactory
from api.libs.sidecar_blocks.document_store.document_api import DocumentData
from api.partners.tests.factories import CompanyFactory, UserFactory, CompanyUserFactory, InvestorFactory, \
    CompanyUserInvestorFactory


def create_document_path():
    config = apps.get_app_config('documents')
    upload_context = config.context
    document_api = config.document_api
    content_type = "application/text"
    contents = b"The greatest document in human history"
    origin_file_obj = io.BytesIO(contents)
    document_data = DocumentData(content_type, origin_file_obj)
    document_path = document_api.upload(upload_context, document_data)
    return document_path


class AdminUserAccessAPITestCase(APITestCase):

    def setUp(self):
        self.company = CompanyFactory()
        self.user = UserFactory()
        self.admin_user = AdminUserFactory(user=self.user, company=self.company)
        self.client.force_authenticate(self.user)
        self.document_path = create_document_path()

    def test_different_company_document(self):
        document = DocumentFactory(document_path=self.document_path)
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        document = DocumentFactory(
            document_path=self.document_path,
            access_scope=Document.AccessScopeOptions.COMPANY.value
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_same_company_document(self):
        document = DocumentFactory(company=self.company, document_path=self.document_path)
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_only_document(self):
        document = DocumentFactory(
            company=self.company,
            document_path=self.document_path,
            access_scope=Document.AccessScopeOptions.USER_ONLY.value
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_investor_only_document(self):
        document = DocumentFactory(
            company=self.company,
            document_path=self.document_path,
            access_scope=Document.AccessScopeOptions.INVESTOR_ONLY.value
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class CompanyUserAccessAPITestCase(APITestCase):

    def setUp(self):
        self.company = CompanyFactory()
        self.user = UserFactory()
        self.company_user = CompanyUserFactory(user=self.user, company=self.company)
        self.client.force_authenticate(self.user)
        self.document_path = create_document_path()

    def test_different_company_document(self):
        document = DocumentFactory(document_path=self.document_path)
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        document = DocumentFactory(
            document_path=self.document_path,
            access_scope=Document.AccessScopeOptions.COMPANY.value
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_same_user_document(self):
        document = DocumentFactory(
            company=self.company,
            document_path=self.document_path,
            uploaded_by_user=self.company_user
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_different_user_company_scope_document(self):
        document = DocumentFactory(
            company=self.company,
            document_path=self.document_path,
            uploaded_by_user=CompanyUserFactory(company=self.company),
            access_scope=Document.AccessScopeOptions.COMPANY.value
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_investor_scope_document(self):
        company_user_investor = CompanyUserInvestorFactory()
        document = DocumentFactory(
            company=self.company,
            document_path=self.document_path,
            uploaded_by_user=CompanyUserFactory(company=self.company),
            access_scope=Document.AccessScopeOptions.INVESTOR_ONLY.value
        )
        InvestorDocument.objects.create(
            document=document,
            investor=company_user_investor.investor
        )
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        CompanyUserInvestorFactory(
            company_user=self.company_user,
            investor=company_user_investor.investor
        )

        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class AnonymousUserAccessAPITestCase(APITestCase):
    def test_anonymous_user(self):
        document_path = create_document_path()
        document = DocumentFactory(document_path=document_path)
        url = reverse('document-download', kwargs={'document_id': document.document_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

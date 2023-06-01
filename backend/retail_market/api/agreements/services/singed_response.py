import os

from django.apps import apps
from django.db import transaction

from api.agreements.models import ApplicantAgreementDocument
from api.applications.models import Application
from api.companies.models import Company
from api.documents.models import Document
from api.companies.models import CompanyUser
from api.libs.docusign.services import DocumentSigningService
from api.libs.sidecar_blocks.document_store.document_api import DocumentData


class SignedResponseService:
    def __init__(
            self,
            envelope_id: str,
            instance: ApplicantAgreementDocument,
            company: Company,
            document_title: str,
            application: Application
    ):
        self.envelope_id = envelope_id
        self.instance = instance
        self.company = company
        self.document_title = document_title
        self.upload_context = None
        self.document_api = None
        self.application = application
        self.get_document_api()

    def get_document_api(self):
        config = apps.get_app_config('documents')
        self.upload_context = config.context
        self.document_api = config.document_api

    def get_company_user(self):
        return CompanyUser.objects.get(
            company=self.application.company,
            user=self.application.user
        )

    def process(self):
        with transaction.atomic():
            docusign_service = DocumentSigningService()
            envelope_documents = docusign_service.get_envelope_documents(envelope_id=self.envelope_id)
            file_path = docusign_service.get_document(
                self.envelope_id,
                envelope_documents=envelope_documents
            )

            if not file_path:
                return

            document_path = self.store_document(file_path)
            if not document_path:
                return

            company_user = self.get_company_user()

            signed_document = Document.create_pdf_document(
                document_type=Document.DocumentType.FUND_AGREEMENT_DOCUMENT,
                company=self.company,
                title="signed_" + self.document_title,
                document_path=document_path,
                uploaded_by_user=company_user
            )

            file_path = docusign_service.get_document(
                envelope_id=self.envelope_id,
                envelope_documents=envelope_documents,
                certificate=True,
            )
            document_path = self.store_document(file_path)

            if not document_path:
                return

            certificate = Document.create_pdf_document(
                document_type=Document.DocumentType.FUND_AGREEMENT_DOCUMENT,
                company=self.company,
                title=self.document_title + "_certificate",
                document_path=document_path,
                uploaded_by_user=company_user
            )
            self.instance.completed = True
            self.instance.signed_document = signed_document
            self.instance.certificate = certificate
            self.instance.save()

            # applicant_agreement_document = self.instance.applicant_agreement_document
            # applicant_agreement_document.signed_document = signed_document
            # applicant_agreement_document.certificate = certificate
            # applicant_agreement_document.completed = True
            # applicant_agreement_document.save()

    def store_document(self, path):
        if not (self.upload_context and self.document_api):
            return

        if os.path.exists(path):
            with open(path, 'rb') as fh:
                document_data = DocumentData("application/pdf", fh)
                document_path = self.document_api.upload(self.upload_context, document_data)
            os.remove(path)
            return document_path
        return None

from django_pglocks import advisory_lock
from rest_framework.generics import ListAPIView, get_object_or_404, RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from api.agreements.models import ApplicantAgreementDocument
from api.agreements.serializers import (
    ApplicantAgreementDocumentSerializer, SigningUrlSerializer
)
from api.agreements.services.approve_gp_task_service import GPSigningTaskApprovalService
from api.agreements.services.singed_response import SignedResponseService
from api.applications.models import Application
from api.funds.services.application_fund_documents import ApplicationFundDocuments
from api.libs.docusign.services import DocumentSigningService
from api.libs.utils.user_name import get_identifier_from_email
from api.mixins.admin_view_mixin import AdminViewMixin
from api.permissions.is_sidecar_admin_permission import IsSidecarAdminUser


class AdminApplicantAgreementDocumentListView(AdminViewMixin, ListAPIView):
    serializer_class = ApplicantAgreementDocumentSerializer
    permission_classes = (IsSidecarAdminUser,)

    def get_queryset(self):
        application = get_object_or_404(
            Application,
            id=self.kwargs['application_id'],
            company=self.company
        )
        signing_documents = ApplicationFundDocuments(
            application=application
        ).get_documents(require_signature=True).values_list(
            'id',
            flat=True
        )
        return ApplicantAgreementDocument.objects.filter(
            application=application,
            agreement_document_id__in=list(signing_documents)
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['admin_user'] = self.admin_user
        return context


class GetAdminSigningURLAPIView(AdminViewMixin, RetrieveAPIView):
    serializer_class = SigningUrlSerializer
    permission_classes = (IsSidecarAdminUser,)

    def get_object(self):
        envelope_id = self.kwargs.get('envelope_id')
        user = self.request.user
        applicant_agreement_document = get_object_or_404(
            ApplicantAgreementDocument,
            envelope_id=envelope_id
        )
        retail_user = self.request.user

        envelope_payload = {
            "signer_email": retail_user.email,
            "signer_name": get_identifier_from_email(retail_user),
            "signer_client_id": retail_user.id,
            "envelope_id": envelope_id,
            "ds_return_url": self.request.query_params['return_url'],
        }

        docusign_service = DocumentSigningService()
        results = docusign_service.send_embedded(envelope_payload)
        return {'signing_url': results['redirect_url']}


class StoreAdminSignedResponse(AdminViewMixin, APIView):
    permission_classes = (IsSidecarAdminUser,)

    def get(self, request, *args, **kwargs):
        envelope_id = self.kwargs.get('envelope_id')
        user = self.request.user
        applicant_agreement_document = get_object_or_404(
            ApplicantAgreementDocument,
            envelope_id=envelope_id
        )
        if applicant_agreement_document.completed and applicant_agreement_document.gp_signing_complete:
            return Response({'status': 'success'})

        application = applicant_agreement_document.application
        company = application.company
        with advisory_lock(envelope_id, wait=False) as acquired:
            if acquired:
                signed_response_service = SignedResponseService(
                    envelope_id=envelope_id,
                    instance=applicant_agreement_document,
                    document_title=applicant_agreement_document.agreement_document.document.title,
                    company=company,
                    application=application
                )
                signed_response_service.process()
            else:
                return Response({'status': 'Another request in process'})

        applicant_agreement_document.completed = True
        applicant_agreement_document.gp_signing_complete = True
        applicant_agreement_document.save()
        GPSigningTaskApprovalService(agreement=applicant_agreement_document).process()

        return Response({'status': 'success'})

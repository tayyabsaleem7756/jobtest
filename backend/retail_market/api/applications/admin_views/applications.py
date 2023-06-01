import uuid

from django.db.models import Q
from django.http import HttpResponseBadRequest
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from api.admin_users.models import AdminUser
from api.applications.admin_views import serializers
from api.applications.admin_views.serializers import ApplicantManagementSerializer, \
    ApplicationDocumentRequestsSerializer, ApplicantListViewSerializer, ApplicantAmlKycSerializer
from api.applications.constants import APPLICATION_APPROVAL_STATUSES
from api.applications.models import Application, ApplicationDocumentsRequests
from api.applications.serializers import ApplicationRequestDocumentSerializer
from api.applications.services.reset_application import ApplicationResetService
from api.applications.services.send_allocation_approval_emails import SendAllocationApprovalEmailService
from api.applications.services.send_application_updated_email import SendApplicationUpdateEmail
from api.applications.services.send_application_withdrawn_email import SendApplicationWithdrawnEmail
from api.documents.models import ApplicationRequestDocument
from api.geographics.selectors.country_selectors import get_country_id_name_map
from api.investors.models import Investor
from api.libs.utils.user_name import get_display_name
from api.mixins.admin_view_mixin import AdminViewMixin
from api.permissions.is_sidecar_admin_permission import IsSidecarAdminUser
from api.workflows.models import Task
from api.workflows.services.user_on_boarding_workflow import UserOnBoardingWorkFlowService


class ApplicationListAPIView(AdminViewMixin, ListAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = serializers.ApplicationSerializer

    def get_queryset(self):
        return Application.active_applications.filter(
            company=self.company,
            fund__external_id=self.kwargs['fund_external_id']
        ).prefetch_related('tax_record')


class ApplicationRetrieveView(AdminViewMixin, RetrieveAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = ApplicantManagementSerializer
    queryset = Application.active_applications.all()

    def get_serializer_context(self):
        context = super().get_serializer_context()
        admin_users = AdminUser.objects.filter(company=self.company).select_related('user')
        admin_name_mapping = {str(admin_user.id): get_display_name(admin_user.user) for admin_user in admin_users}
        context['admin_name_mapping'] = admin_name_mapping
        return context


class ApplicantManagementListView(AdminViewMixin, ListAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = ApplicantListViewSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['country_id_name_map'] = get_country_id_name_map()
        return context

    def get_queryset(self):
        return Application.active_applications.filter(
            company=self.company,
            fund__external_id=self.kwargs['fund_external_id']
        ).select_related(
            'eligibility_response__investment_amount',
            'investment_amount',
            'investor',
            'company',
            'share_class',
            'vehicle',
            'user',
            'kyc_record',
            'fund'
        )


class ExportApplicationsView(AdminViewMixin, ListAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = ApplicantManagementSerializer

    def get_queryset(self):
        return Application.active_applications.filter(
            company=self.company,
            fund__external_id=self.kwargs['fund_external_id']
        ).select_related(
            'eligibility_response__investment_amount',
            'investment_amount',
            'investor',
            'company',
            'share_class',
            'vehicle',
            'user',
            'kyc_record',
            'payment_detail'
        ).prefetch_related(
            'workflow__workflow_comments__created_by',
            'workflow__workflow_comments__created_by'
        )


class ExportApplicationAmlKycData(AdminViewMixin, ListAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = ApplicantAmlKycSerializer

    def get_queryset(self):
        return Application.objects.filter(
            company=self.company,
            fund__external_id=self.kwargs['fund_external_id'],
            eligibility_response__is_eligible=True
        ).select_related(
            'company',
            'kyc_record',
        ).prefetch_related(
            'workflow__workflow_comments__created_by',
        ).exclude(
            status=Application.Status.WITHDRAWN,
            eligibility_response__isnull=True
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        admin_users = AdminUser.objects.filter(company=self.company).select_related('user')
        admin_name_mapping = {str(admin_user.id): get_display_name(admin_user.user) for admin_user in admin_users}
        context['admin_name_mapping'] = admin_name_mapping
        return context


class BulkUpdateApplicationStatus(AdminViewMixin, APIView):
    permission_classes = (IsSidecarAdminUser,)

    def update_task_status(self, application_id):
        fund = Application.objects.get(id=application_id).fund
        applications_count = Application.active_applications.filter(company=self.company, fund=fund).count()
        completed_applications_count = Application.active_applications.filter(
            company=self.company,
            fund=fund,
            status__in=APPLICATION_APPROVAL_STATUSES
        ).count()
        if completed_applications_count and applications_count == completed_applications_count:
            on_boarding_service = UserOnBoardingWorkFlowService(fund=fund, company_user=None)
            workflow = on_boarding_service.get_or_create_allocation_workflow()
            if workflow:
                workflow.workflow_tasks.update(
                    completed=True,
                    status=Task.StatusChoice.APPROVED.value
                )
                workflow.is_completed = True
                workflow.save(update_fields=['is_completed'])

    def post(self, request):
        data = request.data
        status = data.get('status')
        withdrawn_comment = data.get('withdrawn_comment')
        updated_fields = {'status': status}
        ids_to_update = data.get('ids')
        if not ids_to_update:
            return HttpResponseBadRequest('[ids] is a required field')

        if withdrawn_comment:
            updated_fields['withdrawn_comment'] = withdrawn_comment

        Application.active_applications.filter(
            company=self.company,
            id__in=ids_to_update
        ).update(**updated_fields)

        SendAllocationApprovalEmailService.send_emails(application_ids=ids_to_update)
        self.update_task_status(ids_to_update[0])

        # Only send emails after tasks and applications have been updated successfully.

        if int(status) == Application.Status.WITHDRAWN.value:
            SendApplicationWithdrawnEmail(ids_to_update).send_emails()

        return Response({'status': 'success'})


class ApplicationDocumentRequestCreateView(AdminViewMixin, CreateAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = ApplicationDocumentRequestsSerializer


class ApplicationDocumentsRequestsListView(AdminViewMixin, ListAPIView):
    permission_classes = (IsSidecarAdminUser,)
    serializer_class = ApplicationDocumentRequestsSerializer

    def get_queryset(self):
        return ApplicationDocumentsRequests.objects.filter(
            application_id=self.kwargs['application_id']
        ).prefetch_related('application')


class ApplicationDocumentRequestResponseListView(AdminViewMixin, ListAPIView):
    serializer_class = ApplicationRequestDocumentSerializer

    def get_queryset(self):
        application_document_requests = ApplicationDocumentsRequests.objects.filter(
            application_id=self.kwargs['application_id'])
        return ApplicationRequestDocument.objects.filter(application_document_request__in=application_document_requests)


class ApplicationUpdateVehicleAndShareClass(AdminViewMixin, APIView):
    permission_classes = (IsSidecarAdminUser,)

    def post(self, request):
        data = request.data
        share_class = data.get('share_class')
        vehicle = data.get('vehicle')
        comment = data.get('comment')
        max_leverage_ratio = data.get('max_leverage')
        application_id = data.get('application_id')
        has_comment = bool(comment and comment.strip())
        restricted_geographic_area = data.get('restricted_geographic_area')
        restricted_time_period = data.get('restricted_time_period')

        Application.active_applications.filter(
            company=self.company,
            id=application_id
        ).update(
            share_class_id=share_class,
            vehicle_id=vehicle,
            update_comment=comment,
            max_leverage_ratio=max_leverage_ratio,
            is_application_updated=has_comment,
            restricted_geographic_area=restricted_geographic_area,
            restricted_time_period=restricted_time_period
        )
        if has_comment:
            SendApplicationUpdateEmail(application_id).send_application_email()
        return Response({'status': 'success'})


class ApplicationInvestorAccountCodeView(AdminViewMixin, APIView):
    permission_classes = (IsSidecarAdminUser,)

    def post(self, request, application_id):
        application = get_object_or_404(
            Application,
            id=application_id,
            company=self.company
        )
        data = request.data
        investor_account_code = data['investor_account_code']
        if not investor_account_code:
            return Response({'error': 'No investor account code found'})
        try:
            investor = Investor.objects.get(investor_account_code=investor_account_code)
            if Application.active_applications.filter(
                    investor_id=investor.id,
                    fund_id=application.fund_id
            ).exclude(id=application_id).exists():
                return Response(
                    {
                        'investor_account_code': 'Investor account code can only be associated with one application for a fund'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        except Investor.DoesNotExist:
            investor = Investor.objects.create(
                investor_account_code=investor_account_code,
                partner_id=uuid.uuid4().hex,
                name=get_display_name(user=application.user)
            )
        application.investor = investor
        application.save(update_fields=['investor'])
        return Response({'status': 'success'})


class RemoveApplicationsAPIView(AdminViewMixin, APIView):
    permission_classes = (IsSidecarAdminUser,)

    def post(self, request, fund_external_id):
        data = request.data
        ids_to_update = data.get('ids')
        if not ids_to_update:
            return HttpResponseBadRequest('[ids] is a required field')

        Application.active_applications.filter(
            fund__external_id=fund_external_id,
            company=self.company,
            id__in=ids_to_update
        ).filter(
            Q(eligibility_response__isnull=True) | Q(eligibility_response__is_eligible=False)
        ).update(deleted=True)
        return Response({'status': 'success'})


class ApplicationResetAPIView(AdminViewMixin, APIView):
    permission_classes = (IsSidecarAdminUser,)

    def post(self, request, *args, **kwargs):
        application_ids = request.data.get('ids', [])
        applications = Application.objects.filter(id__in=application_ids, company=self.company)
        for application in applications:
            ApplicationResetService(application=application, request=request).reset()
        return Response({'status': 'success'})

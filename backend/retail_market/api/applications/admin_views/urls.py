from django.urls import path, re_path

from api.applications.admin_views import applications
from api.applications.admin_views import document_views

urlpatterns = [
    path(
        'funds/<application_id>/company-documents',
        document_views.ApplicationCompanyDocumentListAPIView.as_view(),
        name="application-company-documents"
    ),
    path(
        'funds/<application_id>/create-company-documents',
        document_views.ApplicationCompanyCreateAPIView.as_view(),
        name="application-company-documents"
    ),
    path(
        'funds/<application_id>/existing-and-deleted-company-documents',
        document_views.ExistingApplicationCompanyDocumentListAPIView.as_view(),
        name="application-company-documents-include-deleted"
    ),
    path(
        'funds/<application_id>/company-documents/<pk>',
        document_views.ApplicationCompanyDocumentUpdateAPIView.as_view(),
        name="application-company-document-update-api"
    ),
    re_path(
        'funds/(?P<fund_external_id>.+)/company-documents/gp_signing_url/(?P<envelope_id>.+)',
        document_views.GetGPSigningURLAPIView.as_view(),
        name="gp-signing-company-documents-signing-url"
    ),
    re_path(
        'funds/(?P<fund_external_id>.+)/company-documents/gp_store_response/(?P<envelope_id>.+)',
        document_views.StoreGPSignedResponse.as_view(),
        name="gp-signing-company-documents-store-url"
    ),
    re_path(
        r'fund/(?P<fund_external_id>.+)/applicant-management-list',
        applications.ApplicantManagementListView.as_view(),
        name='applicant-management-list-view'
    ),
    re_path(
        r'fund/(?P<fund_external_id>.+)/export',
        applications.ExportApplicationsView.as_view(),
        name='applicants-export-view'
    ),
    re_path(
        r'fund/(?P<fund_external_id>.+)/delete',
        applications.RemoveApplicationsAPIView.as_view(),
        name='remove-applications'
    ),
    re_path(
        r'fund/(?P<fund_external_id>.+)/aml-kyc-export',
        applications.ExportApplicationAmlKycData.as_view(),
        name='applicants-aml-kyc-export-view'
    ),
    re_path(
        'actions',
        applications.BulkUpdateApplicationStatus.as_view(),
        name='applications-actions-view'
    ),
    re_path(
        'update',
        applications.ApplicationUpdateVehicleAndShareClass.as_view(),
        name='application-update'
    ),
    path(
        'application-document-request/response/<application_id>',
        applications.ApplicationDocumentRequestResponseListView.as_view(),
        name='application-document-request-response-list'
    ),
    path(
        'application-document-request/<application_id>',
        applications.ApplicationDocumentsRequestsListView.as_view(),
        name='application-document-request-list'
    ),
    re_path(r'(?P<pk>\d+)$', applications.ApplicationRetrieveView.as_view(), name='applicant-retrieve-view'),
    re_path(
        r'(?P<application_id>\d+)/investor-account-code',
        applications.ApplicationInvestorAccountCodeView.as_view(),
        name='applicant-investor-account-code-view'
    ),
    path('fund/<fund_external_id>', applications.ApplicationListAPIView.as_view(), name='admin-list-applications-view'),
    path(
        'application-document-request',
        applications.ApplicationDocumentRequestCreateView.as_view(),
        name='application-document-request-create'
    ),
    path(
        '<application_id>/supporting-document',
        document_views.SupportingDocumentView.as_view(),
        name='application-supporting-document-list-create'
    ),
    path(
        '<application_id>/supporting-document/<pk>',
        document_views.SupportingDocumentRetrieveUpdateDestroyView.as_view(),
        name='application-supporting-document-retrieve-update-destroy'
    ),
    path(
        'reset/',
        applications.ApplicationResetAPIView.as_view(),
        name='admin-application-reset-view'
    ),
]

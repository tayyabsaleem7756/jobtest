const API_BASE = process.env.REACT_APP_API_URL;
const SOCKET_BASE = process.env.REACT_APP_WS_URL;


export const FUNDS_URL = `${API_BASE}/api/admin/funds/`
export const APPLICATIONS_URL = `${API_BASE}/api/admin/applications/`
export const CAPITAL_CALL_URL = `${API_BASE}/api/capital_calls/`
export const CAPITAL_CALL_ADMIN_URL = `${API_BASE}/api/admin/capital_calls/`
export const DISTRIBUTION_NOTICE_ADMIN_URL = `${API_BASE}/api/admin/distribution_notices/`
export const ADMIN_STATS_URL = `${FUNDS_URL}admin`
export const OPPORTUNITIES_URL = `${API_BASE}/api/investors/opportunities/`
export const INVESTOR_DETAIL_URL = `${API_BASE}/api/investors/detail/`
export const ORDERS_URL = `${API_BASE}/api/investors/orders/`
export const INVESTOR_PROFILES_URL = `${API_BASE}/api/investors/profiles/`
export const USERS_URL = `${API_BASE}/api/admin/users/`
export const USER_INFO_URL = `${API_BASE}/api/users/info`
export const NOTIFICATIONS_URL = `${API_BASE}/api/notifications/`
export const NOTIFICATIONS_FILTERS_URL = `${API_BASE}/api/notifications/filters`
export const FUND_INVESTOR_URL = `${API_BASE}/api/investors/funds/`
export const CURRENCIES_URL = `${API_BASE}/api/admin/currencies/`
export const DOCUMENTS_URL = `${API_BASE}/api/documents/`
export const COMPANIES_URL = `${API_BASE}/api/companies/`
export const COMPANY_INFO_URL = `${API_BASE}/api/admin/companies/`
export const COMPANY_INFO_DOC_URL = `${API_BASE}/api/admin/companies/documents`
export const getCompanyInfoDocURL = (id: any) => `${API_BASE}/api/admin/companies/documents/${id}`;
export const COMPANY_TOKENS_URL = `${API_BASE}/api/companies/tokens`
export const COMPANY_REGIONS_URL = `${API_BASE}/api/admin/geographics/region_countries`
export const ELIGIBILITY_CRITERIA_URL = `${API_BASE}/api/admin/eligibility_criteria/`
export const KYC_RECORDS_URL = `${API_BASE}/api/kyc_records/`
export const ADMIN_KYC_RECORDS_URL = `${API_BASE}/api/admin/kyc_records/`
export const COMMENTS_URL = `${API_BASE}/api/admin/comments/`
export const TAX_RECORDS_ADMIN_URL = `${API_BASE}/api/admin/tax_records`
export const TAX_RECORDS_URL = `${API_BASE}/api/tax_records`
export const ADMIN_AGREEMENTS_URL = `${API_BASE}/api/admin/agreements`
export const getTaskCountURL = (tokenId: string) => `${SOCKET_BASE}/tasks/recent-count/?token=${tokenId}`
export const ELIGIBILITY_CRITERIA_BLOCKS_URL = `${ELIGIBILITY_CRITERIA_URL}blocks`
export const ALL_USERS_URL = `${API_BASE}/api/admin/users/all`

export const getEligibilityCriteriaDecisionUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/decision`
export const getDecisionByIdUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/custom/decision`
export const getCreateConnectionUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/smart_block/connector`
export const getDeleteConnectionUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/smart_block/connector/delete`
export const getNextBockUrl = () => `${API_BASE}/api/eligibility_criteria/response/criteria_block/`


export const FUND_TAGS_URL = `${API_BASE}/api/admin/funds/tags`;


export const createManagersUrl = (externalId: string) =>
  `${FUNDS_URL}${externalId}/managers`;
export const updateUserUrl = (userId: number) => `${USERS_URL}${userId}`
export const createApplicationDocumentUrl = (applicationId: number) => `${APPLICATIONS_URL}${applicationId}/supporting-document`
export const updateApplicationDocumentUrl = (applicationId: number, applicationDocumentId: number) => `${APPLICATIONS_URL}${applicationId}/supporting-document/${applicationDocumentId}`
export const createFundDocURL = (externalId: string) => `${API_BASE}/api/admin/funds/${externalId}/documents/create`
export const FundDetailDocURL = (externalId: string) => `${API_BASE}/api/admin/funds/${externalId}/public/document`
export const exportInterestAnswers = (externalId: string) => `${API_BASE}/api/admin/funds/interest/${externalId}/export`
export const getFundDocURL = (externalId: string) => `${API_BASE}/api/admin/funds/${externalId}/documents`
export const updateCompanyTokenURL = (tokenId: number) => `${COMPANY_TOKENS_URL}/${tokenId}`
export const updateFundURL = (fundId: number) => `${FUNDS_URL}${fundId}`
export const publishFundURL = (fundId: number) => `${FUNDS_URL}${fundId}/publish`
export const getFundsDetailURL = (externalId: string) => `${FUNDS_URL}external_id/${externalId}`
export const getFundsBaseInfoURL = (externalId: string) => `${FUNDS_URL}external_id/${externalId}/base-info`
export const getFundsInvestmentsURL = (externalId: string) => `${FUND_INVESTOR_URL}${externalId}/detail`
export const updateOrderDetailURL = (orderId: number) => `${ORDERS_URL}${orderId}`
export const fundInvestorDetailUrl = (fundInvestorId: string) => `${FUND_INVESTOR_URL}${fundInvestorId}`
export const capitalCallDetailUrl = (capitalCallUUID: string) => `${CAPITAL_CALL_URL}${capitalCallUUID}`
export const documentDownloadUrl = (documentId: string) => `${DOCUMENTS_URL}${documentId}`
export const updateNotificationUrl = (notificationId: number) => `${NOTIFICATIONS_URL}${notificationId}`
export const eligibilityCriteriaDetailUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}`
export const eligibilityCriteriaUpdateUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/edit`
export const eligibilityCriteriaPreviewUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/preview`
export const createBlockUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/block`
export const validateCustomExpressionUrl = () => `${ELIGIBILITY_CRITERIA_URL}validate-update-custom-expression`
export const createBlockDocumentUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/documents`
export const getBlockDocumentsUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/documents/list`
export const updateConnectorUrl = (connectorId: number) => `${ELIGIBILITY_CRITERIA_URL}connector/${connectorId}`
export const customLogicBlockUrl = (criteriaId: number) => `${ELIGIBILITY_CRITERIA_URL}${criteriaId}/custom_logic_block`
export const updateCriteriaBlockUrl = (connectorId: number) => `${ELIGIBILITY_CRITERIA_URL}criteria_block/${connectorId}`
export const getEligibilityCriteriaCard = (responseId: number) => `${ELIGIBILITY_CRITERIA_URL}response/${responseId}/`
export const deleteDocumentUrl = (documentId: number) => `${DOCUMENTS_URL}${documentId}`
export const getWorkflowsURLByFund = (externalId: string) => `${API_BASE}/api/admin/workflows/funds/${externalId}/`
export const getKYCRecordsByWorkflow = (workflowSlug: string) => `${KYC_RECORDS_URL}workflows/${workflowSlug}/kyc_records`
export const getKYCDocumentsURL = (kycRecordId: number) => `${KYC_RECORDS_URL}${kycRecordId}/documents`
export const getKYCParticipantDocumentsURL = (workflowSlug: string, kycRecordId: number, participantId: number) => `${KYC_RECORDS_URL}workflows/${workflowSlug}/kyc_records/${kycRecordId}/participants/${participantId}/documents`
export const getKYCRiskEvaluationURL = (kycRecordId: number) => `${KYC_RECORDS_URL}${kycRecordId}/risk_evaluation`
export const getKYCCommentsUpdateURL = (commentId: number) => `${COMMENTS_URL}update/${commentId}`;
export const getIndicationOfInterestAnalyticsUrl = (externalId: string) => `${API_BASE}/api/analytics/fund/${externalId}/indication-of-interest`
export const getIndicationOfInterestAnalyticsExportUrl = (externalId: string, fund_id: number) => `${API_BASE}/api/analytics/fund/${externalId}/indication-of-interest/${fund_id}/export`
export const getTaxRecords = () => `${TAX_RECORDS_ADMIN_URL}/`;
export const getTaxFormsUrl = (recordId: number) => `${TAX_RECORDS_ADMIN_URL}/${recordId}/documents`;
export const updateFundStatusURL = (externalId: string) => `${API_BASE}/api/funds/status/${externalId}`;
export const getSigningUrlUrl = (envelopeId: string, returnUrl: string) => `${TAX_RECORDS_URL}/tax_forms/${envelopeId}/form_signing_url?return_url=${returnUrl}`;
export const getFetchTaxDetailsUrl = (record_id: number) => `${TAX_RECORDS_ADMIN_URL}/${record_id}/tax-details/`;
export const getUserAgreementSigningUrl = (envelopeId: string, returnUrl: string) => `${ADMIN_AGREEMENTS_URL}/signing_url/${envelopeId}?return_url=${returnUrl}`;
export const storeUserResponseUrl = (envelopeId: string) => `${ADMIN_AGREEMENTS_URL}/store_response/${envelopeId}`;

export const getCompanyDocumentSigningUrl = (externalId: string, envelopeId: string, returnUrl: string) => `${API_BASE}/api/admin/applications/funds/${externalId}/company-documents/gp_signing_url/${envelopeId}?return_url=${returnUrl}`;
export const storeCompanyDocumentUserResponseUrl = (externalId: string, envelopeId: string) => `${API_BASE}/api/admin/applications/funds/${externalId}/company-documents/gp_store_response/${envelopeId}`;

export const GROUPS_URL = `${API_BASE}/api/admin/companies/groups`
export const getUpdateUserUrl = (userId: number) => `${API_BASE}/api/admin/users/${userId}/update`
export const getReplyListCreateUrl = (commentId: number) => `${API_BASE}/api/comments/${commentId}/replies`


export const createKycDocumentUrl = (kycRecordId: number) => `${ADMIN_KYC_RECORDS_URL}${kycRecordId}/documents`;

export const createTaxRecordUrl = () => `${TAX_RECORDS_ADMIN_URL}/documents/create`;

export const createProgramDocumentUrl = (
  applicationId: number
) => `${APPLICATIONS_URL}funds/${applicationId}/create-company-documents`;

export const getAdminProfileUrl = () => `${API_BASE}/api/admin_users/admin-info`;


import React, {FunctionComponent, memo, useEffect, useMemo, useReducer, useRef, useState,} from "react";
import API from "../../api/marketplaceApi";
import { Element as ScrollElement } from 'react-scroll';
import { AxiosError } from "axios";
import size from "lodash/size";
import first from "lodash/first";
import replace from "lodash/replace";
import map from "lodash/map";
import pickBy from "lodash/pickBy";
import toLower from "lodash/toLower";
import isEqual from "lodash/isEqual";
import isEmpty from "lodash/isEmpty";
import each from "lodash/each";
import get from "lodash/get";
import {useNavigate, useParams} from "react-router-dom";
import {Field, FieldProps, Formik, FormikHelpers, FormikProps, FormikValues,} from "formik";
import {
  AML_FLOW_SLUGS,
  AML_SLUG_SELECTION_ID,
  KYC_LIMITED_PARTNERSHIP_INVESTOR,
  KYC_PARTICIPANT_INVESTOR,
  KYC_PRIVATE_COMPANY_INVESTOR,
  KYC_TRUST_INVESTOR,
  PARTICIPANT_FORMS_INITIAL_STATE,
  STATUS_CODES,
} from "../KnowYourCustomer/constants";
import {selectKYCRecord} from "../KnowYourCustomer/selectors";
import {
  fetchAdditionalCards,
  fetchApplicationDocumentRequestResponse,
  fetchApplicationDocumentRequests,
  fetchCommentsByApplicationId,
  fetchCommentsByKycRecordId,
  fetchInitialRecord,
  fetchKYCDocuments,
  fetchKYCParticipantsDocuments,
  fetchKYCRecord,
  fetchWorkflows,
  dismissApplicationUpdateNotification
} from "../KnowYourCustomer/thunks";
import { getUnavailableSectionMesage } from "../../constants/applicationView";
import {fetchAppRecord, fetchTaxDocuments} from "../TaxForms/thunks";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {FormValues} from "../KnowYourCustomer/interfaces";
import {
  useGetFundDetailsQuery,
  useHasPendingRequestsQuery,
  useGetDocumentsQuery,
  useSubmitApplicationChangesMutation,
  useUpdateCommentStatusMutation,
  useGetApplicationStatusQuery,
  useFetchBankingDetailsQuery,
  useGetApplicationModuleStateQuery,
  useGetApplicationNextStateQuery
} from "../../api/rtkQuery/fundsApi";
import BankingDetails from "./BankingDetails";
import ProgramDoc from "./ProgramDoc";
import FundDocuments from "./FundDocuments";
import WithdrawApplication from "./WithdrawApplication";
import {
  getAnswerInputComponent,
  getDocumentFieldsList,
  getIsFieldEnabled,
  handleValidation,
  onFormUpdateError,
  participantFormStatusReducer,
} from "../KnowYourCustomer/utils";
import {getTotalComments, getTotalCommentsByModule, getParticipantsCount, hasNonApprovedComments} from "./utils";
import AutoSave from "../KnowYourCustomer/components/AutoSave";
import {Card, Schema, WorkflowAnswerPayload,} from "../../interfaces/workflows";
import {
  CardContainer,
  ChangeAnswersButton,
  Container,
  Content,
  FormContainer,
  Header,
  HeaderRow,
  Inner,
  LeftSidebar,
  ParticipantContainer,
  Path,
  SidebarItem,
  SidebarSubItem,
  SubmitButton,
  Subtitle,
  Tab,
  TabRow,
  Title,
  CommentNote,
  CommentBadge,
  CommentContainer,
  ScrollLink,
  DismissButton,
  SubTitle, SubmitChangesButton,
} from "./styles";
import ThemedButton from 'components/Button/ThemeButton'

import tasksApi from "../../api/tasks";
import {resetToDefault, setApplicationStatus,} from "../KnowYourCustomer/kycSlice";
import CommentWrapper from "../../components/CommentWrapper";
import {MODIFY_ELIGBILITY} from "../../constants/urlHashes";
import {Button} from "react-bootstrap";
import NotificationModal from "../../components/NotificationModal";
import Accordion from "react-bootstrap/Accordion";
import {selectAppRecords} from "../TaxForms/selectors";
import {ELIGIBILITY_CRITERIA_CARD_NAME, FILE_UPLOAD_FIELD, INVESTMENT_AMOUNT_CARD_NAME, notificationConfig, OVERVIEW_FIELDS, PARTICIPANTS_CARD_LABEL} from "./constants";
import SchemaContainer from '../KnowYourCustomer/components/CardContainer';
import Logo from "../../components/Logo";
import TaxDocuments from "./components/TaxDocuments";
import {ELIGIBILITY_CRITERIA, KYC_RECORD, FUND_DOCUMENTS, TAX_RECORD, INVESTMENT_ALLOCATION, BANKING_DETAILS, PARTICIPANT, PROGRAM_DOCS} from "../../constants/commentModules";
import CommentCount from "./components/CommentCount";
import Overview from "./Overview";
import InvestmentAmount from "./InvestmentAmount";
import EligibilityCriteria from "./EligibilityCriteria";
import { COMMENT_CREATED, COMMENT_UPDATED } from "../../constants/commentStatus";

import ApplicationStatuses from "./components/ApplicationStatusPills";
import {selectIsEligible} from "../OpportunityOnboarding/selectors";
import {getFundCriteriaResponseStatus} from "../OpportunityOnboarding/thunks";
import  CustomButton from "components/Button/ThemeButton";
import NextStatus from "./components/StatusBars";
import { PageWrapper } from "components/Page";
import BackToDashboard from "./components/BackToDashboard";
import {resetRtkStore} from "../../api/rtkQuery/resetRtkStore";


export interface IUploadDocDetails {
  files: File[],
  recordId: number,
  questionId: string
}

interface ICommentsContext {
  comments: any,
  recordId: null | number;
  recordUUID: null | string;
  callbackDocumentUpload: null | ((data: IUploadDocDetails) => void),
  fetchKYCRecord: null | (() => void),

}

export const CommentsContext = React.createContext<ICommentsContext>({
  comments: {},
  recordId: null,
  recordUUID: null,
  callbackDocumentUpload: null,
  fetchKYCRecord: null
});

const ApplicationView: FunctionComponent<any> = () => {
  const dispatch = useAppDispatch();
  const { externalId, company, ...restParams } = useParams<{ externalId: string, company: string }>();
  const {
    answers,
    commentsByRecord,
    didFetch,
    kycRecordId,
    workflow,
    comments,
    investorType,
    eligibilityCard,
    investmentAmountCard,
    kycRecordParticipants,
    kycParticipantIds,
    currentTaskId,
    recordUUID,
    applicationRecord,
    applicationDocumentsRequests,
    applicationRequestedDocuments
  } = useAppSelector(selectKYCRecord);
  const isEligible = useAppSelector(selectIsEligible);
  const {data: fundDetails} = useGetFundDetailsQuery(externalId);
  const { data: fundDocuments } = useGetDocumentsQuery(externalId, {
    skip: !externalId,
  });

  const {data: submitChangesStatus} = useHasPendingRequestsQuery(externalId);
  const { data: applicationStatus } = useGetApplicationStatusQuery(externalId);
  const { data: applicationNextState, refetch: refetchNextState } = useGetApplicationNextStateQuery(externalId);
  const { data: applicationModuleStats } = useGetApplicationModuleStateQuery(externalId);
  const [apiHandleSubmitChanges] = useSubmitApplicationChangesMutation();
  const [apiResetComment] = useUpdateCommentStatusMutation();
  const { data: bankingApiData } =
    useFetchBankingDetailsQuery(externalId, {
      skip: !externalId,
    });

  const { hasFetchedAppRecords, appRecords, taxDocumentsList } = useAppSelector(selectAppRecords);
  const [activeCard, setActiveCard] = useState<string>("");
  const [application, setApplication] = useState<Card[]>([]);
  const [hasFundDocuments, setHasFundDocuments] = useState(false);
  const [schema, setSchema] = useState<Schema>([]);
  const [notification, setNotification] = useState(notificationConfig.default);
  const history = useNavigate();
  const showAmlKyc = applicationStatus?.is_approved;
  const isAllocationApproved = applicationStatus?.is_approved && isEligible;

  const skipTax = fundDetails?.skip_tax

  const [participantForms, dispatchParticipantForms] = useReducer(
    participantFormStatusReducer,
    PARTICIPANT_FORMS_INITIAL_STATE
  );
  const [enableSubmitChanges, setEnableSubmitChanges] = useState(true);
  const [participantApplications, setParticipantApplications] = useState<{
    [key: string]: Card;
  }>({});
  const [
    submittingParticipantApplications,
    setSubmittingParticipantApplications,
  ] = useState<boolean>(false);
  const participantRefs = useRef<{ [key: string]: FormikProps<FormikValues> }>(
    {}
  );

  const hidratedAnswers = useMemo(() => {
    if (
      investorType === KYC_PRIVATE_COMPANY_INVESTOR ||
      investorType === KYC_LIMITED_PARTNERSHIP_INVESTOR ||
      investorType === KYC_TRUST_INVESTOR
    ) {
      return Object.assign({}, answers, {
        [AML_SLUG_SELECTION_ID]: AML_FLOW_SLUGS[investorType],
      });
    }
    return answers;
  }, [investorType, answers]);

  const onValidate = (values: FormValues) => handleValidation(values, schema);

  const commentsOfCurrentRecord = useMemo(() => {
    if (kycRecordId === null) return {};
    return commentsByRecord[kycRecordId];
  }, [kycRecordId, commentsByRecord]);

  const commentsPerCard = useMemo(() => {
    const commentsPerCard: { [key: string]: number } = {};
    if (
      !!commentsOfCurrentRecord &&
      Object.keys(commentsOfCurrentRecord).length > 0
    ) {
      application.forEach((card) => {
        const schema = card.schema.reduce((acc, question) => {
          if (!acc.includes(question.id)) {
            acc.push(question.id);
          }
          return acc;
        }, [] as string[]);
        schema.forEach((questionId) => {
          if (questionId in commentsOfCurrentRecord) {
            commentsPerCard[card.name] = commentsPerCard[card.name]
              ? commentsPerCard[card.name] + 1
              : 1;
          }
        });
      });
    }
    return commentsPerCard;
  }, [commentsOfCurrentRecord, application]);

  const additionalDocumentPendingRequestsCount = useMemo(() => {
    let count: number = 0;
    const documentResponseFlags: any = {}
    if(applicationDocumentsRequests){
      applicationDocumentsRequests.forEach((request) => {
        documentResponseFlags[request.id] = false;
        applicationRequestedDocuments.forEach((document) => {
          if(document.application_document_request === request.id){
            documentResponseFlags[request.id] = true
          }
        })
      })
    }
    Object.keys(documentResponseFlags).forEach((key) => {
      if(!documentResponseFlags[key]) count++;
    })
    return count
  }, [
    applicationRequestedDocuments,
    applicationDocumentsRequests
  ]);

  useEffect(() => {
    if(get(appRecords, `0.eligibility_response`)){
      dispatch(getFundCriteriaResponseStatus(appRecords[0]?.eligibility_response))
    }
  }, [appRecords])

  useEffect(() => {
    if (!externalId) return
    window.scrollTo(0, 0);
    dispatch(fetchAppRecord(externalId));
    return () => {
      dispatch(resetToDefault());
      resetRtkStore(dispatch)
    };
  }, []);

  const submitParticipantForm = async (
    values: FormValues,
    helpers: FormikHelpers<FormValues>,
    participantId: number
  ) => {
    const documentFields = getDocumentFieldsList(values, workflow!);
    const initialValues = kycRecordParticipants![participantId] ?? {};
    const nonDocumentFields = Object.entries(values).reduce(
      (acc, [key, value]) => {
        if (!documentFields.includes(key) && initialValues[key] !== value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as FormValues
    );
    try {
      if (Object.keys(nonDocumentFields).length > 0) {
        await API.updateParticipantRecord(
          workflow!.slug,
          kycRecordId!,
          participantId,
          nonDocumentFields
        );
        if (recordUUID) dispatch(fetchKYCRecord(recordUUID));
      }
      if (documentFields.length > 0) {
        dispatch(fetchKYCParticipantsDocuments(participantId));
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.data && error.response.status === 400) {
        // @ts-ignore
        onFormUpdateError(error.response?.data, helpers.setFieldError);
      }
    } finally {
      helpers.setSubmitting(false);
    }
  };

  const onChangeAMLKYCAnswers = async () => {
    if (
      !window.confirm("Are you sure you want to change your AML/KYC answers?")
    )
      return;
    await API.updateKYCRecordStatus(
      workflow!.slug,
      kycRecordId!,
      STATUS_CODES.CREATED
    );
    dispatch(setApplicationStatus(STATUS_CODES.CREATED));
    history(`/${company}/funds/${externalId}/amlkyc`);
  };

  useEffect(() => {
    if (externalId) {
      dispatch(fetchWorkflows(externalId));
      hasFetchedAppRecords &&
        !skipTax &&
        appRecords[0] &&
        appRecords[0].tax_record &&
        dispatch(fetchTaxDocuments(appRecords[0].tax_record.uuid));
        kycRecordId && dispatch(fetchCommentsByKycRecordId(kycRecordId));
    }
  }, [dispatch, hasFetchedAppRecords, appRecords, externalId, kycRecordId, skipTax]);

  useEffect(() => {
    if (didFetch.fundWorkflows && externalId) {
      dispatch(fetchInitialRecord(externalId));
    }
  }, [didFetch.fundWorkflows, dispatch, externalId]);

  useEffect(() => {
    if(applicationRecord){
      dispatch(fetchApplicationDocumentRequests(applicationRecord.id))
      dispatch(fetchApplicationDocumentRequestResponse(applicationRecord.id))
      dispatch(fetchCommentsByApplicationId(applicationRecord.id));
    }
  }, [dispatch, applicationRecord])

  useEffect(() => {
    if (kycRecordId === null) return;
    dispatch(fetchKYCDocuments(kycRecordId));
    dispatch(fetchCommentsByKycRecordId(kycRecordId));
  }, [dispatch, kycRecordId]);

  useEffect(() => {
    if (workflow?.cards && hidratedAnswers) {
      const workflowCards = [...workflow.cards];

      if (investmentAmountCard) workflowCards.push(investmentAmountCard);
      if (eligibilityCard) workflowCards.push(eligibilityCard);
      const updatedCards = workflowCards;
      const application = updatedCards.reduce((acc, card) => {
        const schema = card.schema.filter(
          (question) =>
            (hidratedAnswers![question.id] !== undefined ||
              question.submitted_answer ||
              question.investmentDetail ||
              question.type === "file_upload")
        );
        if (
          schema.length > 0 &&
          card.kyc_investor_type_name !== KYC_PARTICIPANT_INVESTOR
        ) {
          acc.push({ ...card, schema });
        }
        return acc;
      }, [] as Card[]);

      const schema = application.reduce((acc, card) => {
        card.schema.forEach((question) => {
          acc.push(question);
        });
        return acc;
      }, [] as Schema);
      setApplication(application);
      setActiveCard(get(application, "[0].name", ""));
      setSchema(schema);
    }
  }, [
    workflow?.cards,
    hidratedAnswers,
    eligibilityCard,
    investmentAmountCard,
    investorType,
  ]);

  useEffect(() => {
    if (appRecords && appRecords[0])
      dispatch(fetchAdditionalCards(appRecords[0].id));
  }, [dispatch, appRecords]);

  useEffect(() => {
    if (
      kycParticipantIds !== null &&
      kycRecordParticipants !== null &&
      workflow?.cards !== undefined
    ) {
      const partApp: { [key: string]: Card } = {};
      const repeatableCards = workflow.cards.filter(
        (card) => card.is_repeatable
      );
      kycParticipantIds.forEach((participantId) => {
        const answers = kycRecordParticipants[participantId];
        repeatableCards.forEach((card) => {
          const schema = card.schema.filter(
            (question) => answers[question.id] !== undefined || question.type === FILE_UPLOAD_FIELD
          );
          const fullName = answers.first_name + " " + answers.last_name;
          if (schema.length > 0) {
            partApp[participantId] = {
              ...card,
              schema,
              name: fullName ?? `${card.name} ${participantId}`,
            };
          }
        });
      });
      setParticipantApplications(partApp);
    }
  }, [kycParticipantIds, kycRecordParticipants, workflow?.cards]);

  useEffect(() => {
    if(kycRecordId)
      dispatch(fetchCommentsByKycRecordId(kycRecordId));
    if (!didFetch.participantDocuments && kycParticipantIds !== null) {
      kycParticipantIds.forEach((participantId) => {
        dispatch(fetchKYCParticipantsDocuments(participantId));
      });
    }
  }, [dispatch, didFetch.participantDocuments, kycRecordId, kycParticipantIds ]);


  useEffect(() => {
    if (kycParticipantIds === null) return;
    kycParticipantIds.forEach((participantId) => {
      dispatch(fetchCommentsByKycRecordId(participantId))
    }
    );
  }, [dispatch, kycParticipantIds]);

  useEffect(() => {
    if (
      submittingParticipantApplications &&
      !participantForms.anyDirty &&
      !participantForms.anySubmitting
    ) {
      setSubmittingParticipantApplications(false);
    }
  }, [
    submittingParticipantApplications,
    participantForms.anyDirty,
    participantForms.anySubmitting,
  ]);

  const bankingCommentsCount = useMemo(() => {
    return getTotalCommentsByModule(comments, BANKING_DETAILS);
  }, [comments]);


  const programCommentsCount = useMemo(() => {
    return getTotalCommentsByModule(comments, PROGRAM_DOCS);
  }, [comments]);

  const fundDocumentCommentsCount = useMemo(() => {
    const ids = map(fundDocuments, (val) => `${val.id}`);
    return getTotalComments(comments, ids, FUND_DOCUMENTS);
  }, [comments, fundDocuments]);

  const investmentCommentsCount = useMemo(() => {
    return getTotalCommentsByModule(comments, INVESTMENT_ALLOCATION);
  }, [comments, fundDocuments]);


  const taxCommentsCount = useMemo(() => {
    return getTotalCommentsByModule(comments, TAX_RECORD);
  }, [comments])

  const investmentCard = useMemo(() => {
    return application.find(card => card.name === "Investment Amount")
  }, [application])

  const eligibilityCriteriaCard = useMemo(() => {
    return application.find(card => card.name === "Eligibility Criteria")
  }, [application])

  const overviewCommentsCount = useMemo(() => {
    let newCommentCount = 0;
    let updatedCommentCount = 0;
    const kycComments = get(commentsByRecord, `${KYC_RECORD}.${kycRecordId}`);
    each(OVERVIEW_FIELDS, (field) => {
      if (
        kycComments &&
        kycComments[field] &&
        // @ts-ignore
        get(kycComments[field], `${""}.0`)?.status === COMMENT_CREATED
      ) {
        newCommentCount++;
      }
      if (
        kycComments &&
        kycComments[field] &&
        // @ts-ignore
        get(kycComments[field], `${""}.0`)?.status === COMMENT_UPDATED
      ) {
        updatedCommentCount++;
      }
    });
    if(newCommentCount > 0) return newCommentCount;
    if(updatedCommentCount > 0) return -1;
    return 0
  }, [commentsByRecord]);

  const onDismissNotification = () => {
    dispatch(
      dismissApplicationUpdateNotification({
        application_id: applicationRecord?.uuid,
        application_fields: { is_application_updated: false },
      })
    ).then(() => {
      if (externalId)
      dispatch(fetchInitialRecord(externalId));
    });
  };

  const participantCommentsCount = useMemo(() => {
    const count = getParticipantsCount(comments, kycParticipantIds);
    return count;
  }, [kycParticipantIds, comments])

  const formInit = hidratedAnswers ?? answers

  if (didFetch.fundWorkflows && didFetch.initialRecord && !workflow)
    return (
      <PageWrapper>
      <Container>
        <Inner>
          <Content>No application found for this fund.</Content>
        </Inner>
      </Container>
      </PageWrapper>
    );
  if (!answers || !workflow)
    return (
      <PageWrapper>
      <Container>
        <Inner>
          <Content>Fetching application...</Content>
        </Inner>
      </Container>
      </PageWrapper>
    );


  const getSectionId = (label: string) => {
    return toLower(replace(label, /\s/g, "_"));
  }

  const handleSubmitChanges = async () => {
    if(submitChangesStatus?.has_pending_requests && enableSubmitChanges){
      await apiHandleSubmitChanges(externalId);
      refetchNextState()
      setNotification(notificationConfig.submittedChanges);
      setEnableSubmitChanges(false);
    }else {
      setNotification(notificationConfig.submittedChanges);
    }
  }

  const getKYCRecord = () => {
    if (recordUUID) dispatch(fetchKYCRecord(recordUUID));
  }

  const callbackSubmitPOA = () => {
    getKYCRecord();
    applicationRecord && dispatch(fetchCommentsByApplicationId(applicationRecord.id));
  }

  const handleSubmit = async (formikData: FormValues, { setFieldError }: FormikHelpers<FormValues>) => {
    const values = pickBy(formikData, (value, key) => {
      return (!isEqual(get(formInit, key), value) && key !== "aml-kyc-type-selection")
    })

    if(!isEmpty(values)) {
      if (currentTaskId) await tasksApi.submitChangesForTask(currentTaskId);
      try {
        const fieldsToExclude = getDocumentFieldsList(values, workflow);
        const payload = Object.keys(values).reduce((acc, key) => {
          if (fieldsToExclude.indexOf(key) === -1) {
            acc[key] = values[key];
          }
          return acc;
        }, {} as WorkflowAnswerPayload);
        payload.status = STATUS_CODES.SUBMITTED.id + "";
        await API.updateKYCRecord(workflow!.slug, kycRecordId!, payload);
        if (recordUUID) dispatch(fetchKYCRecord(recordUUID));
        dispatch(fetchKYCDocuments(kycRecordId!));
        if (kycParticipantIds !== null) {
          setSubmittingParticipantApplications(true);
          kycParticipantIds.forEach((participantId) => {
            participantRefs?.current[participantId]?.submitForm();
          });
        }
      } catch (e) {
        const error = e as AxiosError;
        if (error.response?.data && error.code === "400") {
          // @ts-ignore
          onFormUpdateError(error.response.data, setFieldError);
        }
      }
    }
  }

  const handleUploadDouments = async (data: IUploadDocDetails) => {
    if(size(data.files) > 0 && data.recordId && data.questionId){
      const acc: Promise<any>[] = [];
      each(data.files, (file: File) => {
        const formData = new FormData();
        formData.append('file_data', file);
        formData.append('field_id', data.questionId);
        formData.append('record_id', `${data.recordId}`);
        acc.push(API.uploadDocumentToKYCRecord(data.recordId, formData));
      });
      await Promise.allSettled(acc);
      if(kycRecordId)
        dispatch(fetchKYCDocuments(kycRecordId));
      dispatch(fetchKYCParticipantsDocuments(data.recordId));
      getKYCRecord();
    }
  }

  const getCommentsCount = (card: any) => {
    if(card.id === "aml-kyc-entities-and-stuff-aml-entity-card")
      return getTotalComments(comments, ["kyc_investor_type_name", "investor_location"]);

    if(card.name === "Eligibility Criteria")
      return getTotalCommentsByModule(comments, ELIGIBILITY_CRITERIA);

    if(card.name === "Investment Amount")
      return investmentCommentsCount;

    const ids = map(card?.schema, 'id');
    return getTotalComments(comments, ids);
  }

  const getModuleDetails = (card: any) => {
    const isEligibilityCard = card.name === "Eligibility Criteria";
    const resp = {
      isEligibilityCard: false,
      commentsModule: KYC_RECORD,
      moduleId: appRecords[0].kyc_record.id
    };
    if(isEligibilityCard) {
      return { ...resp, isEligibilityCard: true, commentsModule: ELIGIBILITY_CRITERIA, moduleId: appRecords[0].eligibility_response}
    }
    if(card.name === "Investment Amount"){
      return { ...resp, commentsModule: INVESTMENT_ALLOCATION, moduleId: get(card.schema, `0.investmentDetail.investment_record_id`) };
    }
    return resp;
  }

  if (didFetch.fundWorkflows && !workflow)
    return <Container>No application found.</Container>;
  if (!answers || !workflow || formInit === null) return <Container>Loading...</Container>;

  let showModifyEligibilityButton = false

  if (appRecords && appRecords[0]) {
    showModifyEligibilityButton = hasNonApprovedComments(comments, ELIGIBILITY_CRITERIA, appRecords[0]?.eligibility_response) || (submitChangesStatus?.has_pending_requests && enableSubmitChanges)
  }

  return (
    <PageWrapper>
    <Formik
      initialValues={formInit}
      onSubmit={handleSubmit}
      validate={onValidate}
      enableReinitialize={true}
    >
      {(formikProps: FormikProps<FormValues>) => (
        <Container>
          <AutoSave />
          <Header style={{boxSizing:'border-box'}}>
            <HeaderRow style={{boxSizing:'border-box'}}>
              <div style={{boxSizing:'border-box'}}>
              <BackToDashboard/>
                <Title>Application Overview</Title>
                <Logo size="md" suffixText={fundDetails?.name} />
              </div>
            </HeaderRow>
            <HeaderRow>
              <TabRow>
                <Tab active>Info</Tab>
              </TabRow>
              <div style={{display:'flex'}}>
                {/* <SubmitButton onClick={handleSubmitChanges} className="me-2">
                  Submit Changes
                </SubmitButton> */}
                {/* <SubmitChangesButton onClick={handleSubmitChanges}>  Submit Changes</SubmitChangesButton> */}
                <ThemedButton btnStyle={{fontSize:'16px'}} size='md' onClick={handleSubmitChanges}>
                Submit Changes
					</ThemedButton>
                {applicationRecord && applicationRecord.uuid ? (
                  <WithdrawApplication
                    status={applicationRecord?.status}
                    applicationUuId={applicationRecord.uuid}
                  />
                ) : (
                  <></>
                )}
              </div>
            </HeaderRow>
          </Header>
          <Inner>
            <LeftSidebar>
              <SidebarItem active>
              Investor Information
                <CommentCount count={overviewCommentsCount} />
              </SidebarItem>
              {investmentCard && isEligible && (
                <SidebarItem key={investmentCard.name}>
                  <ScrollLink to={getSectionId(investmentCard.name)}>
                    {investmentCard.name}
                    <CommentCount count={getCommentsCount(investmentCard)} />
                  </ScrollLink>
                </SidebarItem>
              )}
              {eligibilityCriteriaCard && (
                <SidebarItem key={eligibilityCriteriaCard.name}>
                  <ScrollLink to={getSectionId(eligibilityCriteriaCard.name)}>
                    {eligibilityCriteriaCard.name}
                    <CommentCount
                      count={getCommentsCount(eligibilityCriteriaCard)}
                    />
                  </ScrollLink>
                </SidebarItem>
              )}
              {isEligible && <>
                {application.map(
                (card) =>
                  card.name && applicationStatus?.is_approved &&
                  ![
                    ELIGIBILITY_CRITERIA_CARD_NAME,
                    INVESTMENT_AMOUNT_CARD_NAME,
                  ].includes(card.name) && (
                    <SidebarItem key={card.name}>
                      <ScrollLink to={getSectionId(card.name)}>
                        {card.name}
                        <CommentCount count={getCommentsCount(card)} />
                      </ScrollLink>
                    </SidebarItem>
                  )
              )}
              {applicationStatus?.is_approved &&
                kycParticipantIds !== null &&
                Object.keys(participantApplications).length > 0 &&
                kycRecordParticipants !== null && (
                  <SidebarItem active={activeCard === PARTICIPANTS_CARD_LABEL}>
                    {" "}
                    <ScrollLink to={getSectionId(PARTICIPANTS_CARD_LABEL)}>
                      {PARTICIPANTS_CARD_LABEL}
                    </ScrollLink>
                  </SidebarItem>
                )}
              {applicationStatus?.is_approved &&
                kycParticipantIds !== null &&
                Object.keys(participantApplications).length > 0 &&
                kycRecordParticipants !== null &&
                kycParticipantIds!.map((participantId, index) => {
                  const label =
                    kycRecordParticipants[participantId] !== null
                      ? `${kycRecordParticipants[participantId].first_name} ${kycRecordParticipants[participantId].last_name}`
                      : `Participant ${index + 1}`;
                  return (
                    <SidebarSubItem active={activeCard === label}>
                      {" "}
                      <ScrollLink to={getSectionId(label)}>
                        {label}
                        <CommentCount
                          count={get(participantCommentsCount, participantId)}
                        />
                      </ScrollLink>
                    </SidebarSubItem>
                  );
                })}
                {!skipTax && isAllocationApproved && size(taxDocumentsList) > 0 && (
                  <SidebarItem>
                    <ScrollLink to={getSectionId("Tax Forms")}>
                      Tax Forms
                      <CommentCount count={taxCommentsCount} />
                    </ScrollLink>
                  </SidebarItem>
                )}
                {first(bankingApiData) && (
                  <SidebarItem>
                    <ScrollLink to={getSectionId('Banking Details')}>
                      Banking Details
                      <CommentCount count={bankingCommentsCount} />
                    </ScrollLink>
                  </SidebarItem>
                )}
                {isAllocationApproved && hasFundDocuments && (
                  <SidebarItem>
                    <ScrollLink to={getSectionId('Fund Documents')}>
                      Documents
                      <CommentCount count={(fundDocumentCommentsCount + additionalDocumentPendingRequestsCount)} />
                    </ScrollLink>
                  </SidebarItem>
                )}
                {isAllocationApproved && (
                  <SidebarItem>
                    <ScrollLink to={getSectionId("POA")}>
                      Program Documents
                      <CommentCount count={programCommentsCount} />
                    </ScrollLink>
                  </SidebarItem>
                )}
                </>
              }
             </LeftSidebar>
             <Content>
               <FormContainer>
                 <ApplicationStatuses applicationStatus={applicationModuleStats} fundDetails={fundDetails}/>
                 {applicationRecord?.is_application_updated && (
                  <CommentContainer className={"mb-3"}>
                    <DismissButton onClick={onDismissNotification}>
                      &#x274C;
                    </DismissButton>
                    <CommentBadge>
                      Your application has been updated
                    </CommentBadge>
                    <CommentNote>
                      {applicationRecord.withdrawn_comment === "" && applicationRecord.update_comment}
                      {applicationRecord.withdrawn_comment && applicationRecord.withdrawn_comment}
                    </CommentNote>
                  </CommentContainer>
                )}
                 <NextStatus applicationNextState={applicationNextState}/>
                <CommentsContext.Provider
                  value={{
                    comments: get(
                      commentsByRecord,
                      `${KYC_RECORD}.${appRecords[0]?.kyc_record.id}`
                    ),
                    recordUUID,
                    recordId: kycRecordId,
                    callbackDocumentUpload: handleUploadDouments,
                    fetchKYCRecord: getKYCRecord,
                  }}
                >
                  <Overview />
                </CommentsContext.Provider>
                {isEligible && investmentCard && <CardContainer className={"mb-3"}>
                  <ScrollElement name={getSectionId(investmentCard.name)}>
                    <SubTitle>Investment Amount</SubTitle>
                  </ScrollElement>
                  {investmentCard && (
                    <InvestmentAmount
                      card={investmentCard}
                      commentsByRecord={commentsByRecord}
                      recordUUID={recordUUID}
                      recordId={kycRecordId}
                      getKYCRecord={getKYCRecord}
                      handleUploadDouments={handleUploadDouments}
                    />
                  )}
                </CardContainer>}
                {
                  eligibilityCriteriaCard && <CardContainer className={"mb-3"}>
                  <ScrollElement name={getSectionId(eligibilityCriteriaCard.name)}>
                    <SubTitle>Eligibility Criteria</SubTitle>
                  </ScrollElement>
                    {showModifyEligibilityButton && <Button
                    variant={"outline-primary"}
                    className={"mt-3"}
                    onClick={() => {
                      apiResetComment({
                        module: ELIGIBILITY_CRITERIA,
                        moduleId: appRecords[0]?.eligibility_response,
                      });
                      history(
                        `/${company}/opportunity/${externalId}/onboarding${MODIFY_ELIGBILITY}`
                      );
                    }}
                  >
                    Modify My Answers Below
                  </Button>}
                  {eligibilityCriteriaCard && (
                    <EligibilityCriteria
                      card={eligibilityCriteriaCard}
                      commentsByRecord={commentsByRecord}
                      recordUUID={recordUUID}
                      recordId={kycRecordId}
                      moduleId={appRecords[0]?.eligibility_response}
                      getKYCRecord={getKYCRecord}
                      handleUploadDouments={handleUploadDouments}
                    />
                  )}
                </CardContainer>
                }

                {showAmlKyc && isEligible ? (
                  <>
                    {application.map((card, i) => {
                      if (
                        [
                          ELIGIBILITY_CRITERIA_CARD_NAME,
                          INVESTMENT_AMOUNT_CARD_NAME,
                        ].includes(card.name)
                      )
                        return;
                      const { isEligibilityCard, commentsModule, moduleId } =
                        getModuleDetails(card);
                      let moduleComments = get(
                        commentsByRecord,
                        `${commentsModule}.${moduleId}`
                      );

                      return (
                        <CardContainer key={card.name}>
                          <ScrollElement name={getSectionId(card.name)}>
                            <Subtitle onClick={() => setActiveCard(card.name)}>
                              {card.name}
                            </Subtitle>
                          </ScrollElement>
                          {i === 0 && applicationStatus?.is_approved && (
                            <div>
                              <ChangeAnswersButton
                                onClick={onChangeAMLKYCAnswers}
                              >
                                Change AML/KYC Answers
                              </ChangeAnswersButton>
                            </div>
                          )}
                          {get(card, "card_id") !==
                            "aml-kyc-individual-personal-information" &&
                          !isEligibilityCard &&
                          !applicationStatus?.is_approved ? (
                            <>
                              {getUnavailableSectionMesage(
                                i === 0 ? "Entity details" : card.name
                              )}
                            </>
                          ) : (
                            <>
                              {card.schema.map((question) => {
                                const isFieldEnabled = getIsFieldEnabled(
                                  formikProps.values,
                                  question.field_dependencies
                                );
                                if (!isFieldEnabled) return null;
                                const AnswerInput =
                                  getAnswerInputComponent(question);
                                let comments = get(
                                  moduleComments,
                                  `${question.id}`
                                );
                                if (question.id === AML_SLUG_SELECTION_ID)
                                  comments = get(
                                    moduleComments,
                                    `kyc_investor_type_name`
                                  );

                                const nonDocumentComments =
                                  comments && comments[""];

                                // @ts-ignore
                                return (
                                  <Field key={question.id}>
                                    {(_: FieldProps) => (
                                      <>
                                        <CommentsContext.Provider
                                          value={{
                                            comments,
                                            recordUUID,
                                            recordId: kycRecordId,
                                            callbackDocumentUpload:
                                              handleUploadDouments,
                                            fetchKYCRecord: getKYCRecord,
                                          }}
                                        >
                                          <AnswerInput question={question} />
                                        </CommentsContext.Provider>
                                        {Array.isArray(nonDocumentComments) &&
                                          question.type !==
                                            "eligibility_criteria_response" &&
                                          map(nonDocumentComments,
                                            (comment: any) => (
                                              <CommentWrapper
                                                key={comment.id}
                                                comment={comment}
                                              />
                                            )
                                          )}
                                      </>
                                    )}
                                  </Field>
                                );
                              })}
                            </>
                          )}
                        </CardContainer>
                      );
                    })}
                  </>
                ) : <>
                {
                  isEligible ? <CardContainer>
                  <ScrollElement
                    className="p-0 pb-4 pt-2"
                    name={getSectionId("Personal information")}
                  >
                    <Subtitle>AML/KYC</Subtitle>
                    AML/KYC will appear later.
                  </ScrollElement>
                </CardContainer> : null
                }
                </>}
                {kycParticipantIds !== null && isEligible &&
                  Object.keys(participantApplications).length > 0 &&
                  kycRecordParticipants !== null && (
                    <ScrollElement name={getSectionId(PARTICIPANTS_CARD_LABEL)}>
                      <h3>{PARTICIPANTS_CARD_LABEL}</h3>
                      <br />
                    </ScrollElement>
                  )}
                {!applicationStatus?.is_approved && isEligible && (
                  <div className="pb-4">
                    {getUnavailableSectionMesage(PARTICIPANTS_CARD_LABEL)}
                  </div>
                )}
                {applicationStatus?.is_approved &&
                  kycParticipantIds !== null &&
                  Object.keys(participantApplications).length > 0 &&
                  kycRecordParticipants !== null && isEligible &&
                  kycParticipantIds!.map((id) => {
                    const participantSchema = participantApplications[id];
                    const participantAnswers = kycRecordParticipants![id];
                    const idString = id.toString();
                    if (!participantAnswers || !participantSchema) return null;
                    return (
                      <>
                        {" "}
                        <ParticipantContainer
                          flush
                          key={id}
                          defaultActiveKey={idString}
                        >
                          <Accordion.Item eventKey={idString} key={idString}>
                            <Accordion.Header>
                              <ScrollElement
                                name={getSectionId(participantSchema.name)}
                              >
                                {participantSchema.name}
                              </ScrollElement>
                            </Accordion.Header>
                            <Accordion.Body>
                              <CommentsContext.Provider
                                value={{
                                  comments: get(
                                    commentsByRecord,
                                    `${PARTICIPANT}.${id}`
                                  ),
                                  recordUUID,
                                  recordId: id,
                                  callbackDocumentUpload: handleUploadDouments,
                                  fetchKYCRecord: getKYCRecord,
                                }}
                              >
                                <SchemaContainer
                                  recordId={id}
                                  schema={participantSchema.schema}
                                  key={id}
                                  initialValues={participantAnswers}
                                  disableAutosave={false}
                                  isParticipant={true}
                                  innerRef={participantRefs}
                                  onStatusChange={dispatchParticipantForms}
                                  onSubmit={(values, helpers) =>
                                    submitParticipantForm(values, helpers, id)
                                  }
                                  recordComments={get(
                                    commentsByRecord,
                                    `${PARTICIPANT}.${id}`
                                  )}
                                />
                              </CommentsContext.Provider>
                            </Accordion.Body>
                          </Accordion.Item>
                        </ParticipantContainer>
                        <br />
                      </>
                    );
                  })}

                {
                  isAllocationApproved && <>
                  {!skipTax && <ScrollElement
                  className="p-0 pb-4 pt-2"
                  name={getSectionId("Tax Forms")}
                >
                  <TaxDocuments />
                 </ScrollElement>}
                 <ScrollElement className="p-0 pb-4" name={getSectionId("Banking Details")}>
                   <BankingDetails callbackSubmit={callbackSubmitPOA}/>
                 </ScrollElement>
                  {isAllocationApproved && <ScrollElement className="p-0 pb-4" name={getSectionId("Fund Documents")}>
                   <FundDocuments callbackFundDocumentStatus={setHasFundDocuments} />
                 </ScrollElement>}
                  {isAllocationApproved && <ScrollElement className="p-0 pb-4" name={getSectionId("POA")}>
                   <ProgramDoc isApplicationView={true} callbackSubmitPOA={callbackSubmitPOA} />
                 </ScrollElement>}
                  </>
                }
               </FormContainer>
             </Content>
           </Inner>
           <NotificationModal
             title={notification?.title}
             showModal={notification?.show}
             handleClose={() => setNotification(notificationConfig.default)}
           >
             {notification?.msg}
           </NotificationModal>
         </Container>
       )}
     </Formik>
     </PageWrapper>
   );
};

export default ApplicationView;

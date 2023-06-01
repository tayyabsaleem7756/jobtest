import React, { FunctionComponent, useEffect, useMemo, useReducer, useState } from 'react';
import get from "lodash/get";
import first from "lodash/first";
import API from "../../api";
import { INVESTOR_URL_PREFIX } from "../../constants/routes";
import { Redirect, useParams } from "react-router-dom";
import { AxiosError } from 'axios';
import { createFirstParticipant, fetchInitialRecord, fetchKYCRecord, fetchKYCDocuments, fetchKYCParticipantsDocuments, fetchWorkflows } from './thunks';
import { PARTICIPANT_FORMS_INITIAL_STATE, STATUS_CODES } from './constants';
import { selectKYCRecord } from './selectors';
import AutoSave from './components/AutoSave';
import FirstStep from './components/FirstStep';
import CardContainer from './components/CardContainer';
import { Card, Schema, WorkflowAnswerPayload } from '../../interfaces/workflows';
import { hasOnBoardingPermission } from '../../components/FundReview/onboardingPermission';
import { FormValues, Params, RecordDocument } from './interfaces';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { ArrowForward } from '@material-ui/icons';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { KYC_RECORD } from '../../constants/commentModules';
import { useGetFundDetailsQuery, useUpdateModulePositionMutation, useFetchModulePositionQuery } from "../../api/rtkQuery/fundsApi";
import { Field, FieldProps, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { handleValidation, getAnswerInputComponent, getDocumentFieldsList, onFormUpdateError, parseCard, getIndividualFormInitialValues, getIsFieldEnabled, participantFormStatusReducer } from './utils'
import { AddAnotherButton, BackButton, BigTitle, ButtonRow, Container, EligibilityErrorWrapper, FormContainer, NextButton, ParticipantDivider, StyledLink, Title } from './styles';
import {resetToDefault} from "./kycSlice";
import Logo from "../../components/Logo";
import Button from "react-bootstrap/Button";
import { CircularProgress } from '@material-ui/core';
import { logMixPanelEvent } from '../../utils/mixpanel';


const AMLKYCPage: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { answers, kycRecordId, kycParticipantIds, kycRecordParticipants, isFetching, didFetch, fundWorkflows, recordUUID, selectedWorkflowSlug, status, workflow } = useAppSelector(selectKYCRecord);
  const { externalId } = useParams<Params>();
  const [initialValues, setInitialValues] = useState<FormValues>({})
  const {data: fundDetails} = useGetFundDetailsQuery(externalId);
  const [updateKycPosition] = useUpdateModulePositionMutation();
  const {data: kycPosition} = useFetchModulePositionQuery(externalId, {
    skip: !externalId
  });
  const [card, setCard] = useState<Card>();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isEligibile, setIsEligible] = useState<boolean>(true)
  const [participantForms, dispatchParticipantForms] = useReducer(participantFormStatusReducer, PARTICIPANT_FORMS_INITIAL_STATE);

  const onSubmit = async (values: FormValues, { setSubmitting, setFieldError }: FormikHelpers<FormValues>) => {
    if (kycRecordId === null) return;
    // if there are documents to upload, start uploading them first
    const documentFields = getDocumentFieldsList(values, workflow!);
    const documentsUploading = documentFields.reduce((acc, field) => {
      if (!values[field]) return acc;
      const files = values[field] as unknown as RecordDocument;
      files.pendingUploads.forEach(file => {
        const formData = new FormData();
        formData.append('file_data', file);
        formData.append('field_id', field);
        formData.append('record_id', kycRecordId.toString());
        acc.push(API.uploadDocumentToKYCRecord(kycRecordId, formData));
      });
      return acc;
    }, [] as Promise<any>[]);

    const nonDocumentFields = Object.entries(values).reduce((acc, [key, value]) => {
      if (!documentFields.includes(key) && initialValues[key] !== value) {
        acc[key] = value;
      }
      return acc;
    }, {} as FormValues);

    try {
      if (Object.keys(nonDocumentFields).length > 0) {
        await API.updateKYCRecord(workflow!.slug, kycRecordId, nonDocumentFields);
        dispatch(fetchKYCRecord(recordUUID!));
        console.log("form data is ", values)
      }
      if (documentsUploading.length > 0) {
        // TODO: handle document upload errors
        await Promise.allSettled(documentsUploading);
        dispatch(fetchKYCDocuments(kycRecordId));
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.data && error.code === '400') {
        onFormUpdateError(error.response.data, setFieldError);
      } else {
        console.error('Unexpected error', e);
      }
    } finally {
      setSubmitting(false);
      logMixPanelEvent(`AML/KYC ${get(card, 'name', '')} submitted`, get(fundDetails, 'company.name'), get(fundDetails, 'company.slug'))
    }
  }

  const submitParticipantForm = async (values: FormValues, { setSubmitting, setFieldError }: FormikHelpers<FormValues>,
     participantId: number, participantFormInitialValues: FormValues) => {
    if (kycRecordId === null) return;
    const pendingUploads = getDocumentFieldsList(values, workflow!);
    const documentsUploading = pendingUploads.reduce((acc, field) => {
      const files = values[field] as unknown as RecordDocument;
      files.pendingUploads.forEach(file => {
        const formData = new FormData();
        formData.append('file_data', file);
        formData.append('field_id', field);
        formData.append('record_id', participantId.toString());
        acc.push(API.uploadKYCParticipantDocument(workflow!.slug, kycRecordId, participantId, formData));
      });
      return acc;
    }, [] as Promise<any>[]);

    const documentFields = getDocumentFieldsList(values, workflow!);
    const nonDocumentFields = Object.entries(values).reduce((acc, [key, value]) => {
      if (!documentFields.includes(key) && participantFormInitialValues[key] !== value) {
        acc[key] = value;
      }
      return acc;
    }, {} as FormValues);

    try {
      if (Object.keys(nonDocumentFields).length > 0) {
        await API.updateParticipantRecord(workflow!.slug, kycRecordId, participantId, nonDocumentFields);
        dispatch(fetchKYCRecord(recordUUID!));
      }
      if (documentsUploading.length > 0) {
        await Promise.allSettled(documentsUploading);
        dispatch(fetchKYCParticipantsDocuments(participantId));
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.data && error.response.status === 400) {
        onFormUpdateError(error.response.data, setFieldError);
      } else {
        console.error('Unexpected error', e);
      }
    } finally {
      setSubmitting(false);
      logMixPanelEvent(`AML/KYC participant form submitted`, get(fundDetails, 'company.name'), get(fundDetails, 'company.slug'))
    }
  }

  const submitForReview = async ({ values, setFieldError, setSubmitting }: FormikProps<FormValues>) => {
    if (kycRecordId === null) return;
    try {
      setSubmitting(true);
      const valuesToExclude = getDocumentFieldsList(values, workflow!);
      const answersToExclude = getDocumentFieldsList(answers!, workflow!);
      const payload: WorkflowAnswerPayload = {};
      Object.keys(answers!).forEach(key => {
        if (answersToExclude.indexOf(key) === -1) {
          payload[key] = answers![key];
        }
      });
      Object.keys(values).forEach(key => {
        if (valuesToExclude.indexOf(key) === -1) {
          payload[key] = values[key];
        }
      });
      payload.status = STATUS_CODES.SUBMITTED.id + '';
      await API.updateKYCRecord(workflow!.slug, kycRecordId, payload);
      await API.reviewKYCRecord(externalId, kycRecordId);
      dispatch(fetchKYCRecord(recordUUID!));
      goToNextStep();
    } catch (e) {
      const error = e as AxiosError;
      if (error.response?.data && error.code === '400') {
        onFormUpdateError(error.response.data, setFieldError);
      } else {
        console.error('Unexpected error', e);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const addAnother = async () => {
    if (workflow === null || kycRecordId === null || !repeteable) return console.warn('Unable to add another record');
    try {
      await API.createKYCParticipantRecord(workflow!.slug, kycRecordId!);
      dispatch(fetchKYCRecord(recordUUID!));
    } catch (e) {
      console.error(e);
    }
  }

  const markParticipantsAsReady = async () => {
    const requests: Promise<any>[] = [];
    kycParticipantIds?.forEach(recordId => {
      requests.push(API.updateKYCParticipantStatus(workflow!.slug, kycRecordId!, recordId, STATUS_CODES.SUBMITTED));
    });
    return await Promise.all(requests);
  }

  const previousStepAvailable = useMemo(() => {
    if(workflow && workflow?.cards)
      return currentStep !== 0 && workflow!.cards.some((card, i) => i < currentStep && getIsFieldEnabled(answers ?? {}, card?.card_dependencies))
    else  return false;
  }, [currentStep, workflow, answers])

  const goToNextStep = () => setCurrentStep(current => {
    for (let i = current + 1; i < workflow!.cards.length; i++) {
      if (getIsFieldEnabled(answers!, workflow!.cards[i].card_dependencies)) {
        return i;
      }
    }
    return workflow!.cards.length + 1;
  });

  useEffect(() => {
    updateKycPosition({moduleId: KYC_RECORD, externalId, currentStep});
  }, [currentStep]);

  useEffect(() => {
    const positionDetails = first(kycPosition);
    const position = get(positionDetails, 'last_position');
    const module =  get(positionDetails, 'module');
    if(position && module === KYC_RECORD) {
      console.log({position: Number(position)});
      setCurrentStep(Number(position));
    }
  }, [kycPosition]);

  const goToPreviousStep = () => setCurrentStep(current => {
    for (let i = current - 1; i >= 0; i--) {
      if (getIsFieldEnabled(answers!, workflow!.cards[i].card_dependencies)) {
        return i;
      }
    }
    return workflow!.cards.findIndex(card => getIsFieldEnabled(answers!, card.card_dependencies));
  });

  const onValidate = (values: FormValues) => handleValidation(values, schema);

  const { schema, repeteable, title } = useMemo(() => {
    if (card !== undefined) return parseCard(card);
    return { schema: [] as Schema, repeteable: false, title: '' };
  }, [card])

  useEffect(() => {
    return () => {
      dispatch(resetToDefault())
    }
  }, [])

  useEffect(() => {
    dispatch(fetchWorkflows(externalId));
  }, [dispatch, externalId])

  useEffect(() => {
    if (workflow?.cards) {
      const card = workflow.cards[currentStep];
      setCard(card)
    }
  }, [currentStep, workflow?.cards]);

  useEffect(() => {
    if (isFetching.firstParticipant) return;
    if (!workflow?.slug || kycRecordId === null || kycParticipantIds === null) return;
    if (repeteable && kycParticipantIds.length === 0 && didFetch.kycRecord) {
      dispatch(createFirstParticipant());
    }
  }, [dispatch, repeteable, workflow?.slug, kycParticipantIds, kycRecordId, didFetch.kycRecord, isFetching.firstParticipant]);

  useEffect(() => {
    if (card && answers) {
      const { initialValues } = parseCard(card, answers);
      setInitialValues(initialValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card, answers])

  useEffect(() => {
    if (typeof kycRecordId === 'number') {
      dispatch(fetchKYCDocuments(kycRecordId));
      // dispatch(fetchComments(kycRecordId));
    }
  }, [dispatch, kycRecordId])

  useEffect(() => {
    if (!didFetch.participantDocuments && kycParticipantIds !== null) {
      kycParticipantIds.forEach(participantId => {
        dispatch(fetchKYCParticipantsDocuments(participantId));
      });
    }
    }, [dispatch, didFetch.participantDocuments, kycParticipantIds]);

  useEffect(() => {
    if (didFetch.fundWorkflows) dispatch(fetchInitialRecord(externalId))
  }, [dispatch, didFetch.fundWorkflows, externalId]);

  if (workflow && workflow.cards.length === 0) return <Container>This workflow contains no cards.</Container>
  if (didFetch.fundWorkflows && !workflow && !selectedWorkflowSlug && didFetch.initialRecord && !kycRecordId) return <FirstStep externalId= {externalId}/>
  if (didFetch.fundWorkflows && fundWorkflows.length === 0) return <Container>No workflows are available.</Container>
  if (didFetch.fundWorkflows && !workflow && selectedWorkflowSlug) return <Container>No workflow matching {selectedWorkflowSlug} could be found.</Container>
  if (!didFetch.fundWorkflows && !didFetch.initialRecord) return <Container>Fetching available workflows...</Container>
  if (didFetch.fundWorkflows && !workflow) return <Container>Selecting workflow {selectedWorkflowSlug}...</Container>
  if (!workflow || Object.keys(initialValues).length === 0) return <Container>Loading...</Container>
  if (!card || !answers) {
    if (fundDetails?.skip_tax) return <Redirect to={`/${INVESTOR_URL_PREFIX}/funds/${externalId}/bank_details/`} exact />
    return <Redirect to={`/${INVESTOR_URL_PREFIX}/funds/${externalId}/tax/`} exact />
  }
  if(!isEligibile) return <Container>
    <BigTitle>
      <Logo size="md" suffixText={fundDetails?.name} />
      KYC/AML
    </BigTitle>
    <EligibilityErrorWrapper>
    <Button variant="outline-primary btn-back" className="mb-2" onClick={() => {
      setIsEligible(true);
      goToPreviousStep()
    }}>Back</Button>
    <h4 className='heading'>Not Eligible</h4>
    <p>Unfortunately you are not eligible to invest in this opportunity at this time</p>
    </EligibilityErrorWrapper>
  </Container>

  const addAnotherAvailable = repeteable && kycParticipantIds !== null && kycRecordParticipants !== null && didFetch.participantDocuments && ((kycParticipantIds.length === 1 && !participantForms.disallowSubmit) || (kycParticipantIds.length > 1));

  return <Container>
    <BigTitle>
      <Logo size="md" suffixText={fundDetails?.name} />
      KYC/AML
    </BigTitle>
    <Formik
      initialValues={initialValues}
      validate={repeteable ? undefined : onValidate}
      onSubmit={onSubmit}
      enableReinitialize={true}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<FormValues>) => {
        return (
          <FormContainer>
            <AutoSave />
            <Form>
              {
                previousStepAvailable && <StyledLink 
                to={`/${INVESTOR_URL_PREFIX}/funds/${externalId}/application/`}>
                  <ArrowBackIcon /> Back to Application Overview
                  </StyledLink>
              }
              <Title>{title}</Title>
              {repeteable &&
                (kycParticipantIds === null ||
                  kycRecordParticipants === null ||
                  (kycParticipantIds !== null &&
                    kycRecordParticipants !== null &&
                    !didFetch.participantDocuments)) &&
                "Fetching participants.."}
              {repeteable &&
                kycParticipantIds !== null &&
                kycRecordParticipants !== null &&
                didFetch.participantDocuments &&
                kycParticipantIds.map((recordId) => (
                  <>
                    <CardContainer
                      key={recordId}
                      recordId={recordId}
                      schema={schema}
                      initialValues={getIndividualFormInitialValues(
                        schema,
                        kycRecordParticipants[recordId]
                      )}
                      onSubmit={(values, helpers) =>
                        submitParticipantForm(
                          values,
                          helpers,
                          recordId,
                          getIndividualFormInitialValues(
                            schema,
                            kycRecordParticipants[recordId]
                          )
                        )
                      }
                      isParticipant={true}
                      onStatusChange={dispatchParticipantForms}
                    />
                    <ParticipantDivider />
                  </>
                ))}
              {!repeteable &&
                schema.map((question) => {
                  const isFieldEnabled = getIsFieldEnabled(
                    formikProps.values,
                    question.field_dependencies
                  );
                  if (!isFieldEnabled) return null;
                  const AnswerInput = getAnswerInputComponent(question);

                  return (
                    <Field key={question.id}>
                      {(_: FieldProps) => (
                        <AnswerInput key={question.id} question={question} />
                      )}
                    </Field>
                  );
                })}
            </Form>
            <br />
            <ButtonRow>
            {previousStepAvailable && (
                <BackButton onClick={goToPreviousStep}>
                  <ArrowBackIcon /> Previous Step
                </BackButton>
              )}
              <NextButton
                disabled={
                  formikProps.isSubmitting ||
                  formikProps.isValidating ||
                  formikProps.isValidating ||
                  Object.keys(formikProps.errors).length > 0 ||
                  (repeteable && participantForms.disallowSubmit) ||
                  (repeteable &&
                    (kycParticipantIds === null ||
                      kycParticipantIds.length === 0))
                }
                onClick={async () => {
                  if (currentStep === workflow!.cards.length - 1) {
                    return submitForReview(formikProps);
                  }
                  if (formikProps.dirty && !formikProps.isSubmitting) {
                    await formikProps.submitForm();
                  }
                  if (repeteable) {
                    await markParticipantsAsReady();
                  }
                  if (formikProps.values.economic_beneficiary === "none") {
                    setIsEligible(false);
                  } else setIsEligible(true);
                  goToNextStep();
                }}
              >
                {formikProps.isSubmitting ? (
                  <>
                    Next Step <CircularProgress size={12} color="primary" />
                  </>
                ) : (
                  <>
                  Next Step <ArrowForward />
                  </>
                )}
              </NextButton>
              {addAnotherAvailable && (
                <AddAnotherButton
                  onClick={addAnother}
                  disabled={
                    Object.values(formikProps.errors).filter((p) => p).length >
                      0 ||
                    formikProps.isSubmitting ||
                    formikProps.isValidating ||
                    participantForms.disallowSubmit
                  }
                >
                  Add another
                </AddAnotherButton>
              )}
            </ButtonRow>
          </FormContainer>
        );
      }
      }
    </Formik>
  </Container >;
}



export default hasOnBoardingPermission(AMLKYCPage);
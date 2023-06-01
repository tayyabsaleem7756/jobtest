import {FunctionComponent, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import first from "lodash/first";
import map from "lodash/map";
import filter from "lodash/filter";
import each from "lodash/each";
import get from "lodash/get";
import keys from "lodash/keys";
import uniq from "lodash/uniq";
import size from "lodash/size";
import includes from "lodash/includes";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { PageWrapper } from "components/Page";
import CustomButton from 'components/Button/ThemeButton'
import FilePreviewModal from "../../components/FilePreviewModal";
import {
  useFetchModulePositionQuery,
  useGetApplicationStatusQuery,
  useGetApprovedDocumentsQuery,
  useGetDocumentsQuery,
  useGetFundDetailsQuery,
  useSubmitApprovedDocumentsMutation,
  useUpdateModulePositionMutation
} from "../../api/rtkQuery/fundsApi";
import {hasOnBoardingPermission} from '../../components/FundReview/onboardingPermission';
import {AgreeDocumentBlock} from "./styles";
import {FUND_DOCUMENTS} from "../../constants/commentModules";
import {BigTitle, Container, FormContainer, StyledForm,} from "../TaxForms/styles";
import Logo from "../../components/Logo";
import Confirmation from "../../components/FundReview/ConfirmationSection";
import {IApplicationStatus} from "../../interfaces/application";
import {canMovePastReviewDocs} from "../../utils/statusChecks";


const NEXT_STEP_MESSAGE = 'Thank you. Please continue to the next step to sign your subscription documents.'

interface FundDocumentsProps {}

const FundDocuments: FunctionComponent<FundDocumentsProps> = () => {
  const [docViewed, setDocViewed] = useState<any[]>([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [acceptedDocs, setAcceptedDocs] = useState<any[]>([]);
  const { externalId } = useParams<any>();
  const {data: fundDetails} = useGetFundDetailsQuery(externalId);
  const [submitApprovedDocuments] = useSubmitApprovedDocumentsMutation();
  const [updateFundDocumentsPosition] = useUpdateModulePositionMutation();
  const { data: applicationStatus } = useGetApplicationStatusQuery<{ data: IApplicationStatus }>(externalId);
  const { data: documents } = useGetDocumentsQuery(externalId, {
    skip: !externalId,
  });
  const { data: apiApprovedDocuments } = useGetApprovedDocumentsQuery(
    externalId,
    {
      skip: !externalId,
    }
  );
  const {data: fundPositionDetails} = useFetchModulePositionQuery(externalId, {
    skip: !externalId
  });
  const positionDetails = first(fundPositionDetails);

  useEffect(() => {
    updateFundDocumentsPosition({moduleId: FUND_DOCUMENTS, externalId, currentStep: 0});
  }, []);

  useEffect(()=>{
    window.scrollTo(0,0)
  },[size(documents),showConfirmation])

  useEffect(() => {
    const acceptedDocs: number[] = [];
    const availableDocsId = map(documents, "id");
    const apiApprovedDocs = get(first(apiApprovedDocuments), "response_json");
    if (!apiApprovedDocs) return
    each(keys(apiApprovedDocs), (val: string) => {
      if (includes(availableDocsId, parseInt(val)) && apiApprovedDocs[val])
        acceptedDocs.push(parseInt(val));
    });
    setAcceptedDocs(acceptedDocs);
    setDocViewed(acceptedDocs);
  }, [apiApprovedDocuments, documents]);

  const callbackPreviewFile = async (document: any) => {
    setDocViewed(uniq([...docViewed, document.id]));
  };

  const isDocViewed = (document: any) => {
    return includes(docViewed, document.id);
  };

  const saveAcceptedDocs = (acceptedDocs: number[]) => {
    const payload: any = {
      externalId,
      response_json: {},
    };
    each(documents, (doc: any) => {
      payload.response_json[doc.id] = includes(acceptedDocs, doc.id);
    });
    submitApprovedDocuments(payload);
  };

  const updateApproval = (document: any) => {
    let data = [];
    if (!includes(acceptedDocs, document.id)) {
      data = uniq([...acceptedDocs, document.id]);
    } else {
      data = filter(acceptedDocs, (docId: any) => docId !== document.id);
    }
    setAcceptedDocs(data);
    saveAcceptedDocs(data);
  };

  const isDocApproved = (document: any) => {
    return includes(acceptedDocs, document.id);
  };

  const isNextButtonEnable = () => {
    return size(documents) === size(acceptedDocs);
  };

  const canMoveToNextStep = canMovePastReviewDocs(applicationStatus)

  // if(showConfirmation || (get(positionDetails, 'last_position') === '1' && get(positionDetails, 'module') === FUND_DOCUMENTS))
  if(showConfirmation)
    return (<Confirmation
      moduleId={FUND_DOCUMENTS}
      redirectUrl={`/funds/${externalId}/agreements`}
      customText={canMoveToNextStep ? NEXT_STEP_MESSAGE : null}
    />);

  return (
    <PageWrapper>
    <Container>
      <BigTitle>
        <Logo size="md" suffixText={fundDetails?.name} />
        Review Documents
      </BigTitle>
      

      <StyledForm>
        <FormContainer>
          <h4 className="mt-5 mb-4 ms-3">I acknowledge I have reviewed</h4>
          <div>
            {!isNextButtonEnable() && (
              <p className="note-text ms-3">
                * Please download the documents to enable the checkboxes
              </p>
            )}
          </div>
          <div key={`inline-radio`} className="mb-1 custom-radio-buttons">
            <div>
              {map(documents, (document) => (
                <div className={"mt-2"}>
                  <AgreeDocumentBlock>
                    <FilePreviewModal
                      documentId={`${document.document_id}`}
                      documentName={document.document_name}
                      callbackPreviewFile={() => callbackPreviewFile(document)}
                      callbackDownloadFile={() => callbackPreviewFile(document)}
                    >
                      <Form.Check
                        type="checkbox"
                        label={document.document_name}
                        onChange={() => updateApproval(document)}
                        value={document.id}
                        checked={isDocApproved(document)}
                        disabled={!isDocViewed(document)}
                        onClick={(e) => e.stopPropagation()}
                        id={`approval-${document.doc_id}`}
                      />
                    </FilePreviewModal>
                  </AgreeDocumentBlock>
                </div>
              ))}
            </div>
          </div>
          <CustomButton
            onClick={() => {
              setShowConfirmation(true);
            }}
            disabled={!isNextButtonEnable()}
            // className={"mt-4"}
            solo
            position="right"
          >
            Next
          </CustomButton>
        </FormContainer>
      </StyledForm>
    </Container>
    </PageWrapper>
  );
};

export default hasOnBoardingPermission(FundDocuments);
// export default FundDocuments;


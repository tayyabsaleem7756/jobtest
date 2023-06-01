import {FunctionComponent, useEffect, useMemo, useState} from 'react';
import size from "lodash/size";
import isNil from "lodash/isNil";
import isEmpty from "lodash/isEmpty";
import find from "lodash/find";
import {useNavigate, useParams} from "react-router";
import { PageWrapper } from 'components/Page';
import CustomButton from 'components/Button/ThemeButton'
import {
  useFetchProgramDocsQuery,
  useFetchSignedPowerOfAttorneyQuery,
  useGetDocumentsQuery
} from "../../api/rtkQuery/fundsApi";
import {hasOnBoardingPermission} from '../../components/FundReview/onboardingPermission';
import ProgramDocForm from "./Form";
import Logo from "../../components/Logo";
import Confirmation from "../../components/FundReview/ConfirmationSection";
import {BigTitle, Container, FormContainer, NextButton} from "../TaxForms/styles";


const PowerOfAttorney: FunctionComponent = () => {
  const { externalId, company } = useParams<any>();
  const history = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { data: programDocuments } = useFetchProgramDocsQuery({externalId, skipRquiredOnce: true}, {
    skip: !externalId,
  });
  const { data: documents } = useGetDocumentsQuery(externalId, {
    skip: !externalId,
  });
  const { data: signedDocuments } = useFetchSignedPowerOfAttorneyQuery(externalId, {
    skip: !externalId,
  });


  const isAllowed = useMemo(() => {
    const data = find(programDocuments, (doc) => {
      const { company_document, signed_document, is_acknowledged } = doc;
      const { require_signature, require_wet_signature } = company_document;
      return (
        (require_signature && require_wet_signature && signed_document === null) ||
        (!require_signature && !require_wet_signature && !is_acknowledged)
      );
    })
    return isEmpty(data) || isNil(data);
  }, [programDocuments])

  const callbackSubmitPOA = () => {
    if (size(documents) === 0) setShowConfirmation(true);
    else history(`/${company}/funds/${externalId}/review_docs`);
  }

  useEffect(()=>{
    window.scrollTo(0,0)
  },[showConfirmation])

  if (showConfirmation && size(documents) === 0)
    return (<PageWrapper><Container><Confirmation redirectUrl={`/funds/${externalId}/agreements`} /></Container></PageWrapper>);

  return <PageWrapper>
   <Container>
    <BigTitle>
      <Logo size="md" />
      Program Documents
    </BigTitle>
    <FormContainer>
      <div className='mb-5'>
        <ProgramDocForm />
      </div>
      <div className="text-end">
        <CustomButton
          disabled={!isAllowed}
          onClick={callbackSubmitPOA}
          solo
          position='right'
        >
          Next
        </CustomButton>
      </div>
    </FormContainer>
  </Container>
  </PageWrapper>
}

export default hasOnBoardingPermission(PowerOfAttorney);

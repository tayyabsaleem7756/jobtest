import {FunctionComponent, useMemo, useState} from 'react';
import {Link, useParams,useNavigate} from "react-router-dom";
import {useGetAgreementsQuery} from "../../api/rtkQuery/agreementsApi";
import ApplicantAgreementDocument from "./components/ApplicantDocument";
import {IApplicantAgreement} from "../../interfaces/Agreement/agreementDocuments";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";
import { PageWrapper } from 'components/Page';
import SideCarLoader from "../../components/SideCarLoader";
import Logo from "../../components/Logo";
import {useGetFundDetailsQuery} from "../../api/rtkQuery/fundsApi";
import {Wrapper, THead, MarginBottomContainer} from './styles'
import {hasKycPermission} from "../../components/FundReview/onboardingPermission";
import  CustomButton  from 'components/Button/ThemeButton';



interface AgreementsProps {
}


const AgreementsPage: FunctionComponent<AgreementsProps> = () => {
  const navigate=useNavigate()
  const {externalId, company} = useParams<{ externalId: string, company: string }>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {data: fundDetails} = useGetFundDetailsQuery(externalId);
  const {data: agreements, isLoading: isLoadingAgreements} = useGetAgreementsQuery(externalId);

  const isSigningComplete = useMemo(() => {
      let allDocumentsSigned = false;
      if(agreements){
        for(let i = 0; i < agreements.length; i++){
          allDocumentsSigned = agreements[i]?.completed;
          if(!allDocumentsSigned) break;
        }
      }
      return allDocumentsSigned
    }, [agreements])

  if (isSubmitting || isLoadingAgreements) return <PageWrapper><MarginBottomContainer>
    <SideCarLoader/>
  </MarginBottomContainer>
  </PageWrapper>
  if (!agreements) return <PageWrapper><MarginBottomContainer></MarginBottomContainer></PageWrapper>
  if (isSigningComplete)
    return (
      <PageWrapper>
      <MarginBottomContainer className={"mt-5"}>
        <Logo size="md" suffixText={fundDetails?.name} />
        <Wrapper>
          <h4 className="mb-4 ms-3">
            Your investment application is in final review!
          </h4>
          {/* <Link
            to={`/funds/${externalId}/application`}
            className="btn btn-outline-primary btn-purple"
          >
            Go to My Application
          </Link> */}
          <CustomButton solo position='left' variant='outlined' onClick={()=>navigate(`/${company}/funds/${externalId}/application`)}>
          Go to My Application
          </CustomButton>
        </Wrapper>
      </MarginBottomContainer>
      </PageWrapper>
    );

  return <PageWrapper> <MarginBottomContainer className={'mt-5'}>
    <Logo size="md" suffixText={fundDetails?.name} />
    <div className={'mt-3'}><h2>Subscription Documents</h2></div>
    <div className={'mt-5'}>
      <Table striped bordered hover>
        <THead>
        <tr>
          <th>Document Name</th>
          <th>Status</th>
        </tr>
        </THead>
        <tbody>
        {agreements.map((agreement: IApplicantAgreement) => {
          return <ApplicantAgreementDocument
            agreementDocument={agreement}
            key={agreement.id}
            setIsSubmitting={setIsSubmitting}
          />
        })}
        </tbody>
      </Table>
    </div>
  </MarginBottomContainer>
  </PageWrapper>
};

export default hasKycPermission(AgreementsPage);

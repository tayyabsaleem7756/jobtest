import React, { FunctionComponent, useMemo, useRef } from "react";
import find from "lodash/find";
import Row from "react-bootstrap/Row";
import size from "lodash/size";
import InvestmentOppotunities from "../../components/StartPage/InvestmentOppotunities";
import ContactSection from "../../components/StartPage/ContactSection";
import { LoggedInFooter } from "../../components/Footer";
import { H1, Section, Wrapper } from "../../components/StartPage/styles";
import {
  useGetActiveApplicationFundQuery,
  useGetInvestedCountQuery,
  useGetUserInProgressWorkflowQuery,
  useGetUserOpportunitiesQuery,
  useGetUserTasksQuery,
} from "../../api/rtkQuery/tasksApi";
import { useAppSelector } from "../../app/hooks";
import { selectUserInfo } from "../User/selectors";
import SideCarLoader from "../../components/SideCarLoader";
import StatusBar from "../../components/StartPage/StatusBar";
import { ActiveApplicationsContainer, QuestionDiv, StartPageSectionHeading, TopRow, WelcomeBackText } from "./styles";
import map from "lodash/map";
import { IActiveApplicationFund } from "../../interfaces/applicationStatus";
import Col from "react-bootstrap/Col";
import ActiveApplicationCard from "../../components/StartPage/ActiveApplicationCard";
import HelpCenter from "../../components/StartPage/HelpCenter";
import Container from "react-bootstrap/Container";

interface StartPageProps {
}

const StartPage: FunctionComponent<StartPageProps> = () => {
  const userInfo = useAppSelector(selectUserInfo);
  const { data: opportunitiesData, isLoading: isLoadingOpportunities } =
    useGetUserOpportunitiesQuery();
  // const {data: tasksData} = useGetUserTasksQuery();
  const { data: investedCountData } = useGetInvestedCountQuery();
  const { data: inProgressWorkFlow } = useGetUserInProgressWorkflowQuery();
  const { data: activeApplicationFunds } = useGetActiveApplicationFundQuery();

  const refApp = useRef<HTMLDivElement>(null)
  const refOpp = useRef<HTMLHeadingElement>(null)

  const scrollToRef = (ref: string) => {

    switch (ref) {
      case 'refApp':
        refApp.current?.scrollIntoView()
        break;
      case 'refOpp':
        refOpp.current?.scrollIntoView()
        break;

      default:
        break;
    }
  }

  // const workflowFund = useMemo(() => {
  //   return find(opportunitiesData, (opportunity) => opportunity?.external_id === inProgressWorkFlow?.fund_external_id);
  // }, [inProgressWorkFlow, opportunitiesData]);

  if (isLoadingOpportunities) {
    return (
      <>
        <Wrapper fluid hasLoader={true}>
          <SideCarLoader />
        </Wrapper>
        <LoggedInFooter />
      </>
    )
  }



  return (
    <>
      <Wrapper fluid>
        <TopRow className={'mb-4'}>
          {userInfo && <WelcomeBackText>Welcome back, <span>{userInfo.first_name}</span>!</WelcomeBackText>}
          <StatusBar
            opportunitiesCount={size(opportunitiesData)}
            investmentsCount={investedCountData ? investedCountData.invested_count : 0}
            activeApplicationCount={size(activeApplicationFunds)}
            scrollTo={scrollToRef}
          />
        </TopRow>
        <Section>
          <ActiveApplicationsContainer ref={refApp}>
            <div><StartPageSectionHeading>Applications In Progress</StartPageSectionHeading></div>
            <div className={'scrollable'}>
              <Row>
                {map(activeApplicationFunds, (fundDetail: IActiveApplicationFund) => {
                  return <Col md={6} sm={12} className={'mb-3'}>
                    <ActiveApplicationCard fundDetail={fundDetail} />
                  </Col>
                })}
              </Row>
            </div>
          </ActiveApplicationsContainer>
        </Section>
        <Section>
          <InvestmentOppotunities
            isLoading={isLoadingOpportunities}
            opportunities={opportunitiesData}
            scrollRef={refOpp}
          />
        </Section>
      </Wrapper>
      <QuestionDiv>
        <ContactSection />
        <HelpCenter />
      </QuestionDiv>
      <LoggedInFooter />
    </>
  );
};

export default StartPage;

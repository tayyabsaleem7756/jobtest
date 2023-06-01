import React, {FunctionComponent} from 'react';
import ArrowBack from "@material-ui/icons/ArrowBack";
import Container from "react-bootstrap/Container";
import { INVESTOR_URL_PREFIX } from "../../../../constants/routes";
import {InvestmentTopDashboard, DashboardLink} from "./styles";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import GlossaryModal from "../../../../components/Glossary/GlossaryModal";
import StatCardGroup from "./CardGroup";
import {IFundInvestorDetail} from "../../../../interfaces/fundInvestorDetail";
import PieChartContainer from "../PieChart";

interface TopDashboardProps {
  totalRow: IFundInvestorDetail
  hasData: boolean
}


const TopDashboard: FunctionComponent<TopDashboardProps> = ({totalRow, hasData}) => {
  return <InvestmentTopDashboard className="hero-dashboard">
    <Container fluid className="hero-dashboard-container">
      <Row>
        <Col>
          <DashboardLink to={`/${INVESTOR_URL_PREFIX}/start`}>
            <ArrowBack /> Investment Opportunities
          </DashboardLink>
          <h1 className="hero-dashboard-heading">Investor Dashboard <GlossaryModal/></h1>
          <p>All metrics are based on the most recent data provided.<br/>
            This means aggregate data is totaled across investments with different data reporting dates.<br/>
            Aggregate data does not include Legacy Program Investments.</p>
          <StatCardGroup totalRow={totalRow}/>
        </Col>
        <Col>
          {<PieChartContainer totalRow={totalRow} hasData={hasData}/>}
        </Col>
      </Row>
    </Container>
  </InvestmentTopDashboard>
};

export default TopDashboard;

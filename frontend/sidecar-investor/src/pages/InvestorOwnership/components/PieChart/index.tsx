import React, {FunctionComponent} from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import NavSharePieChart from "./NavSharePieChart";
import FormattedCurrency from "../../../../utils/FormattedCurrency";
import {Card} from "react-bootstrap";
import {IFundInvestorDetail} from "../../../../interfaces/fundInvestorDetail";
import styled from "styled-components";
import {NA_DEFAULT_VALUE} from "../../../../constants/defaultValues";

const ListValue = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 15px;
  line-height: 19px;
  letter-spacing: 0.02em;
`

const CurrentEquityListValue = styled(ListValue)`
  color: #AD62AA;
`
const CurrentGainListValue = styled(ListValue)`
  color: #4A47A3;
`
const LoanListValue = styled(ListValue)`
  color: #03145E;
`

const InterestListValue = styled(ListValue)`
  color: #610094;
`


interface PieChartContainerParams {
  totalRow: IFundInvestorDetail
  hasData: boolean
}


const PieChartContainer: FunctionComponent<PieChartContainerParams> = ({totalRow, hasData}) => {
  const noLoanValue = hasData ? '0' : NA_DEFAULT_VALUE
  return <Card className="hero-card">
    <Card.Body>
      <Row>
        <Col>
          <h5 className="hero-card-heading">Total Gross Share of NAV Breakdown</h5>
        </Col>
      </Row>
      <Row>
        <Col>
          <ul>
            <li>
              <span className="list-heading">Total Equity Commitment Called to Date</span>
              <CurrentEquityListValue className="list-value">
                <FormattedCurrency
                  value={totalRow.equity_called}
                  replaceZeroWith={NA_DEFAULT_VALUE}
                />
              </CurrentEquityListValue>
            </li>
            <li>
              <span className="list-heading">Total Unrealized Gain/(Loss)</span>
              <CurrentGainListValue className="list-value">
                <FormattedCurrency
                  value={totalRow.gain}
                  replaceZeroWith={NA_DEFAULT_VALUE}
                />
              </CurrentGainListValue>
            </li>
            <li>
              <span className="list-heading">Total Unpaid Interest</span>
              <InterestListValue className="list-value">
                <FormattedCurrency
                  value={totalRow.unpaid_interest}
                  replaceZeroWith={noLoanValue}
                  defaultReturn={noLoanValue}
                />
              </InterestListValue>
            </li>
            <li>
              <span className="list-heading">Total Loan Balance</span>
              <LoanListValue className="list-value">
                <FormattedCurrency
                  value={totalRow.loan_balance}
                  replaceZeroWith={noLoanValue}
                  defaultReturn={noLoanValue}
                />
              </LoanListValue>
            </li>
          </ul>
        </Col>
        <Col>
          <NavSharePieChart totalRow={totalRow}/>
        </Col>
      </Row>
    </Card.Body>
  </Card>
}

export default PieChartContainer;
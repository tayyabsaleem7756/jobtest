import { IFundInvestorDetail } from "../../../../interfaces/fundInvestorDetail";
import { FunctionComponent } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useParams } from "react-router";
import { Params } from "../../../TaxForms/interfaces"
import { Card, CardGroup } from "react-bootstrap";
import { InvestmentTopDashboard } from "../../../InvestorOwnership/components/TopDashboard/styles";
import InvestorProfileSelector from "../../../../components/InvestorProfileSelector";
import { OptionTypeBase } from "react-select";
import styled from "styled-components";
import GlossaryModal from "../../../../components/Glossary/GlossaryModal";
import FormattedCurrency from "../../../../utils/FormattedCurrency";
import { NA_DEFAULT_VALUE } from "../../../../constants/defaultValues";
import { INVESTOR_URL_PREFIX } from "../../../../constants/routes";
import { Link } from "react-router-dom";
import ArrowBack from "@material-ui/icons/ArrowBack";
import { standardizeDate } from "../../../../utils/dateFormatting";
import { getPercentValue } from "../../../../utils/dollarValue";
import { GLOSSARY_DEFINITION_HASH } from "../../../../constants/glossaryItemsHash";
import StatToolTip from "../../../../components/GlossaryToolTip/StatBlockToolTip";
import { useGetCompanyInfoQuery } from "../../../../api/rtkQuery/commonApi";

const InvestorName = styled.span`
  font-size: 24px;
  font-family: "Inter", sans-serif;
  display: inline-block;
  vertical-align: middle;
  margin-left: ${(props) => `${props.theme.baseLine}px`};
  font-weight: 400;
  color: ${(props) => `${props.theme.palette.common.sectionHeading}px`};

  .currency {
    font-size: 18px;
    margin-left: 10px;
  }
`;

const InvestmentSection = styled(Row)`
  border-bottom: 1px dashed #a3a2a2;
  padding: 0 0 ${(props) => `${props.theme.baseLine / 2}px`};
  margin-bottom: ${(props) => `${props.theme.baseLine}px`};
`;

const StarTextCol = styled(Col)`
  margin-top: ${(props) => `${props.theme.baseLine * 1.5}px`};
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  color: #000000;
`;

const DashboardLink = styled(Link)`
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  font-family: "Quicksand Bold";
  color: #091626;
  margin-bottom: 10px;
`;

const LogoImage = styled.img`
  width: 100px;
  height: 24px;
`;

const StyledCardGroup = styled(CardGroup)`
  -webkit-justify-content: space-between !important;
  padding-left: ${(props) =>
    props.secondGroup && props.isLegacy ? `1.7%` : `0px`} !important;

  @media (max-width: 1230px) {
    padding-left: ${(props) =>
      props.secondGroup && props.isLegacy ? `1.8%` : `0px`} !important;
  }

  @media (max-width: 1200px) {
    display: block !important;
    width: ${(props) => (props.isLegacy ? `51%` : `100%`)};
    margin-top: 0px !important;
    padding-left: 0px !important;
  }

  @media (max-width: 991px) {
    display: block !important;
    width: 100% !important;
    margin-top: 0px !important;
    padding-left: 0px !important;
  }
`;
interface InfoWrapProps {}

const WrapInCol: FunctionComponent<InfoWrapProps> = ({ children }) => (
  <Col>{children}</Col>
);
interface InfoHeaderProps {
  fundInvestorDetail: IFundInvestorDetail;
  availableOptions: OptionTypeBase[];
  investorProfile: OptionTypeBase;
  setInvestorProfile: (arg0: OptionTypeBase) => void;
}

const getGlossaryToolTip = (heading: string) => {
  const glossaryValue = GLOSSARY_DEFINITION_HASH[heading];
  if (!glossaryValue) return <></>;
  return <StatToolTip heading={heading} />;
};

const TopSection: FunctionComponent<InfoHeaderProps> = ({
  fundInvestorDetail,
  investorProfile,
  setInvestorProfile,
  availableOptions,
}) => {
  const { externalId } = useParams<Params>();
  const { data: companyInfo } = useGetCompanyInfoQuery(externalId, { skip: !externalId });
  const currencySymbol = fundInvestorDetail.currency?.symbol;
  const isLegacy = fundInvestorDetail.is_legacy;
  let tiles = (
    <>
      <StyledCardGroup isLegacy={isLegacy}>
        <Card>
          <Card.Body>
            <div className="heading">
              Net Equity {getGlossaryToolTip("Net Equity")}
            </div>
            <div className="value">
              <FormattedCurrency
                value={fundInvestorDetail.current_net_equity}
                symbol={currencySymbol}
                replaceZeroWith={NA_DEFAULT_VALUE}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="heading">
              Loan Balance + Unpaid Interest{" "}
              {getGlossaryToolTip("Loan Balance + Unpaid Interest")}
            </div>
            <div className="value">
              <FormattedCurrency
                value={fundInvestorDetail.loan_balance_with_unpaid_interest}
                symbol={currencySymbol}
                replaceZeroWith={NA_DEFAULT_VALUE}
              />
            </div>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <div className="heading">
              Gross Share Of NAV {getGlossaryToolTip("Gross Share of NAV")}
            </div>
            <div className="value">
              <FormattedCurrency
                value={fundInvestorDetail.gross_share_of_investment_product}
                symbol={currencySymbol}
                replaceZeroWith={NA_DEFAULT_VALUE}
              />
            </div>
          </Card.Body>
        </Card>
      </StyledCardGroup>
      <StyledCardGroup isLegacy={isLegacy} secondGroup={true}>
        <Card>
          <Card.Body>
            <div className="heading">
              Equity Commitment Uncalled{" "}
              {getGlossaryToolTip("Equity Commitment Uncalled")}
            </div>
            <div className="value">
              <FormattedCurrency
                value={fundInvestorDetail.remaining_equity}
                symbol={currencySymbol}
                replaceZeroWith={NA_DEFAULT_VALUE}
              />
            </div>
          </Card.Body>
        </Card>
        {!isLegacy && (
          <>
            <Card>
              <Card.Body>
                <div className="heading">
                  Unrealized Gain/(Loss){" "}
                  {getGlossaryToolTip("Unrealized Gain/(Loss)")}
                </div>
                <div className="value">
                  <FormattedCurrency
                    value={fundInvestorDetail.gain}
                    symbol={currencySymbol}
                    replaceZeroWith={NA_DEFAULT_VALUE}
                  />
                </div>
              </Card.Body>
            </Card>
            <Card>
              <Card.Body>
                <div className="heading">
                  IRR Leveraged / Unleveraged{" "}
                  {getGlossaryToolTip("IRR Leveraged / Unleveraged")}
                </div>
                <div className="value">
                  {fundInvestorDetail.leveraged_irr
                    ? `${getPercentValue(
                        fundInvestorDetail.leveraged_irr
                      )}/${getPercentValue(
                        fundInvestorDetail.un_leveraged_irr
                      )}`
                    : "Coming Soon"}
                </div>
              </Card.Body>
            </Card>
          </>
        )}
      </StyledCardGroup>
    </>
  );

  tiles = isLegacy ? tiles : <WrapInCol children={tiles} />;

  return (
    <InvestmentTopDashboard>
      <Container fluid>
        <InvestmentSection>
          <DashboardLink to={`/${INVESTOR_URL_PREFIX}/ownership`}>
            <ArrowBack /> Investor Dashboard
          </DashboardLink>
          <Col>
            <h1 className="hero-dashboard-heading">
              My Investments <GlossaryModal />
            </h1>
            {companyInfo?.company_logo && (<LogoImage src={companyInfo?.company_logo} className="lasalle-logo" alt="logo" />)}
            <InvestorName>
              {fundInvestorDetail.fund_name}
              <span className={"currency"}>
                ({fundInvestorDetail.currency?.code})
              </span>
            </InvestorName>
            <InvestorProfileSelector
              options={availableOptions}
              value={investorProfile}
              onChange={setInvestorProfile}
            />
          </Col>
        </InvestmentSection>
        {fundInvestorDetail.invested_since && <Row>
          <p>
            Invested since {standardizeDate(fundInvestorDetail.invested_since)}
          </p>
        </Row>}
        <Row lg={2}>{tiles}</Row>
        <Row className="{mt-2}">
          {isLegacy ? (
            <StarTextCol>
              *Metrics are based on the most recent available data. Some metrics
              are not available for Legacy Program Investments. Please contact
              the investment fund management team for more information.
            </StarTextCol>
          ) : (
            <StarTextCol>
              *All metrics are based on the most recent available data.
            </StarTextCol>
          )}
        </Row>
      </Container>
    </InvestmentTopDashboard>
  );
};

export default TopSection;


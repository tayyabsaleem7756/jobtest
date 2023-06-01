import React, {FunctionComponent} from 'react';
import {Tab, Tabs} from "react-bootstrap";
import {useAppSelector} from "../../../../app/hooks";
import {selectInvestorOwnership} from "../../selectors";
import InvestedFunds from "../InvestedFunds";
import NotificationsList from "../Notifications";
import CurrencyToggle from "../InvestedFunds/CurrencyToggle";
import styled from "styled-components";
import {getInvestedFunds, getInvestmentCompositions} from "../InvestedFunds/computations";


const StyledTabs = styled(Tabs)`
  padding: 10px 10px 0 10px;
  
  button {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    color: #020203;
    
    :hover {
      border: none;
      color: #020203;
    }
  }

  .nav-link.active {
    color: #020203;
    border: none;
    border-bottom: 7px solid #EFB335;
  }
  
  .nav-link {
    transition: none;
  }
`


interface TopDashboardProps {

}


const TableTabsView: FunctionComponent<TopDashboardProps> = ({}) => {
  const investorOwnership = useAppSelector(selectInvestorOwnership);

  if (!investorOwnership) return <></>

  const {activeInvestedFunds, legacyInvestedFunds} = getInvestedFunds(investorOwnership.invested_funds);
  const {activeInvestedCompositions, legacyInvestmentCompositions} = getInvestmentCompositions(investorOwnership.investment_compositions);

  return <StyledTabs defaultActiveKey="ownership" id="uncontrolled-tab-example">
    <Tab eventKey="ownership" title="Ownership">
      <section>
        <div className="ms-auto"><CurrencyToggle/></div>
        <h2>Active Investments</h2>
        <InvestedFunds
          investedFunds={activeInvestedFunds}
          compositions={activeInvestedCompositions}
          isLegacy={false}
        />
      </section>
      {legacyInvestedFunds.length > 0 &&
        <section>
          <h2>Legacy Program Investments</h2>
          <div>Metrics are based on the most recent available data. Some metrics are not available.</div>
          <InvestedFunds
            investedFunds={legacyInvestedFunds}
            compositions={legacyInvestmentCompositions}
            isLegacy={true}
          />
        </section>
      }
    </Tab>
    <Tab eventKey="notifications" title="Notifications & Documents">
      <NotificationsList key={'mobile-view-notifications'}/>
    </Tab>
  </StyledTabs>
};

export default TableTabsView;

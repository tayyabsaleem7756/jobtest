import React, {FunctionComponent} from 'react';
import {useAppSelector} from "../../../../app/hooks";
import {selectInvestorOwnership} from "../../selectors";
import Stack from "react-bootstrap/Stack";
import InvestedFunds from "../InvestedFunds";
import NotificationsList from "../Notifications";
import CurrencyToggle from "../InvestedFunds/CurrencyToggle";
import {getInvestedFunds, getInvestmentCompositions} from "../InvestedFunds/computations";


interface DesktopViewTablesProps {
}


const DesktopViewTables: FunctionComponent<DesktopViewTablesProps> = () => {
  const investorOwnership = useAppSelector(selectInvestorOwnership);
  if (!investorOwnership) return <></>

  const {activeInvestedFunds, legacyInvestedFunds} = getInvestedFunds(investorOwnership.invested_funds);
  const {activeInvestedCompositions, legacyInvestmentCompositions} = getInvestmentCompositions(investorOwnership.investment_compositions);

  return <>
    <section>
      <Stack direction="horizontal">
        <h2 className="section-title">Active Investments</h2>
        <div className="ms-auto"><CurrencyToggle/></div>
      </Stack>
      <InvestedFunds
        investedFunds={activeInvestedFunds}
        compositions={activeInvestedCompositions}
        isLegacy={false}
      />
    </section>
    {legacyInvestedFunds.length > 0 && 
      <section>
        <Stack direction="horizontal">
          <h2 className="section-title">Legacy Program Investments</h2>
        </Stack>
        <Stack direction="horizontal">
          <p>Metrics are based on the most recent available data. Some metrics are not available.</p>
        </Stack>
        <InvestedFunds
          investedFunds={legacyInvestedFunds}
          compositions={legacyInvestmentCompositions}
          isLegacy={true}
        />
      </section>
    }
    <section>
      <h2 className="section-title">Notifications & Documents</h2>
      <NotificationsList key={'desktop-view-notifications'}/>
    </section>
  </>
};

export default DesktopViewTables;

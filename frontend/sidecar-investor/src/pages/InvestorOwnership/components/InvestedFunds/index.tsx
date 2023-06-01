import React, {FunctionComponent} from 'react';
import styled from 'styled-components';
import {IInvestmentComposition, IOwnershipFundInvestor} from "../../../../interfaces/investorOwnership";
import InvestedFundRow from "./InvestedFundRow";
import {createTotalRow} from "./computations";
import {SideCarStyledTable} from "../../../../presentational/StyledTableContainer";
import {useAppSelector} from "../../../../app/hooks";
import {selectShowUSD} from "../../selectors";
import Table from "react-bootstrap/Table";
import GlossaryToolTip from "../../../../components/GlossaryToolTip";
import GlossaryToolTipHeader from "../../../../components/GlossaryToolTip";

interface InvestedFundsProps {
  investedFunds: IOwnershipFundInvestor[],
  compositions: IInvestmentComposition,
  isLegacy: boolean
}

const TH = styled(({colWidth, ...props}) => <th {...props} />)`
  min-width: 130px;
  width: ${({colWidth}) => colWidth ? colWidth : "auto"};
`


const InvestedFunds: FunctionComponent<InvestedFundsProps> = ({investedFunds, compositions, isLegacy}) => {
  const showUSD = useAppSelector(selectShowUSD);
  const totalRow = createTotalRow(investedFunds, isLegacy);

  return <SideCarStyledTable>
    <Table responsive>
      <thead>
      <tr>
        <TH colWidth="12.5%"></TH>
        <TH colWidth="12.5%"><GlossaryToolTipHeader header={'Investment'} heading={'Investment'}/></TH>
        <TH colWidth="12.5%"><GlossaryToolTipHeader header={'Net Equity'} heading={'Net Equity'}/></TH>
        <TH colWidth="12.5%"><GlossaryToolTip header={'Loan Balance + Unpaid Interest'} heading={'Loan Balance + Unpaid Interest'}/>
        </TH>
        <TH colWidth="12.5%"><GlossaryToolTip header={'Gross Share of NAV'} heading={'Gross Share of NAV'}/></TH>
        <TH colWidth="12.5%"><GlossaryToolTip header={'Equity Commitment Uncalled'} heading={'Equity Commitment Uncalled'}/></TH>
        {!isLegacy && <TH><GlossaryToolTip header={'Unrealized Gain/(Loss)'} heading={'Unrealized Gain/(Loss)'}/></TH>}
        {!isLegacy && <TH><GlossaryToolTip header={'Return of Capital'} heading={'Return of Capital'}/></TH>}
        {!isLegacy && <TH><GlossaryToolTip header={'Profit Distributions'} heading={'Profit Distributions'}/></TH>}
        {!isLegacy && <TH><GlossaryToolTip header={'IRR (Leveraged)'} heading={'IRR Leveraged'}/></TH>}
        {!isLegacy && <TH><GlossaryToolTip header={'IRR (Unleveraged)'} heading={'IRR Unleveraged'}/></TH>}
        <TH colWidth="12.5%">Last NAV Update</TH>
        <TH colWidth="12.5%"><GlossaryToolTip header={'Currency'} heading={'Currency'}/></TH>
      </tr>
      </thead>
      <tbody>
      {investedFunds.map((investedFund) => (
        <InvestedFundRow
          key={investedFund.id}
          investedFund={investedFund}
          compositions={compositions}
          isSubRow={false}
        />
      ))}
      {investedFunds && showUSD && investedFunds.length > 0 &&
      <InvestedFundRow
        key={totalRow.id}
        investedFund={totalRow}
      />}
      </tbody>
    </Table>

  </SideCarStyledTable>
};

export default InvestedFunds;

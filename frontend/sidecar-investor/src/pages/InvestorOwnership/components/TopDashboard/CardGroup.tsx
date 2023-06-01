import React, {FunctionComponent} from 'react';
import {CardGroup} from "react-bootstrap";
import FormattedCurrency from "../../../../utils/FormattedCurrency";
import {getPercentValue} from "../../../../utils/dollarValue";
import {IFundInvestorDetail} from "../../../../interfaces/fundInvestorDetail";
import StatCard from "./StatCard";
import {NA_DEFAULT_VALUE} from "../../../../constants/defaultValues";
import {roundAndAdd} from "../InvestedFunds/computations";


interface StatCardProps {
  totalRow: IFundInvestorDetail
}

const StatCardGroup: FunctionComponent<StatCardProps> = ({totalRow}) => {
  const cardsInfo = [
    {
      heading: 'Total Net Equity',
      value: <FormattedCurrency value={totalRow.current_net_equity} replaceZeroWith={NA_DEFAULT_VALUE}/>
    },
    {
      heading: 'Total Loan Balance + Unpaid Interest',
      value: <FormattedCurrency value={totalRow.loan_balance_with_unpaid_interest} replaceZeroWith={NA_DEFAULT_VALUE}/>
    },
    {
      heading: 'Total Gross Share Of NAV',
      value: <FormattedCurrency value={roundAndAdd(totalRow.current_net_equity, totalRow.loan_balance_with_unpaid_interest)} replaceZeroWith={NA_DEFAULT_VALUE}/>,
      glossaryKey: 'Total Gross Share of NAV'
    },
    {
      heading: 'Total Equity Commitment Uncalled',
      value: <FormattedCurrency value={totalRow.remaining_equity} replaceZeroWith={NA_DEFAULT_VALUE}/>
    },
    {heading: 'Total Unrealized Gain/(Loss)', value: <FormattedCurrency value={totalRow.gain} replaceZeroWith={NA_DEFAULT_VALUE}/>},
    {
      heading: 'Total IRR Leveraged / Unleveraged',
      value: totalRow.leveraged_irr ? `${getPercentValue(totalRow.leveraged_irr)}/${getPercentValue(totalRow.un_leveraged_irr)}` : 'Coming Soon'
    },
  ]

  return <CardGroup>
    {cardsInfo.map(cardInfo => <StatCard
      heading={cardInfo.heading}
      value={cardInfo.value}
      glossaryKey={cardInfo.glossaryKey}
    />)}

  </CardGroup>

};

export default StatCardGroup;

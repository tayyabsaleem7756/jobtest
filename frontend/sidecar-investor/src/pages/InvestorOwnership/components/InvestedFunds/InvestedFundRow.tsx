import React, {FunctionComponent} from 'react';
import {IInvestmentComposition, IOwnershipFundInvestor} from "../../../../interfaces/investorOwnership";
import {TOTAL_ROW_ID} from "./computations";
import {INVESTOR_URL_PREFIX} from "../../../../constants/routes";
import FormattedCurrency from "../../../../utils/FormattedCurrency";
import {getPercentValue} from "../../../../utils/dollarValue";
import {useAppSelector} from "../../../../app/hooks";
import {selectShowUSD} from "../../selectors";
import classNames from "classnames";
import {FundDetailLink} from "../../../../presentational/Links";
import { useGetCompanyInfoQuery } from "../../../../api/rtkQuery/commonApi";
import styled from "styled-components";
import {DASH_DEFAULT_VALUE, NA_DEFAULT_VALUE} from "../../../../constants/defaultValues";
import {standardizeDate} from "../../../../utils/dateFormatting";


const LogoImg = styled.img`
  width: 80px;
  margin-right: 10px;
`

const FirstColSpan = styled.span`
  display: inline-flex;
`

interface InvestedFundRowProps {
  investedFund: IOwnershipFundInvestor,
  compositions?: IInvestmentComposition,
  isSubRow?: boolean,
}


const InvestedFundRow: FunctionComponent<InvestedFundRowProps> = ({
                                                                    investedFund,
                                                                    compositions,
                                                                    isSubRow,
                                                                  }) => {
  const [open, setOpen] = React.useState(false);
  const showUSD = useAppSelector(selectShowUSD);
  const { data: companyInfo } = useGetCompanyInfoQuery(investedFund.fund.external_id, { skip: !investedFund.fund.external_id });
  const isTotalRow = investedFund.id === TOTAL_ROW_ID;
  const currencySymbol = showUSD ? '$' : investedFund.currency.symbol;
  const currencyRate = showUSD ? investedFund.currency.rate : 1;
  const isLegacy = investedFund.fund.is_legacy;

  const fundId = investedFund.fund.id;
  const fundComposition = !isSubRow && compositions && compositions[fundId]
  const hasSubRows = !isSubRow && fundComposition && fundComposition.length > 1;
  let firstCell = <FundDetailLink
    to={`/${INVESTOR_URL_PREFIX}/funds/${investedFund.fund.external_id}/detail`}>{investedFund.fund.name}
  </FundDetailLink> as any;
  if (isTotalRow) firstCell = '';
  if (isSubRow) firstCell = investedFund.investor_name;

  const collapseImage = <img src="/assets/images/collapse.svg" alt=""/>
  const expandImage = <img src="/assets/images/expand.svg" alt=""/>

  return <>
    <tr key={`${investedFund.id}-row`} className={classNames({'result-row': isTotalRow, 'subRow': isSubRow})}>
      <td>{isTotalRow ? 'Total' : <FirstColSpan>
        {!isSubRow && companyInfo?.company_logo && <LogoImg src={companyInfo.company_logo} alt=""/>}{hasSubRows &&
      <span onClick={() => setOpen(!open)}>
          {open ? collapseImage : expandImage}
        </span>}
      </FirstColSpan>
      }</td>
      <td>{firstCell}</td>
      <td><FormattedCurrency value={investedFund.current_net_equity} symbol={currencySymbol}
                             rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>
      <td><FormattedCurrency value={investedFund.loan_balance_with_unpaid_interest}
                             symbol={currencySymbol} rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>
      <td><FormattedCurrency value={investedFund.nav_share} symbol={currencySymbol}
                             rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>
      <td><FormattedCurrency value={investedFund.remaining_equity} symbol={currencySymbol}
                             rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>
      {!isLegacy && <td><FormattedCurrency value={investedFund.gain} symbol={currencySymbol}
                             rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>}
      {!isLegacy && <td><FormattedCurrency value={investedFund.return_of_capital} symbol={currencySymbol}
                             rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>}
      {!isLegacy && <td><FormattedCurrency value={investedFund.profit_distributions} symbol={currencySymbol}
                             rate={currencyRate} replaceZeroWith={DASH_DEFAULT_VALUE}/></td>}
      {!isLegacy && <td>{getPercentValue(investedFund.leveraged_irr, NA_DEFAULT_VALUE, DASH_DEFAULT_VALUE)}</td>}
      {!isLegacy && <td>{getPercentValue(investedFund.un_leveraged_irr, NA_DEFAULT_VALUE, DASH_DEFAULT_VALUE)}</td>}
      <td>{standardizeDate(investedFund.latest_nav)}</td>
      <td>{investedFund.currency.code}</td>
      {/*<td>{investedFund.id !== TOTAL_ROW_ID && <SellFundButton investedFund={investedFund}/>}</td>*/}
    </tr>
    {!isSubRow && fundComposition && fundComposition.length > 1 && open && fundComposition.map((fundInvestment) =>
      <InvestedFundRow
        investedFund={fundInvestment}
        isSubRow={true}
      />)}

  </>
};

export default InvestedFundRow;

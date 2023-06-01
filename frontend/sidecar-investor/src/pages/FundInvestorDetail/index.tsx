import React, {FunctionComponent, useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {fetchFundInvestorDetail, fetchInvestorProfiles} from "./thunks";
import {selectFundInvestorDetail, selectInvestorProfileOptions} from "./selectors";
import InfoTable from "./components/InfoTable";
import {getPercentValue} from "../../utils/dollarValue";
import FormattedCurrency from "../../utils/FormattedCurrency";
import {OptionTypeBase} from "react-select";
import TopSection from "./components/TopSection";
import {LoggedInFooter} from "../../components/Footer";
import NoDataToast from "../../components/NoDataToast";
import {DASH_DEFAULT_VALUE, NA_DEFAULT_VALUE} from "../../constants/defaultValues";
import {standardizeDate} from "../../utils/dateFormatting";
import NotificationsList from "../InvestorOwnership/components/Notifications";


interface FundInvestorsProps {
}


const FundInvestorDetail: FunctionComponent<FundInvestorsProps> = () => {
  const {externalId} = useParams<{ externalId: string }>();
  const [investorProfile, setInvestorProfile] = useState<OptionTypeBase | null | undefined>(null);
  const dispatch = useAppDispatch();
  const fundInvestments = useAppSelector(selectFundInvestorDetail);
  const investorProfileOptions = useAppSelector(selectInvestorProfileOptions);

  useEffect(() => {
    dispatch(fetchFundInvestorDetail(externalId))
    dispatch(fetchInvestorProfiles());
  }, [])

  useEffect(() => {
    const availableInvestorIds = fundInvestments?.map(investment => investment.investor)
    if (!availableInvestorIds) return;

    let investorExists = false
    if (investorProfile) {
      investorExists = availableInvestorIds.indexOf(investorProfile.value) > -1;
    }
    if (!investorProfile || !investorExists) {
      const firstProfile = investorProfileOptions.find(p => p.value === availableInvestorIds[0])
      setInvestorProfile(firstProfile)
    }
  }, [investorProfileOptions, fundInvestments])

  if (!investorProfile) {
    return <></>
  }

  const fundInvestorDetail = fundInvestments?.find(investment => investment.investor === investorProfile.value)
  if (!fundInvestorDetail) return <></>

  const availableInvestorIds = fundInvestments?.map(investment => investment.investor)
  const availableOptions = investorProfileOptions.filter(profile => availableInvestorIds.indexOf(profile.value) > -1)

  const currencySymbol = fundInvestorDetail.currency?.symbol;
  const isLegacy = fundInvestorDetail.is_legacy;
  const isNavDisabled = fundInvestorDetail.is_nav_disabled;

  const grossCommitmentsRow = [
    {
      heading: 'Gross Commitment',
      value: <FormattedCurrency value={fundInvestorDetail.commitment_amount} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Gross Commitment Called to Date',
      value: <FormattedCurrency value={fundInvestorDetail.called_to_date} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Gross Commitment Uncalled',
      value: <FormattedCurrency value={fundInvestorDetail.uncalled_amount} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      omitDisplay: isLegacy,
      heading: 'Distributions Recallable',
      value: <FormattedCurrency value={fundInvestorDetail.distributions_recallable} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      omitDisplay: isLegacy,
      heading: 'Net Commitment Called to Date',
      value: <FormattedCurrency value={fundInvestorDetail.net_commitment_called_to_date} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
  ]
  const noLeverageUsed = !(Boolean(fundInvestorDetail.initial_leverage_ratio))
  const loansRow = [
    {
      heading: 'Loan Commitment',
      value: <FormattedCurrency value={noLeverageUsed ? 0 : fundInvestorDetail.loan_commitment} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Interest Rate',
      value: getPercentValue(
        noLeverageUsed ? 0 : fundInvestorDetail.current_interest_rate,
        NA_DEFAULT_VALUE,
        DASH_DEFAULT_VALUE
      )
    },
    {
      omitDisplay: isLegacy,
      heading: 'Loan Drawn',
      value: <FormattedCurrency value={noLeverageUsed ? 0 : fundInvestorDetail.loan_drawn} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Total Interest Accrued to Date',
      value: <FormattedCurrency value={noLeverageUsed ? 0 : fundInvestorDetail.interest_accrued} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>,

    },
    {
      heading: 'Loan Repayment',
      value: <FormattedCurrency value={noLeverageUsed ? 0 : fundInvestorDetail.loan_repayment} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>,
    },
    {
      heading: 'Total Interest Paid to Date',
      value: <FormattedCurrency value={noLeverageUsed ? 0 : fundInvestorDetail.interest_paid} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>,

    },
    {
      heading: 'Loan Balance + Unpaid Interest',
      value: <FormattedCurrency value={noLeverageUsed ? 0 : fundInvestorDetail.loan_balance_with_unpaid_interest}
                                symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Loan to Value',
      value: getPercentValue(
        noLeverageUsed ? 0 : fundInvestorDetail.loan_to_value,
        NA_DEFAULT_VALUE,
        DASH_DEFAULT_VALUE
      )
    },
    {
      heading: 'Initial Leverage Ratio',
      value: getPercentValue(
        noLeverageUsed ? 0 : fundInvestorDetail.initial_leverage_ratio,
        NA_DEFAULT_VALUE,
        DASH_DEFAULT_VALUE
      )
    },
  ]

  const equityRow = [
    {
      heading: 'Equity Commitment',
      value: <FormattedCurrency value={fundInvestorDetail.equity_commitment} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Equity Commitment Called to Date',
      value: <FormattedCurrency value={fundInvestorDetail.equity_called} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Equity Commitment Uncalled',
      value: <FormattedCurrency value={fundInvestorDetail.equity_remaining} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
  ]

  const distributionRow = [
    {
      heading: 'Distributions from Underlying Investment',
      value: <FormattedCurrency value={fundInvestorDetail.total_distributions} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Distributions Used to Repay Loan',
      value: <FormattedCurrency value={fundInvestorDetail.distributions_used_for_loan} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Distributions Used to Repay Interest',
      value: <FormattedCurrency value={fundInvestorDetail.distributions_used_for_interest} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Distributions Recallable',
      value: <FormattedCurrency value={fundInvestorDetail.distributions_recallable} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Distributions Paid to Employee',
      value: <FormattedCurrency value={fundInvestorDetail.distributions_to_employee} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    }
  ]

  const navRow = [
    {
      heading: 'Investment NAV',
      value: <FormattedCurrency value={fundInvestorDetail.fund_nav} symbol={currencySymbol}
                                defaultReturn={DASH_DEFAULT_VALUE} replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Investment NAV as of',
      value: standardizeDate(fundInvestorDetail.fund_nav_date),
      glossaryKey: 'Investment NAV as of (date)'
    },
    {
      heading: 'Investment Ownership %',
      value: getPercentValue(fundInvestorDetail.fund_ownership_percent, NA_DEFAULT_VALUE, DASH_DEFAULT_VALUE, 6)
    },
    {
      heading: 'Gross Share of NAV',
      value: <FormattedCurrency value={fundInvestorDetail.gross_share_of_investment_product} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Loan Balance + Unpaid Interest',
      value: <FormattedCurrency value={fundInvestorDetail.loan_balance_with_unpaid_interest} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>,
      glossaryKey: 'Loan Balance + Unpaid Interest'
    },
    {
      omitDisplay: isLegacy,
      heading: 'Capital Calls Since Last NAV Update',
      value: <FormattedCurrency value={fundInvestorDetail.capital_calls_since_last_nav} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      omitDisplay: isLegacy,
      heading: 'Distributions Since Last NAV Update',
      value: <FormattedCurrency value={fundInvestorDetail.distributions_calls_since_last_nav} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      heading: 'Net Equity',
      value: <FormattedCurrency value={fundInvestorDetail.current_net_equity} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
    {
      omitDisplay: isLegacy,
      heading: 'Unrealized Gain/(Loss)',
      value: <FormattedCurrency value={fundInvestorDetail.gain} symbol={currencySymbol}
                                replaceZeroWith={DASH_DEFAULT_VALUE}/>
    },
  ]

  return <>
    {!fundInvestorDetail.has_data && <NoDataToast/>}
    <TopSection
      fundInvestorDetail={fundInvestorDetail}
      availableOptions={availableOptions}
      investorProfile={investorProfile}
      setInvestorProfile={setInvestorProfile}
    />
    <section>
      <h2 className="section-title">Gross Commitments</h2>
      <InfoTable infoRow={grossCommitmentsRow} colWidth="20%"/>
    </section>
    <section>
      <h2 className="section-title">Loans</h2>
      <InfoTable infoRow={loansRow}/>
    </section>
    <section>
      <h2 className="section-title">Equity</h2>
      <InfoTable infoRow={equityRow} colWidth="33%"/>
    </section>
    {!isLegacy &&
      <section>
        <h2 className={"section-title"}>Distributions</h2>
        <InfoTable infoRow={distributionRow}/>
      </section>
    }
    {
      !isNavDisabled && <section>
        <h2 className="section-title">NAV</h2>
        <InfoTable infoRow={navRow}/>
      </section>
    }
    <section>
      <h2 className="section-title">Notifications & Documents</h2>
      <NotificationsList
        key={`${investorProfile?.value}-${fundInvestorDetail?.fund}`}
        viewInvestorId={investorProfile?.value}
        viewFundId={fundInvestorDetail?.fund}
      />
    </section>
    <LoggedInFooter/>
  </>
};

export default FundInvestorDetail;

import {IOwnershipFundInvestor, IInvestmentComposition} from "../../../../interfaces/investorOwnership";
import {IFundInvestorDetail} from "../../../../interfaces/fundInvestorDetail";
import {round} from "lodash";

const SKIP_KEYS = ['id', 'fund', 'currency', 'ownership', 'order', 'investor', 'latest_nav']
const PERCENTAGE_KEYS = ['leveraged_irr', 'un_leveraged_irr']

export const TOTAL_ROW_ID = 0

interface PieData {
  name: string;
  value: number
}

export const roundAndAdd = (...args: number[]) => {
  var accumulator = 0;

  for (const arg of args) {
    if(arg) {
      accumulator += round(arg, 0);
    }
  }
  return accumulator;
}

export const createTotalRow = (investedFunds: IOwnershipFundInvestor[], isLegacy: boolean) => {
  const accumulatedRow = {id: TOTAL_ROW_ID, currency: '', fund: {'name': 'Total', 'is_legacy': isLegacy}, ownership: ''} as any;
  investedFunds.forEach((fund) => {
    if(fund.fund.is_legacy === isLegacy) {
      for (const [key, value] of Object.entries(fund)) {
        if (SKIP_KEYS.indexOf(key) > -1) continue
        let accumulateValue = round(value, 0)
        if (PERCENTAGE_KEYS.indexOf(key) === -1) accumulateValue *= fund.currency.rate;

        if (!(key in accumulatedRow)) accumulatedRow[key] = accumulateValue
        else accumulatedRow[key] += accumulateValue
      }
    }
  })
  return accumulatedRow;
}

export const getNavPieChartData = (totalRow: IFundInvestorDetail) => {
  const pieChartData = [] as PieData[];

  pieChartData.push({name: 'Total Equity Commitment Called to Date', value: totalRow.equity_called},)
  pieChartData.push({name: 'Total Unrealized Gain/(Loss)', value: totalRow.gain},)
  pieChartData.push({name: 'Total Unpaid Interest', value: totalRow.unpaid_interest},)
  pieChartData.push({name: 'Total Loan Balance', value: totalRow.loan_balance},)


  return pieChartData;
}

export const getGainBarChartData = (investedFunds: IOwnershipFundInvestor[]) => {
  const barChartData = {
    realizedGain: 0,
    unrealizedGain: 0
  } as any;
  investedFunds.forEach((fund) => {
    barChartData.unrealizedGain += fund.unrealized_gain
    barChartData.realizedGain += fund.unrealized_gain * 0.75
  })
  return [
    {name: 'Total Realized Gain', value: barChartData.realizedGain},
    {name: 'Total Unrealized Gain', value: barChartData.unrealizedGain},
  ];
}

export const getInvestmentCompositions = (investmentCompositions: IInvestmentComposition) => {
  const activeInvestedCompositions: { [key: string]: any } = {}, legacyInvestmentCompositions: { [key: string]: any } = {};

  for (const [key, value] of Object.entries(investmentCompositions)) {
    value[0].fund.is_legacy 
      ? legacyInvestmentCompositions[key] = value
      : activeInvestedCompositions[key] = value;
  }
  return {activeInvestedCompositions, legacyInvestmentCompositions}
}

export const getInvestedFunds = (investedFunds: IOwnershipFundInvestor[]) => {
  const activeInvestedFunds: any = [], legacyInvestedFunds: any = [];
  
  investedFunds.forEach((fund) => {
    fund.fund.is_legacy 
      ? legacyInvestedFunds.push(fund)
      : activeInvestedFunds.push(fund)
  });

  return {activeInvestedFunds, legacyInvestedFunds}
}
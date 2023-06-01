import { FunctionComponent } from "react";
import get from "lodash/get";
import FormattedCurrency from "../../../../utils/FormattedCurrency";
import { ADMIN_URL_PREFIX } from "../../../../constants/routes";
import ApplicantActions from "./ApplicantActions";
import { TableLink } from "../../../../components/Table/styles";
import ApplicantPill from "./ApplicantPill";
import { getLeverageOptionLabel } from "../../constants";
import {isApplicationApproveable} from "../utils";

const formatCurrency = (row: any, column: string, symbol: string) => {
  const val = get(row, column, "");
  return <>{val ? <FormattedCurrency value={val} symbol={symbol} /> : <></>}</>;
};

const LeverageRatio: FunctionComponent<any> = ({ leverageValue }) => {
  const label = getLeverageOptionLabel(leverageValue);
  return <span>{label}</span>;
};

export const getColumns = (
  fundDetails: any,
  toggleModal: any,
  handleUpdateSelectedStatus: any,
  withdrawConfirmationModal: any,
) => {
  const columns = [
    {
      title: "First Name",
      dataKey: "first_name",
      fixed: "left",
      Cell: (row: any) => (
        <TableLink
          to={`/${ADMIN_URL_PREFIX}/funds/${fundDetails.external_id}/applicants/${row.id}`}
        >
          {get(row, "first_name", "")}
        </TableLink>
      ),
    },
    {
      title: "Last Name",
      dataKey: "last_name",
      fixed: "left",
      Cell: (row: any) => (
        <TableLink
          to={`/${ADMIN_URL_PREFIX}/funds/${fundDetails.external_id}/applicants/${row.id}`}
        >
          {get(row, "last_name", "")}
        </TableLink>
      ),
    },
    {
      title: "Eligibility Decision",
      dataKey: "eligibility_decision",
      width: 180,
      Cell: (row: any) => (
        <ApplicantPill
          data={row}
          field="eligibility_decision"
        />
      ),
    },
    {
      title: "Requested Leverage",
      dataKey: "investment_detail.requested_leverage",
      width: 180,
    },
    {
      title: "Max Leverage",
      dataKey: "investment_detail.max_leverage",
      width: 150,
    },
    {
      title: "Final Leverage",
      dataKey: "investment_detail.final_leverage_ratio",
      width: 150,
      Cell: (row: any) => (
        <LeverageRatio
          leverageValue={get(row, "investment_detail.final_leverage_ratio")}
        />
      ),
    },
    {
      title: "Requested Equity",
      dataKey: "investment_detail.requested_entity",
      width: 150,
      Cell: (row: any) => formatCurrency(row, "investment_detail.requested_entity", get(fundDetails, 'currency.symbol', '$')),
    },
    {
      title: "Final Equity",
      dataKey: "investment_detail.final_entity",
      width: 120,
      Cell: (row: any) => formatCurrency(row, "investment_detail.final_entity", get(fundDetails, 'currency.symbol', '$')),
    },
    {
      title: "Total Investment",
      dataKey: "investment_detail.total_investment",
      width: 180,
      Cell: (row: any) => formatCurrency(row, "investment_detail.total_investment", get(fundDetails, 'currency.symbol', '$')),
    },
    {
      title: "Application Approval",
      dataKey: "application_approval",
      width: 180,
      Cell: (row: any) => (
        <ApplicantPill data={row} field="application_approval"/>
      ),
    },
    {
      title: "KYC/AML",
      dataKey: "kyc_aml",
      width: 150,
      Cell: (row: any) => <ApplicantPill data={row} field="kyc_aml"/>,
    },
    {
      title: "Tax Review",
      dataKey: "taxReview",
      width: 150,
      Cell: (row: any) => <ApplicantPill data={row} field="taxReview"/>,
    },
    {
      title: "Final Review",
      dataKey: "legalDocs",
      width: 150,
      Cell: (row: any) => <ApplicantPill data={row} field="legalDocs"/>,
    },
    {
      title: "Action",
      dataKey: "action",
      fixed: "right",

      Cell: (row: any, rowIndex: number) => {

        return (
          <>
            {fundDetails && row && (
              <ApplicantActions
                fundDetailsURL={`/${ADMIN_URL_PREFIX}/funds/${fundDetails.external_id}/applicants/${row.id}`}
                toggleModal={() => toggleModal(rowIndex)}
                hideApproval={!isApplicationApproveable(row)}
                toggleWithdrawConfirmationModal={() => withdrawConfirmationModal(row.id)}
                handleUpdateSelectedStatus={(status: number, comment?: string) =>
                  handleUpdateSelectedStatus(row.id, status, comment)
                }
              />
            )}
          </>
        );
      },
    },
  ];
  if (fundDetails?.enable_internal_tax_flow) {
    const internalTax = {
      title: "Internal Tax",
      dataKey: "internal_tax",
      width: 150,
      Cell: (row: any) => <ApplicantPill data={row} field="internal_tax"/>,
    }
    columns.splice(12, 0, internalTax)
  }
  if (fundDetails?.skip_tax) {
    return columns.filter(column => column.title !== 'Tax Review')
  }

  return columns;
}

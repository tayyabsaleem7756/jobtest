import FormattedCurrency from "../../../../../../utils/FormattedCurrency";
import { get } from "lodash";
import { Link } from "./styles";
import { standardizeDate } from "../../../../../../utils/dateFormatting";

const formatCurrency = (row: any, column: string, symbol: string) => {
  const val = get(row, column, "");
  return (
    <>
      {val ? <FormattedCurrency value={val} symbol={symbol} /> : <span>-</span>}
    </>
  );
};

export const getColumns = (handleSelectRow: any) => [
  {
    title: "Created On",
    fixed: "left",
    dataKey: "created_timestamp",
    minWidth: 200,
    flexGrow: 1,
    Cell: (row: any) => <span>{standardizeDate(row.created_timestamp)}</span>,
  },
  {
    title: "Approved On",
    dataKey: "approved_at",
    minWidth: 200,
    flexGrow: 1,
    Cell: (row: any) => <span>{standardizeDate(row.approved_at)}</span>,
  },
  {
    title: "Total Capital Called",
    dataKey: "total_capital_called",
    minWidth: 200,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "total_capital_called", row?.currency?.symbol),
  },
  {
    title: "Amount Received",
    dataKey: "total_amount_received",
    minWidth: 200,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "total_amount_received", row?.currency?.symbol),
  },
  {
    title: "",
    dataKey: "action",
    fixed: "right",
    minWidth: 153,
    flexGrow: 1,
    Cell: (row: any) => (
      <Link onClick={() => handleSelectRow(row)}>View Details</Link>
    ),
  },
];

// export const dummyData = [
//   {
//     id: 1,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 2,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 3,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 4,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 5,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 6,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 7,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
//   {
//     id: 8,
//     created_timestamp: "2/21/2020",
//     approved_at: "2/28/2020",
//     total_capital_called: 240000,
//     total_amount_received: 231040,
//   },
// ];

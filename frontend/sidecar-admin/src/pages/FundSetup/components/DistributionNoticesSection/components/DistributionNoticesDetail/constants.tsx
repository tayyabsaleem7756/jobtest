import FormattedCurrency from "../../../../../../utils/FormattedCurrency";
// import DocIcon from "../../../../../../assets/images/doc_icon.svg";
// import OpenInNewIcon from "../../../../../../assets/images/open_in_new_icon.svg";
import { get } from "lodash";
import { CSSProperties } from "react";
import { DocTile } from "./styles";
import FilePreviewModal from "../../../../../../components/FilePreviewModal";

const footerRowStyle = {
  borderTop: "1px solid black",
  position: "absolute",
  top: "0px",
  padding: "8px",
  width: "100%",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "20px",
} as CSSProperties;

const isFooter = (row: any) => get(row, "isFooter") === true;

const formatCurrency = (row: any, column: string, symbol: string) => {
  const val = get(row, column, "");
  return (
    <span style={isFooter(row) ? footerRowStyle : {}}>
      {val ? <FormattedCurrency value={val} symbol={symbol} /> : <span>-</span>}
    </span>
  );
};

const DocLink = ({ doc }: any) => {
  // const [isLoading, setIsLoading] = useState(false);
  // const handleClick = async () => {
  //   setIsLoading(true);
  //   await handleDownloadDoc(doc.document_id, doc.title);
  //   setIsLoading(false);
  // };
  // if (isLoading)
  //   return (
  //     <DocTile>
  //       <span>Downloading ...</span>
  //     </DocTile>
  //   );
  return (
    // <DocTile onClick={() => handleClick()}>
    //   <img src={DocIcon} alt="" />
    //   <span>{doc.title}</span>
    //   <img src={OpenInNewIcon} alt="" />
    // </DocTile>
    <DocTile>
      <FilePreviewModal
        documentId={doc.document_id}
        documentName={doc.title}
        noCell={true}
        showPreviewIcon={false}
      />
    </DocTile>
  );
};

export const TEXT = {
  title: {
    confirmed: "Distrubutions have been processed ",
    notConfirmed: "Please Confirm",
  },
  description: {
    confirmed: "Statements have been sent to investors.",
    notConfirmed:
      "You have reviewed all distributions and are ready to issue distributions to investors",
  },
};

export const TOOLTIP="The documents are being generated, please come back later to approve."

export const getColumns = () => [
  {
    title: "First Name",
    fixed: "left",
    dataKey: "user.first_name",
    minWidth: 130,
    flexGrow: 1,
    Cell: (row: any) => (
      <span style={isFooter(row) ? footerRowStyle : {}}>
        {get(row, "user.first_name")}
      </span>
    ),
  },
  {
    title: "Last Name",
    dataKey: "user.last_name",
    minWidth: 130,
    flexGrow: 1,
    Cell: (row: any) => (
      <span style={isFooter(row) ? footerRowStyle : {}}>
        {get(row, "user.last_name")}
      </span>
    ),
  },
  {
    title: "Gross Distribution",
    dataKey: "investments",
    minWidth: 170,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "investments", row?.currency?.symbol),
  },
  {
    title: "Ownership %",
    dataKey: "ownership",
    minWidth: 150,
    flexGrow: 1,
    Cell: (row: any) => (
      <span style={isFooter(row) ? footerRowStyle : {}}>
        {isFooter(row)
          ? ''
          : `${get(row, "ownership")} %`}
       
      </span>
    ),
  },
  {
    title: "Management Fees",
    dataKey: "management_fees",
    minWidth: 160,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "management_fees", row?.currency?.symbol),
  },
  {
    title: "Organization Cost",
    dataKey: "organization_cost",
    minWidth: 160,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "organization_cost", row?.currency?.symbol),
  },
  {
    title: "Fund Expenses",
    dataKey: "fund_expenses",
    minWidth: 150,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "fund_expenses", row?.currency?.symbol),
  },
  {
    title: "Distribution Amount",
    dataKey: "amount",
    minWidth: 150,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "amount", row?.currency?.symbol),
  },
  {
    title: "Total Distributions To Date ",
    dataKey: "total_to_date",
    minWidth: 230,
    flexGrow: 1,
    Cell: (row: any) =>
      formatCurrency(row, "total_to_date", row?.currency?.symbol),
  },
  {
    title: "Distribution Notice",
    dataKey: "docs",
    fixed: "right",
    minWidth: 200,
    flexGrow: 1,
    Cell: (row: any) =>
      isFooter(row) ? (
        <span style={footerRowStyle}></span>
      ) : get(row, "document") ? (
        <DocLink
          style={isFooter(row) ? footerRowStyle : {}}
          docName={get(row, "document.title")}
          doc={get(row, "document")}
          // handleDownloadDoc={handleDownloadDoc}
        />
      ) : (
        <span>N/A</span>
      ),
  },
];

export const dummyData = [
  {
    id: 1,
    user: { first_name: "John", last_name: "Snow" },
    total_investment: 20000,
    ownership: 19000,
    management_fees: 0,
    organization_cost: 0,
    fund_expenses: 1000,
    total_distributions_to_date: 20000,
    distribution_amount: 0,
    doc_name: "Snow_022120",
  },
  {
    id: 2,
    user: { first_name: "John", last_name: "Snow" },
    total_investment: 15000,
    ownership: 20000,
    management_fees: 1000,
    organization_cost: 500,
    fund_expenses: 2000,
    total_distributions_to_date: 35000,
    distribution_amount: 25000,
    doc_name: "Snow_022120",
  },
  {
    id: 3,
    user: { first_name: "John", last_name: "Snow" },
    total_investment: 10000,
    ownership: 15000,
    management_fees: 500,
    organization_cost: 0,
    fund_expenses: 1000,
    total_distributions_to_date: 25000,
    distribution_amount: 15000,
    doc_name: "Snow_022120",
  },
  {
    id: 4,
    user: { first_name: "John", last_name: "Snow" },
    total_investment: 5000,
    ownership: 7000,
    management_fees: 0,
    organization_cost: 0,
    fund_expenses: 500,
    total_distributions_to_date: 5000,
    distribution_amount: 7000,
    doc_name: "Snow_022120",
  },
  {
    id: 5,
    user: { first_name: "John", last_name: "Snow" },
    total_investment: 8000,
    ownership: 10000,
    management_fees: 500,
    organization_cost: 200,
    fund_expenses: 1500,
    total_distributions_to_date: 15000,
    distribution_amount: 8000,
    doc_name: "Snow_022120",
  },
  {
    id: 6,
    user: { first_name: "John", last_name: "Snow" },
    total_investment: 30000,
    ownership: 25000,
    management_fees: 2000,
    organization_cost: 1000,
    fund_expenses: 3000,
    total_distributions_to_date: 30000,
    distribution_amount: 25000,
    doc_name: "Snow_022120",
  },
];

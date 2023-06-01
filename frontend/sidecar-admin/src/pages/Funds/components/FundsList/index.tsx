import { FunctionComponent, useEffect, useState } from "react";
import size from "lodash/size";
import filter from "lodash/filter";
import Col from "react-bootstrap/Col";
import RsuiteTable from "../../../../components/Table/RSuite";
import SidecarModal from "../../../../components/SidecarModal";
import FundDocuments from "../../../EligibilityCriteria/components/EligibilityFormCreation/components/CriteriaForm/components/FundDocuments";
import { ADMIN_URL_PREFIX } from "../../../../constants/routes";
import { useGetFundsQuery } from "../../../../api/rtkQuery/fundsApi";
import Actions from "./Actions";
import { FundId, StatusDateContainer, Status } from "./styles";
import Finalize from "./Finalize";
import { IFund } from "../../interfaces";

interface FundsListProps {
  filterKey?: string;
  setFinishedLoading?: Function;
}

const getTableColumns = (showDocumentModal: (fund: IFund) => void) => [
  {
    title: "Fund Name",
    dataKey: "name",
    flexGrow: 1.5,
    minWidth: 250,
    Cell: (row: IFund) => (
      <FundId to={`/${ADMIN_URL_PREFIX}/funds/${row.external_id}`}>{row.name}</FundId>
    ),
  },
  {
    title: "Status",
    dataKey: "status",
    flexGrow: 1,
    Cell: (row: IFund) => (
      <StatusDateContainer>
        <Status>{row.status}</Status>
      </StatusDateContainer>
    ),
  },
  {
    title: "Fund Setup",
    dataKey: "fund_setup",
    flexGrow: 1,
    Cell: (row: IFund) => (
      <>
        {row.is_published ? (
          <FundId to={`/${ADMIN_URL_PREFIX}/funds/${row.external_id}`}>Edit</FundId>
        ) : (
          <FundId
            to={`/${ADMIN_URL_PREFIX}/funds/${row.external_id}?view=setup&tab=applicants`}
          >
            View
          </FundId>
        )}
      </>
    ),
  },
  {
    title: "Eligibility",
    dataKey: "Eligibility",
    flexGrow: 0.6,
    Cell: (row: IFund) => (
      <>
        <FundId
          to={`/${ADMIN_URL_PREFIX}/funds/${row.external_id}?view=setup&tab=eligibilityCriteria`}
        >
          {row.has_eligibility_criteria ? "Edit" : "View"}
        </FundId>
      </>
    ),
  },
  {
    title: "Application Management",
    dataKey: "ApplicationManagement",
    flexGrow: 1,
    minWidth: 230,
    Cell: (row: IFund) => (
      <>
        <FundId
          to={`/${ADMIN_URL_PREFIX}/funds/${row.external_id}?view=setup&tab=applicants`}
        >
          View
        </FundId>
      </>
    ),
  },
  {
    title: "Finalize",
    dataKey: "Finalize",
    flexGrow: 0.6,
    Cell: (row: IFund) => (
      <>
        {!row.is_finalized && (
          <Finalize fundId={row.id} canBeFinalized={row.can_finalize} />
        )}
      </>
    ),
  },
  {
    title: "Fund Documents",
    dataKey: "FundDocuments",
    flexGrow: 1,
    minWidth: 200,
    Cell: (row: IFund) => (
      <>
        <FundId
          to={`/${ADMIN_URL_PREFIX}/funds/${row.external_id}?view=setup&tab=documents`}
          onClick={(e: any) => {
            e.preventDefault();
            showDocumentModal(row);
          }}
        >
          Edit
        </FundId>
      </>
    ),
  },
  {
    title: "Actions",
    dataKey: "Actions",
    flexGrow: 0.5,
    Cell: (row: IFund) => (
        <Actions
          fundId={row.id}
          fundName={row.name}
          hasEligibilityCriteria={row.has_eligibility_criteria}
          showPublishOpportunity={!row.is_published}
          showPublishInvestmentDetails={!row.publish_investment_details}
          showAcceptApplications={!row.accept_applications}
          showCloseApplications={!row.close_applications}
          showReOpenApplications={row.close_applications}
          showIndicationOfInterest={!row.open_for_indication_interest}
          closeIndicationOfInterest={row.open_for_indication_interest}
          canStartAcceptingApplications={row.can_start_accepting_applications}
        />
    )
   }
  // {
  //   title: "Fund Analytics",
  //   dataKey: "Fund Analytics",
  //   flexGrow: 1,
  //   Cell: (row: IFund) => <></>,
  // },
];

const FundsList: FunctionComponent<FundsListProps> = ({
  filterKey,
  setFinishedLoading,
}) => {
  const [editDocumentFund, setEditDocumentFund] = useState<null | IFund>(null);
  const {
    data: fundsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetFundsQuery({
    skip: false,
  });

  const [filteredFunds, setFilteredFunds] = useState<IFund[]>([]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (fundsData && size(fundsData) > 0) setFilteredFunds(fundsData);
  }, [fundsData]);

  useEffect(() => {
    if (filterKey) {
      setFilteredFunds(
        filter(
          fundsData,
          (fund) =>
            fund.name.toLowerCase().includes(filterKey.toLowerCase()) ||
            fund.partner_id.toLowerCase().includes(filterKey.toLowerCase())
        )
      );
    } else {
      if (fundsData) setFilteredFunds(fundsData);
    }
  }, [filterKey, fundsData]);

  useEffect(() => {
    if (isLoading === false && isFetching === false) {
      setFinishedLoading && setFinishedLoading();
    }
  }, [isLoading, isFetching, setFinishedLoading]);

  return (
    <Col md={12} className={"mb-3"}>
      <RsuiteTable
        height="calc(100vh - 288px)"
        allowColMinWidth={true}
        wordWrap={true}
        rowSelection={false}
        columns={getTableColumns((fund: IFund) => setEditDocumentFund(fund))}
        data={filteredFunds}
      />
      <SidecarModal
        title={`${editDocumentFund ? editDocumentFund.name : ""} Documents`}
        showModal={editDocumentFund !== null}
        handleClose={() => setEditDocumentFund(null)}
      >
        {editDocumentFund && editDocumentFund.id ? (
          <FundDocuments fund={editDocumentFund} />
        ) : (
          <></>
        )}
      </SidecarModal>
    </Col>
  );
};

export default FundsList;

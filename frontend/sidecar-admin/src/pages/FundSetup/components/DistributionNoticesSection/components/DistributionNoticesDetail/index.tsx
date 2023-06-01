import {
  TopRow as Row,
  BackButton,
  IconButton,
  ApproveButton,
  RowItem,
  Title,
  AmountCell,
  Text,
} from "./styles";
import Tooltip from "../../../../../../components/Tooltip"
import backIcon from "../../../../../../assets/images/arrow_back.svg";
import downloadIcon from "../../../../../../assets/images/download-icon.svg";
import FormattedCurrency from "../../../../../../utils/FormattedCurrency";
import RsuiteTable from "../../../../../../components/Table/RSuite";
import { getColumns, TEXT, TOOLTIP } from "./constants";
import { useMemo, useState } from "react";
import { standardizeDate } from "../../../../../../utils/dateFormatting";
import API from "../../../../../../api/backendApi";
import workflowAPI from "../../../../../../api/workflowAPI";
import { APPROVED } from "../../../../../../constants/taskStatus";
import ConfirmationModal from "./components/ConfirmationModal";
import {useAppSelector} from "../../../../../../app/hooks";
import {selectFundDetail} from "../../../../../FundDetail/selectors";
import get from "lodash/get";

const CapitalCallsDetail = ({
  goBack,
  data,
  selectedRow,
}: {
  goBack: any;
  data: any[];
  selectedRow: any;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const fundDetails = useAppSelector(selectFundDetail);

  const fundCurrencySymbol = get(fundDetails, 'currency.symbol', '$')
  const currencyDetail = get(fundDetails, 'currency')
  const { distribution_date, can_approve, document, task_id, approved_at, are_documents_generated } = selectedRow;

  const generateFooterData = (data: any[]) => {
    return {
      id: -1,
      isFooter: true,
      currency: currencyDetail,
      user: { first_name: "Total", last_name: "" },
      investments: data.reduce((total, obj) => total + (obj.investments || 0), 0),
      ownership: data.reduce((total, obj) => total + (obj.ownership || 0), 0),
      management_fees: data.reduce(
        (total, obj) => total + (obj.management_fees || 0),
        0
      ),
      organization_cost: data.reduce(
        (total, obj) => total + (obj.organization_cost || 0),
        0
      ),
      fund_expenses: data.reduce(
        (total, obj) => total + (obj.fund_expenses || 0),
        0
      ),
      total_to_date: data.reduce(
        (total, obj) => total + (obj.total_to_date || 0),
        0
      ),
      amount: data.reduce(
        (total, obj) => total + (obj.amount || 0),
        0
      ),
    };
  };

  const footerData = useMemo(() => {
    return generateFooterData(data);
  }, [data]);

  const handleConfirmApprove = async () => {
    const res ={success:false}
    if (can_approve) {
      try{
      const payload = { status: APPROVED, completed: true };
      await workflowAPI.updateTask(task_id, payload);
      res.success=true
      setConfirmed(true);

    }
    catch{
      alert('Unable to approve Capital Call')
    }
    }
    return res
  };

  const handleHide = () => {
    setShowModal(false);
  };

  if (!fundDetails) return <></>

  return (
    <div>
      <Row>
        <BackButton onClick={() => goBack()}>
          <img src={backIcon} alt="" />
          Back
        </BackButton>
        <RowItem>
          <IconButton
            variant="outline-primary"
            onClick={() =>
            document &&  API.downloadDocument(document.document_id, document.title)
            }
          >
            <img src={downloadIcon} alt="" />
            Download
          </IconButton>
          {!(approved_at || confirmed || !can_approve) && (
             <Tooltip text={TOOLTIP} enable={!are_documents_generated}>
              <span>
            <ApproveButton
              disabled={!are_documents_generated}
              onClick={() => setShowModal(true)}
              variant="primary"
            >
              Approve Distributions
            </ApproveButton>
            </span>
            </Tooltip>
          )}
        </RowItem>
      </Row>
      <Row>
        <RowItem>
          <Title>Distribution Amount</Title>
          <AmountCell>
            <FormattedCurrency
              value={data.reduce((total, obj) => total + (obj.amount || 0), 0)}
              symbol={fundCurrencySymbol}
            />
          </AmountCell>
        </RowItem>
        <RowItem>
          <Text>Distribution Date:  </Text>
          <Text style={{ color: "#607D8B" }}>{standardizeDate(distribution_date)}</Text>
        </RowItem>
      </Row>
      <RsuiteTable
        isLoading={false}
        columns={getColumns()}
        data={[...data, footerData]}
        rowSelection={false}
      />
      <ConfirmationModal
        showModal={showModal}
        handleHide={handleHide}
        handleConfirmApprove={handleConfirmApprove}
        confirmed={confirmed}
        displayText={TEXT}
      />
    </div>
  );
};

export default CapitalCallsDetail;

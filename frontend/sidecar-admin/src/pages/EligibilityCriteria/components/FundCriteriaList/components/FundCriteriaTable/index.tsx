import { FunctionComponent, useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";
import Badge from "react-bootstrap/Badge";
import _filter from "lodash/filter";
import { useAppDispatch, useAppSelector } from "../../../../../../app/hooks";
import { dateFormatter } from "../../../../../../utils/dateFormatting";
import {
  selectfetchingEligibilityCriteria,
  selectFundCriteria,
} from "../../../../selectors";
import { ADMIN_URL_PREFIX } from "../../../../../../constants/routes";
import { IEligibilityCriteria } from "../../../../../../interfaces/EligibilityCriteria/criteria";
import { getFundEligibilityCriteria } from "../../../../thunks";
import RsuiteTable from "../../../../../../components/Table/RSuite";
import { IFundBaseInfo, IFundDetail } from "../../../../../../interfaces/fundDetails";
import { stringFoundIn } from "../../../../../../utils/stringFiltering";
import Actions from "./Actions";
import { FormId } from "./styles";
import { useDeleteEligibilityCriteriaMutation } from "../../../../../../api/rtkQuery/eligibilityApi";

interface FundCriteriaTableProps {
  fund: IFundBaseInfo | IFundDetail;
  filter?: string;
}

const getTableColumns = (fund: IFundBaseInfo, handleDelete: (eligbilityCriteriaId: number) => void) => [
  {
    title: "Rule country/Region",
    dataKey: "name",
    flexGrow: 1,
    Cell: (criteria: IEligibilityCriteria) => (
      <FormId to={`/${ADMIN_URL_PREFIX}/eligibility/${criteria.id}/edit`}>
        {criteria.name}
      </FormId>
    ),
  },
  {
    title: "Status",
    dataKey: "status_name",
    flexGrow: 1,
    Cell: (criteria: IEligibilityCriteria) => (
      <Badge bg="secondary">{criteria.status_name}</Badge>
    ),
  },
  {
    title: "Last Edit",
    dataKey: "name",
    flexGrow: 1,
    Cell: (criteria: IEligibilityCriteria) => (
      <>{dateFormatter(criteria.last_modified)}</>
    ),
  },
  {
    title: "Creator",
    dataKey: "creator_name",
    flexGrow: 1,
  },
  {
    title: "Actions",
    dataKey: "name",
    flexGrow: 1,
    Cell: (criteria: IEligibilityCriteria) => (
        <Actions fund={fund} criteria={criteria} handleDelete={handleDelete} disabled={criteria.status_name === "Published"} />
      )
  },
];

const FundCriteriaTable: FunctionComponent<FundCriteriaTableProps> = ({
  fund,
  filter,
}) => {
  const [filteredCriteria, setFilteredCriteria] = useState<any[]>([]);
  const fundCriteria = useAppSelector(selectFundCriteria);
  const isFetching = useAppSelector(selectfetchingEligibilityCriteria);
  const [deleteEligbilityCriteria] = useDeleteEligibilityCriteriaMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFundEligibilityCriteria(fund.id));
  }, [dispatch, fund.id]);

  useEffect(() => {
    if (filter) {
      const criteria = fundCriteria.filter(({ creator_name, name }) =>
        stringFoundIn(filter, creator_name, name)
      );
      setFilteredCriteria(criteria);
    } else {
      setFilteredCriteria(fundCriteria);
    }
  }, [fundCriteria, filter]);

  const handleDelete = (eligbilityCriteriaId: number) => {
    deleteEligbilityCriteria({id: eligbilityCriteriaId}).then(() => {
      dispatch(getFundEligibilityCriteria(fund.id));
    })
  }


  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <p>
            This is where you can create eligibility rules for investors in
            various countries/jurisdictions. You can create rules for an
            investor coming from a particular region (ex: Europe) or an
            individual country (ex: US).{" "}
          </p>
          <p>
            Additionally, you can add criteria based on where the fund is
            domiciled. If the jurisdiction has no criteria but investors will
            still be able to invest, please select the No Local Requirement block and
            designate that jurisdiction. Investors from countries that are not
            included in a block will be deemed not eligible.{" "}
          </p>
          <p>
            When you are ready to start creating your criteria, click the
            purple create button and pick the country or countries you want to
            create the criteria for.
          </p>
        </Grid>
      </Grid>
      <RsuiteTable
        height="calc(100vh - 288px)"
        rowSelection={false}
        isLoading={isFetching}
        columns={getTableColumns(fund, handleDelete)}
        data={filteredCriteria}
      />
    </>
  );
};

export default FundCriteriaTable;

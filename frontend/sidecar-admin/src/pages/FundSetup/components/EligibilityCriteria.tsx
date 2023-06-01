import { FunctionComponent, useState, useMemo } from "react";
import get from "lodash/get";
import countBy from "lodash/countBy";
import size from "lodash/size";
import map from "lodash/map";
import Button from "react-bootstrap/Button";
import {
  APPROVED,
  PUBLISHED,
} from "../../../constants/eligibilityCriteriaStatus";
import { IEligibilityCriteria } from "../../../interfaces/EligibilityCriteria/criteria";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getFundEligibilityCriteria } from "../../EligibilityCriteria/thunks";
import { selectFundCriteria } from "../../EligibilityCriteria/selectors";
import { useBulkPublishMutation } from "../../../api/rtkQuery/fundsApi";
import FundCriteriaTable from "../../EligibilityCriteria/components/FundCriteriaList/components/FundCriteriaTable";
import CreateCriteriaButton from "../../EligibilityCriteria/components/FundCriteriaList/components/CreateCriteriaModal";
import { IFundBaseInfo } from "../../../interfaces/fundDetails";
import { HeaderWithSearch } from "../../../components/Header";
import { ContentContainer } from "../styles";

interface EligibilityCriteriaProps {
  fund: IFundBaseInfo;
}

const EligibilityCriteria: FunctionComponent<EligibilityCriteriaProps> = ({
  fund,
}) => {
  const [filter, setFilter] = useState<string>("");
  const fundCriteria = useAppSelector(selectFundCriteria);
  const [updateBulkPublish] = useBulkPublishMutation();
  const dispatch = useAppDispatch();

  const isReadyForPublish = useMemo(() => {
    const count = countBy(fundCriteria, (criteria: IEligibilityCriteria) => {
      if (criteria.status === APPROVED) return "approved";
      if (criteria.status === PUBLISHED) return "published";
    });
    const publishable = get(count, "approved", 0) + get(count, "published", 0);
    return (
      count.approved && count.approved > 0 && publishable === size(fundCriteria)
    );
  }, [fundCriteria]);

  const handlePublish = () => {
    if (size(fundCriteria) > 0) {
      const criteriaIds = map(fundCriteria, "id");
      updateBulkPublish({ criteriaIds }).then((resp: any) => {
        if (get(resp, "data.status") === "success") {
          dispatch(getFundEligibilityCriteria(fund.id));
        }
      });
    }
  };

  return (
    <ContentContainer>
      <HeaderWithSearch
        title="Eligibility Criteria"
        isSubtitle
        onSearch={setFilter}
        searchValue={filter}
      >
        <CreateCriteriaButton fund={fund} />
        {isReadyForPublish && (
          <Button variant="primary" onClick={handlePublish}>
            All eligibility flows are ready
          </Button>
        )}
      </HeaderWithSearch>
      <FundCriteriaTable fund={fund} filter={filter} />
    </ContentContainer>
  );
};

export default EligibilityCriteria;

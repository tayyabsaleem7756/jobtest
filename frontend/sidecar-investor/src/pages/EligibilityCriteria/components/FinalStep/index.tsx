import React, {FunctionComponent} from 'react';
import {useParams, useHistory} from "react-router-dom";
import {useAppSelector} from "../../../../app/hooks";
import {selectIsEligible} from "../../selectors";
import {ICriteriaBlock} from "../../../../interfaces/EligibilityCriteria/criteria";
import {IApplicationStatus} from "../../../../interfaces/application";
import {useGetApplicationStatusQuery} from "../../../../api/rtkQuery/fundsApi";
import {INVESTOR_URL_PREFIX} from '../../../../constants/routes';
import {NextButton} from './stlyes';


interface FinalStepProps {
  criteriaBlock: ICriteriaBlock;
}

const NEXT_STEP_MESSAGE = 'Thank you. Please continue to the next step to fill AML/KYC details'

const FinalStep: FunctionComponent<FinalStepProps> = ({criteriaBlock}) => {
  let {externalId} = useParams<{ externalId: string }>();
  const isEligible = useAppSelector(selectIsEligible);
  const {data: applicationStatus} = useGetApplicationStatusQuery<{ data: IApplicationStatus }>(externalId);
  const history = useHistory();

  if (isEligible) {
    return <>
      <h6
        className="mt-5 mb-4">{applicationStatus?.is_approved ? NEXT_STEP_MESSAGE : criteriaBlock.payload.need_review_text}</h6>
      {applicationStatus?.is_approved && (
        <NextButton
          variant="primary"
          onClick={() => history.push(`/${INVESTOR_URL_PREFIX}/funds/${externalId}/amlkyc`)}
        >
          Next
        </NextButton>
      )}
    </>
  }

  return <>
    <h4 className="mt-5 mb-4">Not eligible</h4>
    <p>{criteriaBlock.payload.failure_text}</p>
  </>
};

export default FinalStep;

import React, {FunctionComponent, useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {INVESTOR_URL_PREFIX} from "../../../../constants/routes";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {selectFundApplicationDetails, selectFundCriteriaResponse} from "../../selectors";
import {ICriteriaBlock} from "../../../../interfaces/EligibilityCriteria/criteria";
import DetailsForm from "../../../IndicateInterest/components/DetailsForm";
import FinalStep from "./index";
import {EligibilityInterestForm, FormContent} from "./stlyes";
import eligibilityCriteriaAPI from "../../../../api/eligibilityCriteria";
import eligibilityCriteriaApi from "../../../../api/eligibilityCriteria";
import {setInvestmentAmount} from "../../eligibilityCriteriaSlice";
import {useGetDefaultOnBoardingDetailsQuery} from "../../../../api/rtkQuery/fundsApi";
import FinalInvestmentDetail from "./FinalInvestmentDetailView";
import SideCarLoader from "../../../../components/SideCarLoader";
import get from "lodash/get";


interface IndicateInterestProps {
  criteriaBlock: ICriteriaBlock;
}

const IndicateInterest: FunctionComponent<IndicateInterestProps> = ({
  criteriaBlock,
}) => {
  const [hasSubmittedIndicateInterest, setSubmittedIndicateInterest] =
    useState(false);
  const {externalId} = useParams<{ externalId: string }>();
  const dispatch = useAppDispatch()
  const [isEligible, setIsEligible] = useState<boolean | null>(null)
  const fundCriteriaResponse = useAppSelector(selectFundCriteriaResponse)
  const fundApplication = useAppSelector(selectFundApplicationDetails)
  const {data: defaultOnBoardingDetails} = useGetDefaultOnBoardingDetailsQuery(externalId);
  const isAllocationApproved = get(defaultOnBoardingDetails, 'is_allocation_approved');
  const isAllocationLocked = get(defaultOnBoardingDetails, 'is_allocation_locked');
  const investmentDetails = get(defaultOnBoardingDetails, 'investment_details');

  const getResponseStatus = async (responseId: number) => {
    const response = await eligibilityCriteriaApi.getResponseStatus(responseId);
    setIsEligible(response?.is_eligible)
  }

  useEffect(() => {
    if (fundCriteriaResponse) {
      getResponseStatus(fundCriteriaResponse.id)
    }

  }, [fundCriteriaResponse])

  if (!fundCriteriaResponse) return <></>

  if (isEligible === null) return <SideCarLoader/>

  const submitInvestmentAmount = async (payload: any) => {
    const data = await eligibilityCriteriaAPI.createInvestmentAmount(
      fundCriteriaResponse.id,
      payload
    )
    dispatch(setInvestmentAmount(data))
    setSubmittedIndicateInterest(true)
  }

  if (!hasSubmittedIndicateInterest && (isAllocationLocked || isAllocationApproved)) {
    return <FinalInvestmentDetail
      investmentDetail={investmentDetails}
      nextFunction={async() => {
        isAllocationLocked && await eligibilityCriteriaAPI.createEligibilityCriteriaResponseReviewTask(fundCriteriaResponse.id)
        setSubmittedIndicateInterest(true)
      }}
    />
  }

  return (
    <>
      {isEligible && !hasSubmittedIndicateInterest ? (
        <EligibilityInterestForm>
            <FormContent>
            {
              fundCriteriaResponse?.offer_leverage ? "Please enter your requested equity investment amount and select a leverage option to indicate your total requested gross investment. The requested amount can be updated up until the Application Period is closed. After the Application Period is closed, requested amounts and leverage can only be decreased prior to signing the subscription documents.":
              "After the Application Period is closed, requested amounts can only be decreased prior to signing the subscription documents."
            }
            </FormContent>
            <DetailsForm
                isOnBoarding={true}
                showBasicInfoFields={false}
                callbackSubmit={(payload: any) => submitInvestmentAmount(payload)}
                investmentInfo={fundCriteriaResponse?.investment_amount}
                maxLeverage={fundApplication?.max_leverage_ratio}
                minimumInvestment={fundCriteriaResponse?.min_investment}
                offerLeverage={fundCriteriaResponse?.offer_leverage}
            />
        </EligibilityInterestForm>
      ) : (
        <>
          <FinalStep criteriaBlock={criteriaBlock} />
          <Link to={`/${INVESTOR_URL_PREFIX}/funds/${externalId}/application`} className="mb-2 btn btn-outline-primary btn-purple">Go to My Application</Link>
        </>
      )}
    </>
  );
};

export default IndicateInterest;

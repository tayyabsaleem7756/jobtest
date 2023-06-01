import {FunctionComponent} from "react";
import {ActiveApplicationCardDiv, Button, H3} from "./styles";
import {IActiveApplicationFund} from "../../interfaces/applicationStatus";
import {useHistory} from "react-router-dom";
import {getOnboardingURL} from "./utils";
import arrowRight from "../../assets/images/white-arrow-right.svg"
import toLower from "lodash/toLower";

interface ActiveApplicationCardProps {
  fundDetail: IActiveApplicationFund
}


const CONTINUE_STATUS = ['continue', 'approved']

const ActiveApplicationCard: FunctionComponent<ActiveApplicationCardProps> = (
  {
    fundDetail
  }
) => {
  const history = useHistory()

  const applicationUrl = `/investor/funds/${fundDetail.external_id}/application`

  return (
    <ActiveApplicationCardDiv>
      <div className={'fund-name'}><H3>{fundDetail.name}</H3></div>
      {toLower(fundDetail.application_status) === 'changes_requested' && <div>
        <span className={'changes-requested'}>Changes Requested</span>
      </div>}
      <div className={'lower-div'}>
        <div className={'info-div'}>
          {fundDetail.focus_region && <p className={'m-0'}>{fundDetail.focus_region}</p>}
          {fundDetail.type && <p className={'m-0'}>{fundDetail.type}</p>}
          {fundDetail.risk_profile && <p className={'m-0'}>{fundDetail.risk_profile}</p>}
        </div>
        <div className={'button-div'}>
          <Button
            onClick={() => history.push(applicationUrl)}
          >
            View application <img src={arrowRight} className={'ms-2'}/>
          </Button>
        </div>
      </div>
    </ActiveApplicationCardDiv>
  );
};

export default ActiveApplicationCard;

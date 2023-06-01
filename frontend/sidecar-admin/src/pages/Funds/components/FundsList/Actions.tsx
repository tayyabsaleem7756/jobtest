import { FunctionComponent, useState } from "react";
import get from "lodash/get";
import styled from "styled-components";
import MenuIcon from "@material-ui/icons/MoreVert";
import Popover from "@material-ui/core/Popover";
import ConfirmationModal from "./ConfirmationModal";
import {
  Link,
  MenuIconWrapper,
} from "../../../FundSetup/components/ApplicantsList/styles";
import { useUpdateFundStatusMutation } from "../../../../api/rtkQuery/fundsApi";

const AppLink = styled(Link)`
  width: 208px;
  color: #444 !important;
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  border-bottom: 1px dashed;
  &.disabled {
    color: #aaa !important;
    cursor: not-allowed;
  }
`;

interface IActions {
  fundId: number;
  fundName: string;
  showPublishOpportunity: boolean;
  showPublishInvestmentDetails: boolean;
  showAcceptApplications: boolean;
  hasEligibilityCriteria: boolean;
  showCloseApplications: boolean;
  showReOpenApplications: boolean;
  showIndicationOfInterest: boolean;
  closeIndicationOfInterest: boolean;
  canStartAcceptingApplications: boolean;
}

enum IActionTypes {
  PublishIndicationOfInterest = "open_for_indication_interest",
  CloseIndicationOfInterest = "close_for_indication_interest",
  PublishOpportunity = "is_published",
  AcceptApplications = "accept_applications",
  PublishInvestmentDetails = "publish_investment_details",
  CloseApplications = "close_applications",
  reOpenApplications = "re_open_applications"
}

const modalsConfig = {
  [IActionTypes.PublishIndicationOfInterest]: {
    title: "Publish Indication of Interest",
    getMsg: (fundName = "") =>
      `Sidecar will allow people with access to ${fundName} to indicate their interest in investing in ${fundName} in the future.  Once people have submit their indication an admin can download data on all of the people who have indicated interest so far.`,
  },
  [IActionTypes.CloseIndicationOfInterest]: {
    title: "Close For Indication of Interest",
    getMsg: (fundName = "") =>
      `Sidecar will close ${fundName} for indication of interest`,
  },
  [IActionTypes.PublishOpportunity]: {
    title: "Publish Opportunity",
    getMsg: (fundName = "") =>
      `Sidecar will show information for ${fundName} on the investor home page as a new opportunity. Once it is published investors will see the overview of the investment and can visit it’s fund page.`,
  },
  [IActionTypes.PublishInvestmentDetails]: {
    title: "Publish Investment Details",
    getMsg: (fundName = "") =>
      `Sidecar will hold all data regarding investments for ${fundName} until it is published. Once it is published investors will see their investment details, once published a fund can not be unpublished.`,
  },
  [IActionTypes.AcceptApplications]: {
    title: "Accept Applications",
    getMsg: (fundName = "") =>
      `Sidecar will allow investors to begin the on-boarding process for ${fundName}.`,
  },
  [IActionTypes.CloseApplications]: {
    title: "Close Applications",
    getMsg: (fundName = "") =>
      `Sidecar will stop accepting applications for ${fundName}.`,
  },
  [IActionTypes.reOpenApplications]: {
    title: "Accept Applications",
    getMsg: (fundName = "") =>
      `Sidecar will start accepting applications for ${fundName}.`,
  },
};

const Actions: FunctionComponent<IActions> = ({
  fundId,
  fundName,
  hasEligibilityCriteria,
  showPublishOpportunity,
  showPublishInvestmentDetails,
  showAcceptApplications,
  showCloseApplications,
  showReOpenApplications,
  showIndicationOfInterest,
  closeIndicationOfInterest,
  canStartAcceptingApplications,
}) => {
  const [activeModal, setActiveModal] = useState<null | IActionTypes>(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [updateFundStatus] = useUpdateFundStatusMutation()

  const handleClick = (event: any) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = (actionKey: IActionTypes) => {
    if(![IActionTypes.reOpenApplications, IActionTypes.CloseIndicationOfInterest].includes(actionKey)){
      updateFundStatus({fundId, [actionKey]: true })
      .then(() => {
        setActiveModal(null);
      })
      .catch((e) => {
        setActiveModal(null);
      });
    }
    else if(actionKey === IActionTypes.CloseIndicationOfInterest){
      updateFundStatus({fundId, [IActionTypes.PublishIndicationOfInterest]: false })
      .then(() => {
        setActiveModal(null);
      })
      .catch((e) => {
        setActiveModal(null);
      });
    }
    else {
      updateFundStatus({fundId, [IActionTypes.CloseApplications]: false })
      .then(() => {
        setActiveModal(null);
      })
      .catch((e) => {
        setActiveModal(null);
      });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      {(showPublishOpportunity ||  showPublishInvestmentDetails ||  showAcceptApplications || showCloseApplications || showReOpenApplications || showIndicationOfInterest) && (
        <MenuIconWrapper onClick={handleClick}>
          <MenuIcon />
        </MenuIconWrapper>
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {
          showIndicationOfInterest && <AppLink
          to="/"
          onClick={(e: any) => {
            e.preventDefault();
            setActiveModal(IActionTypes.PublishIndicationOfInterest);
            handleClose();
          }}
        >
          {modalsConfig[IActionTypes.PublishIndicationOfInterest].title}
        </AppLink>
        }
        {
          closeIndicationOfInterest && <AppLink
          to="/"
          onClick={(e: any) => {
            e.preventDefault();
            setActiveModal(IActionTypes.CloseIndicationOfInterest);
            handleClose();
          }}
        >
          {modalsConfig[IActionTypes.CloseIndicationOfInterest].title}
        </AppLink>
        }
        {showPublishInvestmentDetails && (
          <AppLink
            to="/"
            onClick={(e: any) => {
              e.preventDefault();
              setActiveModal(IActionTypes.PublishInvestmentDetails);
              handleClose();
            }}
          >
            {modalsConfig[IActionTypes.PublishInvestmentDetails].title}
          </AppLink>
        )}
        {showPublishOpportunity && (
          <AppLink
            to="/"
            onClick={(e: any) => {
              e.preventDefault();
              setActiveModal(IActionTypes.PublishOpportunity);
              handleClose();
            }}
          >
            {modalsConfig[IActionTypes.PublishOpportunity].title}
          </AppLink>
        )}
        {showAcceptApplications && (
          <AppLink
            to="/"
            className={!canStartAcceptingApplications ? "disabled" : ""}
            onClick={(e: any) => {
              e.preventDefault();
              handleClose();
              if(canStartAcceptingApplications)
                setActiveModal(IActionTypes.AcceptApplications);
            }}
          >
            {modalsConfig[IActionTypes.AcceptApplications].title}
          </AppLink>
        )}
        {
          showCloseApplications && (
            <AppLink
            to="/"
            className={showAcceptApplications ? "disabled" : ""}
            onClick={(e: any) => {
              e.preventDefault();
              handleClose();
              if(hasEligibilityCriteria)
                setActiveModal(IActionTypes.CloseApplications);
            }}
          >
            {modalsConfig[IActionTypes.CloseApplications].title}
          </AppLink>
          )
        }
        {
          showReOpenApplications && (
            <AppLink
            to="/"
            onClick={(e: any) => {
              e.preventDefault();
              handleClose();
              if(hasEligibilityCriteria)
                setActiveModal(IActionTypes.reOpenApplications);
            }}
          >
            {modalsConfig[IActionTypes.reOpenApplications].title}
          </AppLink>
          )
        }
      </Popover>
      <ConfirmationModal
        title={get(modalsConfig, `${activeModal}.title`, "")}
        showModal={activeModal !== null}
        handleClose={() => setActiveModal(null)}
        handleSubmit={() => (activeModal ? handleSubmit(activeModal) : "")}
      >
        {activeModal && <>{modalsConfig[activeModal].getMsg(fundName)}</>}
      </ConfirmationModal>
    </div>
  );
};

export default Actions;

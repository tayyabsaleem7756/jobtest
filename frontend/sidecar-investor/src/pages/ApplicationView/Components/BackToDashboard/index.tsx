import React, {FunctionComponent} from "react";
import arrowLeft from "../../../../assets/images/arrow-left-icon.svg"
import {BackLink} from "./styles";
import {useHistory} from "react-router";


interface BackToDashboardProps {
}

const BackToDashboard: FunctionComponent<BackToDashboardProps> = () => {
  const history = useHistory()

  const onClick = () => history.push('/investor/start')

  return (
    <BackLink onClick={onClick}>

      <img src={arrowLeft}/>
      Back to Dashboard
    </BackLink>
  );
};

export default BackToDashboard;

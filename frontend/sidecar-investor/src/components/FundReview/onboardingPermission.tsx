import React, { FunctionComponent } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { IApplicationStatus } from "../../interfaces/application";
import { useGetApplicationStatusQuery } from "../../api/rtkQuery/fundsApi";
import ConfirmationComponent from "./Confirmation";

interface IConfirmation {
    redirectUrl: string;
    callbackSubmitPOA?: () => void;
}


export const hasOnBoardingPermission = (Content: React.ComponentType) => {

    const Confirmation: FunctionComponent<IConfirmation> = ({ redirectUrl, ...restProp }) => {
        let { externalId } = useParams<{ externalId: string }>();
        const { data: applicationStatus } = useGetApplicationStatusQuery<{ data: IApplicationStatus }>(externalId);
        const history = useHistory();
        const isAppoved = applicationStatus?.is_approved;

        if(!applicationStatus)
            return (<></>)
        if(isAppoved)
            return (<Content {...restProp} />);

        return (<ConfirmationComponent  showNext={isAppoved} handleClickNext={() => history.push(redirectUrl)}  />);
    };

    return Confirmation;
}



export const hasKycPermission = (Content: React.ComponentType) => {

    const Confirmation: FunctionComponent<IConfirmation> = ({ redirectUrl }) => {
        let { externalId } = useParams<{ externalId: string }>();
        const { data: applicationStatus } = useGetApplicationStatusQuery<{ data: IApplicationStatus }>(externalId);
        const history = useHistory();
        const isAppoved = applicationStatus?.is_aml_kyc_approved && applicationStatus?.is_tax_info_submitted && applicationStatus?.is_payment_info_submitted;
        if(!applicationStatus)
            return (<></>)
        if(isAppoved)
            return (<Content />);

        return (<ConfirmationComponent  showNext={isAppoved} handleClickNext={() => history.push(redirectUrl)}  />);
    };

    return Confirmation;
}


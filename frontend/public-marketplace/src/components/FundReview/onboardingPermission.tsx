/* eslint-disable import/prefer-default-export */
import React, { FunctionComponent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IApplicationStatus } from 'interfaces/common/applicationStatus'
import { useGetApplicationStatusQuery } from 'api/rtkQuery/fundsApi'
import Loader from 'components/Loader'
import ConfirmationComponent from "./Confirmation";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IConfirmation {
	redirectUrl: string;
	// callbackSubmitPOA?: () => void;
}

export const hasOnBoardingPermission = (Content: React.ComponentType) => {
	const Confirmation: FunctionComponent<IConfirmation> = ({
																														redirectUrl, ...restProp
	}) => {
		const { externalId } = useParams<{ externalId: string }>()
		const { data: applicationStatus } = useGetApplicationStatusQuery<{
			data: IApplicationStatus
		}>(externalId)
		const navigate = useNavigate()
		const { company } =useParams()
		const isAppoved = applicationStatus?.is_approved

		if (!applicationStatus) return <Loader />
		if (isAppoved) return <Content {...restProp} />

		return (<ConfirmationComponent  showNext={isAppoved} handleClickNext={() => navigate('/'+company+redirectUrl)}  />);
	}

	return Confirmation
}


export const hasKycPermission = (Content: React.ComponentType) => {

	const Confirmation: FunctionComponent<IConfirmation> = ({redirectUrl}) => {
		let { externalId } = useParams<{ externalId: string }>();
		const { data: applicationStatus } = useGetApplicationStatusQuery<{ data: IApplicationStatus }>(externalId);
		const history = useNavigate();
		const { company } =useParams()
		const isAppoved = applicationStatus?.is_aml_kyc_approved && applicationStatus?.is_tax_info_submitted && applicationStatus?.is_payment_info_submitted;
		if(!applicationStatus)
			return (<></>)
		if(isAppoved)
			return (<Content />);

		return (<ConfirmationComponent  showNext={isAppoved} handleClickNext={() => history('/'+company+redirectUrl)}  />);
	};

	return Confirmation;
}

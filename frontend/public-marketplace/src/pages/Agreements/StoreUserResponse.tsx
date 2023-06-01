import React, {FunctionComponent, useEffect} from 'react';
import {useNavigate, useParams} from "react-router-dom";

import API from "../../api/marketplaceApi";
import Container from "react-bootstrap/Container";
import SideCarLoader from "../../components/SideCarLoader";
import Logo from "../../components/Logo";
import {useGetFundDetailsQuery} from "../../api/rtkQuery/fundsApi";
import { PageWrapper } from 'components/Page';
import { logMixPanelEvent } from 'utils/mixpanel';
import { get } from 'lodash';


interface StoreUserResponseProps {
}


const StoreUserResponse: FunctionComponent<StoreUserResponseProps> = () => {
  const {envelopeId, externalId, company} = useParams<{ envelopeId: string, externalId: string, company: string }>();
  const history = useNavigate();
  const {data: fundDetails} = useGetFundDetailsQuery(externalId);


  const storeUserResponse = async () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const event = urlParams.get("event");
    if (envelopeId && event === "signing_complete") {
      await API.storeUserResponse(envelopeId)
      history(`/${company}/funds/${externalId}/agreements`);
      logMixPanelEvent('Signed agreement document', get(fundDetails, 'company.name'), get(fundDetails, 'company.slug'))
    }
  }

  useEffect(() => {
    storeUserResponse()
  }, [])

  return <PageWrapper> <Container className={'mt-5 ps-5 pe-5'}>
    <Logo size="md" suffixText={fundDetails?.name} />
    <h4 className={'mt-3'}>Please wait while we store your response</h4>
    <SideCarLoader/>
  </Container>
  </PageWrapper>
};

export default StoreUserResponse;

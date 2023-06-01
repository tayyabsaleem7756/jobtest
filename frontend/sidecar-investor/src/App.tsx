import React, {useEffect, useState} from 'react';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import mixpanel from 'mixpanel-browser';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import {INVESTOR_URL_PREFIX} from "./constants/routes";
import InvestorOwnership from "./pages/InvestorOwnership";
import NavBar from "./components/Navbar";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import FundInvestorDetail from "./pages/FundInvestorDetail";
import RequestAllocationPage from "./pages/RequestAllocation";
import {ThemeProvider} from 'styled-components';
import {defaultTheme} from "./theme";
import SignedOut from "./pages/SignedOut";
import {useAppDispatch, useAppSelector} from "./app/hooks";
import {fetchUserInfo} from "./pages/User/thunks";
import {selectUserInfo} from "./pages/User/selectors";
import {ISelectOptionNumValue} from "./interfaces/form";
import {SHOW_UNPUBLISHED_FUNDS, VIEW_AS_USER_HEADER} from "./constants/headers";
import MobileUserSelector from "./components/CompanyUserSelector/MobileUserSelector";
import Opportunities from "./pages/Opportunities";
import FundProfile from "./pages/FundProfile";
import IndicateInterest from "./pages/IndicateInterest";
import KnowYourCustomer from "./pages/KnowYourCustomer";
import TaxForms from "./pages/TaxForms";
import BankDetailsForm from "./pages/BankDetailsForm";
import AgreementsPage from "./pages/Agreements/index";
import FundDocuments from "./pages/FundDocuments";
import ApplicationView from "./pages/ApplicationView";
import EligibilityCriteriaPage from "./pages/EligibilityCriteria";
import StartPage from "./pages/StartPage";
import * as Sentry from '@sentry/react';
import ScreenError from "./components/ScreenError";
import StoreUserResponse from "./pages/Agreements/StoreUserResponse";
import InitiateWitnessSigning from "./pages/Agreements/components/Witness/InitiateSigning";
import StoreWitnessResponse from "./pages/Agreements/components/Witness/StoreResponse";
import ProgramDoc from "./pages/ProgramDoc";
import StoreDocuSignResp from './pages/ProgramDoc/StoreDocuSignResp';
import IndicationOfInterest from './pages/IndicationOfInterest';
import { logMixPanelEvent } from './utils/mixpanel';
import { get } from 'lodash';


function App() {
  const history = useHistory();
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [viewAs, setViewAs] = useState<ISelectOptionNumValue | null>(null)
  const [showUnPublished, setShowUnPublished] = useState<boolean>(false)
  const {getAccessTokenSilently, isLoading, isAuthenticated} = useAuth0();

  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch()

  // TODO: Find better approach for this
  const updateAxiosToken = async (retry: boolean) => {
    try {
      const token = await getAccessTokenSilently();
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setAccessToken(token);
    } catch (e) {
      console.log(e)
      if (retry) {
        setTimeout(() => updateAxiosToken(false), 3000)
      }
    }
  }

  useEffect(() => {
    updateAxiosToken(true);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    updateAxiosToken(true);
    if(process.env.REACT_APP_MIX_PANEL_API_KEY)
      mixpanel.init(process.env.REACT_APP_MIX_PANEL_API_KEY, {debug: true});
    return () => {
      localStorage.removeItem('userInfo')
    }
  }, []);

  useEffect(() => {
    if(userInfo) localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    if (accessToken) {
      dispatch(fetchUserInfo());
    }

  }, [accessToken, dispatch])

  useEffect(() => {
    history.listen(() => logMixPanelEvent(window.location.pathname));
    logMixPanelEvent(window.location.pathname);
  }, [history]);

  useEffect(() => {
    if (userInfo) {
      const isNewlogin = localStorage.getItem('newLogin');
      if(isNewlogin){
        mixpanel.identify(get(userInfo, 'email'));
        logMixPanelEvent('New login');
        localStorage.removeItem('newLogin');
      }
    }
  }, [userInfo]);
  


  const handleViewAsChange = async (selectedOption: ISelectOptionNumValue | null) => {
    axios.defaults.headers.common[VIEW_AS_USER_HEADER] = selectedOption ? selectedOption.value : null;
    setViewAs(selectedOption)
  }

  const handleShowUnpublishedChange = async (showUnpublishedFunds: boolean) => {
    axios.defaults.headers.common[SHOW_UNPUBLISHED_FUNDS] = showUnpublishedFunds;
    setShowUnPublished(showUnpublishedFunds)
  }

  if (!isLoading && !isAuthenticated) return <ThemeProvider theme={defaultTheme}>
    <NavBar
      onViewAsChange={handleViewAsChange}
      viewAs={null}
      showUnPublished={false}
      setShowUnPublished={handleShowUnpublishedChange}
    />
    <Sentry.ErrorBoundary fallback={ScreenError}>
      <Switch>
        <Route path={`/${INVESTOR_URL_PREFIX}/witness/:uuid/sign/:envelopeId`} exact
               component={InitiateWitnessSigning}/>
        <Route path={`/${INVESTOR_URL_PREFIX}/witness/:uuid/submit/:envelopeId`} exact
               component={StoreWitnessResponse}/>
        <Route component={SignedOut}/>
      </Switch>
    </Sentry.ErrorBoundary>
  </ThemeProvider>
  if (!accessToken || !userInfo) return <></>
  return (
    <>
      <ThemeProvider theme={defaultTheme}>
        <NavBar
          onViewAsChange={handleViewAsChange}
          viewAs={viewAs}
          showUnPublished={showUnPublished}
          setShowUnPublished={handleShowUnpublishedChange}
        />

        <MobileUserSelector
          onChange={handleViewAsChange}
          viewAs={viewAs}
          showUnPublished={showUnPublished}
          setShowUnPublished={handleShowUnpublishedChange}
        />
        <Sentry.ErrorBoundary fallback={ScreenError}>
          <Switch>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/witness/:uuid/sign/:envelopeId`} exact
                   component={InitiateWitnessSigning}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/witness/:uuid/submit/:envelopeId`} exact
                   component={StoreWitnessResponse}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/invest`} exact
                            component={RequestAllocationPage}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/ownership`} exact component={InvestorOwnership}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/:companySlug/opportunities`} exact
                            component={Opportunities}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/detail`} exact
                            component={FundInvestorDetail}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/onboarding`} exact
                            component={EligibilityCriteriaPage}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/profile`} exact component={FundProfile}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/interest`} exact
                            component={IndicateInterest}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/amlkyc`} exact component={KnowYourCustomer}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/tax`} exact component={TaxForms}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/application`} exact
                            component={ApplicationView}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/bank_details`} exact
                            component={BankDetailsForm}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/program_doc`} exact
                            component={ProgramDoc}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/review_docs`} exact
                            component={FundDocuments}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/agreements`} exact
                            component={AgreementsPage}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/user-agreement/:envelopeId`} exact
                            component={StoreUserResponse}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:fundSlug/program_doc/:envelopeId/:viewType`} exact
                            component={StoreDocuSignResp}/>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/start`} exact component={StartPage}/>
            <ProtectedRoute path="/" exact> <Redirect to={`/${INVESTOR_URL_PREFIX}/start`}/> </ProtectedRoute>
            <ProtectedRoute path={`/${INVESTOR_URL_PREFIX}/funds/:externalId/indication_of_interest`} 
                            exact component={IndicationOfInterest}/>
          </Switch>
        </Sentry.ErrorBoundary>
      </ThemeProvider>
    </>
  )
}

export default App;

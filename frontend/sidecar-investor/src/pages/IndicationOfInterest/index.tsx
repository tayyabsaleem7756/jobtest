import { get } from "lodash";
import React, { useEffect } from "react";
import API from "../../api/backendApi";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ContactInfo from "../../components/Contact";
import LoggedInFooter from "../../components/Footer";
import CompanyLogo from "../../components/Logo";
import IndicationOfInterestForm from "./Components/IndicationOfInterestForm";
import IndicationOfInterestHeader from "./Components/IndicationOfInterestHeader";
import IndicationOfInterestSuccess from "./Components/IndicationOfIntrestSuccess";
import { selectFundDetails } from "./selectors";
import { IndicateInterestContainer, LogoImg } from "./styles";
import { fetchFundProfile } from "./thunks";
import { INVESTOR_URL_PREFIX } from "../../constants/routes";
import HeaderBreadCrumbs from "../../components/BreadCrumbs";
import { Wrapper } from "../../components/StartPage/styles";
import SideCarLoader from "../../components/SideCarLoader";

const IndicationOfInterest = () => {
  const { externalId } = useParams<{ externalId: string }>();
  const fundDetails = useAppSelector(selectFundDetails);
  const dispatch = useAppDispatch();

  const isInterestIndicated = get(fundDetails, "indicated_interest", false);

  const crumbsItems: any = [
    {name: 'Opportunities', href: `/${INVESTOR_URL_PREFIX}/opportunities`, active: false},
    {name: get(fundDetails, 'name'), href: `/${INVESTOR_URL_PREFIX}/funds/${get(fundDetails, 'external_id')}/profile`, active: false},
    {name: 'Indicate Interest', href: null, active: true},
  ]

  useEffect(() => {
    if (externalId) {
      dispatch(fetchFundProfile(externalId));
    }
  }, [dispatch, externalId]);

  const onSubmit = async (response: any) => {
    await API.createFundIndicationOfInterest(externalId, response);
    dispatch(fetchFundProfile(externalId));
  };

  
  let logo = get(fundDetails, "logo")
  if (!logo) {
    logo = get(fundDetails, "company.logo")
  }

  if (!fundDetails) {
    return (
      <>
        <Wrapper fluid hasLoader={true}>
          <SideCarLoader />
        </Wrapper>
        <LoggedInFooter />
      </>
    )
  }
  console.log("fund detail is fund", fundDetails)
  return (
    <IndicateInterestContainer fluid>
      <HeaderBreadCrumbs items={crumbsItems}/>
      <LogoImg
        src={logo}
        alt={get(fundDetails, "name")}
      />
      {!isInterestIndicated ? (
        <>
          <IndicationOfInterestHeader
            fundName={get(fundDetails, "name", "")}
            investmentPeriod={get(fundDetails, "investment_period", undefined)}
          />
          <IndicationOfInterestForm
            minimumInvestment={fundDetails?.minimum_investment}
            currencySymbol={get(fundDetails, "currency.symbol", "$")}
            currencyCode={get(fundDetails, "currency.code", "$")}
            handleSubmit={onSubmit}
          />
        </>
      ) : (
        <IndicationOfInterestSuccess />
      )}
      <ContactInfo email={get(fundDetails, 'company.company_profile.contact_email', '')} whiteBg/>
      <LoggedInFooter />
    </IndicateInterestContainer>
  );
};

export default IndicationOfInterest;

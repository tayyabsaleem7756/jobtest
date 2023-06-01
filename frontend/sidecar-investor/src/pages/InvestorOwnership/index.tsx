import React, {FunctionComponent, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {USER_GUIDE} from "../../constants/urlHashes";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {selectUserInfo} from "../../pages/User/selectors";
import {fetchInvestor} from "./thunks";
import {selectInvestorOwnership} from "./selectors";
import {setInvestor} from "./investorOwnershipSlice";
import {createTotalRow} from "./components/InvestedFunds/computations";
import TopDashboard from "./components/TopDashboard";
import {LoggedInFooter} from "../../components/Footer";
import NoDataToast from "../../components/NoDataToast";
import TableTabsView from "./components/TabsView";
import useScreenWidth from "../../hooks/useScreenWidth";
import DesktopViewTables from "./components/DesktopViewTables";
import WelcomeModal from "../../components/WelcomeCarousel/WelcomeModal";
import API from "../../api"


interface InvestorOwnershipProps {
  isLegacy: boolean
}


const InvestorOwnership: FunctionComponent<InvestorOwnershipProps> = () => {
  const investorOwnership = useAppSelector(selectInvestorOwnership);
  const userInfo = useAppSelector(selectUserInfo);
  const dispatch = useAppDispatch();
  const {isSmall} = useScreenWidth();
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchInvestor());
    return () => {
      dispatch(setInvestor(null));
    }
  }, [dispatch])

  useEffect(() => {
    if (userInfo && !userInfo.first_login_at) {
      API.registerFirstLogin();
    }
  }, [userInfo])

  if (!investorOwnership) return <></>
  const investedFunds = investorOwnership.invested_funds;
  console.log({investedFunds});
  const isLegacy = false;
  const totalRow = createTotalRow(investedFunds, isLegacy);

  const hasHelpLocation = location.hash === USER_GUIDE;
  const isFirstLogin = userInfo && !userInfo.first_login_at;
  const showWelcomeModal = isFirstLogin || hasHelpLocation;

  return <>
    {showWelcomeModal && <WelcomeModal/>}
    {!investorOwnership.has_data && <NoDataToast/>}
    <TopDashboard totalRow={totalRow} hasData={investorOwnership.has_data}/>

    {isSmall ? <TableTabsView/> : <DesktopViewTables/>}
    <LoggedInFooter/>
  </>
};

export default InvestorOwnership;

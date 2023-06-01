import {FunctionComponent, useEffect, useState} from 'react';
import {Tab, Tabs} from "react-bootstrap";
import {SetupContainer} from "./styles";
import EligibilityCriteria from './components/EligibilityCriteria';
import FundSetupContent from './components/FundSetup';
import Applicants from './components/Applicants';
import {IFundBaseInfo} from "../../interfaces/fundDetails";
import {TABS} from "./constants";
import {useSelector} from 'react-redux';
import {selectAllTasks} from '../Tasks/selectors';
import {ITaskDetail} from '../../interfaces/Workflow/task';
import {resetFundSetup} from "./fundSetupSlice";
import {useAppDispatch} from "../../app/hooks";
import CapitalCallsSection from './components/CapitalCallsSection';
import DistributionNoticesSection from './components/DistributionNoticesSection';

interface FundDemandProps {
  fund: IFundBaseInfo,
  task?: ITaskDetail | null
}


const FundSetup: FunctionComponent<FundDemandProps> = ({ fund, task }) => {
  const [tab, setTab] = useState<string | null>(null);
  const dispatch = useAppDispatch()
  const tasks = useSelector(selectAllTasks)


  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const paramsTab = searchParams.get('tab');
    const paramstabOption = Object.values(TABS).find(v => v === paramsTab);
    if (!tab) {
      setTab(paramstabOption || TABS.FUND_SETUP);
    } else if(tab && task){
      setTab(paramstabOption || TABS.APPLICANTS_MANAGEMENT);
    }
     else if (paramstabOption !== tab) {
      searchParams.set('tab', tab);
      window.history.replaceState({}, '', `?${searchParams.toString()}`);
    }
  }, [tab])

  useEffect(() => {
    return () => {
      dispatch(resetFundSetup())
    }
  }, [])

  if (!tab) return null;

  return <SetupContainer fluid>
    <Tabs id="fund-setup-tab" onSelect={setTab} activeKey={tab}>
      <Tab eventKey={TABS.FUND_SETUP} title="Fund Setup" className="create-form-tab">
        <FundSetupContent fund={fund} />
      </Tab>
      <Tab eventKey={TABS.ELIGIBILITY_CRITERIA} title="Eligibility Criteria" className="create-form-tab">
        {tab === TABS.ELIGIBILITY_CRITERIA && (<EligibilityCriteria fund={fund} />)}
      </Tab>
      <Tab eventKey={TABS.APPLICANTS_MANAGEMENT} title="Applicant Management" className="create-form-tab">
        {tab === TABS.APPLICANTS_MANAGEMENT && (<Applicants fund={fund} task={task}/>)}
      </Tab>
      <Tab eventKey={TABS.CAPITAL_CALLS} title="Capital Calls" className="create-form-tab" >
          {tab === TABS.CAPITAL_CALLS && <CapitalCallsSection />}
        </Tab>
        <Tab eventKey={TABS.DISTRIBUTION_NOTICES} title="Distribution Notices" className="create-form-tab" >
          {tab === TABS.DISTRIBUTION_NOTICES && <DistributionNoticesSection />}
        </Tab>
    </Tabs>
  </SetupContainer>
};

export default FundSetup;

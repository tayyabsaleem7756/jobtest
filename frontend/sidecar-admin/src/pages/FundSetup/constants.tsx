import find from "lodash/find";

export const TABS = {
  FUND_SETUP: 'fundSetup',
  INDICATION_OF_INTEREST: 'indicationOfInterest',
  ELIGIBILITY_CRITERIA: 'eligibilityCriteria',
  ACTIVITY_LOG: 'activityLog',
  APPLICANTS_MANAGEMENT: 'applicants',
  CAPITAL_CALLS: 'capitalCalls',
  DISTRIBUTION_NOTICES:'distributionNotices'
}

export const LEVERAGE_OPTIONS = [
  { value: "", label: 'Not Started' },
  { value: '0:1', label: 'None' },
  { value: '2:1', label: '2:1' },
  { value: '3:1', label: '3:1' },
  { value: '4:1', label: '4:1' },
]

export const getLeverageOptionLabel = (value: string) => {
  try{
    const option = find(LEVERAGE_OPTIONS, (option: any) => option.value === value);
    return option ? option.label : 'Not Started';  
  }catch(e){
    console.log(e);
    return 'Not Started';  
  }
  
}

export const initFilter = {
  keyword: "",
  officeLocation: "",
  jobBandLevel: "",
  department: "",
  region: "",
  applicationApproval: "",
};

export const APPLICATIONS_NOT_REMOVABLE_MESSAGE = 'Only Applications that are not started or not eligible can be removed'
import get from "lodash/get";
import includes from "lodash/includes";
import { IOpportunity } from "../../pages/Opportunities/interfaces";
import NameLogo from "./NameLogo";
import {ComingSoon, PillAbsoluteLink} from "./styles";

const getHost = () => {
  return `${window.location.protocol}//${window.location.host}`
}

export const getOnboardingURL = (link: string) => {
  const params = new URL(link);
  return get(params, 'pathname', link);
}

const getOnboardingLinkTitle = (link: string) => {
  const title = includes(link, "/onboarding") ? "Apply Now" : "Continue";
  return title;
}


const cellRenderer = (row: IOpportunity, key: keyof IOpportunity) => {
  if (row && row[key]) return row[key];
  return "";
};

const isShowActionLink = (row: any) => {
  if(row.accept_applications && !row.close_applications && !row.is_application_started){
    return true
  }
  else if(row.accept_applications && row.close_applications && row.is_application_started){
    return true
  }
  else if(row.accept_applications && !row.close_applications && row.is_application_started){
    return true
  }
  return false
}

export const Columns = [
  {
    title: "Fund",
    dataKey: "name",
    flexGrow: 2,
    Cell:(row: IOpportunity) =><NameLogo logo={row.company_logo} name={row.name}/>
  },
  { title: "Region/Country", dataKey: "focus_region", flexGrow: 1, minWidth: 100, },
  {
    title: "Type",
    dataKey: "type",
    flexGrow: 1.2,
    Cell: (row: IOpportunity) => cellRenderer(row, "type"),
  },
  {
    title: "Risk Profile",
    dataKey: "risk_profile",
    flexGrow:1,
    Cell: (row: IOpportunity) => cellRenderer(row, "risk_profile"),
  },
  {
    title: "Application Period",
    dataKey: "investment_period",
    flexGrow: 1,
    Cell: (row: IOpportunity) => cellRenderer(row, "investment_period"),
  },
  {
    title: "",
    dataKey: "action",
    fixed: "right",
    width: 160,
    Cell: (row: any) => {
      let onboarding_link = row.application_link
      let title = getOnboardingLinkTitle(row.application_link)
      if (row.external_onboarding_url != null) {
        onboarding_link = row.external_onboarding_url
        title = "Apply now"
      }
      console.log(onboarding_link)
      return (
        <>
          {isShowActionLink(row) ? (
            <PillAbsoluteLink
              data-apply-link={onboarding_link}
              onClick={()=>window.open(onboarding_link)}
            >
              {title}
            </PillAbsoluteLink>
          ): <>
          {
            row.open_for_indication_interest ?  
            <PillAbsoluteLink
            data-apply-link={`${getHost()}/investor/funds/${row.external_id}/indication_of_interest`}
            onClick={()=>window.open(`${getHost()}/investor/funds/${row.external_id}/indication_of_interest`)}
          >
            Indicate Interest
          </PillAbsoluteLink>: <ComingSoon>Coming Soon</ComingSoon>
          }
          </>}
        </>
      );
    },
  },
];
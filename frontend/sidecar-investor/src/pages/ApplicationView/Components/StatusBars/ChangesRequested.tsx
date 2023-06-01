import React, {FunctionComponent} from "react";
import flagIcon from "../../../../assets/images/flag.svg"
import {ChangesRequestedDiv} from "./styles";

import toLower from "lodash/toLower";
import replace from "lodash/replace";
import get from "lodash/get";
import {Link as ReactScrollLink} from "react-scroll/modules";

const getSectionId = (label: string) => {
  return toLower(replace(label, /\s/g, "_"));
}

export const moduleToSectionNameMapping = {
  eligibility: getSectionId('Eligibility Criteria'),
  taxReview: getSectionId('Tax Forms'),
  kyc_aml: getSectionId('Personal information'),
  legalDocs: getSectionId('Fund Documents'),
  internal_tax: getSectionId('Fund Documents'),
}


interface ChangesRequestedProps {
  changesRequestedModule: string
  getCommentCountData:any

}

const ChangesRequested: FunctionComponent<ChangesRequestedProps> = ({changesRequestedModule,getCommentCountData}) => {

  // const goToSection = get(moduleToSectionNameMapping, changesRequestedModule)
  const {countData,sequence}=getCommentCountData()
  const module = sequence.find((elem:string)=>countData[elem]>0) || sequence[0]

  return (
    <ChangesRequestedDiv>
      <div className={'left-div'}>
        <div className={'label'}>Application Status:</div>
        <div className={'value'}>Changes requested</div>
      </div>
      <div>
        <ReactScrollLink to={getSectionId(module)}>
          <div className={'action'}>
            See what needs your input
            <img src={flagIcon}/>
          </div>
        </ReactScrollLink>
      </div>
    </ChangesRequestedDiv>
  );
};

export default ChangesRequested;

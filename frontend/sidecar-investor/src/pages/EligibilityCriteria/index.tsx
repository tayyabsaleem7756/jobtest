import {FunctionComponent, useEffect, useState} from 'react';
import {useParams, useLocation} from "react-router-dom";
import API from '../../api/backendApi'
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {getFundCriteriaResponseDocuments, getFundCriteriaResponseStatus} from "./thunks";
import {ActiveBlockContainer, PreviewContainer, LogoBlock} from "./styles";
import {
  selectFundCriteriaPreview,
  selectFundCriteriaResponse,
  selectIsEligible,
  selectRequiredDocuments} from "./selectors";
import { useGetFundDetailsQuery } from "../../api/rtkQuery/fundsApi";
import eligibilityCriteriaAPI from "../../api/eligibilityCriteria";
import PreviewBlock from "./components/PreviewBlock";
import Button from "react-bootstrap/Button";
import eligibilityCriteriaApi from "../../api/eligibilityCriteria";
import PreviewModeCountrySelector from "./components/CountryInvestorSelector/PreviewMode";
import {resetToDefault, setIsLoading} from "./eligibilityCriteriaSlice"
import getFundDetails from "../../components/EligibilityCriteria/FundDetails";
import LogoLasalle from "../../components/Logo";
import { getEligibilityCriteriaResponse } from "./thunks";
import { MODIFY_ELIGBILITY } from "../../constants/urlHashes";
import { find, get } from 'lodash';
import { logMixPanelEvent } from '../../utils/mixpanel';

interface EligibilityCriteriaPreviewPageProps {

}


const EligibilityCriteriaPage: FunctionComponent<EligibilityCriteriaPreviewPageProps> = () => {
  let {externalId} = useParams<{ externalId: string }>();
  const location = useLocation();
  const [currentPosition, setCurrentPosition] = useState(0)
  const [currentBlock, setCurentBlock] = useState<any>(null)
  const [previousBlocks, setPreviousBlocks] = useState<any>([])
  const dispatch = useAppDispatch()
  const {data: fundDetails} = useGetFundDetailsQuery(externalId);
  const fundCriteriaPreview = useAppSelector(selectFundCriteriaPreview);
  const requiredDocuments = useAppSelector(selectRequiredDocuments)
  const fundCriteriaResponse = useAppSelector(selectFundCriteriaResponse)
  const isEligible = useAppSelector(selectIsEligible);
  const isModify = location.hash === MODIFY_ELIGBILITY;
  const is_smart_criteria = get(fundCriteriaPreview, 'is_smart_criteria')


  const updatePositionOnApi = (position: number) => {
    if(fundCriteriaResponse && currentBlock?.is_user_documents_step){
      const payload = {last_position: position}
      fundCriteriaResponse && eligibilityCriteriaApi.updateCriteriaResponse(fundCriteriaResponse.id, payload)
    }
  }

  const getValidBlock = (block: any) => {
    const finalStep = fundCriteriaPreview?.criteria_blocks.find(block => block.is_final_step);
    const userDocumentStep = fundCriteriaPreview?.criteria_blocks.find(block => block.is_user_documents_step);
    if(!is_smart_criteria){
      if(currentBlock.is_user_documents_step){
        return finalStep
      }
      else if(block.is_final_step && isEligible && requiredDocuments.length > 0){
        return userDocumentStep
      }
    }
    if(block){
      if(!block.is_user_documents_step){
        return block
      }
      else if(block.is_user_documents_step && isEligible && requiredDocuments.length > 0){
        return block
      }
      else if(block.is_user_documents_step && !isEligible){
        return finalStep
      }
      else {
        return finalStep
      }
    }
    else {
      return finalStep
    }

  }

  
  useEffect(() => {
    if (fundCriteriaResponse) {
      dispatch(setIsLoading(true));
      Promise.all([
        dispatch(getFundCriteriaResponseDocuments(fundCriteriaResponse.id)),
        dispatch(getFundCriteriaResponseStatus(fundCriteriaResponse.id))
      ]).then(() => {
        dispatch(setIsLoading(false));
      }).catch(() => {
        dispatch(setIsLoading(false));
      })
    }
  }, [fundCriteriaResponse]);

  useEffect(() => {
    if(!currentBlock || currentBlock?.is_country_selector){
      fetchNextBlock()
    }
  }, [fundCriteriaResponse])

  useEffect(() => {
    return () => {
      dispatch(resetToDefault())
    }
  }, [])

  const fetchNextBlock = async () => {
    const blockId = fundCriteriaResponse?.user_block_responses.length === 1 ?
            fundCriteriaResponse?.user_block_responses[0].block_id : fundCriteriaResponse?.last_position
      if(blockId){
        const nextBlock = await API.fetchCriteriaBlock(blockId, 'next', externalId)
        setCurentBlock(nextBlock);
      }
  }


  useEffect(() => {
    if(!isModify)
      dispatch(getEligibilityCriteriaResponse(externalId));
  }, [])

  if (!fundCriteriaResponse || !fundCriteriaPreview || currentBlock?.is_country_selector) return <><PreviewModeCountrySelector
    externalId={externalId}/></>


  const goBack = async () => {
    let previousBlock: any = await API.fetchCriteriaBlock(currentBlock.id, 'previous', externalId)
    const finalStep = fundCriteriaPreview.criteria_blocks.find(block => block.is_final_step);
    const userDocumentStep = fundCriteriaPreview.criteria_blocks.find(block => block.is_user_documents_step);
    if(is_smart_criteria){
      if((previousBlock.is_user_documents_step && !isEligible ) 
        || (previousBlock.is_user_documents_step && isEligible && requiredDocuments.length === 0)){
      previousBlock = await API.fetchCriteriaBlock(previousBlock.id, 'previous', externalId)
      setCurentBlock(previousBlock)
    }else {
      setCurentBlock(previousBlock)
    }
    }
    else {
      if(currentBlock.is_final_step && isEligible && requiredDocuments.length > 0){
        setCurentBlock(userDocumentStep)
      }
      else if(currentBlock.is_user_documents_step){
        previousBlock = await API.fetchCriteriaBlock(finalStep?.id, 'previous', externalId)
        setCurentBlock(previousBlock)
      }
      else if ((previousBlock.is_user_documents_step && isEligible && requiredDocuments.length === 0) || 
      (previousBlock.is_user_documents_step && !isEligible) ) {
        previousBlock = await API.fetchCriteriaBlock(previousBlock.id, 'previous', externalId)
        setCurentBlock(previousBlock)
      }
      else {
        setCurentBlock(previousBlock)
      }
    }
    logMixPanelEvent('Onboarding previous step', get(fundDetails, 'company.name'), get(fundDetails, 'company.slug'))
  }

  const goForward = async () => {
    let nextBlock = null;
    let validBlock = null;
    try{
      nextBlock = await API.fetchCriteriaBlock(currentBlock.id, 'next', externalId)
      validBlock = getValidBlock(nextBlock)
    }
    catch {
      validBlock = getValidBlock(nextBlock)
    }
    if(validBlock){
      setCurentBlock(validBlock)
      setPreviousBlocks([...previousBlocks, currentBlock])
      updatePositionOnApi(currentBlock.id)
      logMixPanelEvent('Onboarding next step', get(fundDetails, 'company.name'), get(fundDetails, 'company.slug'))
  }
}

  if (!currentBlock) return <></>

  return <PreviewContainer fluid>
    <LogoBlock><LogoLasalle size="md" suffixText={fundDetails?.name}/></LogoBlock>
    <ActiveBlockContainer>
      <Button variant="outline-primary btn-back" className="mb-2" onClick={goBack}>Back</Button>
      <PreviewBlock nextFunction={goForward} criteriaBlock={currentBlock} />
    </ActiveBlockContainer>
  </PreviewContainer>
};

export default getFundDetails(EligibilityCriteriaPage);

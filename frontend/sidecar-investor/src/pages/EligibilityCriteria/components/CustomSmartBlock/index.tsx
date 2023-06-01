import {FunctionComponent, useMemo} from 'react';
import find from "lodash/find";
import map from "lodash/map";
import get from "lodash/get";
import size from "lodash/size";
import omit from "lodash/omit";
import isUndefined from 'lodash/isUndefined';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {ICriteriaBlock} from "../../../../interfaces/EligibilityCriteria/criteria";
import {IEligibilityCriteriaResponse} from "../../../../interfaces/EligibilityCriteria/criteriaResponse";
import eligibilityCriteriaAPI from "../../../../api/eligibilityCriteria";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {selectFundCriteriaPreview, selectIsLoading} from "../../selectors";
import {setIsLoading, updateResponseBlock} from "../../eligibilityCriteriaSlice";
import {getCriteriaBlockAnswer} from "../../utils/getCriteriaBlockAnswer";

interface ICustomSmartBlockProps {
  criteriaBlock: ICriteriaBlock,
  fundCriteriaResponse: null | IEligibilityCriteriaResponse, 
  nextFunction: () => void;
}

const CustomSmartBlock: FunctionComponent<ICustomSmartBlockProps> = ({criteriaBlock, fundCriteriaResponse, nextFunction}) => {
  const fundCriteriaPreview = useAppSelector(selectFundCriteriaPreview);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);

  const selectedAnswer = getCriteriaBlockAnswer(criteriaBlock, fundCriteriaResponse)
  const answerPayload = selectedAnswer ? selectedAnswer.response_json : {};
  const isMultipleSelectionEnabled = get(criteriaBlock, 'custom_block.is_multiple_selection_enabled', false);
  const answerValue = selectedAnswer?.response_json.value;
  
  const getDetails = (key: string) => {
    return get(criteriaBlock, `custom_block.${key}`);
  }

  const blockKey = getDetails("id");

  const isChecked = (fieldId: number) => {
    return get(answerPayload, `${fieldId}`, false);
  }

  const updateAnswer = async (value: boolean, optionIdx: number, optionId: number) => {
    if(!fundCriteriaPreview) return;
    const selectedOption = get(getDetails('custom_fields'), `${optionIdx}`);
    let responseJson = {};
    if(isMultipleSelectionEnabled){
      const jsonPayload = omit(answerPayload, 'value');
      responseJson = {
        ...jsonPayload,
        [selectedOption.id]: value,
        [`${selectedOption.id}_option`]: selectedOption
      }
    }
    else {
      responseJson = {
        value: optionId,
        [`${selectedOption.id}_option`]: selectedOption
      }
    }
    const payload = {
      block_id: criteriaBlock.id,
      response_json: responseJson,
      eligibility_criteria_id: fundCriteriaPreview.id
    }
    dispatch(setIsLoading(true));
    const responseData = await eligibilityCriteriaAPI.createUpdateResponseBlock(payload)
    dispatch(updateResponseBlock(responseData))
    dispatch(setIsLoading(false));
  }
  
  const canMoveForward = useMemo(() => {
    const selectedField = find(getDetails('custom_fields'), (option: any) => {
      return answerPayload[option.id];
    });
    if(isMultipleSelectionEnabled) return !isUndefined(selectedField) && !isLoading;
    else return answerValue && !isLoading;
  }, [answerPayload, isLoading]);
  
  if (!fundCriteriaPreview) return <></>

  return <div>
    <h4 className="mt-5 mb-4">{getDetails('title')}</h4>
    {getDetails('description') && <p className="mt-0">{getDetails('description')}</p>}
    {(getDetails('is_multiple_selection_enabled') === true && size(getDetails('custom_fields')) > 1) && (
      <p className="mt-0">Please select all that apply.</p>
    )}
    <div key={`inline-radio`} className="mb-4 custom-radio-buttons">
      {map(getDetails('custom_fields'), (option: any, idx: number) => {
        return <div key={`custom-block-option-${idx}`}>
          <Form.Check
            className={'mb-2'}
            onClick={(e: any) => updateAnswer(!isChecked(option.id), idx, option.id)}
            inline
            type={isMultipleSelectionEnabled ? 'checkbox' : 'radio'}
            label={`${option.title}`}
            name={blockKey}
            value={option.title}
            checked={isMultipleSelectionEnabled ? isChecked(option.id) : answerValue === option.id}
            id={`accredited-${idx}`}
          />
        </div>
      })}
    </div>
    <Button onClick={nextFunction} disabled={!canMoveForward}>Next</Button>
  </div>
};

export default CustomSmartBlock;

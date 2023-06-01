import { FunctionComponent, useEffect, useMemo } from 'react';
import map from 'lodash/map';
import get from 'lodash/get';
import find from 'lodash/find';
import size from 'lodash/size';
import isUndefined from 'lodash/isUndefined';
import Form from 'react-bootstrap/Form';
import { ICriteriaBlock } from '../../../../interfaces/EligibilityCriteria/criteria';
import Button from 'react-bootstrap/Button';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { selectAnswers, selectFundCriteriaPreview } from '../../selectors';
import {
  setAnswer,
  setUserFilesText,
  setLogicFlowValues,
  setSelectedOption,
  resetUserFilesText
} from '../../eligibilityCriteriaPreviewSlice';
import { has } from 'lodash';

interface ICustomSmartBlockProps {
  criteriaBlock: ICriteriaBlock;
  nextFunction: () => void;
}

const CustomSmartBlock: FunctionComponent<ICustomSmartBlockProps> = ({
  criteriaBlock,
  nextFunction,
}) => {
  const answers = useAppSelector(selectAnswers);
  const fundCriteriaPreview = useAppSelector(selectFundCriteriaPreview);
  const dispatch = useAppDispatch();
  const isMultipleSelectionEnabled = get(criteriaBlock, 'custom_block.is_multiple_selection_enabled', false);

  const getDetails = (key: string) => {
    return get(criteriaBlock, `custom_block.${key}`);
  };
  console.log({ criteriaBlock });

  const blockKey = getDetails('id');
  const answerKey = `${blockKey}-${criteriaBlock.id}`;

  const getFieldId = (fieldId: number) => `${answerKey}-${fieldId}`;

  const isChecked = (fieldId: number) => {
    const fieldKey = getFieldId(fieldId);
    return !isUndefined(answers[fieldKey]);
  };

  const isRadioChecked = (optionId: number) => {
    return !isUndefined(answerKey) && answers[answerKey] === optionId;
  }

  const updateAnswer = (value: number, index: number) => {
    const fieldId = getFieldId(index);
    const selectedOption = find(
      getDetails('custom_fields'),
      (field) => field.id === value
    );
    const fileUploadText = get(
      selectedOption,
      'required_documents.description',
      get(selectedOption, 'required_documents.title')
    );
    const requireFiles = has(get(selectedOption, 'required_documents'), 'title');
    const payload = { [fieldId]: isChecked(index) ? undefined : value };
    dispatch(setAnswer(payload));
    !isChecked(index) && dispatch(setSelectedOption({[criteriaBlock.id]: { ...selectedOption, isSmartBlock: true }}));
    if(requireFiles){
      dispatch(
        setUserFilesText({ [answerKey]: isChecked(index) ? null : fileUploadText })
      );
    }
    else {
      dispatch(resetUserFilesText(criteriaBlock.id));
    }
  };

  const updateRadioAnswer = (value: string) => {
    const selectedOption = find(
      getDetails('custom_fields'),
      (field) => field.id === value
    );
    const fileUploadText = get(
      selectedOption,
      'required_documents.description',
      get(selectedOption, 'required_documents.title')
    );
    const requireFiles = has(get(selectedOption, 'required_documents'), 'title');
    const payload = {[answerKey]: value}
    dispatch(setAnswer(payload))
    dispatch(setSelectedOption({[criteriaBlock.id]: selectedOption}))
    if(requireFiles){
      dispatch(setUserFilesText({[answerKey]: fileUploadText}))
    }
    else {
      dispatch(resetUserFilesText(criteriaBlock.id));
    }
  }

  useEffect(() => {
    const ineligibleField = find(
      getDetails('custom_fields'),
      (option: any, idx: number) => {
        if(isMultipleSelectionEnabled){
          if (isChecked(idx)) return !get(option, 'marks_as_eligible', false);
        }
        else {
          if (isRadioChecked(option.id)) return !get(option, 'marks_as_eligible', false);
        } 
      }
    );
    dispatch(
      setLogicFlowValues({ [criteriaBlock.id]: ineligibleField ? false : true })
    );
  }, [answers, criteriaBlock]);

  const canMoveForward = useMemo(() => {
    if(isMultipleSelectionEnabled){
      const valueSelected = find(
        getDetails('custom_fields'),
        (option: any, idx: number) => {
          if (isChecked(idx)) return true;
        }
      );
      return valueSelected;
    }
    else {
      return answers[answerKey]
    }
  }, [answers, criteriaBlock]);

  if (!fundCriteriaPreview) return <></>;

  return (
    <div>
      <h4 className='mt-5 mb-4'>{getDetails('title')}</h4>

      <p className='mt-0'>{getDetails('description')}</p>
      {(getDetails('is_multiple_selection_enabled') === true && size(getDetails('custom_fields')) > 1) && (
        <p className='mt-0'>Please select all that apply.</p>
      )}
      <div key={`inline-radio`} className='mb-4 custom-radio-buttons'>
        {map(getDetails('custom_fields'), (option: any, idx: number) => {
          return (
            <div key={`custom-block-option-${idx}`}>
              {
                isMultipleSelectionEnabled ? <Form.Check
                className={'mb-2'}
                onClick={(e: any) => updateAnswer(option.id, idx)}
                inline
                label={option.title}
                name={`${blockKey}-${idx}`}
                value={option.title}
                checked={isChecked(idx)}
                id={`accredited-${idx}`}
              /> : <Form.Check
              className={'mb-2'}
              onClick={(e: any) => updateRadioAnswer(option.id)}
              inline
              type='radio'
              label={option.title}
              name={`${blockKey}-${idx}`}
              value={option.title}
              checked={isRadioChecked(option.id)}
              id={`accredited-${idx}`}
            />
              }
            </div>
          );
        })}
      </div>
      <Button onClick={nextFunction} disabled={!canMoveForward}>
        Next
      </Button>
    </div>
  );
};

export default CustomSmartBlock;

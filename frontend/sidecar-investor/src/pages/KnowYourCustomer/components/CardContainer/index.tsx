import React, { FunctionComponent, useEffect } from 'react';
import uniqBy from "lodash/uniqBy";
import get from "lodash/get";
import AutoSave from '../AutoSave';
import { FormValues, DispatchStatus } from '../../interfaces';
import { Field, FieldProps, Formik, FormikHelpers, FormikValues, FormikProps, useFormikContext } from 'formik';
import { Comment, Schema } from '../../../../interfaces/workflows';
import { getAnswerInputComponent, getIsFieldEnabled, handleValidation } from '../../utils';
import CommentWrapper from "../../../../components/CommentWrapper";

interface CardProps {
  schema: Schema;
  onSubmit?: (values: FormikValues, helpers: FormikHelpers<FormValues>) => Promise<void>;
  initialValues: FormikValues;
  ignoreRequired?: boolean;
  disableAutosave?: boolean;
  isParticipant?: boolean;
  recordId: number;
  onStatusChange?: DispatchStatus;
  innerRef?: React.MutableRefObject<{ [key: string]: FormikProps<FormikValues> }>;
  recordComments?: {
    [key: string]: Comment[];
  };
}

const CardContainer: FunctionComponent<CardProps> = ({ schema, onSubmit, initialValues, disableAutosave, recordId, isParticipant, onStatusChange, innerRef, recordComments }) => {
  const onValidate = (values: FormikValues) => handleValidation(values, schema);

  const atSubmit = async (values: FormikValues, helpers: FormikHelpers<FormValues>) => {
    onSubmit && await onSubmit(values, helpers);
  };

  const getComments = (question: any) => {
    const questionId = `participant_${recordId || ""}_${question.id}.`;
    const comments = uniqBy(get(recordComments, questionId), 'id');
    return comments;
  }

  return <Formik
    initialValues={initialValues}
    validate={onValidate}
    onSubmit={atSubmit}
    enableReinitialize={true}
    validateOnMount={false}
    innerRef={ref => (innerRef !== undefined && ref !== null) ? innerRef.current[recordId] = ref : undefined}
  >
    {(formikProps: FormikValues) => {
      return <div >
        {!disableAutosave && <AutoSave />}
        {(isParticipant && onStatusChange) && <CardStatus onStatusChange={onStatusChange} participantId={recordId} />}
        {schema.map(question => {
          const isFieldEnabled = getIsFieldEnabled(formikProps.values, question.field_dependencies);
          if (!isFieldEnabled) return null;
          const AnswerInput = getAnswerInputComponent(question);
          const comments = getComments(question);
          
          return <Field key={question.id}>
            {(_: FieldProps) => (
              <>
                <AnswerInput key={question.id} question={question} />
                {comments?.map((comment) => <CommentWrapper key={comment.id} comment={comment} />)}
              </>
            )}
          </Field>
        })}
      </div>
    }}
  </Formik>
}

const CardStatus = ({ onStatusChange, participantId }: { onStatusChange: DispatchStatus, participantId: number }) => {
  const { errors, dirty, isValidating, isSubmitting } = useFormikContext();

  useEffect(() => {
    const hasErrors = Object.keys(errors).length > 0;
    const newStatus = { dirty, hasErrors, isValidating, isSubmitting }
    onStatusChange({ newStatus, participantId });
  }, [onStatusChange, participantId, errors, dirty, isValidating, isSubmitting]);

  return null;
}

export default CardContainer;
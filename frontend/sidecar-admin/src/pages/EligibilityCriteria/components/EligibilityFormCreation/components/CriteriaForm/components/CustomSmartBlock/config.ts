import * as Yup from "yup";

export const reviewTypeOptions = [
  { label: 'Knowledgeable', value: 'Knowledgeable Employee Eligibility Reviewer' },
  { label: 'Financial', value: 'Financial Eligibility Reviewer' },
  { label: 'No Review Required', value: 'No Review Required' },
];

export enum Field {
  TITLE = "title",
  DESCRIPTION = "description",
  DOC_TITLE = "title",
  DOCUMENTS = "documents",
  SUPPORTING_DOC = "supporting_document",
  SUPPORTING_DOC_NAME = "supporting_document_name",
  SUPPORTING_DOC_DESC = "supporting_document_desc",
  IS_ELIGIBLE = "marks_as_eligible",
  REVIEW_TYPE = "reviewers_required",
  IS_MULTIPLE_SELECTION_ENABLED = "is_multiple_selection_enabled"
}

export const initDocField = {
  [Field.DOC_TITLE]: "",
  [Field.SUPPORTING_DOC]: false,
  [Field.SUPPORTING_DOC_NAME]: "",
  [Field.SUPPORTING_DOC_DESC]: "",
  [Field.IS_ELIGIBLE]: true,
  [Field.REVIEW_TYPE]: []
}

export const initStates = {
  [Field.TITLE]: "",
  [Field.DOCUMENTS]: [],
};

export const VALIDATION_SCHEMA_DOCUMENT = Yup.object({
  [Field.DOC_TITLE]: Yup.string().required("Required"),
  // [Field.SUPPORTING_DOC]: Yup.boolean(),
  [Field.SUPPORTING_DOC_NAME]: Yup.string().when([Field.SUPPORTING_DOC], {
    is: (value: any) => value,
    then: Yup.string().required("Required"),
  }),
  [Field.SUPPORTING_DOC_DESC]: Yup.string().when([Field.SUPPORTING_DOC], {
    is: (value: any) => value,
    then: Yup.string().required("Required"),
  }),
  [Field.IS_ELIGIBLE]: Yup.boolean(),
  [Field.REVIEW_TYPE]: Yup.array().when([Field.IS_ELIGIBLE], {
    is: (value: any) => value,
    then: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Required"),
        value: Yup.string().required("Required"),
      })
    ).min(1, 'Required'),
  }),
})


export const VALIDATION_SCHEMA = Yup.object({
  [Field.TITLE]: Yup.string().required("Required"),
});

export const DUPLICATE_TITLE_ERROR = 'The fields eligibility_criteria, title must make a unique set.'

export const ERRORS: {[key: string]: string} = {
  [DUPLICATE_TITLE_ERROR]: 'Custom smart block with this title already exists',
  default: 'Unable to create the custom smart block'
}
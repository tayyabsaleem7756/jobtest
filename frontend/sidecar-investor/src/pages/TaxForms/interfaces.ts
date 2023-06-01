import { AnswerTypes, Question } from "../../interfaces/workflows";
import { GeoSelector } from "../../interfaces/TaxModule/regionCountries";

export type FieldComponent = {
  question: Question<AnswerTypes>;
}

export interface Params {
  externalId: string
}
export interface TaxState {
  taxForms: any,
  taxDocumentsList: any,
  appRecords: any,
  checkedForms: any,
  geoSelector: GeoSelector[],
  signUrl: {[key: string]: string},
  hasFetchedAppRecords: boolean,
  taxDocumentsListExist: boolean, 
  taxFormsAdmin: any,
  taxFormsLinks: LinkByTaxForm,
  taxDetails: any
}

export interface Link {
  status: string,
  envelope_id: string,
  documentName: string
  disabled: boolean,
  isCreatingEnvelop: boolean;
  checked: boolean,
  document_id: string,
  record_id: number,
  inputType: string
  helpUrl: string | null
}

export interface LinkByTaxForm {
  [key: string]: Link
}
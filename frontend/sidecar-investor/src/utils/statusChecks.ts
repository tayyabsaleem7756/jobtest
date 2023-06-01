import {IApplicationStatus} from "../interfaces/application";

export const canMovePastReviewDocs = (applicationStatus: IApplicationStatus) => {
  return applicationStatus?.is_aml_kyc_approved && applicationStatus?.is_tax_info_submitted && applicationStatus?.is_payment_info_submitted;
}
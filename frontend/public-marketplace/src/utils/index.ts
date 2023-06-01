import { IApplicationStatus } from 'interfaces/application'
import moment from 'moment'

export const getDateFromString = (dt: string) => {
	if (!dt) return null
	try {
		return moment(dt).toDate()
	} catch (e) {
		return null
	}
}

export const canMovePastReviewDocs = (applicationStatus: IApplicationStatus) =>
	applicationStatus?.is_aml_kyc_approved &&
	applicationStatus?.is_tax_info_submitted &&
	applicationStatus?.is_payment_info_submitted

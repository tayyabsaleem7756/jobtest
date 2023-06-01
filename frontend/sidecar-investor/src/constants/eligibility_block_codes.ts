export const US_ACCREDITED_INVESTOR = 'US-AI'
export const APPROVAL_CHECKBOXES = 'AC'
export const KNOWLEDGEABLE_EMPLOYEE = 'KE'
export const KEY_INVESTMENT_INFORMATION = 'KII'
export const AU_WHOLESALE_CLIENT = 'AU-WC'
export const AU_SOPHISTICATED_INVESTOR = 'AU-SI'
export const AU_PROFESSIONAL_INVESTOR_BLOCKS = 'AU-PI'
export const SG_ACCREDITED_INVESTOR = 'SG-AI'
export const SG_INVESTMENT_PROFESSIONAL = 'SG-IP'
export const SG_QUALIFYING_PERSON = 'SG-QP'
export const CN_LEGITIMATE_ASSETS = 'CN-LOA'
export const CN_TAX_FILINGS_ID = 'CN-TF'
export const JP_ELIGIBLE_ENTITY = 'JP-EE'
export const KR_REVERSE_INQUIRY = 'KR-RI'
export const FILLING_ACKNOWLEDGEMENT_ID = 'KR-FA'
export const HK_ELIGIBILITY_BLOCK = 'HK-EB'
export const QUALIFIED_PURCHASER_BLOCK_ID = 'US-QP'


export const GENERIC_BLOCK_CODES = [
  AU_WHOLESALE_CLIENT,
  AU_PROFESSIONAL_INVESTOR_BLOCKS,
  AU_SOPHISTICATED_INVESTOR,
  SG_ACCREDITED_INVESTOR,
  SG_QUALIFYING_PERSON,
  CN_LEGITIMATE_ASSETS,
  CN_TAX_FILINGS_ID,
  JP_ELIGIBLE_ENTITY,
  FILLING_ACKNOWLEDGEMENT_ID,
  QUALIFIED_PURCHASER_BLOCK_ID
]

export const PREVIEW_GENERIC_BLOCK_CODE = [
  ...GENERIC_BLOCK_CODES,
  KNOWLEDGEABLE_EMPLOYEE,
  HK_ELIGIBILITY_BLOCK
]

export const CHECKBOX_BLOCKS = [
  SG_INVESTMENT_PROFESSIONAL
]
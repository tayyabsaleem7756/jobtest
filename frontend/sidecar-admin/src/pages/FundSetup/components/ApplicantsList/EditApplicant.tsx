import {memo, FC, useMemo, useEffect, useState} from "react";
import {Formik, FormikHelpers} from "formik";
import * as Yup from "yup";
import get from "lodash/get";
import first from "lodash/first";
import split from "lodash/split";
import map from "lodash/map";
import size from "lodash/size";
import each from "lodash/each";
import compact from "lodash/compact";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import isString from "lodash/isString";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {FormTextFieldRow} from "../../../../components/Form/TextField";
import {FormTextAreaRow} from "../../../../components/Form/TextArea";
import {FormSelectorFieldRow} from "../../../../components/Form/SelectorField";
import {JOB_BANDS} from "../../../EligibilityCriteriaPreview/components/CountrySelector/constants";
import RadioField, {
  ISelectOption,
} from "../../../../components/Form/RadioField";
import CurrencyField from "../../../../components/Form/CurrencyField";
import ApplicantPill from "./ApplicantPill";
import {LEVERAGE_OPTIONS} from "../../constants";
import {
  EditApplicantWrapper,
  EditApplicantFooter,
  PaginationIcon,
  ButtonWrapper, EditApplicantStatusCol,
} from "./styles";
import {
  useUpdateApplicantMutation,
  useUpdateApplicationVehicleAndShareClassMutation,
  useUpdateKYCRecordMutation,
  useUpdateInvestorCodeMutation,
} from "../../../../api/rtkQuery/kycApi";
import {IBaseApplication} from "../../../../interfaces/application";
import {useAppDispatch, useAppSelector} from "../../../../app/hooks";
import {selectVehicles} from "../../selectors";
import {useGetVehiclesQuery} from "../../../../api/rtkQuery/fundsApi";
import {useParams} from "react-router-dom";
import NotificationModal from "./NotificationModal";
import {fetchVehicles} from "../../thunks";
import {IStatus} from "./constants";
import {selectFundDetail} from "../../../FundDetail/selectors";
import _ from "lodash";

const INITIAL_VALUES = {
  email_address: "",
  first_name: "",
  last_name: "",
  eligibility_decision: "",
  job_band: "",
  requested_leverage: "",
  max_leverage: "",
  final_leverage: "",
  requested_entity: "",
  final_entity: null,
  final_total_investment: "",
  applicationApproval: "",
  kryc_aml: "",
  legalDocs: "",
  taxReview: "",
  internal_tax: "",
  internal_comment: "",
  notify_investor: "",
  investor_account_code: "",
  vehicle: 0,
  share_class: 0
};

const VALIDATION_SCHEMA = Yup.object({
  final_total_investment: Yup.number()
    .typeError("Value should be a number.")
    .required("Required"),
  final_entity: Yup.number()
    .typeError("Value should be a number.")
    .required("Required"),
  requested_leverage: Yup.mixed().required("Required").nullable(),
  final_leverage_ratio: Yup.mixed().required("Required").nullable(),
});

const getRatio = (values: any, key: string) => {
  const data = get(values, `${key}.value`, get(values, key, null));
  const val = first(split(data, ":"));
  return isNaN(parseInt(`${val}`)) ? 0 : Number(val);
};

export interface IEditApplicant {
  data: IBaseApplication,
  paginationFooter: any,
  callbackSaveEditApplicant: any,
  handleClose: any,
  handleFullApplication?: any,
  handlePrev: any,
  handleNext: any,
}

interface IFormData extends IBaseApplication {
  final_entity?: null | number;
  final_leverage_ratio?:  null | string;
  vehicle?: number;
  investor_account_code?: string;
  eligibility_decision?: string;
}

const EditApplicant: FC<IEditApplicant> = ({
  data,
  paginationFooter,
  callbackSaveEditApplicant,
  handleClose,
  handleFullApplication,
  handlePrev,
  handleNext,
}) => {
  const {externalId} = useParams<{ externalId: string }>();
  const dispatch = useAppDispatch();
  const finalEntity=get(data, 'investment_detail.final_entity')
  const formData: IFormData  = {
    ...data,
    ...get(data, 'investment_detail'),
    share_class: get(data, 'share_class.id', INITIAL_VALUES.share_class),
    vehicle: get(data, 'vehicle.id', INITIAL_VALUES.vehicle),
    final_entity: !!finalEntity ? finalEntity.toFixed(2): finalEntity,
    eligibility_decision: get(data, 'eligibility_decision')
  };
  const [updateApplicantMutation] = useUpdateApplicantMutation();
  const [updateKYCMutation] = useUpdateKYCRecordMutation();
  const [updateInvestorCode] = useUpdateInvestorCodeMutation();
  const [updateApplicationVehicleAndShareClassMutation] = useUpdateApplicationVehicleAndShareClassMutation();
  const { data: vehiclesAPIData } = useGetVehiclesQuery(externalId, {
    skip: !externalId,
  });
  const vehicles = useAppSelector(selectVehicles);
  const [isShowNotificationModal, setIshowNotificationModal] = useState(false);
  const [comment, setComment] = useState('')
  const fundDetails = useAppSelector(selectFundDetail);

  useEffect(() => {
    dispatch(fetchVehicles())
  }, [])

  const getTotalInvestment = (data: {final_entity?:  null | number, final_leverage_ratio?: null | string}) => {
    const finalAmount = parseFloat(`${get(data, "final_entity")}`);
    const finalLeverageRatio = getRatio(data, "final_leverage_ratio");
    if(_.isNaN(finalAmount)) return 0
    return parseFloat((finalAmount + finalAmount * finalLeverageRatio).toFixed(6));
  }

  const getFinalLeverage = (data: {final_entity?:  null | number, final_leverage_ratio?:   null | string}) => {
    const finalAmount = parseFloat(`${get(data, "final_entity")}`);
    const finalLeverageRatio = getRatio(data, "final_leverage_ratio");
    if(_.isNaN(finalAmount)) return 0
   return parseFloat((finalAmount * finalLeverageRatio).toFixed(6));
  }

  const requireNotification = (values: any) => {
    let finalLeverageRatio = get(values, 'final_leverage_ratio.value')
    const finalEntity = `${get(values, 'final_entity')}`
    if (finalLeverageRatio === undefined) {
      finalLeverageRatio = get(values, 'final_leverage_ratio')
    }
    return finalEntity !== `${get(formData, 'final_entity')}` || finalLeverageRatio !== get(formData, 'final_leverage_ratio')
  }


  const onSubmit = (values: any, { setSubmitting, setFieldError }: FormikHelpers<any>) => {
    setSubmitting(true);
    const vehicle = get(values, 'vehicle')
    const shareClass = get(values, 'share_class')

    const kycPayload = {
      recordId: get(data, 'kyc_record'),
      workflowSlug: get(data, 'kyc_wf_slug'),
      job_band: get(values, "job_band"),
    }

    const applicationVehicleAndClassPayload = {
      vehicle: vehicle ? vehicle : null,
      share_class: shareClass ? shareClass : null,
      comment: comment,
      application_id: data.id,
      max_leverage: getRatio(values, "max_leverage"),
      restricted_geographic_area: get(values, 'restricted_geographic_area', ''),
      restricted_time_period: get(values, 'restricted_time_period', '')
    }

    const investorCodePayload = {
      applicationId: data.id,
      investor_account_code: get(values, "investor_account_code", ""),
    }

    let payload: any = {
      job_band: get(values, "job_band"),
      final_amount: parseFloat(`${get(values, "final_entity")}`),
      final_leverage_ratio: getRatio(values, "final_leverage_ratio"),
      id: get(values, "investment_detail.id"),
      internal_comment: get(values, "internal_comment", ""),
      notify_investor: Boolean(get(values, "notify_investor", false)),
    };
    if (data.has_custom_leverage) {
      payload['final_leverage'] = get(values, "final_leverage_amount")
    }

    if (data.has_custom_total_investment) {
      payload['total_investment'] = get(values, "final_total_investment")
    }

    const promises = [
      updateApplicantMutation(payload),
      updateInvestorCode(investorCodePayload),
      updateApplicationVehicleAndShareClassMutation(
        applicationVehicleAndClassPayload
      ),
    ];
    if(kycPayload.recordId) promises.push(updateKYCMutation(kycPayload))
    Promise.all(promises)
      .then((resp: any) => {
        const errors = compact(map(resp, 'error.data'));
        if (size(errors) > 0) {
          setSubmitting(false);
          each(errors, (error, key) => {
            if(typeof error !== "object") return ;
            each(error, (errorMsg, key) => {
              setFieldError(key, errorMsg);
            });
          });
        } else {
          setSubmitting(false);
          handleClose();
          callbackSaveEditApplicant();
        }
      })
      .catch((e) => {
        setSubmitting(false);
      });
  };

  const getOptionsValue = (value: string | ISelectOption) => {
    if (isString(value)) {
      return {
        value: value,
        label: value,
      };
    }
    return value;
  };

  const vehicleOptions = useMemo(() => {
    return vehicles?.map(((vehicle: { name: any; id: any; }) => {
      return {label: vehicle.name, value: vehicle.id}
    }))
  }, [vehicles]);

  const getShareClassOptions = (vehicle_id: number) => {
    return vehiclesAPIData
      ?.filter(
        (val: { company_fund_vehicle: number; fund: number }) =>
          val.company_fund_vehicle === vehicle_id && val.fund === data.fund
      )
      .map(
        (shareClass: {
          display_name: string;
          id: number;
          company_fund_vehicle: number;
        }) => {
          return { label: shareClass.display_name, value: shareClass.id };
        }
      );
  }

  const getOptionById = (options: any, value: any) => {
    return options?.find((option: { value: number; }) => option.value === value)
  }

  const handleSave = (values: any, handleSubmit: any) => {
    if (requireNotification(values)) {
      setIshowNotificationModal(true)
    } else {
      handleSubmit()
      handleClose()
      setIshowNotificationModal(false)
    }
  }
  const skipTax = get(data, 'skip_tax')

  return (
    <>
    <Formik
      validationSchema={VALIDATION_SCHEMA}
      initialValues={data ? formData : INITIAL_VALUES}
      onSubmit={onSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        isSubmitting,
        setFieldValue,
        errors,
      }) => {
        console.log({values})
        // const finalEntity = get(values, "final_entity", 0)
        const finalEntity:any = !!get(values, "final_entity") ? get(values, "final_entity") : ''
        return (
          <>
            <EditApplicantWrapper>
              <Row>
                <Col>
                  <FormTextFieldRow
                    label="Email Address"
                    name="email_address"
                    placeholder="Enter Email Address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={get(values, "user.email")}
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <FormTextFieldRow
                    label="First Name"
                    name="first_name"
                    placeholder="Enter First Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                    disabled={true}
                  />
                </Col>
                <Col>
                  <FormTextFieldRow
                    label="Last Name"
                    name="last_name"
                    placeholder="Enter Last Name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name}
                    disabled={true}
                  />
                </Col>
                <Col className="col_job_band">
                  <FormSelectorFieldRow
                    label="Job Band/Level"
                    name="job_band"
                    placeholder="Select"
                    onChange={(value: any) => {
                      setFieldValue("job_band", value.value);
                    }}
                    onBlur={handleBlur}
                    value={{ value: values.job_band, label: values.job_band }}
                    options={JOB_BANDS}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <FormSelectorFieldRow
                    label="Eligibility"
                    name="eligibility_decision"
                    placeholder="Select"
                    onChange={(value: any) =>
                      setFieldValue("eligibility_decision", value)
                    }
                    onBlur={handleBlur}
                    value={{
                      value: get(values, "eligibility_type"),
                      label: get(values, "eligibility_type"),
                    }}
                    options={[
                      {
                        value: get(values, "eligibility_type"),
                        label: get(values, "eligibility_type"),
                      },
                    ]}
                    isDisabled={true}
                  />
                </Col>
              </Row>

              <Row className="mt-2">
                <Col>
                  <RadioField
                    label="Requested Leverage"
                    name="requested_leverage"
                    className="leverage-radio"
                    disabled={true}
                    onChange={(value: any) =>
                      setFieldValue("requested_leverage", value)
                    }
                    options={LEVERAGE_OPTIONS}
                    value={getOptionsValue(get(values, "requested_leverage"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <RadioField
                    label="Max Leverage"
                    name="max_leverage"
                    className="leverage-radio"
                    onChange={(value: any) =>
                      setFieldValue("max_leverage", value)
                    }
                    options={LEVERAGE_OPTIONS}
                    value={getOptionsValue(get(values, "max_leverage"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                  <RadioField
                    label="Final Leverage"
                    name="final_leverage_ratio"
                    className="leverage-radio"
                    onChange={(value: any) =>
                      setFieldValue("final_leverage_ratio", value)
                    }
                    options={LEVERAGE_OPTIONS}
                    value={getOptionsValue(get(values, "final_leverage_ratio"))}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md="6">
                  <CurrencyField
                    label="Final Equity"
                    name="final_entity"
                    placeholder="Enter Final Equity"
                    onChange={(value: any) =>
                      setFieldValue("final_entity", value)
                    }
                    onBlur={handleBlur}
                    // value={finalEntity ? finalEntity : 0}
                    value={finalEntity}
                    currencySymbol={get(fundDetails, 'currency.symbol')}
                  />
                  {get(errors, "final_amount") && (
                    <p className="text-danger mb-0">
                      {get(errors, "final_amount")}
                    </p>
                  )}
                </Col>
                <Col md="6">
                  <CurrencyField
                    label="Leverage Amount"
                    name="final_leverage_amount"
                    placeholder="Leverage Amount"
                    onChange={(value: any) =>
                      setFieldValue("final_leverage_amount", value)
                    }
                    disabled={!data.has_custom_leverage}
                    onBlur={handleBlur}
                    value={data.has_custom_leverage ? get(values, 'final_leverage_amount') : getFinalLeverage(values)}
                    currencySymbol={get(fundDetails, 'currency.symbol')}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col md="6">
                  <CurrencyField
                    label="Requested Equity"
                    name="requested_entity"
                    placeholder="Enter Requested Equity"
                    disabled={true}
                    onChange={(value: any) =>
                      setFieldValue("requested_entitys", value)
                    }
                    onBlur={handleBlur}
                    value={Number(get(values, "requested_entity", 0))}
                    currencySymbol={get(fundDetails, 'currency.symbol')}
                  />
                </Col>

                <Col md="6">
                  <CurrencyField
                    label="Total Investment"
                    name="final_total_investment"
                    placeholder="Enter TotalInvestment"
                    disabled={!data.has_custom_total_investment}
                    onChange={(value: any) =>
                      setFieldValue("final_total_investment", value)
                    }
                    onBlur={handleBlur}
                    value={data.has_custom_total_investment ? get(values, 'final_total_investment') : getTotalInvestment(values)}
                    currencySymbol={get(fundDetails, 'currency.symbol')}
                  />
                </Col>
              </Row>

              <Row className="mt-3">
                <EditApplicantStatusCol>
                  <ApplicantPill
                    label="Eligibility Decision"
                    data={values}
                    field="eligibility_decision"
                  />
                </EditApplicantStatusCol>
                <EditApplicantStatusCol>
                  <ApplicantPill
                    label="Application Approval"
                    data={values}
                    field="application_approval"
                  />
                </EditApplicantStatusCol>
                <EditApplicantStatusCol>
                  <ApplicantPill
                    label="KYC/AML"
                    data={values}
                    field="kyc_aml"
                  />
                </EditApplicantStatusCol>
                {!skipTax && <EditApplicantStatusCol>
                  <ApplicantPill
                    label="Tax Review"
                    data={values}
                    field="taxReview"
                  />
                </EditApplicantStatusCol>}
                {fundDetails?.enable_internal_tax_flow && <EditApplicantStatusCol>
                  <ApplicantPill
                    label="Internal Tax"
                    data={values}
                    field="internal_tax"
                  />
                </EditApplicantStatusCol>}
                <EditApplicantStatusCol>
                  <ApplicantPill
                    label="Final Review"
                    data={values}
                    field="legalDocs"
                  />
                </EditApplicantStatusCol>
              </Row>
              <Row className="mt-2">
                <Col>
                  <FormSelectorFieldRow
                    label="Vehicle"
                    name="vehicle"
                    placeholder="Select"
                    onChange={(value: any) => {
                      setFieldValue("vehicle", value.value);
                      setFieldValue("share_class", null);
                    }}
                    onBlur={handleBlur}
                    value={getOptionById(vehicleOptions, values.vehicle)}
                    options={vehicleOptions}
                  />
                </Col>
                <Col>
                  {values.vehicle && (
                    <FormSelectorFieldRow
                      label="Share Class"
                      name="share_class"
                      placeholder="Select"
                      onChange={(value: any) => {
                        setFieldValue("share_class", value.value);
                      }}
                      onBlur={handleBlur}
                      value={
                        values.share_class
                          ? getOptionById(
                              getShareClassOptions(values.vehicle),
                              values.share_class
                            )
                          : null
                      }
                      options={getShareClassOptions(values.vehicle)}
                    />
                  )}
                </Col>
              </Row>
              <Row className="mt-2">
                <Col>
                <FormTextFieldRow
                  label="Restricted Geographic Area"
                  name="restricted_geographic_area"
                  placeholder="Enter Restricted Geographics Area"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={get(values, 'restricted_geographic_area')}
                />
                </Col>
                <Col>
                <FormTextFieldRow
                  label="Restricted Time Period"
                  name="restricted_time_period"
                  placeholder="Enter Restricted Time Period"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={get(values, 'restricted_time_period')}
                />
                </Col>
              </Row>
              <Row className="mt-2">
                <FormTextFieldRow
                  label="Investor Account Code"
                  name="investor_account_code"
                  placeholder="Enter Investor Account Code"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={get(values, 'investor_account_code')}
                />
              </Row>
              <Row className="mt-2">
                <Col>
                  <FormTextAreaRow
                    label="Add internal comment"
                    name="internal_comment"
                    placeholder="Enter Add internal comment"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={get(values, "internal_comment")}
                  />
                </Col>
              </Row>
            </EditApplicantWrapper>
            <EditApplicantFooter>
              <Row>
                <Col md="3">
                  <PaginationIcon
                    className={!handlePrev ? "disabled" : ""}
                    onClick={handlePrev || (() => {})}
                  >
                    <ChevronLeft />
                  </PaginationIcon>

                  {(handlePrev || handleNext) && paginationFooter}

                  <PaginationIcon
                    className={!handleNext ? "disabled" : ""}
                    onClick={handleNext || (() => {})}
                  >
                    <ChevronRight />
                  </PaginationIcon>
                </Col>
                <Col>
                  <ButtonWrapper>
                    {handleFullApplication && (
                      <Button
                        variant="outline-primary"
                        onClick={handleFullApplication}
                      >
                        View full application
                      </Button>
                    )}
                    <Button variant="outline-primary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button
                      type="button"
                      disabled={isSubmitting || !isValid}
                      onClick={() => handleSave(values, handleSubmit)}
                    >
                      Save
                    </Button>
                  </ButtonWrapper>
                </Col>
              </Row>
            </EditApplicantFooter>
            <NotificationModal 
              isShow={isShowNotificationModal} 
              comment={comment}
              onChange={(val) => setComment(val)}
              onSubmit={() => {
                setIshowNotificationModal(false)
                handleSubmit()
              }} 
              onHide={handleClose} 
              />
          </>
        );
      }}

    </Formik>
    </>
  );
};

export default memo(EditApplicant);

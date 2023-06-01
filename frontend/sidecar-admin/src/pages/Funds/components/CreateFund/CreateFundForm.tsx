import { FunctionComponent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import Container from "react-bootstrap/Container";
import get from "lodash/get";
import find from "lodash/find";
import each from "lodash/each";
import { Formik } from "formik";
import {
  FUND_TYPE_OPTIONS,
  INVITE_TYPE_OPTIONS,
  LEVERAGE_TYPE_OPTIONS,
  INITIAL_VALUES,
  VALIDATION_SCHEMA,
} from "./constants";
import {
  fetchGeoSelector,
  fetchFundsTags,
} from "../../../EligibilityCriteria/thunks";
import API from "../../../../api";
import { StyledForm, StyledSwitch } from "../../../../presentational/forms";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import {
  selectCountrySelector,
  selectFundTags,
} from "../../../EligibilityCriteria/selectors";
import { addFund, editFund } from "../../fundsSlice";
import { FormTextFieldRow } from "../../../../components/Form/TextField";
import FormNumberField from "../../../../components/Form/NumberField";
import { FormSelectorFieldRow } from "../../../../components/Form/SelectorField";
import RadioField from "../../../../components/Form/RadioField";
import FileUpload from "./FileUpload";
import FileUploadComp from "./FileUploadComp";
import { ICurrency } from "../../../../interfaces/currency";
import { useHistory } from "react-router-dom";
import { ADMIN_URL_PREFIX } from "../../../../constants/routes";
import { getFundInitialValues } from "./getEditInitialValues";
import { getValueWithDefault } from "../../../../utils/getValue";
// import CurrencyFormat from "react-currency-format";
import CurrencyInput from "./currencyInput";
import { Accordion } from "react-bootstrap";
import ImageUpload from "./ImageUpload";
import TextEditor from "./TextEditor";
import DataTable from "./DataTable";
import { OptionTypeBase } from "react-select";
import FormTextAreaRow from "../../../../components/Form/TextArea";
import { logMixPanelEvent } from "../../../../utils/mixPanel";

interface CreateFundFormProps {
  closeModal: () => void;
  fund?: any;
}

// const dummyManager = {
//   full_name: "John Doe",
//   bio: "Lorem Ipsum, Example of a biography",
//   designation: "VP of Employee experience",
// };

// const dummyManagers = [dummyManager];

const ButtonsContainer = styled.div`
  text-align: right;
`;

const AccordionContainer = styled.div`
  padding-top: 20px;
`;


const CreateFundForm: FunctionComponent<CreateFundFormProps> = ({
  closeModal,
  fund,
}) => {
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState("");
  const [inviteFile, setInviteFile] = useState([]);
  const [logoFile, setLogoFile] = useState({});
  const [bannerFile, setBannerFile] = useState({});
  const [inviteFileErrors, setInviteFileErrors] = useState<any>("");
  const [fundDocs, setFundDocs] = useState([]);
  const [selectedFundDocs, setSelectedFundDocs] = useState([]);
  const [externalOnboardingToggled, setExternalOnboardingToggled] = useState(fund && fund.external_onboarding_url != null)
  const [documentFilterToggled, setDocumentFilterToggled] = useState(fund && fund.document_filter != null)
  const dispatch = useAppDispatch();
  const history = useHistory();
  const countrySelector = useAppSelector(selectCountrySelector);
  const tagsOptions = useAppSelector(selectFundTags);
  const { externalId } = useParams<{ externalId: string }>();

  useEffect(() => {
    dispatch(fetchGeoSelector());
    dispatch(fetchFundsTags());
  }, [dispatch]);

  const getCurrenciesOptions = () => {
    return currencies.map((currency: ICurrency) => ({
      value: currency.id,
      label: currency.code,
    }));
  };

  const fetchCurrencies = async () => {
    const fetchedCurrencies = await API.getCurrencies();
    setCurrencies(fetchedCurrencies);
  };

  const fetchDocs = async () => {
    const fetchedDocs = await API.fetchFundDetailDocument(externalId);
    setFundDocs(fetchedDocs);
  };

  const uploadSelectedDocuments = async () => {
    let file = { path: "" };
    for (let i = 0; i < selectedFundDocs.length; i++) {
      file = selectedFundDocs[i];

      const docsFormData: any = new FormData();
      docsFormData.append("title", file.path);
      docsFormData.append("document_file", file);
      await API.uploadFundDetailDocument(externalId, docsFormData);
      fetchDocs();
    }
  };

  useEffect(() => {
    fetchCurrencies();
    fetchDocs();
  }, []);

  const onSubmit = async (
    values: any,
    { setSubmitting, setFieldError, setFieldValue, setValues }: any
  ) => {
    setFormError("");
    setShowSuccess(false);
    setSubmitting(true);
    setInviteFileErrors("");

    uploadSelectedDocuments();

    //
    // Temporarily Removed functionality
    ///
    // To be put in a different function to create it on demand //////////
    // const managersFormData: any = new FormData();
    // each(dummyManager, (val, key) => {
    //   managersFormData.append(key, val);
    // });

    // if (Object.keys(logoFile).length > 0) {
    //   managersFormData.append("profile_image", logoFile);
    // }

    // const managersData = await API.createManagers(externalId, managersFormData);

    // ////////                               ///////////                               ///////////

    const payload: any = {
      name: values.name,
      county_code: get(values.county_code, "value", ""),
      focus_region: getValueWithDefault(values, "focus_region", ""),
      risk_profile: getValueWithDefault(values, "risk_profile", ""),
      type: getValueWithDefault(values, "type", ""),
      investment_period: getValueWithDefault(values, "investment_period", ""),
      fund_page: getValueWithDefault(values, "fund_page", ""),
      minimum_investment: values.minimum_investment,
      fund_type: get(values.fund_type, "value", 0),
      is_invite_only: Boolean(get(values.is_invite_only, "value", 0)),
      offer_leverage: Boolean(get(values.offer_leverage, "value", 0)),
      fund_currency: get(values.fund_currency, "value", false),
      partner_id: values.partner_id,
      sold: 0,
      target_fund_size: getValueWithDefault(values, "target_fund_size", ""),
      firm_co_investment_commitment: getValueWithDefault(
        values,
        "firm_co_investment_commitment",
        ""
      ),
      is_nav_disabled: getValueWithDefault(values, "is_nav_disabled", ""),
      skip_tax: getValueWithDefault(values, "skip_tax", ""),
      enable_internal_tax_flow: getValueWithDefault(values, "enable_internal_tax_flow", true),
      tags: JSON.stringify(
        getValueWithDefault(values, "tags", []).map((a: any) => ({
          name: a.label,
        }))
      ),
      target_irr: getValueWithDefault(values, "target_irr", 0),
      strategy: getValueWithDefault(values, "strategy", ""),
      investment_description: getValueWithDefault(
        values,
        "investment_description",
        ""
      ),
      short_description: getValueWithDefault(values, "short_description", ""),
      long_description: getValueWithDefault(values, "long_description", ""),
      stats_json: JSON.stringify(getValueWithDefault(values, "stats_json", [])),
      //
      // Temporarily Removed functionality
      ///
      // fund_managers: JSON.stringify(
      //   [...getValueWithDefault(values, "managers", []), managersData].map(
      //     (manager) => manager.id
      //   )
      // ),
    };

    const formData: any = new FormData();
    each(payload, (val, key) => {
      formData.append(key, val);
    });
    if (inviteFile) {
      formData.append("invite_file", inviteFile);
    }
    if (Object.keys(logoFile).length > 0) {
      formData.append("logo", logoFile);
    }
    if (Object.keys(bannerFile).length > 0) {
      formData.append("banner_image", bannerFile);
    }
    formData.append("external_onboarding_url", externalOnboardingToggled ? values.external_onboarding_url : '')
    formData.append("document_filter", documentFilterToggled ? values.document_filter : '')
    try {
      if (values.id) {
        const data = await API.editFund(values.id, formData);
        logMixPanelEvent('Fund edit');
        setSubmitting(false);
        if (data.invite_file_error) {
          setInviteFileErrors(data.invite_file_error);
        } else {
          dispatch(editFund(data));
          const url = `/${ADMIN_URL_PREFIX}/funds/${data.external_id}`;
          if (url !== history.location.pathname) history.push(url);
          closeModal();
          setShowSuccess(true);
        }
      } else {
        const data = await API.createFund(formData);
        logMixPanelEvent('Fund create');
        setSubmitting(false);
        if (data.invite_file_error) {
          setFieldValue("id", data.id);
          setInviteFileErrors(data.invite_file_error);
        } else {
          dispatch(addFund(data));
          history.push(`/${ADMIN_URL_PREFIX}/funds/${data.external_id}`);
          closeModal();
        }
      }
    } catch (e: any) {
      setSubmitting(false);
      switch (get(e.response, "status")) {
        case 400:
          each(get(e.response, "data"), (error, key) => {
            setFieldError(key, error);
          });
          break;
        case 500:
          if (inviteFile) setInviteFileErrors(true);
          else setFormError("Unable to process your request.");
          break;
      }
    }
  };

  const handleClose = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    closeModal();
  };

  const getCountryOption = (value: any) => {
    if (value && value.value) {
      return value;
    }
    return find(countrySelector, (country) => country.value === value) || null;
  };

  const getCurrencyOption = (value: any) => {
    if (value && value.value) {
      return value;
    }
    const options = getCurrenciesOptions();
    return find(options, (currency) => currency.value === value);
  };
  const formatTags = (tagsFromAPi: { name: string }[]) => {
    return tagsFromAPi.map((tag) => ({ label: tag.name, value: tag.name }));
  };
  const getFundData = () => {
    return {
      ...getFundInitialValues(fund),
      stats_json: getValueWithDefault(fund, "stats_json", []),
      short_description: getValueWithDefault(fund, "short_description", ""),
      long_description: getValueWithDefault(fund, "long_description", ""),
      tags: formatTags(get(fund, "tags")),
      county_code: getCountryOption(fund.county_code),
      fund_currency: getCurrencyOption(fund.fund_currency),
    };
  };

  return (
    <Container fluid className={"pb-5"}>
      <Formik
        initialValues={fund ? getFundData() : INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          errors,
        }) => {
          return (
            <StyledForm onSubmit={handleSubmit}>
              <FormTextFieldRow
                label="Fund Name"
                name="name"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              <FormSelectorFieldRow
                label="Fund Domiciled Country"
                name="county_code"
                placeholder="Select Country"
                onChange={(value: any) => setFieldValue("county_code", value)}
                onBlur={handleBlur}
                value={getCountryOption(values.county_code)}
                options={countrySelector}
              />

              <FormTextFieldRow
                label="Focus Region/Country"
                name="focus_region"
                placeholder="Enter focus Region/Country"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.focus_region}
              />

              <FormTextFieldRow
                label="Type"
                name="type"
                placeholder="Optional"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.type}
              />

              <FormTextFieldRow
                label="Risk Profile"
                name="risk_profile"
                placeholder="Risk Profile"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.risk_profile}
              />

              <FormTextFieldRow
                label="Investment Period"
                name="investment_period"
                placeholder="Optional"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.investment_period}
              />

              <FormTextFieldRow
                label="Fund Page"
                name="fund_page"
                placeholder="https://"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.fund_page}
              />

              <FormSelectorFieldRow
                label="Currency of fund"
                name="fund_currency"
                placeholder="Select"
                onChange={(value: any) => setFieldValue("fund_currency", value)}
                onBlur={handleBlur}
                value={getCurrencyOption(values.fund_currency)}
                options={getCurrenciesOptions()}
              />

              <CurrencyInput
                label="Minimum Equity Investment Amount (Fund Currency)"
                name="minimum_investment"
                placeholder="Check requirements"
                onChange={(name: any, value: any) => {
                  setFieldValue(name, value);
                }}
                value={values.minimum_investment}
              />

              <CurrencyInput
                label="Target Fund Size (Fund Currency)"
                name="target_fund_size"
                placeholder="Enter Target Fund Size (Fund Currency)"
                onChange={(name: any, value: any) => {
                  setFieldValue(name, value);
                }}
                value={values.target_fund_size}
              />

              <CurrencyInput
                label="Firm Co-investment Commitment (Fund Currency)"
                name="firm_co_investment_commitment"
                placeholder="Enter Firm Co-investment Commitment (Fund Currency)"
                onChange={(name: any, value: any) => {
                  setFieldValue(name, value);
                }}
                value={values.firm_co_investment_commitment}
              />

              <RadioField
                label="Open/Closed?"
                name="fund_type"
                onChange={(value: any) => setFieldValue("fund_type", value)}
                options={FUND_TYPE_OPTIONS}
                value={values.fund_type}
              />

              <RadioField
                label="Is the Fund open to all employees or invite only?"
                name="is_invite_only"
                onChange={(value: any) =>
                  setFieldValue("is_invite_only", value)
                }
                options={INVITE_TYPE_OPTIONS}
                value={values.is_invite_only}
              />

              <RadioField
                label="Will you be offering leverage?"
                name="offer_leverage"
                onChange={(value: any) =>
                  setFieldValue("offer_leverage", value)
                }
                options={LEVERAGE_TYPE_OPTIONS}
                value={values.offer_leverage}
              />

              <FormTextFieldRow
                label="Partner ID"
                name="partner_id"
                placeholder="Enter your unique identifier"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.partner_id}
              />
              {values.is_invite_only?.value || values.offer_leverage?.value ? (
                <>
                  <FileUpload
                    title="Applicants"
                    name="invite_file"
                    onFileSelect={(file: any) => {
                      setInviteFile(file);
                      setFormError("");
                    }}
                    onDelete={() => {
                      setInviteFile([]);
                      setInviteFileErrors("");
                      setFormError("");
                    }}
                    isUploading={isSubmitting}
                    error={inviteFileErrors}
                  />
                  {inviteFileErrors && (
                    <p className="text-danger">{inviteFileErrors}</p>
                  )}
                </>
              ) : (
                <></>
              )}

              {formError && <p className="text-danger">{formError}</p>}

              <AccordionContainer>
              <Accordion>
                <Accordion.Item
                  eventKey="0"
                  style={{ background: "transparent" }}
                >
                  <Accordion.Header>Advanced Settings</Accordion.Header>
                  <Accordion.Body
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "25px",
                    }}
                  >
                    <ImageUpload
                      onChange={(_name: any, _file: any) => setLogoFile(_file)}
                      name="logo"
                      label="Fund Specific Logo"
                      currentImg={values.logo}
                    />
                    <ImageUpload
                      onChange={(_name: any, _file: any) =>
                        setBannerFile(_file)
                      }
                      name="banner_image"
                      label="Fund Specific Banner"
                      currentImg={values.banner_image}
                    />
                    <FileUploadComp
                      multi
                      allowedFormats={["image/*", ".pdf"]}
                      title="Display Docs"
                      onFilesSelect={(files: any) => {
                        setSelectedFundDocs(files);
                      }}
                      currentFiles={fundDocs}
                      onDelete={() => {
                        // setFundDocs([]);
                      }}
                      isUploading={isSubmitting}
                    />

                    <FormSelectorFieldRow
                      label="Tags"
                      name="tags"
                      placeholder="Select"
                      onChange={(value: any) => setFieldValue("tags", value)}
                      onBlur={handleBlur}
                      isMulti={true}
                      value={values.tags}
                      options={formatTags(tagsOptions)}
                    />
                    <FormNumberField
                      label="Target IRR (%)"
                      name="target_irr"
                      placeholder="Enter Target IRR"
                      onChange={(e: any) => {
                        const name = e.target.name;
                        const value = e.target.value;
                        if (!value) {
                          setFieldValue(name, value);
                        } else {
                          const val = parseFloat(value);
                          if (val < 101) {
                            setFieldValue(name, value);
                          }
                        }
                      }}
                      onBlur={handleBlur}
                      value={values.target_irr}
                    />
                    <FormTextFieldRow
                      label="Strategy"
                      name="strategy"
                      placeholder="Enter strategy"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.strategy}
                    />
                    <DataTable
                      data={values.stats_json as OptionTypeBase[]}
                      label="Stats"
                      onChange={(value: any) =>
                        setFieldValue("stats_json", value)
                      }
                    />

                    <TextEditor
                      label="Short Description"
                      name="short_description"
                      onChange={(value: any) =>
                        setFieldValue("short_description", value)
                      }
                      value={values.short_description}
                    />
                    <TextEditor
                      label="Long Description"
                      name="long_description"
                      onChange={(value: any) =>
                        setFieldValue("long_description", value)
                      }
                      value={values.long_description}
                    />
                    <StyledSwitch
                      id="is_nav_disabled"
                      label="Disable NAV"
                      type="switch"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.is_nav_disabled}
                      checked={values.is_nav_disabled}
                    />
                    <StyledSwitch
                      id="skip_tax"
                      label="Skip Tax"
                      type="switch"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.skip_tax}
                      checked={values.skip_tax}
                    />
                    <StyledSwitch
                      id="enable_internal_tax_flow"
                      label="Enable Internal Tax Flow"
                      type="switch"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.enable_internal_tax_flow}
                      checked={values.enable_internal_tax_flow}
                    />
                     <StyledSwitch
                      id="allow_external_onboarding"
                      label="Allow external onboarding"
                      type="switch"
                      onChange={function (event: React.ChangeEvent<HTMLInputElement>) {
                        handleChange(event)
                        setExternalOnboardingToggled(!externalOnboardingToggled)
                        if (!externalOnboardingToggled) {
                          values.external_onboarding_url = ''
                        }
                      }}
                      onBlur={handleBlur}
                      value={externalOnboardingToggled}
                      checked={externalOnboardingToggled}
                      />
                      {externalOnboardingToggled ? (
                          <FormTextFieldRow
                             label='URL'
                             name='external_onboarding_url'
                             placeholder='External onboarding URL'
                             onChange={handleChange}
                             value={values.external_onboarding_url}
                          >
                         </FormTextFieldRow>) : (<></>)
                      }
                    <StyledSwitch
                        id="allow_document_filter"
                        label="Allow Document filter"
                        type="switch"
                        onChange={function (event: React.ChangeEvent<HTMLInputElement>) {
                          handleChange(event)
                          setDocumentFilterToggled(!documentFilterToggled)
                          if (!documentFilterToggled) {
                            values.document_filter = ''
                          }
                        }}
                        onBlur={handleBlur}
                        value={documentFilterToggled}
                        checked={documentFilterToggled}
                    />
                    {documentFilterToggled ? (
                        <FormTextAreaRow label="Fund documents filter" name="document_filter" placeholder="Insert fund documents filter code" onChange={handleChange} onBlur={() => {}} value={values.document_filter} />) : (<></>)
                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
                </AccordionContainer>
             
              {formError && (<p className="text-danger">{formError}</p>)}
              <ButtonsContainer className="text-right">
                <Button
                  variant="outline-primary"
                  type="submit"
                  className={"submit-button"}
                  disabled={isSubmitting}
                >
                  {fund ? "Save" : "Create"}
                </Button>
                <Button
                  variant="outline-primary"
                  type="cancel"
                  className={"cancel-button"}
                  disabled={isSubmitting}
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </ButtonsContainer>
              {showSuccess && (
                <Alert variant="success">
                  Fund has been successfully updated.
                </Alert>
              )}
            </StyledForm>
          );
        }}
      </Formik>
    </Container>
  );
};

export default CreateFundForm;

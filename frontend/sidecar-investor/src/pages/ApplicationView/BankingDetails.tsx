import React, { FunctionComponent } from "react";
import get from "lodash/get";
import first from "lodash/first";
import {useHistory, useParams} from "react-router";
import { useAppSelector } from "../../app/hooks";
import {
  useUpdateBankingDetailsMutation,
  useFetchBankingDetailsQuery,
} from "../../api/rtkQuery/fundsApi";
import { selectKYCRecord } from "../KnowYourCustomer/selectors";
import DetailsForm from "../BankDetailsForm/Form";
import { Params } from "../TaxForms/interfaces";
import {ChangeAnswersButton, SubTitle} from "./styles";
import {BANKING_DETAILS} from "../../constants/commentModules";
import { IBankingDetails } from "../../interfaces/bankingDetails";
import { getUnavailableSectionMesage } from "../../constants/applicationView";
import {INVESTOR_URL_PREFIX} from "../../constants/routes";


interface BankingDetailsProps {
  callbackSubmit: () => void;
  taxDocumentsSigned?: boolean;
}

const BankingDetails: FunctionComponent<BankingDetailsProps> = ({ callbackSubmit, taxDocumentsSigned }) => {
  const { externalId } = useParams<Params>();
  const [updateBankingDetails] = useUpdateBankingDetailsMutation();
  const { commentsByRecord } = useAppSelector(selectKYCRecord);
  const history = useHistory()

  const { data: bankingApiData, isLoading: isLoadingBankingData } =
    useFetchBankingDetailsQuery(externalId, {
      skip: !externalId,
    });
  const bankingData: IBankingDetails | undefined = first(bankingApiData);

  let commentsOfThisRecord = {}
  if (bankingData) {
    commentsOfThisRecord = get(commentsByRecord, `${BANKING_DETAILS}.${bankingData.id}`);
  }

  const onSubmit = (values: any) => {
    updateBankingDetails({
      fundId: values.id,
      ...values,
      currency: get(values, "currency.value"),
      bank_country: get(values, "bank_country.value"),
    })
      .then((resp: any) => {
        callbackSubmit();
      })
      .catch((e) => {
        console.log({ e });
      });
  };

  if (isLoadingBankingData) return <></>;

  const changeBankingDetails = () => {
    if(taxDocumentsSigned)
      history.push(`/${INVESTOR_URL_PREFIX}/funds/${externalId}/bank_details`)
  }

  return (
    <>
      <SubTitle>Banking Details</SubTitle>
      <ChangeAnswersButton
        onClick={changeBankingDetails}
        disabled={!taxDocumentsSigned}

      >
        Go to Bank Details
      </ChangeAnswersButton>
      {(!isLoadingBankingData && !bankingData) && (
         <p>{getUnavailableSectionMesage('Banking Details')}</p>
      )}
      {(!isLoadingBankingData && bankingData) && (
        <DetailsForm
          details={bankingData}
          submitOnBlur={true}
          handleSubmit={onSubmit}
          comments={commentsOfThisRecord}
        />
      )}
    </>
  );
};

export default BankingDetails;

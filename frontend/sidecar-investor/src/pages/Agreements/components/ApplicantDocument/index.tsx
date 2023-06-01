import React, {FunctionComponent} from 'react';
import {useParams} from "react-router-dom";
import {IApplicantAgreement} from "../../../../interfaces/Agreement/agreementDocuments";
import API from "../../../../api";
import {Status} from "./styles";
import classNames from "classnames";


interface ApplicantAgreementDocumentProps {
  agreementDocument: IApplicantAgreement;
  setIsSubmitting: (arg0: boolean) => void
}


const ApplicantAgreementDocument: FunctionComponent<ApplicantAgreementDocumentProps> = ({
                                                                                          agreementDocument,
                                                                                          setIsSubmitting
                                                                                        }) => {
  const {externalId} = useParams<{ externalId: string }>();

  const getSigningUrl = async () => {
    if (agreementDocument.completed) return;
    setIsSubmitting(true)
    const {host, protocol} = window.location;
    const agreementId = agreementDocument.id;
    const return_url = encodeURIComponent(
      `${protocol}//${host}/investor/funds/${externalId}/user-agreement/envelopeId`
    );
    const response = await API.getAgreementsSigningUrl(agreementId, return_url);
    window.open(response.signing_url, "_self");
    return response;
  };
  return <tr key={agreementDocument.id}>
    <td className={'cursor-pointer'}>
      <div
        onClick={getSigningUrl}
        className={classNames({'underlined': !agreementDocument.completed})}
      >
        {agreementDocument.document.title}
      </div>
    </td>
    <td>
      <Status>{agreementDocument.status}</Status>
    </td>
  </tr>
};

export default ApplicantAgreementDocument;

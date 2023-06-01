import React, {FunctionComponent, useState} from 'react';
import Modal from "react-bootstrap/Modal";
import {IOwnershipFundInvestor} from "../../../../interfaces/investorOwnership";
import {StyledButton} from "../../../../presentational/buttons";
import SaleFundForm from "./SellFundForm";



interface SellFundProps {
  investedFund: IOwnershipFundInvestor
}


const SellFundButton: FunctionComponent<SellFundProps> = ({investedFund}) => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const closeModal = () => setShowModal(false);

  return <>
    <StyledButton onClick={() => setShowModal(true)} variant={'outline-primary'}>Sell</StyledButton>
    <Modal size={'lg'} show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Sell Fund</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <SaleFundForm fundId={investedFund.fund.id} closeModal={closeModal}/>
      </Modal.Body>
    </Modal>
  </>;
};

export default SellFundButton;

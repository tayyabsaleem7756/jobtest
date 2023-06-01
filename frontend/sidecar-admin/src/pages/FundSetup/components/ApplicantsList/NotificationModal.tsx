import React, { FunctionComponent, useState } from "react";
import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  ButtonsContainer,
  CancelButton,
  Label,
  MessageInput,
  SendButton,
} from "../../../KnowYourCustomer/components/RequestModal/styles";

interface INotificationModalProps {
  isShow: boolean;
  comment: string;
  onSubmit: () => void;
  onHide: () => void;
  onChange: (value: string) => void;
}

const ModalBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotificationModal: FunctionComponent<INotificationModalProps> = ({
  isShow,
  comment,
  onChange,
  onSubmit,
  onHide,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    onChange(e.target.value);

  return (
    <Modal show={isShow} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Notify Applicant</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ModalBodyWrapper>
          <Label>Message</Label>
          <MessageInput value={comment} onChange={handleChange} />
        </ModalBodyWrapper>
        <ButtonsContainer>
          <CancelButton onClick={onHide}>Cancel</CancelButton>
          <SendButton onClick={onSubmit}>Save and Send</SendButton>
        </ButtonsContainer>
      </Modal.Body>
    </Modal>
  );
};

export default NotificationModal;

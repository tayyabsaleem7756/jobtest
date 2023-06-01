import React, { FunctionComponent, memo } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

interface ConfirmationModalProps {
  title: string;
  submitLabel?: string;
  showModal: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  children: any;
}

const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = ({
  title,
  submitLabel,
  showModal,
  handleSubmit,
  handleClose,
  children,
}) => {
  return (
    <Modal size={"lg"} show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={handleClose}>
          Close
        </Button>
        <Button onClick={handleSubmit}>{submitLabel}</Button>
      </Modal.Footer>
    </Modal>
  );
};

ConfirmationModal.defaultProps = {
  submitLabel: "Submit",
};

export default memo(ConfirmationModal);

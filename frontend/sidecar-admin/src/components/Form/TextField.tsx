import React, { FunctionComponent } from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { ErrorMessage, useField } from "formik";
import Row from "react-bootstrap/Row";
import styled from "styled-components";

interface FormTextFieldProps {
  label: string;
  name: string;
  placeholder: string;
  onChange: any;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value: string | number | string[] | undefined;
  disabled?: boolean;
  error?: any;
}

const FormTextField: FunctionComponent<FormTextFieldProps> = ({
  label,
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  disabled,
}) => {
  return (
    <Row className={"mt-2"}>
      <Col md={4} className="field-label">
        {label}
      </Col>
      <Col md={8}>
        <Form.Group controlId="formFilterValue">
          <Form.Control
            type="text"
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            disabled={!!disabled}
          />
          <ErrorMessage name={name} component="div" />
        </Form.Group>
      </Col>
    </Row>
  );
};

const LabelCol = styled(Col)`
  font-size: 15px !important;
  font-weight: 700 !important;
  line-height: 21px;
  padding-bottom: 6px;
`;

const TextInputContainer = styled(Form.Control)`
  background-color: white;
  border: 1px solid #d5cbcb !important;
`;

export const FormTextFieldRow: FunctionComponent<FormTextFieldProps> = ({
  label,
  name,
  placeholder,
  onChange,
  onBlur,
  value,
  error,
  disabled,
}) => {
  
  let field;
  try {
    const fieldInfo = useField(name);
    field = fieldInfo[0];
  } catch (e) {
    field = false;
  }
  return (
    <Row className={"mt-2"}>
      <LabelCol md="12" className="field-label">
        {label}
      </LabelCol>
      <Col md="12" >
        <Form.Group controlId="formFilterValue">
          <TextInputContainer
            type="text"
            name={name}
            placeholder={placeholder}
            onChange={onChange}
            onBlur={onBlur}
            value={value}
            disabled={!!disabled}
          />
          {field && <ErrorMessage className="text-danger" name={name} component="div" /> }
          {error && <p className="text-danger">{error}</p>}
        </Form.Group>
      </Col>
    </Row>
  );
};

export default FormTextField;

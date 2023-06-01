import React, {FunctionComponent} from "react";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import {ErrorMessage} from "formik";
import Row from "react-bootstrap/Row";
import styled from "styled-components";
import CurrencyFormat from "react-currency-format";

interface CurrencyInputProps {
  label: string;
  name: string;
  placeholder: string;
  onChange: any;
  value: string | number | string[] | undefined;
}

const LabelRow = styled(Row)`
  font-size: 15px !important;
  font-weight: 700 !important;
  line-height: 21px;
  padding-left: 12px;
  padding-bottom: 6px;
`;

const InputContainer = styled(CurrencyFormat)`
  background-color: white !important;
  border: 1px solid #D5CBCB !important;
`;

const CurrencyInput: FunctionComponent<CurrencyInputProps> = (
  {
    label,
    name,
    placeholder,
    onChange,
    value
  }
) => {
  return <Row className={'mt-2'}>
    <Col md={12} className='field-label'>
      <LabelRow md={4} className='field-label'>
        {label}
      </LabelRow>
    </Col>
    <Col md={12}>
      <Form.Group controlId="formFilterValue">
        <InputContainer
          thousandSeparator
          name={name}
          placeholder={placeholder}
          onValueChange={
            (values: any) => {
              const {value} = values;
              onChange(name, value)
            }
          }
          value={value || ""}
        />
        <ErrorMessage className="text-danger" name={name} component="div"/>
      </Form.Group>
    </Col>
  </Row>
}

export default CurrencyInput;
import React, {FunctionComponent} from 'react';
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import {ErrorMessage, Formik} from "formik";
import {INITIAL_VALUES, VALIDATION_SCHEMA} from "./constants";
import API from "../../../../api";
import {StyledForm} from "../../../../presentational/forms";
import Form from 'react-bootstrap/Form';
import {useAppDispatch} from "../../../../app/hooks";
import {fetchInvestor} from "../../thunks";
import {StyledButton} from "../../../../presentational/buttons";


interface SaleFundFormProps {
  fundId: number
  closeModal: () => void;
}


const SaleFundForm: FunctionComponent<SaleFundFormProps> = ({fundId, closeModal}) => {
  const dispatch = useAppDispatch();

  const onSubmit = async (values: any, {setSubmitting}: any) => {
    setSubmitting(true);
    const payload = {
      fund: fundId,
      requested_sale: values.requestedSale,
    }
    await API.createSale(payload)
    dispatch(fetchInvestor());
    setSubmitting(false);
    closeModal();
  }

  return <Container fluid>
    <Col md={{span: 8}}>
      <Formik
        initialValues={INITIAL_VALUES}
        validationSchema={VALIDATION_SCHEMA}
        onSubmit={onSubmit}
      >
        {({
            values,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
          <StyledForm onSubmit={handleSubmit}>
            <Form.Group controlId="formFilterValue">
              <Form.Label>Requested Sale</Form.Label>
              <Form.Control
                type="number"
                name="requestedSale"
                placeholder="Requested Sale"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.requestedSale}
              />
              <ErrorMessage name="loanRequest" component="div"/>
            </Form.Group>
            <StyledButton variant="outline-primary" type="submit" disabled={isSubmitting}>
              Sale
            </StyledButton>
          </StyledForm>
        )}
      </Formik>
    </Col>
  </Container>;
};

export default SaleFundForm;

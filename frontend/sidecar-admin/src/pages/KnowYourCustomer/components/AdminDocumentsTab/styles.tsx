import styled from "styled-components";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

export const ColumnDiv = styled.div`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`

export const DocumentsTableCol = styled(Col)`
  .rs-table-cell-content {
    min-height: 90px;
  }

  .rs-table-cell-wrap {
    height: 100%;

  }
`

export const DatePickerDiv = styled.div`
  input {
    width: auto;
  }
`

export const TextInput = styled(Form.Control)`
  width: 97%;
`
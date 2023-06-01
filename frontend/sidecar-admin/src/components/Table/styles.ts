import styled from "styled-components";
import { Link } from "react-router-dom";
import "rsuite-table/dist/css/rsuite-table.css";

export const Wrapper = styled.div`
margin: auto;
  width: 100%;
  display: flex;
  .table-container {
    align-items: stretch;
    width: 100%;
  }
  .rs-table {
    border-radius: 0.4em;
  }
  .rs-table-row-header {
    .rs-table-cell {
      background: #413c69;
      div {
        color: #fff;
        font-weight: 700;
      }
    }
  }
  .rs-table-row-header.rs-table-row:hover {
      background: #0d0d0e;
      .rs-table-cell, .rs-table-cell-group {
        background: #413c69;
        div {
          color: #fff;
          font-weight: 700;
        }
      }
    }
    .wrap-word{
      .rs-table-cell-content {
        word-break: break-word !important;
      }
    }
`;

export const TableLink = styled(Link)`
    color: #020203;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    border-bottom: 1px dotted #666;
`

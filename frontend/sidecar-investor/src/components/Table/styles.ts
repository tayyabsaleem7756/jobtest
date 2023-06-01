import styled from "styled-components";
import "rsuite-table/dist/css/rsuite-table.css";

export const Wrapper = styled.div`
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

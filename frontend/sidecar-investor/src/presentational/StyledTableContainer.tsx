import styled from "styled-components";

export const SideCarStyledTable = styled.div`
  background: white;
  box-shadow: 0 18px 20px 1px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 30px;

  @media screen and (max-width: 655px) {
    margin-top: 10px;  
  }

  .table {
    margin: 0;

    thead,
    tbody {

      th,
      td {
        font-family: 'Quicksand Medium';
        padding: ${props => `${props.theme.baseLine}px ${props.theme.baseLine}px`};
      }
    }

    thead {

      th {
        font-size: 13px;
        background: ${props => props.theme.palette.common.darkDesaturatedBlueColor};
        color: white;
        vertical-align: top;
        font-family: 'Quicksand Bold';
      }
    }

    tbody {

      tr {

        td {
          border-color: ${props => props.theme.palette.common.borderLightBlueColor} !important;
          border-width: 1px 0 0 0;
          vertical-align: middle;

          a {

            .badge {
              text-decoration: underline;
            }
          }
        }

        &.subRow {

          td {

            &:first-child {
              border: 0;
            }
          }
        }

        &.result-row {
          background: ${props => props.theme.palette.common.lightGrayishBlueColor};
        }
      }
    }
  }

`

export const NotificationsTable = styled(SideCarStyledTable)`
  table {
    max-height: 500px;
    min-height: 490px;
  }
`
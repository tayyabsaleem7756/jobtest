import React, {FunctionComponent} from 'react';


import {SideCarStyledTable} from "../../../../presentational/StyledTableContainer";
import Table from "react-bootstrap/Table";
import GlossaryToolTip from "../../../../components/GlossaryToolTip";
import {GLOSSARY_DEFINITION_HASH} from "../../../../constants/glossaryItemsHash";


interface InfoObject {
  heading: string;
  value: string | number | React.ReactNode;
  glossaryKey?: string;
  omitDisplay?: boolean;
}

interface InfoTableProps {
  infoRow: InfoObject[];
  colWidth?: string;
}


const InfoTable: FunctionComponent<InfoTableProps> = ({infoRow, colWidth}) => {
  return <SideCarStyledTable>
    <Table responsive>
      <thead>
      <tr>
        {infoRow.map((infoCol) => {
          if(infoCol.omitDisplay) {
            return '';
          }
          const glossaryKey = infoCol.glossaryKey ? infoCol.glossaryKey : infoCol.heading;
          const hasToolTipInfo = GLOSSARY_DEFINITION_HASH[glossaryKey]
          return (
            <th style={{width: colWidth ? colWidth : "auto"}}>
              {hasToolTipInfo ? <GlossaryToolTip header={infoCol.heading} heading={glossaryKey}/> : infoCol.heading}
            </th>
          )
        })}
      </tr>
      </thead>
      <tbody>
      {infoRow.map((infoCol) => !infoCol.omitDisplay && <td>{infoCol.value}</td>)}
      </tbody>
    </Table>
  </SideCarStyledTable>
};

export default InfoTable;

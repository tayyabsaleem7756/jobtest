import React, {FunctionComponent} from 'react';
import {Card} from "react-bootstrap";
import StatToolTip from "../../../../components/GlossaryToolTip/StatBlockToolTip";
import {GLOSSARY_DEFINITION_HASH} from "../../../../constants/glossaryItemsHash";


interface StatCardProps {
  heading: string;
  value: string | number | React.ReactNode;
  glossaryKey?: string
}

const StatCard: FunctionComponent<StatCardProps> = ({heading, value, glossaryKey}) => {
  const glossaryHeading = glossaryKey ? glossaryKey : heading;
  const glossaryValue = GLOSSARY_DEFINITION_HASH[glossaryHeading];
  return <Card>
    <Card.Body>
      <div className="heading">{heading}{glossaryValue && <StatToolTip heading={glossaryHeading}/>}</div>
      <div className="value">{value}</div>
    </Card.Body>
  </Card>
};

export default StatCard;

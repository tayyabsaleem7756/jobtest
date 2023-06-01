import {FunctionComponent} from "react";
import size from "lodash/size";
import RsuiteTable from "../../components/Table/RSuite";
import {IOpportunity} from "../../pages/Opportunities/interfaces";
import {Columns} from "./utils";
import {StartPageSectionHeading} from "../../pages/StartPage/styles";

interface InvestmentOpportunitiesProps {
  isLoading: boolean;
  opportunities?: IOpportunity[];
  scrollRef:((instance: HTMLHeadingElement | null) => void) | React.RefObject<HTMLHeadingElement> | null | undefined;
}

const InvestmentOppotunities: FunctionComponent<
  InvestmentOpportunitiesProps
> = ({ isLoading, opportunities, scrollRef }) => {
  return (
    <>
      <StartPageSectionHeading ref={scrollRef}>Investment Opportunities</StartPageSectionHeading>
      <div style={{ width: "100%" }}>
        <RsuiteTable
          height={size(opportunities) > 10 ? "500px" : ""}
          isLoading={isLoading}
          wordWrap={true}
          rowSelection={false}
          columns={Columns}
          data={opportunities}
          emptyMessage={"Investment Opportunities Coming Soon"}
          align={'left'}
        />
      </div>
    </>
  );
};

export default InvestmentOppotunities;

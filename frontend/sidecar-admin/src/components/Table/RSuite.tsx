import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import { Table, Column, HeaderCell, Cell } from "rsuite-table";
import map from "lodash/map";
import get from "lodash/get";
import without from "lodash/without";
import CheckBoxCell from "./CheckboxCell";
import { Wrapper } from "./styles";

interface IColumns {
  title?: any;
  dataKey?: any;
  width?: any;
  Cell?: any;
}

interface IRSuite {
  isLoading?: boolean;
  allowColMinWidth?: boolean;
  columns?: IColumns[];
  height?: string;
  width?: string;
  autoHeight?: boolean;
  data?: any;
  rowHeight?: number;
  dataKey?: string;
  rowSelection?: boolean;
  wordWrap?: boolean;
  handleSelectRow?: (data: any) => void;
}

const RsSuite: FC<IRSuite> = ({
  isLoading,
  allowColMinWidth,
  height,
  width,
  autoHeight,
  wordWrap,
  columns,
  rowHeight,
  data,
  dataKey,
  rowSelection,
  handleSelectRow,
}) => {
  const [checkValues, setCheckValues] = useState<any[]>([]);
  const [wrapperHeight, setHeight] = useState(0);
  const ref = useRef(null);
  const dataIds = useMemo(()=> map(data,(elem:any)=>elem.id),[data])

  const tableRef = React.useRef();

  const handleCheckCellChange = (value: any) => {
    value = +value;

    let nextCheckValues: any[] = [...checkValues];

    if (nextCheckValues.includes(value)) {
      nextCheckValues = without(nextCheckValues, value);
    } else {
      nextCheckValues.push(value);
    }
    setCheckValues(nextCheckValues);
    if (handleSelectRow) handleSelectRow(nextCheckValues);
  };

  const handleCheckAllChange = () => {
    if (!data) return
    if (checkValues.length === data.length) {
      setCheckValues([])
      if (handleSelectRow) handleSelectRow([]);
    }
    else {
      setCheckValues(dataIds)
      if (handleSelectRow) handleSelectRow(dataIds);
    }
  }

  const getTableWidth = (column: any) => {
    const data: any = {};
    if (column.width) data.width = column.width;
    if (column.flexGrow) {
      data.flexGrow = column.flexGrow;
      if (allowColMinWidth)
        data.minWidth = 100;
    }
    if (column.minWidth && allowColMinWidth) data.minWidth = column.minWidth;
    return data;
  };

  useEffect(() => {
    if (get(ref, "current.clientHeight"))
      setHeight(get(ref, "current.clientHeight"));
  }, []);

  useEffect(() => {
    setCheckValues([])
    if (handleSelectRow) handleSelectRow([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <Wrapper style={{ height ,width}}>
      <div className="table-container" ref={ref}>
        <Table
          height={wrapperHeight}
          data={data}
          ref={tableRef}
          shouldUpdateScroll={false}
          wordWrap={wordWrap}
          autoHeight={autoHeight}
          rowHeight={rowHeight}
          virtualized
        >
          {rowSelection && (
            <Column key="checkColumn" width={56} fixed>
              <HeaderCell className="checkbox-cell">
                <input
                  type="checkbox"
                  checked={data && data.length > 0 && checkValues.length === data.length}
                  onChange={handleCheckAllChange}
                  disabled={!data || data.length === 0}
                />

              </HeaderCell>
              <CheckBoxCell
                dataKey={dataKey}
                checked={(value: any) => {
                  return checkValues.includes(value);
                }}
                onChange={handleCheckCellChange}
              />
            </Column>
          )}
          {map(columns, (column: any) => (
            <Column
              key={column.dataKey}
              align="center"
              {...getTableWidth(column)}
              fixed={column?.fixed}
              className={wordWrap ? "wrap-word" : ""}
            >
              <HeaderCell>{column.title}</HeaderCell>
              <Cell dataKey={column.dataKey}>{column.Cell}</Cell>
            </Column>
          ))}
        </Table>
      </div>
    </Wrapper>
  );
};

RsSuite.defaultProps = {
  dataKey: "id",
  allowColMinWidth: true,
  rowSelection: true,
  height: "400px",
  rowHeight: 46,
  width: "100%",
  autoHeight: false
};

export default RsSuite;

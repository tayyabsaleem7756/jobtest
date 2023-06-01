import React, {FunctionComponent, useRef, useState} from "react";
import {DateRange, OnDateRangeChangeProps, Range} from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import styled from "styled-components";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import useOnClickOutside from "../../hooks/useClickOutside";

const CalendarDiv = styled.div`
  position: absolute;
  right: 0;
`


const ParentDiv = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`

const CursorSpan = styled.span`
  cursor: pointer;
`

const ClearDiv = styled.div`
  position: absolute;
  font-size: 12px;
  cursor: pointer;
  top: 52px;
  left: 10px;
  color: rgb(132, 144, 149);
`

interface SideCarDateRangePickerProps {
  heading: string;
  value: Range[];
  setValue: (arg0: Range[]) => void
}


const SideCarDateRangePicker: FunctionComponent<SideCarDateRangePickerProps> = ({heading, value, setValue}) => {
  const ref = useRef(null)
  const [showCal, setShowCal] = useState<boolean>(false)

  const handleClickOutside = () => {
    setShowCal(false);
  }

  useOnClickOutside(ref, handleClickOutside)


  return <ParentDiv>
    <ParentDiv>
      {heading}
    </ParentDiv>
    <div>
      <div>
        <CursorSpan onClick={() => setShowCal(!showCal)}><ArrowDropDownIcon/></CursorSpan>
        <CalendarDiv ref={ref}>
          {showCal && <><ClearDiv onClick={
            () => setValue([
              {
                startDate: undefined,
                endDate: new Date(""),
                key: 'selection',
              }
            ])
          }>reset</ClearDiv>
            <DateRange
              onChange={(item: OnDateRangeChangeProps) => setValue([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={value}
            /></>}
        </CalendarDiv>
      </div>
    </div>
  </ParentDiv>
}

export default SideCarDateRangePicker;
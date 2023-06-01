import React, {FunctionComponent, useState} from 'react'
import {parseJSON, format, isValid} from 'date-fns'

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


interface DatePickerProps {
  onChange: (date: any) => void,
  startDate?: string | null;
  placeholder?: string

}


const DatePickerComponent: FunctionComponent<DatePickerProps> = ({onChange, startDate,placeholder}) => {
  const [selectedDate, setSelectedDate] = useState<any>(startDate ? new Date(startDate) : undefined)

  const setStartDate = (date: any) => {
    setSelectedDate(date)
    const formattedDate = parseJSON(date)
    if(isValid(formattedDate)){
    onChange(format(formattedDate, 'yyyy-MM-dd'));}
  }

  return (
    <DatePicker placeholderText={placeholder} selected={selectedDate} onChange={(date) => setStartDate(date)} />
  )
}

export default DatePickerComponent;
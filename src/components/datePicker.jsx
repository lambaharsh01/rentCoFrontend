import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function DatePickerComponent({ initialValue, onChange, inputClass="" }) {
  const [selectedDate, setSelectedDate] = useState(initialValue ? new Date(initialValue) : new Date());

  const handleChange = (date) => {
    setSelectedDate(date);
      const formattedDate = date.toLocaleDateString("en-CA"); 
      onChange(formattedDate);
    };

  return (
      <DatePicker
        className={inputClass}
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="yyyy-MM-dd"
    />
  );
};


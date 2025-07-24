import { FC } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import MonthYearPickerInput from "./MonthYearPickerInput";

interface Props {
  value: string; // yyyy-MM-01
  onChange: (value: string) => void;
  id?: string;
  label: string;
}

const MonthYearDatePicker: FC<Props> = ({ value, onChange, id, label }) => {
  const selectedDate = value ? new Date(value) : null;

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => {
        if (date) {
          const formatted = date.toISOString().slice(0, 7);
          onChange(`${formatted}-01`);
        }
      }}
      showMonthYearPicker
      dateFormat="yyyy-MM"
      customInput={<MonthYearPickerInput label={label} id={id} />}
      calendarClassName="bg-gray-800 text-white border border-blue-600 rounded"
    wrapperClassName="w-full"
    />
  );
};

export default MonthYearDatePicker;
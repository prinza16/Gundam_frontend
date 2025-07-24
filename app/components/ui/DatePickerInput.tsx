import React, { forwardRef } from "react";

interface Props {
  value?: string;
  onClick?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  label: string;
}

const DatePickerInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onClick, onChange, id, label }, ref) => {
    return (
      <div className="relative w-full">
        <label className="relative block w-full cursor-text">
          <input
            id={id}
            type="text"
            value={value}
            onClick={onClick}
            onChange={onChange}
            ref={ref}
            autoComplete="off"
            readOnly
            className="px-4 py-2 text-lg outline-none border-2 bg-gray-900 text-blue-200 border-blue-600 rounded hover:border-blue-500 duration-200 peer focus:border-cyan-500 focus:shadow-md focus:shadow-cyan-500/50 w-full selection:bg-blue-600 selection:text-blue-200"
          />
          <span className="absolute left-0 top-3 px-1 text-lg tracking-wide peer-focus:text-cyan-500 pointer-events-none peer-focus:text-sm peer-focus:-translate-y-5 bg-gray-900 ml-2 peer-valid:text-cyan-500 peer-valid:text-sm peer-valid:-translate-y-5 transition-all duration-200">
            {label}
          </span>
        </label>
      </div>
    );
  }
);

export default DatePickerInput
import React, { forwardRef } from "react";

interface Props {
  value?: string;
  onClick?: () => void;
  label: string;
  id?: string;
}

const MonthYearPickerInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onClick, label, id }, ref) => {
    return (
      <div className="relative w-full">
        <label className="relative block w-full cursor-text">
          <input
            id={id}
            type="text"
            onClick={onClick}
            value={value}
            readOnly
            ref={ref}
            className="px-4 py-2 text-lg outline-none border-2 bg-gray-900 text-blue-200 border-blue-600 rounded hover:border-blue-500 duration-200 peer focus:border-cyan-500 focus:shadow-md focus:shadow-cyan-500/50 w-full selection:bg-blue-600 selection:text-blue-200"
          />
          <span 
            className={`
                absolute left-0 top-3 px-1 text-lg tracking-wide pointer-events-none ml-2 bg-gray-900 transition-all duration-200
                ${
                    value
                        ? 'text-cyan-500 text-sm -translate-y-5'
                        : 'peer-focus:text-cyan-500 peer-focus:text-sm peer-focus:-translate-y-5'
                }
            `}
          >
            {label}
          </span>
        </label>
      </div>
    );
  }
);

export default MonthYearPickerInput;
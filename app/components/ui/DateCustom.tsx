import React from 'react';

interface DateCustomProps {
  label: string;
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
}

const DateCustom = ({ label, id, value, onChange, disabled = false, required = false }: DateCustomProps) => {
  return (
    <div className="relative w-full">
      <label className="relative block w-full">
        <input
          required={required}
          id={id}
          type="month"
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete="off"
          className="px-4 py-2 text-lg outline-none border-2 bg-gray-900 text-blue-200 border-blue-600 rounded hover:border-blue-500 duration-200 peer focus:border-cyan-500 focus:shadow-md focus:shadow-cyan-500/50 w-full selection:bg-blue-600 selection:text-blue-200"
        />
        <span className="absolute left-0 top-3 px-1 text-lg tracking-wide peer-focus:text-cyan-500 pointer-events-none peer-focus:text-sm peer-focus:-translate-y-5 bg-gray-900 ml-2 peer-valid:text-cyan-500 peer-valid:text-sm peer-valid:-translate-y-5 transition-all duration-200">
          {label}
        </span>
      </label>
    </div>
  );
};

export default DateCustom;
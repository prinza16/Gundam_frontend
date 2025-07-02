'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaAngleDown } from 'react-icons/fa6';
import { SelectInputProps } from "@/types/select";

const Select: React.FC<SelectInputProps> = ({
  label,
  options,
  selectedValue,
  onSelect,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectOption = (value: string | number) => {
    onSelect(value);
    setIsOpen(false);
  };

  const displayLabel = 
    selectedValue !== '' && selectedValue !== null && selectedValue !== undefined
      ? options.find((opt) => opt.value === selectedValue)?.label || label
      : options.find((opt) => opt.value === '')?.label || label

  const shouldLabelFloat = isOpen || (selectedValue !== '' && selectedValue !== null && selectedValue !== undefined)

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        id={`select-${label}`}
        className={`
          peer
          flex justify-between items-center
          px-4 py-4 text-lg outline-none border-2 rounded duration-200
          cursor-pointer
          ${disabled ? 'bg-gray-700 text-gray-400 border-gray-600' : 'bg-gray-900 text-blue-200 border-blue-600 hover:border-blue-500'}
          ${isOpen ? 'border-cyan-500 shadow-md shadow-cyan-500/50' : ''}
          ${disabled ? 'pointer-events-none' : ''}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
      >
        <span className="truncate">{displayLabel}</span>
        <FaAngleDown className={`ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </div>

      <label
        htmlFor={`select-${label}`}
        className={`
          absolute left-0 top-3 px-1 text-lg tracking-wide pointer-events-none
          transition-all duration-200
          ${shouldLabelFloat
            ? 'text-cyan-500 text-sm -translate-y-5 bg-gray-900 ml-2'
            : ' ml-2'
          }
        `}
      >
        {label}
      </label>

      <div
        className={`
          absolute top-full left-0 mt-2 w-full
          rounded border-[1px] border-blue-700 bg-gray-800 shadow-lg shadow-blue-500/50
          max-h-60 overflow-y-auto z-50
          transition-all duration-200 ease-out
          ${isOpen ? 'visible opacity-100 translate-y-0' : 'invisible opacity-0 -translate-y-2'}
        `}
        role="listbox"
        aria-labelledby={`select-${label}`}
      >
        {options.length > 0 ? (
          options.map((option) => (
            <div
              key={option.value}
              className={`
                cursor-pointer p-4 text-blue-100
                hover:bg-blue-700 hover:text-white
                ${selectedValue === option.value ? 'bg-blue-800 text-white font-semibold' : ''}
              `}
              onClick={() => handleSelectOption(option.value)}
              role="option"
              aria-selected={selectedValue === option.value}
            >
              {option.label}
            </div>
          ))
        ) : (
          <div className="p-4 text-blue-300 text-center">No options available</div>
        )}
      </div>
    </div>
  );
};

export default Select;
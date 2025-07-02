export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectInputProps {
  label: string;
  options: SelectOption[];
  selectedValue: string | number;
  onSelect: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
}
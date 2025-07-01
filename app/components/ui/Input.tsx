interface InputProps {
  label: string;
  type?: "text" | "password" | "email" | "number";
  id?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input = ({ label, type = "text", id, value, onChange }: InputProps) => {
  return (
    <div className="relative w-full">
      <label className="relative block w-full">
        <input
          required
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="px-4 py-2 text-lg outline-none border-2 border-gray-400 rounded hover:border-gray-600 duration-200 peer focus:border-indigo-600 w-full"
        />
        <span className="absolute left-0 top-3 px-1 text-lg uppercase tracking-wide peer-focus:text-indigo-600 pointer-events-none peer-focus:text-sm peer-focus:-translate-y-5 bg-white ml-2 peer-valid:text-sm peer-valid:-translate-y-5">
          {label}
        </span>
      </label>
    </div>
  );
};
export default Input;

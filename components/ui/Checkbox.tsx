"use client";

import { FaCheck } from "react-icons/fa";

interface CheckboxProps {
  text: string;
  checked: boolean;
  setChecked: (value: boolean) => void;
  title?: string;
}

function Checkbox({ text, checked, setChecked, title }: CheckboxProps) {
  return (
    <label
      className="flex items-center gap-x-3 cursor-pointer text-sm text-gray-300 w-fit"
      title={title}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="hidden"
      />
      <div
        className={`relative flex items-center justify-center w-4.5 h-4.5 border-2 border-gray-700 rounded
            ${checked ? "bg-gray-700" : "bg-transparent"}`}
      >
        <FaCheck
          size={12}
          className={`absolute transition-opacity! duration-300 ${checked ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      {text}
    </label>
  );
}

export default Checkbox;

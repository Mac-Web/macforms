"use client";

import { FaXmark } from "react-icons/fa6";
import { useRef } from "react";

interface InputProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  styles?: string;
  clear?: boolean;
  onblur?: () => void;
  onclear?: () => void;
}

function Input({
  placeholder,
  value,
  setValue,
  styles,
  clear,
  onblur,
  onclear,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleClear() {
    setValue("");
    if (onclear) onclear();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }

  return (
    <div
      className={
        "rounded bg-gray-300 dark:bg-gray-900 flex items-center relative " +
        styles
      }
    >
      <input
        className="w-full bg-transparent outline-none border-none text-black dark:text-white text-[18px] px-3 py-1.5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
        onBlur={onblur}
      />
      {clear && value.length > 0 && (
        <div
          className="flex items-center justify-center hover:bg-gray-300 hover:dark:bg-gray-800 rounded cursor-pointer 
                  duration-300 w-7.5 h-7.5 absolute right-2 text-gray-300"
          title="Clear"
          onMouseDown={handleClear}
        >
          <FaXmark size={20} title="Clear" />
        </div>
      )}
    </div>
  );
}

export default Input;

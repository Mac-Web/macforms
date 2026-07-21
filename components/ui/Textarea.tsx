"use client";

interface TextareaProps {
  placeholder: string;
  value: string;
  setValue: (value: string) => void;
  styles?: string;
}

function Textarea({ placeholder, value, setValue, styles }: TextareaProps) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={`rounded bg-gray-300 dark:bg-gray-900 flex items-center relative outline-none border-none
         text-black dark:text-white text-[18px] px-3 py-1.5 resize-y ${styles}`}
    ></textarea>
  );
}

export default Textarea;

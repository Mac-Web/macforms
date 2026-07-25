"use client";

interface ChoiceProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  text: string;
  checkbox?: boolean;
}

function Choice({ checked, setChecked, text, checkbox }: ChoiceProps) {
  return (
    <label className="flex gap-x-3 text-gray-300 items-center cursor-pointer hover:bg-gray-900 px-4 py-2 rounded">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="hidden"
      />
      <div
        className={`min-w-5 w-5 h-5 ${checkbox ? "rounded" : "rounded-full"} border-2 border-gray-300 justify-center items-center flex`}
      >
        <div
          className={`w-2.5 h-2.5 bg-gray-300 ${checkbox ? "rounded-xs" : "rounded-full"} ${checked ? "" : "scale-0"} transition-transform!`}
        />
      </div>
      {text}
    </label>
  );
}

export default Choice;

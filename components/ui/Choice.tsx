"use client";

interface ChoiceProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
  text: string;
  checkbox?: boolean;
}

function Choice({ checked, setChecked, text, checkbox }: ChoiceProps) {
  return (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        className="hidden"
      />
      <div
        className={`w-7 h-7 ${checkbox ? "rounded" : "rounded-full"} border-2 border-gray-700`}
      >
        <div
          className={`w-5 h-5 bg-gray-700 rounded ${checked ? "" : "scale-0"}`}
        />
      </div>
      {text}
    </label>
  );
}

export default Choice;

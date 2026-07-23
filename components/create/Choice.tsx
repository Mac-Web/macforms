"use client";

import { labelStyles } from "@/lib/constants";
import Input from "../ui/Input";
import { ChoiceType } from "@/types/Form";

interface ChoiceProps {
  index: number;
  value: ChoiceType;
  setValue: (value: ChoiceType) => void;
}

function Choice({ index, value, setValue }: ChoiceProps) {
  return (
    <label className={labelStyles}>
      Option {index + 1}
      <Input
        placeholder={`Choice ${index + 1}`}
        value={value.text}
        setValue={(text) => setValue({ ...value, text })}
        clear
      />
    </label>
  );
}

export default Choice;

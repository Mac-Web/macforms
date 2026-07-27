"use client";

import type { ChoiceType } from "@/types/Form";
import { labelStyles } from "@/lib/constants";
import { FaTrash } from "react-icons/fa";
import Input from "../ui/Input";
import Checkbox from "../ui/Checkbox";

interface ChoiceProps {
  index: number;
  value: ChoiceType;
  quiz?: boolean;
  correct?: string;
  setCorrect?: (correct: string | undefined) => void;
  setValue: (value: ChoiceType) => void;
  removeChoice: (() => void) | null;
}

function Choice({
  index,
  value,
  quiz,
  correct,
  setCorrect,
  setValue,
  removeChoice,
}: ChoiceProps) {
  return (
    <label className={labelStyles}>
      <div>
        Option {index + 1}{" "}
        <span className="text-red-500" title="Required">
          *
        </span>
      </div>
      <div className="flex gap-x-3 items-center">
        <Input
          placeholder={`Choice ${index + 1}`}
          value={value.text}
          setValue={(text) => setValue({ ...value, text })}
          clear
        />
        {removeChoice && (
          <FaTrash
            size={17}
            className="cursor-pointer text-gray-300"
            title="Remove option"
            onClick={removeChoice}
          />
        )}
      </div>
      {quiz && (
        <Checkbox
          text="Correct"
          checked={correct === value.id}
          setChecked={(v) => setCorrect!(v ? value.id : undefined)}
        />
      )}
    </label>
  );
}

export default Choice;

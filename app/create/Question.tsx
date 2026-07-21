"use client";

import type { QuestionType } from "@/types/Form";
import { labelStyles } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Dropdown from "@/components/ui/Dropdown";

interface QuestionProps {
  index: number;
  question: QuestionType;
  setQuestion: (q: QuestionType) => void;
}

function Question({ index, question, setQuestion }: QuestionProps) {
  return (
    <div className="flex flex-col gap-y-5 rounded border-2 border-gray-700 p-5">
      <h1 className="text-white text-lg font-bold">Question {index + 1}</h1>
      <label className={labelStyles}>
        <div>
          Question{" "}
          <span className="text-red-500" title="Required">
            *
          </span>
        </div>
        <Input
          placeholder="What is this question?"
          value={question.title}
          setValue={(title) => setQuestion({ ...question, title })}
          styles="w-100"
        />
      </label>
      <label className={labelStyles}>
        Description
        <Textarea
          placeholder="This question is very interesting"
          value={question.description || ""}
          setValue={(description) => setQuestion({ ...question, description })}
          styles="w-100"
        />
      </label>
      <div className={labelStyles}>
        Type
        <Dropdown
          selected={question.type}
          setSelected={(type) =>
            setQuestion({
              ...question,
              type: type as "choice" | "multiple" | "short" | "long",
            })
          }
          values={["Choice", "Multiple", "Short answer", "Long answer"]}
          styles="w-40"
        />
      </div>
    </div>
  );
}

export default Question;

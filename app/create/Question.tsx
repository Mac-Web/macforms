"use client";

import type { Question as QType, QuestionType } from "@/types/Form";
import { labelStyles } from "@/lib/constants";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Dropdown from "@/components/ui/Dropdown";
import Choice from "@/components/create/Choice";
import Btn from "@/components/ui/Btn";
import Checkbox from "@/components/ui/Checkbox";

const questionTypes = ["Multiple", "Text"];

interface QuestionProps {
  index: number;
  question: QuestionType;
  setQuestion: (q: QuestionType) => void;
}

function Question({ index, question, setQuestion }: QuestionProps) {
  return (
    <div className="flex rounded border-2 border-gray-700 p-5 gap-x-10">
      <div className="flex flex-col gap-y-5">
        <h1 className="text-white text-lg font-bold">
          Question {index + 1}{" "}
          {!question.optional && <span className="text-red-500">*</span>}
        </h1>
        <div className={labelStyles}>
          Type
          <Dropdown
            selected={
              questionTypes.find((t) => t.toLowerCase() === question.type)!
            }
            setSelected={(type) => {
              const selectedType = type.toLowerCase() as QType;
              const { id, title, description, optional } = question;
              const base = { id, title, description, optional };
              if (selectedType === "multiple") {
                setQuestion({
                  ...base,
                  type: selectedType,
                  choices: [
                    {
                      id: crypto.randomUUID(),
                      text: "",
                    },
                  ],
                });
              } else if (selectedType === "text") {
                setQuestion({
                  ...base,
                  type: selectedType,
                  placeholder: "",
                });
              }
            }}
            values={questionTypes}
            styles="w-40"
          />
        </div>
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
            setValue={(description) =>
              setQuestion({ ...question, description })
            }
            styles="w-100"
          />
        </label>
      </div>
      <div className="flex-1 flex flex-col gap-y-3">
        {question.type === "multiple" && (
          <>
            {question.choices &&
              question.choices.map((choice, i) => (
                <Choice
                  key={i}
                  index={i}
                  value={choice}
                  setValue={(value) => {
                    const choices = [...question.choices];
                    choices[choices.findIndex((c) => c.id === value.id)] =
                      value;
                    return setQuestion({ ...question, choices });
                  }}
                />
              ))}
            <Btn
              text="Add option"
              onclick={() =>
                setQuestion({
                  ...question,
                  choices: [
                    ...question.choices,
                    {
                      id: crypto.randomUUID(),
                      text: "",
                    },
                  ],
                })
              }
              styles="text-sm"
            />
          </>
        )}
        {question.type === "text" && (
          <>
            <label className={labelStyles}>
              Input placeholder
              <Input
                placeholder="This is a placeholder"
                value={question.placeholder}
                setValue={(placeholder) =>
                  setQuestion({ ...question, placeholder })
                }
              />
            </label>
            <Checkbox
              text="Long answer"
              checked={question.long || false}
              setChecked={(long) => setQuestion({ ...question, long })}
            />
          </>
        )}
        <Checkbox
          text="Required"
          checked={!question.optional}
          setChecked={(required) =>
            setQuestion({ ...question, optional: !required })
          }
        />
      </div>
    </div>
  );
}

export default Question;

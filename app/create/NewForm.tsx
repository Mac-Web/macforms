"use client";

import type { FormType } from "@/types/Form";
import { useState } from "react";
import { labelStyles } from "@/lib/constants";
import { FaShuffle } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Btn from "@/components/ui/Btn";
import Question from "./Question";

const alphabet = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");

function NewForm() {
  const [loading, setLoading] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<FormType>({
    id: "",
    userId: "",
    title: "",
    description: "",
    private: false,
    open: true,
    questions: [{ id: 0, title: "", type: "choice" }],
  });

  function generateCode(): string {
    return new Array(6)
      .fill("")
      .map((c) => alphabet[Math.floor(Math.random() * alphabet.length + c)])
      .join("")
      .toUpperCase();
  }

  function handleSave() {
    setLoading(true);
    console.log(newForm);
    setLoading(false);
  }

  return (
    <div className="w-200 mx-auto flex flex-col gap-y-5">
      <div className="flex flex-col gap-y-5 rounded border-2 border-gray-700 p-5">
        <h1 className="text-white text-lg font-bold">Form information</h1>
        <label className={labelStyles}>
          <div>
            Name{" "}
            <span className="text-red-500" title="Required">
              *
            </span>
          </div>
          <Input
            placeholder="New Form"
            value={newForm.title}
            setValue={(title) =>
              setNewForm((prev) => {
                return { ...prev, title };
              })
            }
            styles="w-100"
          />
        </label>
        <label className={labelStyles}>
          Description
          <Textarea
            placeholder="This form is new"
            value={newForm.description || ""}
            setValue={(description) =>
              setNewForm((prev) => {
                return { ...prev, description };
              })
            }
            styles="w-100"
          />
        </label>
        <Checkbox
          text="Private"
          checked={newForm.private || false}
          setChecked={(p) =>
            setNewForm((prev) => {
              return {
                ...prev,
                code: p ? generateCode() : undefined,
                private: p,
              };
            })
          }
          title="Only users with the access code can fill out and submit the form"
        />
        {newForm.private && (
          <label className={labelStyles}>
            <div>
              Access code{" "}
              <span className="text-red-500" title="Required">
                *
              </span>
            </div>
            <div className="flex gap-x-3">
              <Input
                placeholder="ABC123"
                value={newForm.code || ""}
                setValue={(code) =>
                  setNewForm((prev) => {
                    return {
                      ...prev,
                      code: code.trim().slice(0, 6).toUpperCase(),
                    };
                  })
                }
              />
              <div
                className="rounded hover:bg-gray-900 cursor-pointer w-9 flex
              items-center justify-center"
                title="Generate new access code"
                onClick={(e) => {
                  e.preventDefault();
                  setNewForm((prev) => {
                    return { ...prev, code: generateCode() };
                  });
                }}
              >
                <FaShuffle size={20} />
              </div>
            </div>
          </label>
        )}
        <Checkbox
          text="Open"
          checked={newForm.open || false}
          setChecked={(open) =>
            setNewForm((prev) => {
              return { ...prev, open };
            })
          }
          title="This form is accepting responses"
        />
      </div>
      {newForm.questions.map((question, index) => (
        <Question
          key={question.id}
          index={index}
          question={question}
          setQuestion={(q) =>
            setNewForm((prev) => {
              const newQuestions = [...prev.questions];
              newQuestions[newQuestions.findIndex((i) => i.id === q.id)] = q;
              return { ...prev, questions: newQuestions };
            })
          }
        />
      ))}
      <div
        className="rounded border-dashed border-gray-700 border-2 py-5 flex flex-col items-center gap-y-1
       text-gray-300 cursor-pointer hover:bg-gray-900"
        onClick={() =>
          setNewForm((prev) => {
            return {
              ...prev,
              questions: [
                ...prev.questions,
                { id: prev.questions.length, title: "", type: "choice" },
              ],
            };
          })
        }
      >
        <FaPlusCircle size={25} />
        Add question
      </div>
      <Btn
        text={loading ? "Loading..." : "Save"}
        onclick={handleSave}
        styles="mt-5"
        primary
      />
    </div>
  );
}

export default NewForm;

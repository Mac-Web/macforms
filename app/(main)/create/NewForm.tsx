"use client";

import type { FormType } from "@/types/Form";
import { useState } from "react";
import { labelStyles } from "@/lib/constants";
import { FaShuffle } from "react-icons/fa6";
import { FaPlusCircle } from "react-icons/fa";
import { createForm } from "./actions";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Checkbox from "@/components/ui/Checkbox";
import Btn from "@/components/ui/Btn";
import Question from "./Question";

const alphabet = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");

function NewForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [newForm, setNewForm] = useState<FormType>({
    id: "",
    userId: "",
    title: "",
    description: "",
    private: false,
    open: true,
    quiz: false,
    questions: [
      {
        id: 0,
        title: "",
        type: "multiple",
        correct: "",
        choices: [{ id: crypto.randomUUID(), text: "" }],
      },
    ],
  });
  const router = useRouter();

  function generateCode(): string {
    return new Array(6)
      .fill("")
      .map((c) => alphabet[Math.floor(Math.random() * alphabet.length + c)])
      .join("")
      .toUpperCase();
  }

  async function handleSave() {
    setLoading(true);
    setError(null);
    function invalid(message: string) {
      setError(message);
      setLoading(false);
    }
    if (newForm.title.trim().length == 0) {
      return invalid("Please give your form a title");
    }
    if (newForm.private && (!newForm.code || newForm.code.trim().length == 0)) {
      return invalid("Please generate an access code for the private form");
    }
    for (let i = 0; i < newForm.questions.length; i++) {
      const question = newForm.questions[i];
      if (question.title.trim().length == 0) {
        return invalid(`Please give question ${i + 1} a title`);
      }
      if (question.type === "text" && question.placeholder.trim().length == 0) {
        return invalid(`Please give question ${i + 1}'s input a placeholder`);
      }
      if (question.type === "multiple" && question.choices.length == 0) {
        return invalid(`Please add at least one option for question ${i + 1}`);
      }
      if (
        question.type === "multiple" &&
        question.choices.some((c) => c.text.trim().length == 0)
      ) {
        return invalid(`Please fill in all the options for question ${i + 1}`);
      }
      if (
        newForm.quiz &&
        question.correct !== undefined &&
        (!question.correct || question.correct.trim().length == 0)
      ) {
        return invalid(
          `Please provide a correct answer for question ${i + 1}, or mark it as not having a correct answer`,
        );
      }
    }
    const formId = await createForm(newForm);
    if (formId) {
      router.push(`/forms/${formId}`);
    } else {
      setLoading(false);
    }
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
          text="Quiz"
          checked={newForm.quiz || false}
          setChecked={(quiz) =>
            setNewForm((prev) => {
              return { ...prev, quiz };
            })
          }
          title="Make this form a quiz with correct answers"
        />
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
          quiz={newForm.quiz || false}
          question={question}
          setQuestion={(q) =>
            setNewForm((prev) => {
              const newQuestions = [...prev.questions];
              newQuestions[newQuestions.findIndex((i) => i.id === q.id)] = q;
              return { ...prev, questions: newQuestions };
            })
          }
          handleDelete={
            newForm.questions.length !== 1
              ? () =>
                  setNewForm({
                    ...newForm,
                    questions: newForm.questions.filter(
                      (q) => q.id !== question.id,
                    ),
                  })
              : undefined
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
                {
                  id: prev.questions.length,
                  title: "",
                  type: "multiple",
                  correct: "",
                  choices: [{ id: crypto?.randomUUID(), text: "" }],
                },
              ],
            };
          })
        }
      >
        <FaPlusCircle size={25} />
        Add question
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Btn
        text={loading ? "Loading..." : "Save"}
        onclick={handleSave}
        styles={error ? "" : "mt-5"}
        primary
      />
    </div>
  );
}

export default NewForm;

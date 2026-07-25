"use client";

import type { ResponseType, QuestionType, AnswerType } from "@/types/Form";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { submitForm } from "./actions";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Choice from "@/components/ui/Choice";
import Btn from "@/components/ui/Btn";

function blankAnswers(questions: QuestionType[]): AnswerType[] {
  return questions.map((q, i) => {
    const base = { id: i, questionId: q.id };
    return q.type === "text"
      ? { ...base, type: "text", text: "" }
      : { ...base, type: "multiple", choices: [] };
  });
}

interface QuestionsProps {
  questions: QuestionType[];
  formId: string;
  res?: ResponseType | null;
}

function Questions({ questions, formId, res }: QuestionsProps) {
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [response, setResponse] = useState<ResponseType>(
    res || {
      id: crypto.randomUUID(),
      formId,
      answers: blankAnswers(questions),
    },
  );

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    function invalid(message: string) {
      setError(message);
      setLoading(false);
    }
    for (let i = 0; i < response.answers.length; i++) {
      const answer = response.answers[i];
      if (!questions.find((q) => q.id === answer.questionId)!.optional) {
        if (answer.type === "text" && answer.text.trim().length == 0) {
          return invalid(`Please respond to question ${i + 1}`);
        }
        if (answer.type === "multiple" && answer.choices.length == 0) {
          return invalid(`Please select an option for question ${i + 1}`);
        }
      }
    }
    const res = await submitForm(formId, response);
    setLoading(false);
    if (res?.success) setSubmitted(res.id);
  }

  function handleClear() {
    setResponse({
      id: crypto.randomUUID(),
      formId,
      answers: blankAnswers(questions),
    });
    setModalOpen(false);
  }

  return (
    <>
      {submitted ? (
        <div className="w-full border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5">
          <h2 className="text-white text-lg font-bold">
            Thank you for responding!
          </h2>
          <p className="text-gray-300">
            Your response has been recorded and submitted to the form owner.
          </p>
          <div className="flex flex-col gap-y-1 text-gray-300">
            <div
              onClick={() => window.open(`?edit=${submitted}`, "_self")}
              className="cursor-pointer hover:text-green-600 underline w-fit"
            >
              Edit response
            </div>
            <div
              onClick={() => window.open(`/${formId}`, "_self")}
              className="cursor-pointer hover:text-green-600 underline w-fit"
            >
              Submit another response
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex flex-col gap-y-5">
            {questions.map((question, i) => {
              const answer = response.answers.find(
                (a) => a.questionId === question.id,
              ) as AnswerType;

              return (
                <div key={question.id} className="flex flex-col gap-y-2">
                  <div className="text-gray-300 text-sm">Question {i + 1}</div>
                  <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5">
                    <div className="flex flex-col gap-y-2">
                      <h2
                        className="text-white text-lg font-bold"
                        title={question.type}
                      >
                        {question.title}
                        {!question.optional && (
                          <span className="text-red-500" title="Required">
                            {" "}
                            *
                          </span>
                        )}
                      </h2>
                      {question.description && (
                        <p className="text-gray-300 text-sm">
                          {question.description}
                        </p>
                      )}
                    </div>
                    {question.type === "text" && answer.type === "text" && (
                      <label>
                        <Input
                          placeholder={question.placeholder}
                          value={answer.text}
                          setValue={(text) => {
                            const answers = [...response.answers];
                            const found =
                              answers[
                                answers.findIndex(
                                  (a) => a.questionId === question.id,
                                )
                              ];
                            if (found.type === "text") found.text = text;
                            setResponse({ ...response, answers });
                          }}
                        />
                      </label>
                    )}
                    {question.type === "multiple" &&
                      answer.type === "multiple" && (
                        <div className="flex flex-col gap-y-1">
                          {question.choices.map((choice) => {
                            return (
                              <Choice
                                key={choice.id}
                                checked={
                                  answer.choices.find((c) => c === choice.id)
                                    ? true
                                    : false
                                }
                                setChecked={(checked) => {
                                  setResponse({
                                    ...response,
                                    answers: response.answers.map((a) =>
                                      a.id === answer.id &&
                                      a.type === "multiple"
                                        ? {
                                            ...a,
                                            choices: checked
                                              ? question.multiple
                                                ? [...a.choices, choice.id]
                                                : [choice.id]
                                              : !question.optional &&
                                                  a.choices.length === 1
                                                ? a.choices
                                                : a.choices.filter(
                                                    (c) => c !== choice.id,
                                                  ),
                                          }
                                        : a,
                                    ),
                                  });
                                }}
                                text={choice.text}
                                checkbox={question.multiple}
                              />
                            );
                          })}
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex gap-x-5 w-full">
            <Btn
              text={loading ? "Loading..." : res ? "Save" : "Submit"}
              onclick={handleSubmit}
              primary
            />
            <Btn text="Clear" onclick={() => setModalOpen(true)} />
          </div>
          <AnimatePresence>
            {modalOpen && (
              <Modal closeModal={() => setModalOpen(false)}>
                <div className="flex flex-col gap-y-5">
                  <h2 className="text-white text-xl font-bold">
                    Clear confirmation
                  </h2>
                  <p className="text-gray-300">
                    Are you sure you want to clear the form? This will wipe
                    everything you&apos;ve already filled out.
                  </p>
                  <div className="flex gap-x-3">
                    <Btn text="Confirm" onclick={handleClear} warning primary />
                    <Btn text="Cancel" onclick={() => setModalOpen(false)} />
                  </div>
                </div>
              </Modal>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}

export default Questions;

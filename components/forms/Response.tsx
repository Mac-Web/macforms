"use client";

import type { FormType, ResponseType } from "@/types/Form";
import type {
  QuestionResponseType,
  ResponseScoreType,
} from "@/app/(main)/forms/[id]/Responses";
import { useState, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import { deleteReponse } from "@/app/(main)/forms/[id]/actions";
import Dropdown from "../ui/Dropdown";
import WarningModal from "../modals/WarningModal";

interface ResponseProps {
  formData: FormType;
  questionResponses: QuestionResponseType[];
  responses: ResponseType[];
  responseScores: ResponseScoreType[];
}

function Response({
  formData,
  questionResponses,
  responses,
  responseScores,
}: ResponseProps) {
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  async function handleDelete() {
    if (response) {
      setLoading(true);
      await deleteReponse(response.id, formData.id);
      setLoading(false);
      setDeleting(false);
    }
  }

  useEffect(() => {
    setResponse(null);
  }, [questionResponses]);

  return (
    <div className="flex flex-col gap-y-5">
      <div className="flex items-center gap-x-5 text-sm">
        <Dropdown
          text="Respondent"
          selected={response?.name || "All"}
          setSelected={(v) =>
            setResponse(responses.filter((r) => r.name === v)[0])
          }
          values={["All", ...responses.map((r) => r.name as string)]}
          width={150}
        />
        {response && formData.quiz && (
          <>
            <div title="Quiz score/accuracy">
              {Math.round(
                (responseScores[0].total / 100) *
                  responseScores.find((s) => s.id === response.id)!.score,
              )}
              /{responseScores[0].total}
            </div>
            <div title="Quiz score/accuracy">
              {responseScores.find((s) => s.id === response.id)!.score}%
            </div>
          </>
        )}
        {response && (
          <>
            <div title={response.createdAt?.toISOString()}>
              Submitted at {response.createdAt?.toLocaleDateString()}
            </div>
            {response.updatedAt?.getTime() !==
              response.createdAt?.getTime() && (
              <div title={response.createdAt?.toISOString()}>
                Edited at {response.createdAt?.toLocaleDateString()}
              </div>
            )}
            <div
              onClick={() => setDeleting(true)}
              className="text-red-500 cursor-pointer hover:underline"
            >
              Delete response
            </div>
          </>
        )}
      </div>
      {formData.questions.map((question, i) => {
        const currentResponses = response
          ? [response.answers[i]]
          : questionResponses.find((q) => q.id === question.id)!.responses;
        const choices =
          question.type === "multiple"
            ? question.choices.map(
                (c) =>
                  currentResponses.filter(
                    (r) =>
                      r && r.type === "multiple" && r.choices.includes(c.id),
                  ).length,
              )
            : null;

        return (
          <div
            key={question.id}
            className="text-black dark:text-gray-300 border-gray-700 border-2 rounded p-5 w-full flex flex-col gap-y-3"
          >
            <div className="text-xs text-black dark:text-gray-300">
              Question {i + 1}
            </div>
            <h2 className="text-black dark:text-white font-bold">
              {question.title}
            </h2>
            {question.description && (
              <p className="text-sm">{question.description}</p>
            )}
            {!response && (
              <div className="text-xs">
                {currentResponses.length} response
                {currentResponses.length === 1 ? "" : "s"}
              </div>
            )}
            <div className="flex flex-col gap-y-2 max-h-50 overflow-auto">
              {question.type === "text" &&
                currentResponses.map((r) => {
                  return r ? (
                    <div
                      key={r.id}
                      className="bg-gray-300 dark:bg-gray-900 rounded px-3 py-1.5"
                    >
                      {r.type === "text" && r.text}
                    </div>
                  ) : null;
                })}
              {question.type === "multiple" &&
                choices &&
                question.choices.map((choice, i) => {
                  const percent =
                    currentResponses.length > 0
                      ? Math.round(
                          (choices[i] / currentResponses.length) * 1000,
                        ) / 10
                      : 0;

                  if (response && !currentResponses[0]) return null;

                  return (
                    (!response ||
                      (currentResponses[0]!.type === "multiple" &&
                        currentResponses[0]?.choices.includes(choice.id))) && (
                      <div
                        key={choice.id}
                        className={`flex items-center border-2 relative overflow-hidden rounded py-1.5 px-3 border-gray-700 ${response && "bg-gray-300 dark:bg-gray-900"}`}
                      >
                        {!response && (
                          <>
                            <div
                              className="bg-gray-300 dark:bg-gray-900 -z-1 absolute h-full top-0 left-0"
                              style={{ width: percent + "%" }}
                            />
                            <div className="absolute right-3 flex gap-x-3 items-center text-xs">
                              {choices[i]} response{choices[i] === 1 ? "" : "s"}
                              <span className="text-base font-bold ml-2">
                                {percent}%
                              </span>
                              {percent !== 0 &&
                                Math.max(...choices) === choices[i] && (
                                  <FaCheckCircle
                                    size={17}
                                    title="Most picked"
                                  />
                                )}
                            </div>
                          </>
                        )}
                        {choice.text}
                      </div>
                    )
                  );
                })}
            </div>
          </div>
        );
      })}
      <AnimatePresence>
        {deleting && (
          <WarningModal
            title="Delete response"
            description={`Are you sure you want to permanently delete ${response?.name}'s response on this form? This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Response;

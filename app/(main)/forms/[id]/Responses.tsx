import type { FormType, ResponseType } from "@/types/Form";
import { prisma } from "@/lib/prisma";
import { FaCheckCircle } from "react-icons/fa";
import Scores from "@/components/forms/Scores";

async function Responses({ formData }: { formData: FormType }) {
  const responseData = await prisma.response.findMany({
    where: { formId: formData.id },
    include: { answers: true },
  });
  const responses: ResponseType[] = responseData.map((res) => {
    return {
      ...res,
      answers: res.answers.map((answer) => {
        return answer.type === "multiple"
          ? {
              ...answer,
              type: "multiple",
              choices: JSON.parse(answer.config as string).choices,
            }
          : {
              ...answer,
              type: "text",
              text: JSON.parse(answer.config as string).text,
            };
      }),
    };
  });
  const questionResponses = formData.questions.map((question) => {
    return {
      id: question.id,
      responses: responses.map((res) => {
        return res.answers.find((a) => a.questionId === question.id);
      }),
    };
  });
  const scores = responses.map((response) => {
    let correct = 0;
    let total = 0;
    formData.questions.forEach((question) => {
      if (question.correct !== undefined) {
        total++;
        const answer = response.answers.find(
          (a) => a.questionId === question.id,
        );
        if (
          answer &&
          ((answer.type === "multiple" &&
            answer.choices[0] === question.correct) ||
            (answer.type === "text" &&
              answer.text.trim().toLowerCase() ===
                question.correct.trim().toLowerCase()))
        ) {
          correct++;
        }
      }
    });
    return total > 0 ? Math.round((correct / total) * 1000) / 10 : 100;
  });
  const sorted = scores.sort((a, b) => a - b);
  const median =
    scores.length % 2 == 0
      ? Math.round(
          (sorted[scores.length / 2] + sorted[scores.length / 2 - 1]) * 5,
        ) / 10
      : sorted[Math.floor(scores.length / 2)];

  return (
    <div className="w-200 mt-8 flex flex-col gap-y-5">
      {formData.quiz && (
        <div className="text-gray-300 border-gray-700 border-2 rounded p-5 w-full flex flex-col gap-y-3">
          <h2 className="text-white font-bold text-lg">
            Quiz score distribution ({scores.length} score
            {scores.length === 1 ? "" : "s"})
          </h2>
          <div className="flex gap-x-10">
            <div>
              <div>Highest score: {Math.max(...scores)}%</div>
              <div>Lowest score: {Math.min(...scores)}%</div>
              <div>
                Average score:{" "}
                {Math.round(
                  (scores.reduce((acc: number, s) => {
                    acc += s;
                    return acc;
                  }, 0) /
                    scores.length) *
                    10,
                ) / 10}
                %
              </div>
              <div>Median score: {median}%</div>
              <Scores scores={sorted} />
            </div>
            <div className="flex-1 flex text-xs gap-x-2">
              {Array(10)
                .fill(0)
                .map((score, i) => {
                  const all = scores.filter(
                    (score) =>
                      score <= 10 * i + 10 &&
                      score >= 10 * i + (i == 0 ? 0 : 1),
                  ).length;
                  const matched = Math.round((all / scores.length) * 100);
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-y-1 h-30 flex-1 justify-end group cursor-pointer"
                    >
                      <div
                        className="bg-gray-900 rounded relative flex justify-center w-full"
                        style={{ height: `${matched}%` }}
                      >
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity! absolute -top-11 w-22
                         text-center  pointer-events-none"
                        >
                          {all} response{all === 1 ? "" : "s"}
                        </span>
                        <span className="absolute bottom-1 text-sm">
                          {matched}%
                        </span>
                      </div>
                      <div>
                        {10 * i + (i == 0 ? 0 : 1)}-{10 * i + 10}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
      {formData.questions.map((question, i) => {
        const currentResponses = questionResponses.find(
          (q) => q.id === question.id,
        )!.responses;
        const choices =
          question.type === "multiple"
            ? question.choices.map(
                (c) =>
                  currentResponses.filter(
                    (r) => r && r.type === "multiple" && r.choices[0] === c.id,
                  ).length,
              )
            : null;

        return (
          <div
            key={question.id}
            className="text-gray-300 border-gray-700 border-2 rounded p-5 w-full flex flex-col gap-y-3"
          >
            <div className="text-xs text-gray-300">Question {i + 1}</div>
            <h2 className="text-white font-bold">{question.title}</h2>
            {question.description && (
              <p className="text-sm">{question.description}</p>
            )}
            <div className="text-xs">
              {currentResponses.length} response
              {currentResponses.length === 1 ? "" : "s"}
            </div>
            <div className="flex flex-col gap-y-2 max-h-50 overflow-auto">
              {question.type === "text" &&
                currentResponses.map((response) => {
                  return response ? (
                    <div
                      key={response.id}
                      className="bg-gray-900 rounded px-3 py-1.5"
                    >
                      {response.type === "text" && response.text}
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

                  return (
                    <div
                      key={choice.id}
                      className="flex items-center border-2 relative overflow-hidden rounded py-1.5 px-3 border-gray-700"
                    >
                      <div
                        className="bg-gray-900 -z-1 absolute h-full top-0 left-0"
                        style={{ width: percent + "%" }}
                      />
                      {choice.text}
                      <div className="absolute right-3 flex gap-x-3 items-center text-xs">
                        {choices[i]} response{choices[i] === 1 ? "" : "s"}
                        <span className="text-base font-bold ml-2">
                          {percent}%
                        </span>
                        {percent !== 0 &&
                          Math.max(...choices) === choices[i] && (
                            <FaCheckCircle size={17} title="Most picked" />
                          )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Responses;

//TODO: optimize this file the logic is terrible and unoptimized

import type { AnswerType, FormType, ResponseType } from "@/types/Form";
import { prisma } from "@/lib/prisma";
import Response from "@/components/forms/Response";
import Scores from "@/components/forms/Scores";

export interface QuestionResponseType {
  id: number;
  responses: (AnswerType | undefined)[];
}

async function Responses({ formData }: { formData: FormType }) {
  const responseData = await prisma.response.findMany({
    where: { formId: formData.id },
    include: { answers: true, user: true },
  });
  let counter = 0;
  const responses: ResponseType[] = responseData.map((res) => {
    return {
      ...res,
      name: res.user?.name || `Anonymous ${++counter}`,
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
    <div className="w-full lg:w-200 mt-8 flex flex-col gap-y-5">
      {formData.quiz && (
        <div className="text-black dark:text-gray-300 border-gray-700 border-2 rounded p-5 w-full flex flex-col gap-y-3">
          <h2 className="text-black dark:text-white font-bold text-lg">
            Quiz score distribution ({scores.length} score
            {scores.length === 1 ? "" : "s"})
          </h2>
          <div className="flex gap-10 flex-col md:flex-row">
            <div>
              <div>
                Highest score: {scores.length > 0 ? Math.max(...scores) : 0}%
              </div>
              <div>
                Lowest score: {scores.length > 0 ? Math.min(...scores) : 0}%
              </div>
              <div>
                Average score:{" "}
                {Math.round(
                  (scores.reduce((acc: number, s) => {
                    acc += s;
                    return acc;
                  }, 0) /
                    scores.length) *
                    10,
                ) / 10 || 0}
                %
              </div>
              <div>Median score: {median || 0}%</div>
              <Scores scores={sorted} />
            </div>
            <div className="flex-1 flex text-xs gap-x-2">
              {Array(10)
                .fill(0)
                .map((_, i) => {
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
                        className="bg-gray-300 dark:bg-gray-900 rounded relative flex justify-center w-full"
                        style={{ height: `${matched}%` }}
                      >
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity! absolute -top-11 w-22
                         text-center  pointer-events-none"
                        >
                          {all} response{all === 1 ? "" : "s"}
                        </span>
                        <span className="absolute bottom-1 text-sm">
                          {matched || 0}%
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
      <Response
        formData={formData}
        questionResponses={questionResponses}
        responses={responses}
      />
    </div>
  );
}

export default Responses;

//TODO: optimize this file the logic is terrible and unoptimized

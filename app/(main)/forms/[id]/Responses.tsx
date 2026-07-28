import type { FormType, ResponseType } from "@/types/Form";
import { prisma } from "@/lib/prisma";
import { FaCheckCircle } from "react-icons/fa";

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

  return (
    <div className="w-200 mt-8 flex flex-col gap-y-5">
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
                    Math.round((choices[i] / currentResponses.length) * 1000) /
                    10;

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
                        {choices[i]} responses{" "}
                        <span className="text-base font-bold ml-2">
                          {percent}%
                        </span>
                        {Math.max(...choices) === choices[i] && (
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

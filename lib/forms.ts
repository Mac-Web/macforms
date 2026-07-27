import type { ChoiceType, FormType, ResponseType } from "@/types/Form";
import { prisma } from "./prisma";
import { getSession } from "./auth";

export async function getFormData(id: string): Promise<FormType | void> {
  try {
    const session = await getSession();
    if (session) {
      //TODO: only logged in users can fetch form data
      const existingForm = await prisma.form.findUnique({
        where: { id }, //TODO: handle permission sometimes needs to check if session user id matches
        include: { questions: true },
      });
      if (existingForm) {
        const {
          id,
          userId,
          title,
          description,
          private: isPrivate,
          code,
          open,
          quiz,
          createdAt,
          updatedAt,
        } = existingForm;

        const formData: FormType = {
          id,
          userId,
          title,
          description: description || undefined,
          private: isPrivate,
          code: code || undefined,
          open,
          quiz,
          createdAt,
          updatedAt,
          questions: existingForm.questions.map((question) => {
            const { id, title, description, optional, type, config, correct } =
              question;
            const base = {
              id,
              title,
              description: description || undefined,
              optional,
              correct: correct || undefined,
            };
            const json = JSON.parse(config as string);
            return type === "multiple"
              ? {
                  ...base,
                  type,
                  choices: json.choices as ChoiceType[],
                }
              : {
                  ...base,
                  type,
                  placeholder: json.placeholder as string,
                };
          }),
        };
        return formData;
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function getResponseData(
  id: string,
): Promise<ResponseType | void> {
  try {
    const existingResponse = await prisma.response.findUnique({
      where: { id },
      include: { answers: true },
    });
    if (existingResponse) {
      const responseData: ResponseType = {
        id,
        formId: existingResponse.formId,
        answers: existingResponse.answers.map((answer) => {
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
      return responseData;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

"use server";

import type { ResponseType } from "@/types/Form";
import { prisma } from "@/lib/prisma";

export async function submitForm(formId: string, response: ResponseType) {
  try {
    const formData = await prisma.form.findUnique({ where: { id: formId } });
    if (formData) {
      const newResponse = await prisma.response.upsert({
        where: { id: response.id },
        update: {
          answers: {
            update: response.answers.map((answer) => {
              return {
                where: { id: answer.id },
                data: {
                  config:
                    answer.type === "text"
                      ? JSON.stringify({ text: answer.text })
                      : JSON.stringify({ choices: answer.choices }),
                },
              };
            }),
          },
        },
        create: {
          ...response,
          id: undefined,
          answers: {
            create: response.answers.map((answer) => {
              return {
                type: answer.type,
                questionId: answer.questionId,
                config:
                  answer.type === "text"
                    ? JSON.stringify({ text: answer.text })
                    : JSON.stringify({ choices: answer.choices }),
              };
            }),
          },
        },
        include: { answers: true },
      });
      return { success: true, id: newResponse.id };
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

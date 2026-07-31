"use server";

import type { ResponseType } from "@/types/Form";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function submitForm(formId: string, response: ResponseType) {
  try {
    const formData = await prisma.form.findUnique({
      where: { id: formId },
      include: { responses: true },
    });
    const session = await getSession();
    if (formData) {
      const existingResponse = (await prisma.response.findUnique({
        where: { id: response.id },
      }))
        ? true
        : false;
      if (existingResponse && !formData.allowEditingResponses)
        return { success: false };
      if (
        formData.allowMultipleResponses ||
        (session &&
          (existingResponse ||
            !formData.responses.find(
              (r) => r.userId && r.userId === session.user.id,
            )))
      ) {
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
            userId: session?.user.id,
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
      } else {
        return {
          message: "You cannot submit multiple responses on this form.",
        };
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function accessForm(formId: string, code: string) {
  try {
    const existingForm = await prisma.form.findUnique({
      where: { id: formId },
    });
    return existingForm && existingForm.private && existingForm.code === code
      ? true
      : false;
  } catch (err) {
    console.error("Error: " + err);
  }
}

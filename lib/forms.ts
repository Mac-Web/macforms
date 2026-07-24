import type { ChoiceType, FormType } from "@/types/Form";
import { prisma } from "./prisma";
import { getSession } from "./auth";

export async function getFormData(id: string): Promise<FormType | void> {
  try {
    const session = await getSession();
    if (session) {
      const existingForm = await prisma.form.findUnique({
        where: { id, userId: session.user.id },
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
        } = existingForm;
        const formData: FormType = {
          id,
          userId,
          title,
          description: description || undefined,
          private: isPrivate,
          code: code || undefined,
          open,
          questions: existingForm.questions.map((question) => {
            const { id, title, description, optional, type, config } = question;
            const base = {
              id,
              title,
              description: description || undefined,
              optional,
            };
            return type === "multiple"
              ? {
                  ...base,
                  type,
                  choices: JSON.parse(JSON.stringify(config))
                    .choices as ChoiceType[],
                }
              : {
                  ...base,
                  type,
                  placeholder: JSON.parse(JSON.stringify(config))
                    .placeholder as string,
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

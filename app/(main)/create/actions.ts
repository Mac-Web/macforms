"use server";

import type { FormType } from "@/types/Form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createForm(formData: FormType) {
  try {
    const session = await getSession();
    if (session) {
      const newForm = await prisma.form.create({
        data: {
          ...formData,
          id: undefined,
          userId: session.user.id,
          questions: {
            create: formData.questions.map((q) => {
              const { title, description, optional, type, correct } = q;
              return {
                title,
                description,
                optional,
                type,
                correct,
                config:
                  type === "text"
                    ? JSON.stringify({ placeholder: q.placeholder })
                    : JSON.stringify({ choices: q.choices }),
              };
            }),
          },
        },
      });
      return newForm.id;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

"use server";

import type { FormType } from "@/types/Form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createForm(formData: FormType) {
  try {
    const session = await getSession();
    if (session) {
      const newForm = await prisma.form.create({
        data: {
          ...formData,
          id: undefined,
          userId: session.user.id,
          collaborators: undefined,
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

export async function editForm(formData: FormType, auto?: boolean) {
  try {
    const session = await getSession();
    if (session) {
      //TODO: allow not signed in collaborators too
      const {
        title,
        description,
        private: isPrivate,
        code,
        open,
        quiz,
      } = formData;
      await prisma.form.update({
        where: {
          id: formData.id,
          OR: [
            { userId: session.user.id },
            { collaborators: { some: { id: session.user.id } } },
          ],
        },
        data: {
          title,
          description,
          private: isPrivate,
          code,
          open,
          quiz,
          questions: {
            deleteMany: { id: { notIn: formData.questions.map((q) => q.id) } },
            upsert: formData.questions.map((q) => {
              const { id, title, description, optional, type, correct } = q;
              const base = {
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
              return {
                where: { id },
                update: base,
                create: base,
              };
            }),
          },
        },
      });
      if (!auto) revalidatePath(`/forms/${formData.id}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

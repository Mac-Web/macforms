"use server";

import type { FormType } from "@/types/Form";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function createForm(formData: FormType) {
  try {
    const session = await getSession();
    if (session) {
      const newForm = await prisma.form.create({
        data: { ...formData, questions: undefined }, //TODO: make this work
      });
      console.log(newForm);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

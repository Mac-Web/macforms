"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteForm(formId: string, path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.delete({
        where: { id: formId, userId: session.user.id },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

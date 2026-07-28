"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteForm(formId: string, path?: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.delete({
        where: { id: formId, userId: session.user.id },
      });
      if (path) {
        revalidatePath(path);
      }
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function starForm(formId: string, starred: boolean, path: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.update({
        where: { id: formId, userId: session.user.id },
        data: { starred },
      });
      revalidatePath(path);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

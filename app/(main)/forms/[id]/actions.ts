"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function addInviteCode(formId: string, code: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.update({
        where: { id: formId, userId: session.user.id },
        data: { codes: { push: code } },
      });
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function removeInviteCode(formId: string, code: string) {
  try {
    const existingForm = await prisma.form.findUnique({
      where: { id: formId },
    });
    if (existingForm && existingForm.codes.includes(code)) {
      await prisma.form.update({
        where: { id: formId },
        data: { codes: { set: existingForm.codes.filter((c) => c !== code) } },
      });
      const cookieStore = await cookies();
      cookieStore.set(`${formId}_access`, "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600,
        path: "/",
      });
      return true;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function renameForm(formId: string, newTitle: string) {
  try {
    const session = await getSession(); //TODO: allow invited one time collaborators to edit too with cookie access
    if (session) {
      await prisma.form.update({
        where: {
          id: formId,
          OR: [
            { userId: session.user.id },
            { collaborators: { some: { id: session.user.id } } },
          ],
        },
        data: { title: newTitle },
      });
      revalidatePath(`/forms/${formId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function inviteCollaborators(formId: string, users: string[]) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.update({
        where: { id: formId, userId: session.user.id },
        data: {
          collaborators: {
            connect: users.map((u) => {
              return { id: u };
            }),
          },
        },
      });
      revalidatePath(`/forms/${formId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function removeCollaborator(formId: string, userId: string) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.update({
        where: { id: formId, userId: session.user.id },
        data: { collaborators: { disconnect: { id: userId } } },
      });
      revalidatePath(`/forms/${formId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function publishForm(formId: string, open: boolean) {
  try {
    const session = await getSession();
    if (session) {
      await prisma.form.update({
        where: {
          id: formId,
          OR: [
            { userId: session.user.id },
            { collaborators: { some: { id: session.user.id } } },
          ],
        },
        data: { open: !open },
      });
      revalidatePath(`/forms/${formId}`);
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

export async function shortenLink(formId: string) {
  try {
    const session = await getSession();
    if (session) {
      const newForm = await prisma.form.update({
        where: {
          id: formId,
          OR: [
            { userId: session.user.id },
            { collaborators: { some: { id: session.user.id } } },
          ],
        },
        data: {
          shortened: crypto.randomUUID().replaceAll("-", "").slice(0, 8), //TODO: shorten even more by using macweb.app root so set up rerouting on root domain too
        },
      });
      revalidatePath(`/forms/${formId}`);
      return newForm.shortened;
    }
  } catch (err) {
    console.error("Error: " + err);
  }
}

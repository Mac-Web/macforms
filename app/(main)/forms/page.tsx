import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Hero from "@/components/layout/Hero";
import Forms from "./Forms";

export const metadata: Metadata = {
  title: "My Forms | MacForms",
  description:
    "Browse, manage, edit, and view all the forms you've created on this page!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "My Forms | MacForms",
    description:
      "Browse, manage, edit, and view all the forms you've created on this page!",
    url: "https://macforms.macweb.app/forms",
    siteName: "MacForms",
    images: [
      {
        url: "/logo.png",
        width: 100,
        height: 100,
      },
    ],
    type: "website",
  },
};

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");
  const forms = await prisma.form.findMany({
    where: {
      OR: [
        { userId: session.user.id },
        { collaborators: { some: { id: session.user.id } } },
      ],
    },
  });

  return (
    <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
      <Hero
        title="My Forms"
        description="Browse, manage, edit, and view all the forms you've created on this page!"
      />
      <Forms forms={forms} userId={session.user.id} />
    </div>
  );
}

export default Page;

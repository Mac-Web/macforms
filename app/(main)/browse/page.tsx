import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import Hero from "@/components/layout/Hero";
import Forms from "./Forms";

export const metadata: Metadata = {
  title: "Browse | MacForms",
  description:
    "Browse and explore public forms other people created on MacForms!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Browse | MacForms",
    description:
      "Browse and explore public forms other people created on MacForms!",
    url: "https://macforms.macweb.app/browse",
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
  const userId = session?.user.id;
  const forms = await prisma.form.findMany({
    where: { NOT: { userId: userId }, private: false, open: true },
    include: { user: true },
    take: 15,
  });

  return (
    <div className="px-5 md:px-20 flex flex-col items-center">
      <Hero
        title="Browse Forms"
        description="Browse and explore public forms other people created on MacForms!"
      />
      <Forms forms={forms} />
    </div>
  );
}

export default Page;

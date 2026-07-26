import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewForm from "./NewForm";

export const metadata: Metadata = {
  title: "Create Form | MacForms",
  description:
    "Create, customize, and manage your own form using the MacForms create form page!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Create Forms | MacForms",
    description:
      "Create, customize, and manage your own form using the MacForms create form page!",
    url: "https://macforms.macweb.app/create",
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

  return (
    <div>
      <h1 className="text-4xl text-white text-center font-bold py-10">
        Create Form
      </h1>
      <NewForm />
    </div>
  );
}

export default Page;

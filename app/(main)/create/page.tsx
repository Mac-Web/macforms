import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewForm from "./NewForm";

export const metadata: Metadata = {
  title: "Create Form | MacForms",
  description:
    "Create, customize, and manage your own form using the MacForms create form page!",
};

async function Page() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div>
      <h1 className="text-3xl text-white text-center font-bold py-10">
        Create Form
      </h1>
      <NewForm />
    </div>
  );
}

export default Page;

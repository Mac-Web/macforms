import type { Metadata } from "next";
import NewForm from "./NewForm";

export const metadata: Metadata = {
  title: "Create Form | MacForms",
  description:
    "Create, customize, and manage your own form using the MacForms create form page!",
};

function Page() {
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

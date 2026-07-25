import { getFormData, getResponseData } from "@/lib/forms";
import { redirect } from "next/navigation";
import Questions from "./Questions";
import Link from "next/link";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const formData = await getFormData(id);
  if (!formData) redirect("/");
  const search = await searchParams;
  const responseId = search?.edit as string;
  const response = responseId ? await getResponseData(responseId) : null;

  return (
    <div className="w-200 mx-auto py-10 flex flex-col gap-y-10 items-center">
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-3xl font-bold">{formData.title}</h1>
        {formData.description && (
          <p className="text-gray-300">{formData.description}</p>
        )}
        <p
          className="text-gray-300 text-xs"
          title={formData.createdAt!.toISOString()}
        >
          Created {formData.createdAt!.toLocaleDateString()}
        </p>
      </div>
      <Questions
        questions={formData.questions}
        formId={formData.id}
        res={response || null}
      />
      <div className="flex flex-col gap-y-3 text-gray-300 text-sm items-center mt-10">
        <Link
          href="/"
          className="flex items-center gap-x-2 text-black dark:text-white text-lg duration-300 py-2 font-bold"
        >
          <Image src="/logo.png" alt="MacForms Logo" width={35} height={35} />{" "}
          MacForms
        </Link>
        <span>
          &copy; {new Date().getFullYear()}{" "}
          <a href="https://macweb.app" target="_blank" className="underline">
            MacWeb
          </a>
        </span>
      </div>
    </div>
  );
}

export default Page;

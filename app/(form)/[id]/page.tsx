import { getFormData, getResponseData } from "@/lib/forms";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { FaEye, FaXmark } from "react-icons/fa6";
import Questions from "./Questions";
import Link from "next/link";
import Image from "next/image";
import { FaQuestionCircle } from "react-icons/fa";

const linkStyles = "underline w-fit hover:text-green-600";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchFormData(id: string) {
  const formData = await getFormData(id);
  if (!formData) redirect("/");
  return formData;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const formData = await fetchFormData(id);

  return {
    title: `${formData.title} | MacForms`,
    description:
      formData.description ||
      `${formData.title} is an online form created using MacForms, a simple and easy to use form creation tool.`,
    authors: [{ name: "MacWeb", url: "https://macweb.app" }],
    openGraph: {
      title: `${formData.title} | MacForms`,
      description:
        formData.description ||
        `${formData.title} is an online form created using MacForms, a simple and easy to use form creation tool.`,
      url: `https://macforms.macweb.app/${formData.id}`,
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
}

async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const formData = await fetchFormData(id);
  const session = await getSession();
  const search = await searchParams;
  const responseId = search?.edit as string;
  const answerId = search?.answer as string;
  const response = responseId ? await getResponseData(responseId) : null;
  const answers = answerId ? await getResponseData(answerId) : null;
  const preview =
    formData.userId === session?.user.id && search?.preview === "true"
      ? true
      : false;

  return (
    <div className="w-200 mx-auto py-10 flex flex-col gap-y-10 items-center">
      <div className="border-2 border-gray-700 rounded p-5 flex flex-col gap-y-5 w-full">
        <h1 className="text-white text-3xl font-bold">{formData.title}</h1>
        {formData.description && (
          <p className="text-gray-300">{formData.description}</p>
        )}
        {formData.quiz && (
          <p
            className="text-gray-300 text-sm flex items-center gap-x-3"
            title="This form is a quiz with correct answers"
          >
            <FaQuestionCircle size={17} /> Quiz
          </p>
        )}
        <p
          className="text-gray-300 text-xs"
          title={formData.createdAt!.toISOString()}
        >
          Created {formData.createdAt!.toLocaleDateString()}
        </p>
      </div>
      {formData.open || (formData.userId === session?.user.id && preview) ? (
        <Questions
          questions={formData.questions}
          formId={formData.id}
          res={response || null}
          answers={answers || null}
          quiz={formData.quiz}
          preview={preview}
          isPrivate={formData.private}
        />
      ) : (
        <div className="border-2 border-gray-700 rounded px-5 py-10 flex flex-col gap-y-5 w-full text-gray-300">
          Sorry, the owner of this form has not opened it to accept responses
          yet.
          <Link href="/" className={linkStyles}>
            Go back to MacForms
          </Link>
          {formData.userId === session?.user.id && (
            <Link href="?preview=true" className={linkStyles}>
              Go to preview (owner only)
            </Link>
          )}
        </div>
      )}
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
      {preview && (
        <div
          className="bg-gray-950 rounded border-2 border-gray-700 flex items-center gap-x-3 text-gray-300 px-4 py-2 fixed
        right-3 top-3"
        >
          <FaEye size={20} />
          This is a preview of the form
          <Link href={`/forms/${formData.id}`}>
            <FaXmark size={20} title="Go back" />
          </Link>
        </div>
      )}
    </div>
  );
}

export default Page;

import { getSession } from "@/lib/auth";
import { getFormData } from "@/lib/forms";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Access from "@/components/forms/Access";
import Bar from "./Bar";
import Responses from "./Responses";
import Settings from "./Settings";
import Edit from "./Edit";

async function fetchFormData(id: string) {
  const formData = await getFormData(id);
  if (!formData) redirect("/");
  return formData;
}

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { id } = await params;
  const formData = await fetchFormData(id);
  const search = await searchParams;
  const tab = (search?.tab as string)?.toLowerCase() || "";
  let title = `Edit ${formData.title}`;
  let param = "";
  if (tab === "responses") {
    title = `${formData.title} Responses`;
    param = "?tab=responses";
  } else if (tab === "settings") {
    title = `${formData.title} Settings`;
    param = "?tab=settings";
  }

  return {
    title: `${title} | MacForms`,
    description: `Edit and configure ${formData.title}'s questions, information, and form settings.`,
    authors: [{ name: "MacWeb", url: "https://macweb.app" }],
    openGraph: {
      title: `${title} | MacForms`,
      description: `Edit and configure ${formData.title}'s questions, information, and form settings.`,
      url: `https://macforms.macweb.app/forms/${formData.id}${param}`,
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
  const search = await searchParams;
  const tab = (search.tab as string)?.toLowerCase() || "";
  const code = search.code as string;
  const session = await getSession();
  const cookieStore = await cookies();
  const cookieAccess =
    formData.userId === session?.user.id ||
    cookieStore.get(`${id}_access`)?.value === "true";
  if (
    (!session || session.user.id !== formData.userId) &&
    !cookieAccess &&
    !code
  ) {
    redirect("/");
  }

  return (
    <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
      {code && !cookieAccess ? (
        <div className="w-150 border-gray-700 rounded border-2 flex flex-col gap-y-5 p-5 mt-5">
          <h2 className="text-lg text-white font-bold">
            You can use the one-time code {code} to edit the form{" "}
            {formData.title}
          </h2>
          {formData.description && (
            <p className="text-gray-300">
              {formData.description.slice(0, 50) +
                (formData.description.length > 50 ? "..." : "")}
            </p>
          )}
          <Access formId={id} code={code} />
        </div>
      ) : (
        <>
          <Bar title={formData.title} id={id} tab={tab} />
          {tab !== "responses" && tab !== "settings" && (
            <Edit formData={formData} />
          )}
          {tab === "responses" && <Responses formData={formData} />}
          {tab === "settings" && <Settings />}
        </>
      )}
    </div>
  );
}

export default Page;

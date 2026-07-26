import { getSession } from "@/lib/auth";
import { getFormData } from "@/lib/forms";
import { redirect } from "next/navigation";
import Hero from "@/components/layout/Hero";

async function fetchFormData(id: string) {
  const session = await getSession();
  if (!session) redirect("/");
  const formData = await getFormData(id);
  if (!formData) redirect("/");
  return formData;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const formData = await fetchFormData(id);

  return {
    title: `Edit ${formData.title} | MacForms`,
    description: `Edit and configure ${formData.title}'s questions, information, and form settings.`,
    authors: [{ name: "MacWeb", url: "https://macweb.app" }],
    openGraph: {
      title: `Edit ${formData.title} | MacForms`,
      description: `Edit and configure ${formData.title}'s questions, information, and form settings.`,
      url: `https://macforms.macweb.app/forms/${formData.id}`,
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

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const formData = await fetchFormData(id);

  return (
    <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
      <Hero title={formData.title} description={formData.description || ""} />
      <p className="text-gray-300">Form editing coming soon!</p>
    </div>
  );
}

export default Page;

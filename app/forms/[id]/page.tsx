import { getSession } from "@/lib/auth";
import { getFormData } from "@/lib/forms";
import { redirect } from "next/navigation";
import Hero from "@/components/layout/Hero";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/");
  const formData = await getFormData(id);
  if (!formData) redirect("/");

  return (
    <div className="px-5 md:px-20 lg:px-[calc(50%-550px)] flex flex-col items-center">
      <Hero title={formData.title} description={formData.description || ""} />
      <p className="text-gray-300">Form editing coming soon!</p>
    </div>
  );
}

export default Page;

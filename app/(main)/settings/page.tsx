import type { Metadata } from "next";
import Hero from "@/components/layout/Hero";

export const metadata: Metadata = {
  title: "Settings | MacForms",
  description:
    "Manage your MacForms preferences, settings, and defaults on this page!",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Settings | MacForms",
    description:
      "Manage your MacForms preferences, settings, and defaults on this page!",
    url: "https://macforms.macweb.app/settings",
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

function Page() {
  return (
    <div className="flex flex-col gap-y-10 items-center">
      <Hero
        title="Settings"
        description="Manage your MacForms preferences, settings, and defaults on this page!"
      />
      <div className="text-gray-300">Settings coming soon!</div>
    </div>
  );
}

export default Page;

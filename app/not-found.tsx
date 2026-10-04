import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import NotFoundBtn from "@/components/layout/NotFound";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Btn from "@/components/ui/Btn";
import "./globals.css";

export const metadata: Metadata = {
  title: "Not Found | MacForms",
  description: "Oops, this page doesn't exist on MacForms...",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "Not Found | MacForms",
    description: "Oops, this page doesn't exist on MacForms...",
    url: "https://macforms.macweb.app",
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

function NotFound() {
  return (
    <ThemeProvider attribute="class">
      <Nav />
      <div className="flex flex-col gap-y-10 items-center pt-30 pb-18">
        <h1 className="text-9xl font-bold text-black dark:text-white">404</h1>
        <p className="text-zinc-700 dark:text-zinc-300">
          Oops, this page doesn&apos;t exist on MacForms...
        </p>
        <div className="flex gap-x-5">
          <Btn text="Home" link="/" primary />
          <NotFoundBtn />
        </div>
      </div>
      <Footer />
    </ThemeProvider>
  );
}

export default NotFound;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home | MacForms",
  description:
    "A simple and easy to use form creation tool with a ton of features.",
  authors: [{ name: "MacWeb", url: "https://macweb.app" }],
  openGraph: {
    title: "MacForms",
    description:
      "A simple and easy to use form creation tool with a ton of features.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class">
          <NextTopLoader
            showSpinner={false}
            height={2}
            initialPosition={0.1}
            shadow={false}
            template='<div class="bar bg-green-500! dark:bg-green-600!" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
          />
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

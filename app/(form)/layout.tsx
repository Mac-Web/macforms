import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Animate from "@/components/layout/Animate";
import NextTopLoader from "nextjs-toploader";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Home | MacForms",
  description:
    "A simple and easy to use form creation tool with a ton of features.",
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
          <Animate>{children}</Animate>
        </ThemeProvider>
      </body>
    </html>
  );
}

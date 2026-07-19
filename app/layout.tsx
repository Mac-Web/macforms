import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Nav from "@/components/layout/Nav";
import "./globals.css";

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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}

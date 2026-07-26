"use client";

import type { Form } from "@/generated/prisma/client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Card from "@/components/forms/Card";
import Link from "next/link";
import { FaPlusCircle } from "react-icons/fa";

function Forms({ forms }: { forms: Form[] }) {
  const [search, setSearch] = useState<string>("");
  const displayedForms = forms.filter((form) => {
    const query = search.trim().toLowerCase();
    return (
      form.title.toLowerCase().includes(query) ||
      form.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-y-10 items-center">
      <Input
        placeholder="Search forms"
        value={search}
        setValue={(s) => setSearch(s)}
        styles="w-100"
        clear
      />
      <div className="flex flex-wrap justify-center gap-5">
        {displayedForms.length > 0 ? (
          <>
            {displayedForms.map((form) => (
              <Card key={form.id} form={form} />
            ))}
            <Link
              href="/create"
              className="h-auto flex flex-col items-center justify-center text-gray-300 gap-y-3 py-5 border-2 border-dashed border-gray-700 rounded hover:bg-gray-900 w-50"
            >
              <FaPlusCircle size={25} />
              Create form
            </Link>
          </>
        ) : (
          <div className="my-5 text-gray-300">
            No forms found!{" "}
            <Link href="/create" className="underline">
              Create one
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Forms;

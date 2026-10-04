"use client";

import type { FormType } from "@/components/forms/Public";
import { useState } from "react";
import Public from "@/components/forms/Public";
import Input from "@/components/ui/Input";
import Link from "next/link";

function Forms({ forms }: { forms: FormType[] }) {
  const [search, setSearch] = useState<string>("");
  const displayForms = forms.filter((f) =>
    [f.title, f.description]
      .join(" ")
      .trim()
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex flex-col items-center gap-y-10">
      <Input
        placeholder="Search forms"
        value={search}
        setValue={(s) => setSearch(s)}
        styles="w-full sm:w-100"
        clear
      />
      {/* FIXME: add sort/filter dropdowns */}
      <div className="text-black dark:text-gray-300 flex gap-5 flex-wrap justify-center">
        {displayForms.length > 0 ? (
          displayForms.map((form, i) => (
            <Public key={form.id} form={form} index={i} />
          ))
        ) : (
          <div className="text-gray-800 dark:text-gray-300 py-10">
            {forms.length > 0
              ? "No matching public forms found. "
              : "There aren't any public forms yet. "}
            <Link href="/create" className="underline">
              Create one
            </Link>
            ?
          </div>
        )}
      </div>
    </div>
  );
}

export default Forms;

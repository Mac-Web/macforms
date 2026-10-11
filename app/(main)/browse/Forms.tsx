"use client";

import type { FormType } from "@/components/forms/Public";
import { useState } from "react";
import { FaArrowsAltV, FaFilter, FaList } from "react-icons/fa";
import Public from "@/components/forms/Public";
import Input from "@/components/ui/Input";
import Link from "next/link";
import Dropdown from "@/components/ui/Dropdown";

const filters = ["All", "Quizzes"];
const sorts = ["Name", "Created", "Updated", "Type"];
const optionStyles = "flex items-center gap-x-3 text-black dark:text-gray-300";

function Forms({ forms }: { forms: FormType[] }) {
  const [search, setSearch] = useState<string>("");
  const [filter, setFilter] = useState<string>(filters[0]);
  const [sort, setSort] = useState<string>(sorts[0]);
  const [ascending, setAscending] = useState<boolean>(true);
  const displayForms = forms
    .filter((form) => {
      let passed = [form.title, form.description]
        .join(" ")
        .trim()
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      switch (filter) {
        case "Quizzes":
          passed = form.quiz;
          break;
      }
      return passed;
    })
    .sort((a, b) => {
      switch (sort) {
        case "Name":
          return a.title.localeCompare(b.title);
        case "Created":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "Updated":
          return a.updatedAt.getTime() - b.updatedAt.getTime();
        case "Type":
          return String(b.quiz).localeCompare(String(a.quiz));
        default:
          return a.id.localeCompare(b.id);
      }
    });
  if (!ascending) displayForms.reverse();

  return (
    <div className="flex flex-col items-center gap-y-10">
      <Input
        placeholder="Search forms"
        value={search}
        setValue={(s) => setSearch(s)}
        styles="w-full sm:w-100"
        clear
      />
      <div className="flex gap-x-10 gap-y-5 flex-wrap justify-center">
        <label className={optionStyles}>
          <FaFilter /> Filter by:{" "}
          <Dropdown
            selected={filters.find((f) => f === filter)!}
            setSelected={(f) => setFilter(f)}
            values={filters}
            styles="w-25 text-center"
          />
        </label>
        <label className={optionStyles}>
          <FaList /> Sort by:{" "}
          <Dropdown
            selected={sorts.find((s) => s === sort)!}
            setSelected={(s) => setSort(s)}
            values={sorts}
            styles="w-30 text-center"
          />
        </label>
        <label className={optionStyles}>
          <FaArrowsAltV /> Order:{" "}
          <Dropdown
            selected={ascending ? "Ascending" : "Descending"}
            setSelected={(o) => setAscending(o.includes("Asc") ? true : false)}
            values={["Ascending", "Descending"]}
            styles="w-30 text-center"
          />
        </label>
      </div>
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

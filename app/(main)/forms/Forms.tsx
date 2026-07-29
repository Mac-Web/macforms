"use client";

import type { Form } from "@/generated/prisma/client";
import { useState } from "react";
import { FaArrowsAltV, FaFilter, FaList, FaPlusCircle } from "react-icons/fa";
import Input from "@/components/ui/Input";
import Card from "@/components/forms/Card";
import Dropdown from "@/components/ui/Dropdown";
import Link from "next/link";

const filters = [
  "All",
  "Quizzes",
  "Starred",
  "Shared",
  "Owned",
  "Private",
  "Open",
];
const sorts = [
  "Name",
  "Created",
  "Updated",
  "Starred",
  "Shared",
  "Owned",
  "Type",
];
const optionStyles = "flex items-center gap-x-3 text-gray-300";

interface FormsProps {
  forms: Form[];
  userId: string;
}

function Forms({ forms, userId }: FormsProps) {
  const [filter, setFilter] = useState<string>("all");
  const [sort, setSort] = useState<string>("name");
  const [ascending, setAscending] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const displayedForms = forms
    .filter((form) => {
      const query = search.trim().toLowerCase();
      let passed = true;
      switch (filter) {
        case "quizzes":
          passed = form.quiz;
          break;
        case "starred":
          passed = form.starred;
          break;
        case "private":
          passed = form.private;
          break;
        case "open":
          passed = form.open;
          break;
        case "shared":
          passed = form.userId !== userId;
          break;
        case "owned":
          passed = form.userId === userId;
          break;
      }
      return (
        passed &&
        (form.title.toLowerCase().includes(query) ||
          form.description?.toLowerCase().includes(query))
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "name":
          return a.title.localeCompare(b.title);
        case "created":
          return a.createdAt.getTime() - b.createdAt.getTime();
        case "updated":
          return a.updatedAt.getTime() - b.updatedAt.getTime();
        case "type":
          return String(b.quiz).localeCompare(String(a.quiz));
        case "starred":
          return String(b.starred).localeCompare(String(a.starred));
        case "shared":
          return String(b.userId !== userId).localeCompare(
            String(a.userId !== userId),
          );
        case "owned":
          return String(b.userId === userId).localeCompare(
            String(a.userId === userId),
          );
        default:
          return a.id.localeCompare(b.id);
      }
    });
  if (!ascending) displayedForms.reverse();

  return (
    <div className="flex flex-col gap-y-10 items-center">
      <Input
        placeholder="Search forms"
        value={search}
        setValue={(s) => setSearch(s)}
        styles="w-100"
        clear
      />
      <div className="flex gap-x-10">
        <label className={optionStyles}>
          <FaFilter /> Filter by:{" "}
          <Dropdown
            selected={filters.find((f) => f.toLowerCase() === filter)!}
            setSelected={(f) => setFilter(f.toLowerCase())}
            values={filters}
            styles="w-25 text-center"
          />
        </label>
        <label className={optionStyles}>
          <FaList /> Sort by:{" "}
          <Dropdown
            selected={sorts.find((s) => s.toLowerCase() === sort)!}
            setSelected={(s) => setSort(s.toLowerCase())}
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
      <div className="flex flex-wrap justify-center gap-5">
        {displayedForms.length > 0 ? (
          <>
            {displayedForms.map((form) => (
              <Card
                key={form.id}
                form={form}
                shared={form.userId !== userId}
                userId={userId}
              />
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

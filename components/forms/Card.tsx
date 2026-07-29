"use client";

import type { Form } from "@/generated/prisma/client";
import { SiGoogleforms } from "react-icons/si";
import {
  FaQuestionCircle,
  FaRegStar,
  FaStar,
  FaEyeSlash,
  FaGlobe,
  FaEye,
  FaLock,
} from "react-icons/fa";
import { starForm } from "@/app/(main)/forms/actions";
import Link from "next/link";
import Menu from "./Menu";

interface CardProps {
  form: Form;
  shared?: boolean;
  userId: string;
}

function Card({ form, shared, userId }: CardProps) {
  async function handleStar(e: React.MouseEvent) {
    e.preventDefault();
    await starForm(form.id, !form.starred, "/forms");
  }

  return (
    <div className="relative">
      <Link
        href={`/forms/${form.id}`}
        className="h-full border-gray-700 border-2 rounded p-5 flex flex-col gap-y-3 text-gray-300 w-50 hover:bg-gray-900"
      >
        <SiGoogleforms size={25} />{" "}
        {/*TODO: replace this icon with iframe preview of actual, user custom upload banner, or smth else*/}
        <h2 className="text-lg text-white font-bold">{form.title}</h2>
        <div className="flex gap-x-2 items-center flex-wrap">
          <div
            onClick={handleStar}
            title={`${form.starred ? "Unstar" : "Star"} form`}
          >
            {form.starred ? (
              <FaStar size={15} className="text-green-600" />
            ) : (
              <FaRegStar size={15} />
            )}
          </div>
          {form.private ? (
            <FaLock size={15} title="Private" />
          ) : (
            <FaGlobe size={15} title="Public" />
          )}
          {form.open ? (
            <FaEye size={15} title="Accepting responses" />
          ) : (
            <FaEyeSlash size={15} title="Not accepting responses" />
          )}
          {form.quiz && <FaQuestionCircle size={15} title="Quiz" />}
          {shared && (
            <span
              className="bg-gray-800/50 text-xs text-gray-300 font-normal px-2 py-1 rounded"
              title="You've been invited as a collaborator for this form"
            >
              Shared
            </span>
          )}
        </div>
        {form.description && (
          <p className="text-sm">
            {form.description.slice(0, 50) +
              (form.description.length > 50 ? "..." : "")}
          </p>
        )}
        <div className="text-xs">
          Last updated{" "}
          <span title={form.updatedAt!.toISOString()}>
            {form.updatedAt!.toLocaleDateString()}
          </span>
        </div>
      </Link>
      <Menu form={form} path="/forms" userId={userId} />
    </div>
  );
}

export default Card;

import type { Form } from "@/generated/prisma/client";
import { SiGoogleforms } from "react-icons/si";
import Link from "next/link";
import Menu from "./Menu";

function Card({ form }: { form: Form }) {
  return (
    <div className="relative">
      <Link
        href={`/forms/${form.id}`}
        className="h-full border-gray-700 border-2 rounded p-5 flex flex-col gap-y-3 text-gray-300 w-50 hover:bg-gray-900"
      >
        <SiGoogleforms size={25} />{" "}
        {/*TODO: replace this icon with iframe preview of actual, user custom upload banner, or smth else*/}
        <h2 className="text-xl text-white font-bold">{form.title}</h2>
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
      <Menu form={form} path="/forms" />
    </div>
  );
}

export default Card;

"use client";

import type { Form, User } from "@/generated/prisma/client";
import { SiGoogleforms } from "react-icons/si";
import { FaQuestionCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export type FormType = Form & {
  user: User;
};

interface PublicProps {
  form: FormType;
  index?: number;
}

function Public({ form, index }: PublicProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, type: "spring", delay: 0.1 * (index || 0) }}
      className="relative"
    >
      <Link
        href={`/${form.id}/`}
        className="h-full border-gray-700 border-2 rounded p-5 flex flex-col gap-y-3 text-black dark:text-gray-300 w-50 hover:bg-gray-300 dark:hover:bg-gray-900"
      >
        <SiGoogleforms size={25} />{" "}
        {/*TODO: replace this icon with iframe preview of actual, user custom upload banner, or smth else*/}
        <h2 className="text-lg text-black dark:text-white font-bold">
          {form.title}
        </h2>
        <div
          onClick={(e: React.MouseEvent) => {
            e.preventDefault();
            window.open(`https://macweb.app/profile/${form.user.id}`, "_blank");
          }}
          className="hover:underline text-sm flex gap-x-3 items-center font-bold"
        >
          <Image
            src={form.user.image || "/avatar.svg"}
            alt="Avatar"
            width={25}
            height={25}
            className="rounded-full"
          />
          {form.user.name}
        </div>
        <div className="flex gap-x-2 items-center flex-wrap">
          {form.quiz && <FaQuestionCircle size={15} title="Quiz" />}
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
    </motion.div>
  );
}

export default Public;

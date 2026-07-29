"use client";

import type { Form } from "@/generated/prisma/client";
import {
  FaEllipsisV,
  FaEye,
  FaPen,
  FaTrash,
  FaRegStar,
  FaStar,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteForm, starForm } from "@/app/(main)/forms/actions";
import WarningModal from "../modals/WarningModal";
import Link from "next/link";

const optionStyles =
  "flex items-center gap-x-3 px-3 py-1.5 cursor-pointer rounded hover:bg-gray-900";

interface MenuProps {
  form: Form;
  path: string;
  userId: string;
}

function Menu({ form, path, userId }: MenuProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  async function handleDelete() {
    setLoading(true);
    await deleteForm(form.id, path);
    setLoading(false);
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div ref={menuRef} className="absolute top-2 right-2 text-gray-300">
      <FaEllipsisV
        size={30}
        className="rounded-full p-2 cursor-pointer hover:bg-gray-900"
        onClick={() => setMenuOpen(!menuOpen)}
      />
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="origin-top-right absolute right-0 top-8 bg-gray-950 border-2 border-gray-700 rounded text-sm p-2 flex flex-col gap-y-1"
          >
            <Link href={`/forms/${form.id}`} className={optionStyles}>
              <FaPen size={17} /> Edit
            </Link>
            <Link href={`/${form.id}?preview=true`} className={optionStyles}>
              <FaEye size={17} /> Preview
            </Link>
            <div
              className={optionStyles}
              onClick={async () => await starForm(form.id, !form.starred, path)}
            >
              {form.starred ? (
                <FaStar size={17} className="text-green-600" />
              ) : (
                <FaRegStar size={17} />
              )}{" "}
              {form.starred ? "Unstar" : "Star"}
            </div>
            {form.userId === userId && (
              <div
                className={optionStyles + " text-red-500"}
                onClick={() => setDeleting(true)}
              >
                <FaTrash size={17} /> Delete
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {deleting && (
          <WarningModal
            title="Delete confirmation"
            description={`Are you sure you want to delete the form "${form.title}"? This will delete all its related data and responses. This action cannot be undone.`}
            confirm={handleDelete}
            closeModal={() => setDeleting(false)}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Menu;

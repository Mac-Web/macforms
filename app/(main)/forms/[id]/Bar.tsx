"use client";

import type { User } from "@/generated/prisma/client";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { renameForm } from "./actions";
import InviteModal from "@/components/modals/InviteModal";
import Input from "@/components/ui/Input";
import Btn from "@/components/ui/Btn";
import Link from "next/link";

const linkStyles = "text-gray-300 px-3 py-1.5 hover:bg-gray-900 rounded";

interface BarProps {
  title: string;
  id: string;
  tab: string;
  users: User[];
  userId: string;
  isOwner?: boolean;
  updated?: boolean;
}

function Bar({ title, id, tab, users, userId, isOwner, updated }: BarProps) {
  const [name, setName] = useState<string | null>(null);
  const [inviting, setInviting] = useState<boolean>(false);

  async function handleRename(e?: React.SubmitEvent) {
    e?.preventDefault();
    if (name && name.trim() !== title && name.trim().length > 0) {
      await renameForm(id, name);
    }
    setName(null);
  }

  return (
    <div className="sticky top-20 w-full z-10">
      <div className="w-full p-2.5 border-2 bg-gray-950 border-gray-700 relative rounded flex justify-center items-center">
        <form
          onSubmit={handleRename}
          className="absolute left-2.5 flex items-center gap-x-3"
        >
          {name !== null ? (
            <Input
              placeholder="Form name"
              value={name}
              setValue={(n) => setName(n)}
              onblur={handleRename}
              styles="w-fit!"
            />
          ) : (
            <h2
              className="text-xl text-white font-bold cursor-pointer pl-3"
              onClick={() => setName(title)}
            >
              {title}
            </h2>
          )}
          <div
            className={`text-gray-300 text-sm ${updated ? "opacity-100" : "opacity-0"} transition-opacity!`}
          >
            Form autosaved
          </div>
        </form>
        <div className="flex gap-x-3">
          <Link
            href={`/forms/${id}`}
            className={`${linkStyles} ${tab !== "responses" && tab !== "settings" && "text-green-600! font-bold"}`}
          >
            Edit
          </Link>
          {["Responses", "Settings"].map((text, i) => {
            return (
              <Link
                key={i}
                href={`/forms/${id}?tab=${text.toLowerCase()}`}
                className={`${linkStyles} ${tab === text.toLowerCase() && "text-green-600! font-bold"}`}
              >
                {text}
              </Link>
            );
          })}
        </div>
        <div className="absolute right-2.5 flex gap-x-2">
          {isOwner && (
            <Btn
              text="Invite"
              onclick={() => setInviting(true)}
              styles="text-[16px]"
            />
          )}
          <Btn
            text="Preview"
            link={`/${id}?preview=true`}
            styles="text-[16px]"
            primary={!isOwner}
          />
          {isOwner && (
            <Btn
              text="Publish"
              onclick={() => console.log("publish")}
              styles="text-[16px]"
              primary
            />
          )}
        </div>
      </div>
      <AnimatePresence>
        {inviting && (
          <InviteModal
            id={id}
            closeModal={() => setInviting(false)}
            users={users}
            userId={userId}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Bar;

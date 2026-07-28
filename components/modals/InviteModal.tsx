"use client";

import type { User } from "@/generated/prisma/client";
import { useState } from "react";
import {
  addInviteCode,
  inviteCollaborators,
  removeCollaborator,
} from "@/app/(main)/forms/[id]/actions";
import { FaCheck, FaSpinner, FaTrash } from "react-icons/fa";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";
import Image from "next/image";

interface InviteModal {
  id: string;
  closeModal: () => void;
  users: User[];
  userId: string;
}

async function addCode(id: string, newCode: string) {
  await addInviteCode(id, newCode);
}

function InviteModal({ id, closeModal, users, userId }: InviteModal) {
  const [search, setSearch] = useState<string>("");
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  async function handleCopy() {
    const newCode = crypto.randomUUID().slice(0, 8);
    navigator.clipboard.writeText(
      `https://macforms.macweb.app/forms/${id}?code=${newCode}`,
    );
    await addCode(id, newCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  async function handleSearch(e: React.SubmitEvent) {
    e.preventDefault();
    if (search.trim()) {
      setLoading(true);
      setSearchedUsers([]);
      setError(null);
      const res = await fetch(
        `/api/users?q=${search.trim().toLowerCase()}`,
      ).then((res) => res.json());
      if (res.success) {
        const userIds = [userId, ...users.map((u) => u.id)];
        setSearchedUsers(
          res.users.filter((u: User) => !userIds.includes(u.id)),
        );
      } else if (res.error) {
        setError(res.error);
      }
      setLoading(false);
    }
  }

  async function handleInvite() {
    setLoading(true);
    await inviteCollaborators(id, selectedUsers);
    setLoading(false);
    setSelectedUsers([]);
    setSearchedUsers([]);
  }

  async function handleRemove(userId: string) {
    if (!removing) {
      setRemoving(userId);
      await removeCollaborator(id, userId);
      setRemoving(null);
    }
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Invite collaborators</h2>
        <form onSubmit={handleSearch} className="relative">
          <Input
            placeholder="Search MacWeb accounts"
            value={search}
            setValue={(s) => setSearch(s)}
            onclear={() => setSearchedUsers([])}
            clear
          />
        </form>
        <div className="max-h-50 overflow-auto w-full flex flex-col gap-y-2">
          {searchedUsers.length > 0 ? (
            searchedUsers.map((user) => {
              const selected = selectedUsers.includes(user.id);
              return (
                <div
                  key={user.id}
                  className="border-2 border-gray-700 hover:bg-gray-900 px-3 py-1.5 rounded cursor-pointer flex gap-x-3 items-center text-gray-300 font-bold"
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      selected
                        ? prev.filter((u) => u !== user.id)
                        : [...prev, user.id],
                    )
                  }
                >
                  <div
                    className={`w-4.5 h-4.5 border-2 border-gray-700 rounded flex justify-center items-center ${selected && "bg-gray-700"}`}
                  >
                    <FaCheck
                      size={20}
                      className={`transition-opacity! ${selected ? "opacity-100" : "opacity-0"}`}
                    />
                  </div>
                  <Image
                    src={user.image || "/avatar.svg"}
                    alt="Avatar"
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                  {user.name}
                </div>
              );
            })
          ) : error ? (
            <div className="text-red-500 text-center text-sm">{error}</div>
          ) : (
            <div className="text-gray-300 text-center text-sm">
              {loading
                ? "Loading..."
                : "No users found. Press enter to search users"}
            </div>
          )}
        </div>
        {searchedUsers.length > 0 && selectedUsers.length > 0 && (
          <Btn
            text={
              loading
                ? "Inviting..."
                : `Invite ${selectedUsers.length} collaborator${selectedUsers.length === 1 ? "" : "s"}`
            }
            onclick={handleInvite}
            styles="text-sm w-full"
            primary
          />
        )}
        {users.length > 0 && (
          <div>
            <h2 className="text-white font-bold mb-1">Collaborators</h2>
            <div className="flex flex-col gap-y-2 max-h-35 overflow-auto">
              {users.map((user) => {
                return (
                  <div
                    key={user.id}
                    className="relative border-2 border-gray-700 px-3 py-1.5 rounded flex gap-x-3 items-center text-gray-300 font-bold"
                  >
                    <Image
                      src={user.image || "/avatar.svg"}
                      alt="Avatar"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                    {user.name}
                    <div
                      className="absolute right-3 flex gap-x-1 items-center"
                      onClick={() => handleRemove(user.id)}
                    >
                      {removing === user.id && (
                        <FaSpinner
                          className="text-gray-300 animate-spin"
                          size={15}
                        />
                      )}
                      <FaTrash
                        className="text-red-500 cursor-pointer"
                        size={15}
                        title="Remove access"
                      />
                      {/* TODO: add confirmation modal for removing collaborators */}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="h-0.5 bg-gray-700 flex justify-center items-center my-3">
          <div className="bg-gray-950 px-3 text-gray-300 text-sm">or</div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="text-gray-300">Use one-time invite link</div>
          <div className="bg-gray-900 rounded px-3 py-1.5 wrap-normal scrollbar-none whitespace-nowrap overflow-x-auto text-gray-300 text-sm">
            macforms.macweb.app/forms/{id}?code=CODE
          </div>
          <Btn
            text={copied ? "Copied!" : "Copy"}
            onclick={handleCopy}
            styles="text-sm"
            primary
          />
        </div>
      </div>
    </Modal>
  );
}

export default InviteModal;

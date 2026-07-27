"use client";

import { useState, useMemo } from "react";
import { addInviteCode } from "@/app/(main)/forms/[id]/actions";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Btn from "../ui/Btn";

interface InviteModal {
  id: string;
  closeModal: () => void;
}

async function addCode(id: string, newCode: string) {
  await addInviteCode(id, newCode);
}

function InviteModal({ id, closeModal }: InviteModal) {
  const [search, setSearch] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const code = useMemo<string>(() => {
    const newCode = crypto.randomUUID().slice(0, 8);
    addCode(id, newCode);
    return newCode;
  }, [id]);

  function handleCopy() {
    navigator.clipboard.writeText(
      `https://macforms.macweb.app/forms/${id}?code=${code}`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Invite collaborators</h2>
        <Input
          placeholder="Search MacWeb accounts"
          value={search}
          setValue={(s) => setSearch(s)}
        />
        {/* TODO: add API for user searching */}
        <div className="h-0.5 bg-gray-700 flex justify-center items-center my-3">
          <div className="bg-gray-950 px-3 text-gray-300 text-sm">or</div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div className="text-gray-300">Use one-time invite link</div>
          <div className="bg-gray-900 rounded px-3 py-1.5 wrap-normal scrollbar-none whitespace-nowrap overflow-x-auto text-gray-300 text-sm">
            macforms.macweb.app/forms/{id}?code={code}
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

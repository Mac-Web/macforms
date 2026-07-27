"use client";

import { useState } from "react";
import { removeInviteCode } from "@/app/(main)/forms/[id]/actions";
import Btn from "../ui/Btn";

interface AccessProps {
  formId: string;
  code: string;
}

function Access({ formId, code }: AccessProps) {
  const [canEdit, setCanEdit] = useState<boolean>(true);

  async function accessForm() {
    const res = (await removeInviteCode(formId, code)) ? true : false;
    setCanEdit(res);
  }

  return canEdit ? (
    <Btn text="Edit form" onclick={accessForm} primary />
  ) : (
    <div className="text-gray-300">
      Sorry, this code is either invalid or expired
    </div>
  );
}

export default Access;

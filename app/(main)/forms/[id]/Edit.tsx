"use client";

import type { FormType } from "@/types/Form";
import type { User } from "@/generated/prisma/client";
import { useState } from "react";
import Bar from "./Bar";
import NewForm from "../../create/NewForm";

interface EditProps {
  formData: FormType;
  users: User[];
  userId: string;
}

function Edit({ formData, users, userId }: EditProps) {
  const [updated, setUpdated] = useState<boolean>(false);

  return (
    <>
      <Bar
        title={formData.title}
        id={formData.id}
        tab="edit"
        users={users}
        userId={userId}
        isOwner={userId === formData.userId}
        updated={updated}
      />
      <div className="w-200 mt-8 flex flex-col gap-y-5">
        <NewForm formData={formData} setUpdated={setUpdated} />
      </div>
    </>
  );
}

export default Edit;

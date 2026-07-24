"use client";

import type { User } from "better-auth";
import NavUser from "./NavUser";
import Btn from "../ui/Btn";

function User({ user }: { user: User | undefined }) {
  return user ? (
    <NavUser user={user} />
  ) : (
    <Btn
      text="Sign in"
      link={`${process.env.NEXT_PUBLIC_ROOT_DOMAIN}?redirect=macforms`}
      primary
    />
  );
}

export default User;

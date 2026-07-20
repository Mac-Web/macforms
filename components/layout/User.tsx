"use client";

import { authClient } from "@/lib/auth-client";
import Btn from "../ui/Btn";

function User() {
  const { data: session } = authClient.useSession();

  return session ? (
    <div>user 123</div>
  ) : (
    <Btn text="Sign in" link="https://macweb.app/?redirect=macforms" primary />
  );
}

export default User;

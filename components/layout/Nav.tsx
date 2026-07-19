import { getSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

async function Nav() {
  const session = await getSession();

  return (
    <nav>
      <Link href="/">MacForms</Link>
      <Link href="/create">Create</Link>
      <Link href="/forms">Forms</Link>
      <Link href="/settings">Settings</Link>
      {session && (
        <div>
          <Image
            src={session.user.image || ""}
            alt="Avatar"
            width={50}
            height={50}
          />
        </div>
      )}
    </nav>
  );
}

export default Nav;

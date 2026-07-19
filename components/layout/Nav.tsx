import { getSession } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";

async function Nav() {
  const session = await getSession();
  console.log(process.env.NODE_ENV);

  return (
    <nav className="text-white flex gap-x-3 items-center px-10">
      <Link href="/">MacForms</Link>
      <Link href="/create">Create</Link>
      <Link href="/forms">Forms</Link>
      <Link href="/settings">Settings</Link>
      {session && (
        <div className="text-white">
          <Image
            src={session.user.image || ""}
            alt="Avatar"
            width={50}
            height={50}
          />
          {session.user.name}
        </div>
      )}
    </nav>
  );
}

export default Nav;

import NavSearch from "./NavSearch";
import User from "./User";
import Image from "next/image";
import Link from "next/link";

const navLinkStyles =
  "text-gray-800 dark:text-gray-300 transition-colors p-2.5 hover:text-green-600";

function Nav() {
  return (
    <nav
      className="flex items-center justify-between gap-x-3 border-b border-gray-700 px-5 md:px-20 lg:px-[calc(50%-550px)] h-17 z-50 
    sticky top-0 bg-gray-200 dark:bg-gray-950"
    >
      <Link
        href="/"
        className="flex items-center gap-x-2 text-black dark:text-white text-lg duration-300 pr-6 py-2 font-bold
       hover:text-shadow-gray-400 hover:text-shadow-sm"
        scroll={true}
      >
        <Image
          src="https://macweb.app/logo.png"
          alt="MacForms Logo"
          width={35}
          height={35}
        />{" "}
        MacForms
      </Link>
      <NavSearch />
      <div className="flex gap-x-3 items-center">
        <div className="md:flex items-center gap-x-3 hidden">
          <Link href="/create" className={navLinkStyles}>
            Create
          </Link>
          <Link href="/forms" className={navLinkStyles}>
            Forms
          </Link>
          <Link href="/settings" className={navLinkStyles}>
            Settings
          </Link>
        </div>
      </div>
      <User />
    </nav>
  );
}

export default Nav;

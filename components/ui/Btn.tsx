"use client";

import Link from "next/link";

interface BtnProps {
  text: string;
  onclick?: () => void;
  link?: string;
  styles?: string;
  primary?: boolean;
}

function Btn({ text, onclick, link, styles, primary }: BtnProps) {
  const btnStyles = `${primary ? "bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 font-bold text-white" : "border-gray-600 hover:border-gray-700 text-gray-300"} border-2 w-fit cursor-pointer rounded py-1 px-3.5 text-lg ${styles}`;

  return onclick ? (
    <button className={btnStyles}>{text}</button>
  ) : (
    <Link href={link!} className={btnStyles}>
      {text}
    </Link>
  );
}

export default Btn;

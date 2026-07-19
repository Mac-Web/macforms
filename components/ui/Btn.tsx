"use client";

interface BtnProps {
  text: string;
  primary?: boolean;
}

function Btn({ text, primary }: BtnProps) {
  return <button>{text}</button>;
}

export default Btn;

"use client";

import { useState, useEffect, useRef } from "react";

interface DropdownProps {
  text?: string;
  selected: string;
  setSelected: (s: string) => void;
  values: string[];
  styles?: string;
}

function Dropdown({
  text,
  selected,
  setSelected,
  values,
  styles,
}: DropdownProps) {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <div
        onClick={() => setMenuOpen(!menuOpen)}
        className={`rounded border-2 border-gray-700 px-4 py-2 cursor-pointer hover:bg-gray-900 text-sm font-bold ${styles}`}
      >
        {selected}
      </div>
      {menuOpen && (
        <div
          className="absolute top-[calc(100%+5px)] z-50 w-full left-0 bg-gray-950 border-2 border-gray-700 flex 
        flex-col p-2 rounded"
        >
          {text && <div>{text}</div>}
          {values.map((v, i) => (
            <div
              key={i}
              onClick={() => {
                setSelected(v);
                setMenuOpen(false);
              }}
              className="p-2 hover:bg-gray-900 rounded cursor-pointer"
            >
              {v}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dropdown;

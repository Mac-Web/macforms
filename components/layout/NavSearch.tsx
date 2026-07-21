"use client";

import { useState, useRef, useEffect } from "react";
import Input from "../ui/Input";

function NavSearch() {
  const [searching, setSearching] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      setSearching(
        containerRef.current?.contains(e.target as Node) ? true : false,
      );
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  return (
    <div className="flex-1 relative" ref={containerRef}>
      <Input
        placeholder="Search MacForms"
        value={search}
        setValue={(s) => setSearch(s)}
        styles={searching && search.trim().length > 0 ? "rounded-b-none" : ""}
        clear={true}
      />
      {searching && search.trim().length > 0 && (
        <div className="text-gray-300 p-3 absolute w-full top-full left-0 bg-gray-900 rounded-b">
          Search coming soon!
        </div>
      )}
    </div>
  );
}

export default NavSearch;

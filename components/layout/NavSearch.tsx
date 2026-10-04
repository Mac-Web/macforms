"use client";

import type { FormType } from "../forms/Public";
import { useState, useRef, useEffect } from "react";
import { SiGoogleforms } from "react-icons/si";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../ui/Input";
import Link from "next/link";

function NavSearch({ userId }: { userId?: string }) {
  const [searching, setSearching] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<FormType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (search.trim().length > 0) {
      setResults([]);
      setSearching(true);
      setLoading(true);
      const res = await fetch(`/api/forms?q=${search.trim()}`).then((res) =>
        res.json(),
      );
      setResults(res);
      setLoading(false);
    }
  }

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setSearching(false);
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, []);

  useEffect(() => {
    setSearching(false);
  }, [pathname]);

  return (
    <div
      className="hidden min-[300px]:block flex-1 relative z-20"
      ref={containerRef}
    >
      <form onSubmit={handleSubmit}>
        <Input
          placeholder="Search MacForms"
          value={search}
          setValue={(s) => setSearch(s)}
          styles={searching && search.trim().length > 0 ? "rounded-b-none" : ""}
          onclear={() => setSearching(false)}
          clear={true}
        />
      </form>
      <AnimatePresence>
        {searching && search.trim().length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-black dark:text-gray-300 p-3 absolute w-full top-full left-0 bg-gray-300 dark:bg-gray-900 rounded-b z-5000"
          >
            {results.length > 0 ? (
              results.map((r) => (
                <Link
                  key={r.id}
                  href={userId === r.userId ? `/forms/${r.id}` : `/${r.id}`}
                  className="rounded hover:bg-gray-200 dark:hover:bg-gray-950/50 px-4 py-2 flex gap-x-4 items-center"
                >
                  <SiGoogleforms size={30} />
                  <div>
                    <div className="text-xs">
                      {userId === r.userId
                        ? "Go to form editor"
                        : `Made by ${r.user.name}`}
                    </div>
                    <h2 className="text-black dark:text-white font-bold text-lg mt-0.5 mb-2">
                      {r.title}
                    </h2>
                    {r.description && (
                      <div className="text-sm">
                        {r.description.slice(0, 70) +
                          (r.description.length > 70 ? "..." : "")}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-sm py-3">
                {loading
                  ? "Searching far and wide..."
                  : "No results found. Try a different search?"}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavSearch;

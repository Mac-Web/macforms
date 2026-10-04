"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

function Animate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, type: "spring" }}
    >
      {children}
    </motion.div>
  );
}

export default Animate;

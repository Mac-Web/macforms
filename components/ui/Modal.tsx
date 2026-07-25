"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
  closeModal: () => void;
}

function Modal({ children, closeModal }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (!modalRef.current?.contains(e.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener("click", clickHandler);
    return () => {
      document.removeEventListener("click", clickHandler);
    };
  }, [closeModal]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 z-20 w-screen h-screen flex items-center justify-center bg-gray-950/85 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0, y: 100 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: 100 }}
        ref={modalRef}
        className="w-100 rounded bg-gray-950 border-2 border-gray-700 p-5"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default Modal;

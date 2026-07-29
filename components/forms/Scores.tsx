"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../ui/Modal";

function Scores({ scores }: { scores: number[] }) {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="cursor-pointer underline mt-3"
      >
        View scores
      </div>
      <AnimatePresence>
        {modalOpen && (
          <Modal closeModal={() => setModalOpen(false)}>
            <h2 className="text-white text-xl font-bold mb-5">
              All scores ({scores.length})
            </h2>
            <div className="flex flex-col gap-y-2 max-h-100 overflow-auto">
              {scores.map((score, i) => (
                <div key={i} className="bg-gray-900 rounded px-3 py-1.5">
                  {score}
                </div>
              ))}
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

export default Scores;

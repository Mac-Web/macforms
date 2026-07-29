"use client";

import { useState } from "react";
import { publishForm, shortenLink } from "@/app/(main)/forms/[id]/actions";
import { AnimatePresence } from "framer-motion";
import Btn from "../ui/Btn";
import WarningModal from "./WarningModal";
import Modal from "../ui/Modal";
import Link from "next/link";
import Checkbox from "../ui/Checkbox";

interface PublishModalProps {
  id: string;
  closeModal: () => void;
  open: boolean;
  code?: string;
  short?: string;
}

function PublishModal({
  id,
  closeModal,
  open,
  code,
  short,
}: PublishModalProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [shortening, setShortening] = useState<boolean>(false);
  const [warning, setWarning] = useState<boolean>(false);
  const [shortened, setShortened] = useState<string | null>(short || null);
  const [copied, setCopied] = useState<boolean>(false);

  async function handleShorten() {
    if (short) {
      setShortened(short);
    } else {
      setShortening(true);
      const res = await shortenLink(id);
      if (res) setShortened(res);
      setShortening(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    await publishForm(id, open);
    setLoading(false);
    setWarning(false);
  }

  function handleCopy() {
    navigator.clipboard.writeText(
      `https://macforms.macweb.app/${shortened || id}`,
    );
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <Modal closeModal={closeModal}>
      <div className="flex flex-col gap-y-5">
        <h2 className="text-white text-xl font-bold">Publish form</h2>
        <div className="text-gray-300">
          {open ? (
            <>
              This form is already published to the internet and can be accessed{" "}
              <Link
                href={`/${id}`}
                className="underline hover:text-green-600"
                target="_blank"
              >
                here
              </Link>
              {code && (
                <>
                  {" "}
                  using the code{" "}
                  <span className="bg-gray-900 px-1.5 text-sm font-bold py-0.5 rounded">
                    {code}
                  </span>
                </>
              )}
              .
            </>
          ) : (
            "Share this form with the world and start accepting responses by publishing it!"
          )}
        </div>
        {open && (
          <div className="flex flex-col gap-y-2 my-3">
            <h2 className="text-white text-lg font-bold">Share link</h2>
            <div className="bg-gray-900 px-2 py-1 rounded text-gray-300 whitespace-nowrap overflow-x-auto">
              macforms.macweb.app/{shortened || id}
            </div>
            <Checkbox
              text={shortening ? "Shortening..." : "Shorten link"}
              checked={shortened ? true : false}
              setChecked={(v) => (v ? handleShorten() : setShortened(null))}
            />
            <Btn
              text={copied ? "Copied!" : "Copy"}
              onclick={handleCopy}
              primary
            />
          </div>
        )}
        <div className="flex gap-x-3">
          <Btn
            text={open ? "Unpublish" : loading ? "Publishing..." : "Publish"}
            onclick={open ? () => setWarning(true) : handlePublish}
            primary
          />
          <Btn text="Cancel" onclick={closeModal} />
        </div>
      </div>
      <AnimatePresence>
        {warning && (
          <WarningModal
            title="Unpublish form"
            description="Are you sure you want to unpublish this form? It will not be accepting any new responses. You can republish the form again any time."
            confirm={handlePublish}
            loading={loading}
            closeModal={() => setWarning(false)}
          />
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default PublishModal;

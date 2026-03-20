"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SubmissionSuccessToast() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const handledKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const queryKey = searchParams.toString();
    const submitted = searchParams.get("submitted");
    const inquiryError = searchParams.get("inquiryError");
    const hasSuccess = submitted === "1";
    const hasError = Boolean(inquiryError);
    if (!hasSuccess && !hasError) return;
    if (handledKeyRef.current === queryKey) return;
    handledKeyRef.current = queryKey;

    setIsError(hasError);
    setMessage(inquiryError || "Submission completed successfully.");

    setVisible(true);

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    const url = new URL(window.location.href);
    url.searchParams.delete("submitted");
    url.searchParams.delete("inquiryError");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [searchParams, searchParams.toString()]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center pointer-events-none px-6">
      <div
        className={`border px-8 py-5 shadow-[0_14px_55px_rgba(0,0,0,0.42)] ${
          isError
            ? "bg-[#f4b7ad] border-[#f7d0ca] text-[#1f2328]"
            : "bg-[#e7d4ad] border-[#f2e5cc] text-[#1f2328]"
        }`}
      >
        <p className="text-sm md:text-base uppercase tracking-widest font-extrabold text-center">
          {message}
        </p>
      </div>
    </div>
  );
}

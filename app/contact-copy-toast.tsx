"use client";

import { useEffect, useRef, useState } from "react";

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function ContactCopyToast() {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLElement>("[data-copy-text]");
      const value = trigger?.dataset.copyText;
      if (!trigger || !value) return;

      try {
        await copyText(value);
        setVisible(true);

        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = window.setTimeout(() => {
          setVisible(false);
        }, 1600);
      } catch {
        setVisible(false);
      }
    };

    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("click", handleClick);
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[72] flex items-center justify-center px-6">
      <div className="border border-[#f2e5cc] bg-[#e7d4ad] px-8 py-5 text-[#1f2328] shadow-[0_14px_55px_rgba(0,0,0,0.42)]">
        <p className="text-sm font-extrabold uppercase tracking-widest text-center md:text-base">
          Copied
        </p>
      </div>
    </div>
  );
}

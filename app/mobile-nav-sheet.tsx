"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/service", label: "Service" },
  { href: "/team", label: "Team" },
  { href: "/works", label: "Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export default function MobileNavSheet() {
  const pathname = usePathname();
  const sheetId = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={sheetId}
        aria-label="Open navigation menu"
        className="header-reveal-item relative z-[121] ml-auto mr-4 flex h-11 w-11 items-center justify-center border border-primary/35 bg-black/15 lg:hidden sm:mr-2 md:mr-0"
        style={{ ["--header-reveal-delay" as string]: "90ms" }}
        onClick={() => setIsOpen((current) => !current)}
      >
        <span className="flex flex-col gap-[5px]">
          <span
            className={`block h-[2px] w-5 bg-slate-100 transition-transform duration-300 ${
              isOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-slate-100 transition-opacity duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-5 bg-slate-100 transition-transform duration-300 ${
              isOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      <div
        className={`fixed inset-0 z-[120] lg:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          id={sheetId}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={`absolute inset-x-0 bottom-0 rounded-t-[2rem] border border-b-0 border-primary/25 bg-[linear-gradient(180deg,rgba(30,35,41,0.98)_0%,rgba(19,22,26,0.98)_100%)] px-5 pb-8 pt-4 shadow-[0_-24px_60px_rgba(0,0,0,0.45)] transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-white/20" />

          <nav className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between border border-primary/15 px-4 py-4 text-sm font-bold uppercase tracking-[0.24em] transition-colors ${
                    isActive
                      ? "bg-primary text-background-dark"
                      : "bg-white/[0.03] text-slate-100 hover:text-[#e6cf9f]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <span>{item.label}</span>
                  <span className="material-symbols-outlined text-[18px]">north_east</span>
                </Link>
              );
            })}
          </nav>

          <Link
            href="/service/apply"
            className="mt-6 inline-flex w-full items-center justify-center bg-[#d8c08f] px-6 py-4 text-sm font-bold uppercase tracking-[0.24em] text-[#1f2328] transition-colors hover:bg-[#ead8b0]"
            onClick={() => setIsOpen(false)}
          >
            Work With Us
          </Link>
        </div>
      </div>
    </>
  );
}

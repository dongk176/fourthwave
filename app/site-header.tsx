"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import MobileNavSheet from "./mobile-nav-sheet";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/service", label: "Service" },
  { href: "/team", label: "Team" },
  { href: "/works", label: "Works" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header key={pathname} className="fixed inset-x-0 top-0 w-full z-[110] bg-transparent">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e0c793]/90 to-transparent" />
      <nav className="relative max-w-[1440px] mx-auto px-0 sm:px-2 md:px-6 h-[5.5rem] flex items-center justify-start gap-0 sm:gap-1 lg:justify-between lg:gap-0 uppercase tracking-widest text-[14px] font-bold text-slate-100">
        <div className="flex items-center justify-start gap-0 -ml-3 sm:-ml-2 md:ml-0">
          <Link
            href="/"
            aria-label="Go to home"
            className="block header-reveal-item"
            style={{ ["--header-reveal-delay" as string]: "40ms" }}
          >
            <div className="-ml-1 h-16 w-[13.2rem] sm:w-[14rem] md:h-14 md:w-52 lg:h-28 lg:w-96 overflow-hidden shrink-0">
              <img
                src="/home/logo.png"
                alt="FOURTHWAVE logo"
                className="h-full w-full object-contain object-left origin-left scale-[2.9] sm:scale-[2.65] md:scale-[2.05] lg:scale-[2.85] drop-shadow-[0_0_14px_rgba(0,0,0,0.75)]"
              />
            </div>
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {NAV_ITEMS.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              className="header-reveal-item text-base text-slate-100 [text-shadow:0_1px_10px_rgba(0,0,0,0.65)] hover:text-[#e6cf9f] transition-colors"
              style={{ ["--header-reveal-delay" as string]: `${120 + index * 45}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <MobileNavSheet />

        <Link
          href="/service/apply"
          className="header-reveal-item hidden lg:inline-flex bg-[#d8c08f] text-[#1f2328] text-base px-8 py-3 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)]"
          style={{ ["--header-reveal-delay" as string]: "470ms" }}
        >
          Work With Us
        </Link>
      </nav>
    </header>
  );
}

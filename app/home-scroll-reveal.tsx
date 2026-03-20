"use client";

import { useEffect } from "react";

const SECTION_SELECTORS = ["#about", "#services", "#works", "#faq", "#contact", "footer"];
const TARGET_SELECTOR = "h2, h3, p, li, article, details, img, video, audio";

export default function HomeScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("IntersectionObserver" in window)) {
      SECTION_SELECTORS.map((selector) => document.querySelector<HTMLElement>(selector))
        .filter((section): section is HTMLElement => Boolean(section))
        .forEach((section) => {
          section
            .querySelectorAll<HTMLElement>(TARGET_SELECTOR)
            .forEach((target) => target.classList.add("is-visible"));
        });
      document
        .querySelectorAll<HTMLElement>("#team [data-reveal], #team [data-team-image]")
        .forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add("is-visible");
          io.unobserve(target);
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    const getSections = () =>
      SECTION_SELECTORS.map((selector) => document.querySelector<HTMLElement>(selector)).filter(
        (section): section is HTMLElement => Boolean(section),
      );

    const registerTargets = (section: HTMLElement) => {
      const targets = Array.from(section.querySelectorAll<HTMLElement>(TARGET_SELECTOR)).filter(
        (element) =>
          element.dataset.homeRevealBound !== "1" &&
          !element.closest("#services form") &&
          !element.matches("form, input, select, textarea, button"),
      );

      if (targets.length === 0) return;

      let index = section.querySelectorAll("[data-home-reveal-bound='1']").length;
      for (const target of targets) {
        target.dataset.homeRevealBound = "1";
        target.classList.add("home-scroll-item");
        target.style.setProperty("--home-reveal-delay", `${Math.min((index % 8) * 70, 490)}ms`);
        io.observe(target);
        index += 1;
      }
    };

    const teamCopyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            teamCopyObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    const teamImageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            teamImageObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    const registerTeamTargets = () => {
      document.querySelectorAll<HTMLElement>("#team [data-reveal]").forEach((target) => {
        if (target.dataset.teamCopyBound === "1") return;
        target.dataset.teamCopyBound = "1";
        teamCopyObserver.observe(target);
      });

      document.querySelectorAll<HTMLElement>("#team [data-team-image]").forEach((target) => {
        if (target.dataset.teamImageBound === "1") return;
        target.dataset.teamImageBound = "1";
        teamImageObserver.observe(target);
      });
    };

    const registerSectionTargets = () => {
      for (const section of getSections()) {
        registerTargets(section);
      }
    };

    registerSectionTargets();
    registerTeamTargets();

    const mo = new MutationObserver(() => {
      registerSectionTargets();
      registerTeamTargets();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      teamCopyObserver.disconnect();
      teamImageObserver.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}

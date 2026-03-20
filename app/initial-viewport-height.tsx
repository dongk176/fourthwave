"use client";

import { useLayoutEffect } from "react";

export default function InitialViewportHeight() {
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;

    const locked = document.documentElement.style.getPropertyValue("--initial-viewport-height");
    if (locked) return;

    const initialHeight = Math.round(window.visualViewport?.height || window.innerHeight || 0);
    if (initialHeight > 0) {
      document.documentElement.style.setProperty(
        "--initial-viewport-height",
        `${initialHeight}px`,
      );
    }
  }, []);

  return null;
}

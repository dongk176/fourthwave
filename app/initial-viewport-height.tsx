"use client";

import { useEffect } from "react";

export default function InitialViewportHeight() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const initialHeight = `${window.innerHeight}px`;
    document.documentElement.style.setProperty("--initial-viewport-height", initialHeight);
  }, []);

  return null;
}

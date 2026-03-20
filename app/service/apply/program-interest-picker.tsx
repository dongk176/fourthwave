"use client";

import { useEffect, useId, useState } from "react";

type ProgramValue = "intensive-audition-program" | "songwriter-bootcamp" | "others";

const PROGRAM_OPTIONS: Array<{ value: ProgramValue; label: string }> = [
  { value: "intensive-audition-program", label: "1. Intensive Audition Program" },
  { value: "songwriter-bootcamp", label: "2. Songwriter Bootcamp" },
  { value: "others", label: "3. Others (Music video, Recording, Coaching etc.)" },
];

interface ProgramInterestPickerProps {
  defaultValue: ProgramValue;
}

export default function ProgramInterestPicker({
  defaultValue,
}: ProgramInterestPickerProps) {
  const [selectedValue, setSelectedValue] = useState<ProgramValue>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const sheetId = useId();

  const selectedOption =
    PROGRAM_OPTIONS.find((option) => option.value === selectedValue) ?? PROGRAM_OPTIONS[0];

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

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
    <div className="block">
      <span className="block text-sm font-semibold mb-2">
        Program of Interest <span className="text-primary">(required)</span>
      </span>

      <input type="hidden" name="programInterest" value={selectedValue} />

      <select
        required
        value={selectedValue}
        onChange={(event) => setSelectedValue(event.target.value as ProgramValue)}
        className="hidden md:block w-full bg-background-dark border border-primary/30 px-4 py-3 focus:outline-none focus:border-primary"
      >
        {PROGRAM_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="flex w-full items-center justify-between border border-primary/30 bg-background-dark px-4 py-3 text-left md:hidden"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-controls={sheetId}
      >
        <span className="truncate pr-4">{selectedOption.label}</span>
        <span className="material-symbols-outlined text-[20px] text-primary">expand_more</span>
      </button>

      <div
        className={`fixed inset-0 z-[130] md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          aria-label="Close program picker"
          className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          id={sheetId}
          role="dialog"
          aria-modal="true"
          aria-label="Program of interest picker"
          className={`absolute inset-x-0 bottom-0 rounded-t-[2rem] border border-b-0 border-primary/25 bg-[linear-gradient(180deg,rgba(30,35,41,0.98)_0%,rgba(19,22,26,0.98)_100%)] px-5 pb-8 pt-4 shadow-[0_-24px_60px_rgba(0,0,0,0.45)] transition-transform duration-300 ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="mx-auto mb-5 h-1.5 w-14 rounded-full bg-white/20" />
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-200">
            Program of Interest
          </p>

          <div className="space-y-2">
            {PROGRAM_OPTIONS.map((option) => {
              const isSelected = option.value === selectedValue;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={`flex w-full items-center justify-between border px-4 py-4 text-left text-sm font-bold uppercase tracking-[0.16em] transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-background-dark"
                      : "border-primary/15 bg-white/[0.03] text-slate-100"
                  }`}
                  onClick={() => {
                    setSelectedValue(option.value);
                    setIsOpen(false);
                  }}
                >
                  <span className="pr-4">{option.label}</span>
                  {isSelected ? (
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">north_east</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

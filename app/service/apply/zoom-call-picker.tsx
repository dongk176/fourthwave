"use client";

import { useMemo, useState } from "react";

type Meridiem = "am" | "pm";

const DAY_LABELS = ["su", "mo", "tu", "we", "th", "fr", "sa"];
const HOUR_OPTIONS = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
const MINUTE_OPTIONS = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"];

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toDateOnly(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDate(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function ZoomCallPicker() {
  const today = toDateOnly(new Date());
  const [viewMonth, setViewMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [hour, setHour] = useState("10");
  const [minute, setMinute] = useState("00");
  const [meridiem, setMeridiem] = useState<Meridiem>("am");

  const monthTitle = useMemo(
    () => viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    [viewMonth],
  );

  const calendarDays = useMemo(() => {
    const year = viewMonth.getFullYear();
    const month = viewMonth.getMonth();
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const cells: { date: Date; inMonth: boolean }[] = [];

    for (let i = firstWeekday - 1; i >= 0; i -= 1) {
      cells.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        inMonth: false,
      });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      cells.push({
        date: new Date(year, month, day),
        inMonth: true,
      });
    }

    while (cells.length < 42) {
      const nextDay = cells.length - (firstWeekday + daysInMonth) + 1;
      cells.push({
        date: new Date(year, month + 1, nextDay),
        inMonth: false,
      });
    }

    return cells;
  }, [viewMonth]);

  const zoomCallKst = useMemo(
    () =>
      `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())} ${hour}:${minute} ${meridiem} KST`,
    [selectedDate, hour, minute, meridiem],
  );

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Schedule a Zoom Call with Jung &amp; Awrii</label>
      <p className="text-sm text-slate-300 mb-3">{zoomCallKst}</p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
        <div className="border border-primary/30 bg-background-dark/55 p-4">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
                )
              }
              className="h-8 w-8 flex items-center justify-center border border-primary/30 hover:border-primary text-primary transition-colors"
              aria-label="Previous month"
            >
              <span className="material-symbols-outlined text-base">chevron_left</span>
            </button>

            <p className="text-sm uppercase tracking-widest font-bold text-primary">{monthTitle}</p>

            <button
              type="button"
              onClick={() =>
                setViewMonth(
                  (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
                )
              }
              className="h-8 w-8 flex items-center justify-center border border-primary/30 hover:border-primary text-primary transition-colors"
              aria-label="Next month"
            >
              <span className="material-symbols-outlined text-base">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_LABELS.map((day) => (
              <div
                key={day}
                className="text-[11px] uppercase tracking-widest text-slate-400 text-center py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell) => {
              const selected = isSameDate(cell.date, selectedDate);
              const isToday = isSameDate(cell.date, today);
              return (
                <button
                  key={`${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`}
                  type="button"
                  onClick={() => {
                    setSelectedDate(toDateOnly(cell.date));
                    setViewMonth(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
                  }}
                  className={[
                    "h-10 text-sm border transition-colors",
                    selected
                      ? "bg-primary text-background-dark border-primary font-bold"
                      : "border-primary/20 hover:border-primary/60",
                    cell.inMonth ? "text-slate-100" : "text-slate-500",
                    isToday && !selected ? "ring-1 ring-primary/50" : "",
                  ].join(" ")}
                >
                  {cell.date.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-primary/30 bg-background-dark/55 p-4 space-y-4">
          <p className="text-xs uppercase tracking-widest text-primary font-bold">Time (KST)</p>

          <div className="grid grid-cols-[1fr_1fr] gap-3">
            <div>
              <label className="text-[11px] uppercase tracking-widest text-slate-400">Hour</label>
              <select
                value={hour}
                onChange={(event) => setHour(event.target.value)}
                className="mt-2 w-full bg-background-dark border border-primary/30 px-3 py-2 focus:outline-none focus:border-primary"
              >
                {HOUR_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-widest text-slate-400">Minute</label>
              <select
                value={minute}
                onChange={(event) => setMinute(event.target.value)}
                className="mt-2 w-full bg-background-dark border border-primary/30 px-3 py-2 focus:outline-none focus:border-primary"
              >
                {MINUTE_OPTIONS.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] uppercase tracking-widest text-slate-400">am / pm</label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMeridiem("am")}
                className={`py-2 border uppercase tracking-widest text-xs transition-colors ${
                  meridiem === "am"
                    ? "bg-primary border-primary text-background-dark font-bold"
                    : "border-primary/30 text-slate-200 hover:border-primary"
                }`}
              >
                am
              </button>
              <button
                type="button"
                onClick={() => setMeridiem("pm")}
                className={`py-2 border uppercase tracking-widest text-xs transition-colors ${
                  meridiem === "pm"
                    ? "bg-primary border-primary text-background-dark font-bold"
                    : "border-primary/30 text-slate-200 hover:border-primary"
                }`}
              >
                pm
              </button>
            </div>
          </div>
        </div>
      </div>

      <input type="hidden" name="zoomCallKst" value={zoomCallKst} />
    </div>
  );
}

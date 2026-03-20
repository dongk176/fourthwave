"use client";

import { useEffect, useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/faq", { cache: "no-store" });
        const payload = (await response.json()) as { items?: FaqItem[] };
        if (!isMounted) return;
        setItems(payload.items ?? []);
      } catch {
        if (!isMounted) return;
        setItems([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen px-6 pb-16 pt-24 md:px-12 md:pb-20 md:pt-32">
      <section className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <h1 className="text-5xl md:text-7xl font-bold uppercase leading-none">FAQ</h1>
        </div>

        {isLoading ? (
          <p className="text-slate-400">Loading FAQ...</p>
        ) : items.length === 0 ? (
          <div className="max-w-5xl border border-primary/20 bg-background-elevated p-8">
            <p className="text-slate-400">No FAQ items yet.</p>
          </div>
        ) : (
          <div className="max-w-5xl space-y-4">
            {items.map((item) => {
              const isOpen = openId === item.id;
              return (
                <article
                  key={item.id}
                  className="border border-primary/20 bg-background-elevated overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
                    className="w-full text-left p-6 md:p-7 flex items-center justify-between gap-6"
                  >
                    <span className="text-lg md:text-2xl font-bold">{item.question}</span>
                    <span
                      className={`material-symbols-outlined text-primary transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen ? (
                    <div className="px-6 md:px-7 pb-7 text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {item.answer}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

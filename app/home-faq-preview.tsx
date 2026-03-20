"use client";

import { useEffect, useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export default function HomeFaqPreview() {
  const [items, setItems] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/faq", { cache: "no-store" });
        const payload = (await response.json()) as { items?: FaqItem[] };
        if (!isMounted) return;
        setItems((payload.items ?? []).slice(0, 3));
      } catch {
        if (!isMounted) return;
        setItems([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="pt-12 pb-24 md:py-32" id="faq">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-5xl md:text-7xl font-bold uppercase mb-6 md:mb-16 border-l-4 border-primary pl-6">
          FAQ
        </h2>

        {isLoading ? (
          <p className="text-slate-400">Loading FAQ...</p>
        ) : items.length === 0 ? (
          <p className="text-slate-400">No FAQ items yet.</p>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <details key={item.id} className="group brutalist-border p-5 md:p-6 cursor-pointer">
                <summary className="list-none flex justify-between items-center text-lg font-bold uppercase tracking-widest">
                  {item.question}
                  <span className="material-symbols-outlined group-open:rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-4 md:mt-6 text-slate-300 font-light whitespace-pre-wrap">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

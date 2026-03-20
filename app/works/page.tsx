"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ResultType = "audio" | "video";
type ResultFilter = "all" | ResultType;

const FILTER_OPTIONS: ResultFilter[] = ["all", "audio", "video"];
const FILTER_LABELS: Record<ResultFilter, string> = {
  all: "ALL",
  audio: "AUDIO",
  video: "VIDEO",
};

interface ResultItem {
  id: string;
  title: string;
  artist: string;
  description: string;
  type: ResultType;
  mediaUrl: string;
  thumbnailUrl?: string;
}

function seekPreviewFrame(video: HTMLVideoElement) {
  if (video.dataset.previewPrepared === "1") return;
  if (!Number.isFinite(video.duration) || video.duration <= 0) return;

  const target = Math.min(0.12, Math.max(video.duration * 0.02, 0.04));
  try {
    video.currentTime = target;
    video.dataset.previewPrepared = "1";
  } catch {
    // noop
  }
}

export default function ResultPage() {
  const [items, setItems] = useState<ResultItem[]>([]);
  const [filter, setFilter] = useState<ResultFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const response = await fetch("/api/results", { cache: "no-store" });
        const payload = (await response.json()) as { items?: ResultItem[] };
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

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;
    return items.filter((item) => item.type === filter);
  }, [filter, items]);

  const gridClassName =
    filter === "all"
      ? "grid grid-cols-[repeat(auto-fit,minmax(min(100%,18rem),1fr))] gap-4"
      : "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3";

  useEffect(() => {
    if (!isFilterDropdownOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterDropdownRef.current?.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterDropdownOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFilterDropdownOpen]);

  return (
    <main className="min-h-screen px-6 pb-14 pt-24 md:px-12 md:pb-16 md:pt-32">
      <section className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-bold uppercase leading-none">
              Works
            </h1>
          </div>
        </div>

          <div className="mb-8 md:mb-10">
            <div className="relative inline-block" ref={filterDropdownRef}>
              <button
                type="button"
                onClick={() => setIsFilterDropdownOpen((current) => !current)}
                className="inline-flex min-w-[10rem] items-center justify-between gap-4 border border-primary/35 bg-transparent px-5 py-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-200 transition-colors hover:border-primary hover:text-primary"
              >
                <span>{FILTER_LABELS[filter]}</span>
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform ${
                    isFilterDropdownOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>

              <div
                className={`absolute left-0 top-full z-20 mt-3 min-w-[10rem] border border-primary/25 bg-background-dark/95 p-2 backdrop-blur transition-all ${
                  isFilterDropdownOpen
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none -translate-y-1 opacity-0"
                }`}
              >
                <div className="space-y-1">
                  {FILTER_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setFilter(option);
                        setIsFilterDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-3 text-left text-sm font-bold uppercase tracking-[0.2em] transition-colors ${
                        filter === option
                          ? "bg-[#d8c08f] text-[#1f2328]"
                          : "text-slate-100 hover:text-[#e6cf9f]"
                      }`}
                    >
                      <span>{FILTER_LABELS[option]}</span>
                      {filter === option ? (
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      ) : null}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {isLoading ? (
            <p className="text-slate-400">Loading results...</p>
          ) : filteredItems.length === 0 ? (
            <div className="border border-primary/20 bg-background-elevated p-10">
              <h2 className="text-2xl font-bold uppercase mb-3">No results yet</h2>
              <p className="text-slate-400">
                Upload your first media from the admin page at <code>/admin</code>.
              </p>
            </div>
          ) : (
            <div className={gridClassName}>
              {filteredItems.map((item) => (
                <article
                  key={item.id}
                  className="border border-primary/20 bg-background-elevated overflow-hidden"
                >
                  <div className="p-4 border-b border-primary/15">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-bold mb-1">{item.title}</h2>
                        <p className="text-sm text-slate-300">{item.artist}</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-primary font-bold border border-primary/30 px-3 py-2">
                        {item.type}
                      </span>
                    </div>
                    {item.description ? (
                      <p className="text-slate-400 mt-3 leading-relaxed text-sm">
                        {item.description}
                      </p>
                    ) : null}
                  </div>

                  <div className="p-4">
                    {item.type === "video" ? (
                      <video
                        className="w-full aspect-square object-cover"
                        controls
                        controlsList="nodownload noplaybackrate noremoteplayback"
                        disablePictureInPicture
                        preload={item.thumbnailUrl ? "metadata" : "auto"}
                        playsInline
                        poster={item.thumbnailUrl}
                        src={item.thumbnailUrl ? item.mediaUrl : `${item.mediaUrl}#t=0.15`}
                        onLoadedMetadata={(event) => {
                          if (item.thumbnailUrl) return;
                          seekPreviewFrame(event.currentTarget);
                        }}
                        onLoadedData={(event) => {
                          if (item.thumbnailUrl) return;
                          seekPreviewFrame(event.currentTarget);
                        }}
                        onPlay={(event) => {
                          if (item.thumbnailUrl) return;
                          const video = event.currentTarget;
                          if (video.dataset.previewPrepared === "1") {
                            video.dataset.previewPrepared = "2";
                            if (video.currentTime > 0.02) {
                              try {
                                video.currentTime = 0;
                              } catch {
                                // noop
                              }
                            }
                          }
                        }}
                        onContextMenu={(event) => event.preventDefault()}
                        onRateChange={(event) => {
                          if (event.currentTarget.playbackRate !== 1) {
                            event.currentTarget.playbackRate = 1;
                          }
                        }}
                      />
                    ) : (
                      <div className="space-y-4">
                        {item.thumbnailUrl ? (
                          <img
                            alt={`${item.title} cover`}
                            className="w-full aspect-square object-cover"
                            src={item.thumbnailUrl}
                          />
                        ) : (
                          <div className="w-full aspect-square bg-[linear-gradient(140deg,#2b323a_0%,#20262c_55%,#d8c08f33_100%)] flex items-center justify-center">
                            <span className="text-primary text-xs uppercase tracking-[0.24em] font-bold">
                              Audio Only
                            </span>
                          </div>
                        )}
                        <audio
                          className="w-full"
                          controls
                          controlsList="nodownload noplaybackrate noremoteplayback"
                          preload="metadata"
                          src={item.mediaUrl}
                          onContextMenu={(event) => event.preventDefault()}
                          onRateChange={(event) => {
                            if (event.currentTarget.playbackRate !== 1) {
                              event.currentTarget.playbackRate = 1;
                            }
                          }}
                        />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
    </main>
  );
}

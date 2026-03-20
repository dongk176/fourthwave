"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ResultType = "audio" | "video";

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

export default function HomeWorksRail() {
  const [items, setItems] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const railRef = useRef<HTMLDivElement | null>(null);

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
        if (isMounted) setIsLoading(false);
      }
    }

    void load();
    return () => {
      isMounted = false;
    };
  }, []);

  const hasItems = useMemo(() => items.length > 0, [items.length]);

  function scrollRail(direction: "left" | "right") {
    const container = railRef.current;
    if (!container) return;
    const delta = Math.max(container.clientWidth * 0.82, 320);
    container.scrollBy({
      left: direction === "right" ? delta : -delta,
      behavior: "smooth",
    });
  }

  return (
    <section className="pt-12 pb-24 md:py-32 bg-background-elevated" id="works">
      <div className="container mx-auto px-6">
        <div className="mb-6 md:mb-10 flex items-center justify-between gap-4">
          <h2 className="text-5xl md:text-7xl font-bold uppercase">WORKS</h2>
          {hasItems ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollRail("left")}
                className="h-10 w-10 flex items-center justify-center border border-primary/35 text-primary hover:bg-primary hover:text-background-dark transition-colors"
                aria-label="Scroll works left"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                type="button"
                onClick={() => scrollRail("right")}
                className="h-10 w-10 flex items-center justify-center border border-primary/35 text-primary hover:bg-primary hover:text-background-dark transition-colors"
                aria-label="Scroll works right"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          ) : null}
        </div>

        {isLoading ? (
          <p className="text-slate-400">Loading works...</p>
        ) : !hasItems ? (
          <p className="text-slate-400">No works uploaded yet.</p>
        ) : (
          <div
            ref={railRef}
            className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory no-scrollbar"
          >
            {items.map((item) => (
              <article
                key={item.id}
                className="border border-primary/20 bg-background-dark/40 overflow-hidden flex-none w-[64vw] sm:w-[52vw] md:w-[38vw] lg:w-[calc((100%-3rem)/4)] max-w-none snap-start"
              >
                <div className="p-4 border-b border-primary/15">
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-300">{item.artist}</p>
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
      </div>
    </section>
  );
}

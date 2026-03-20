"use client";

import { useEffect } from "react";

export default function TeamPage() {
  useEffect(() => {
    const revealTargets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-team-image]");
    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 0px 0px",
      },
    );

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <main>
      <section className="bg-background-elevated pb-24 pt-24 md:py-32" id="team">
        <div className="mx-auto max-w-7xl px-6 md:px-0">
          <div className="mb-12 md:mb-20">
            <h2 className="text-5xl md:text-7xl font-bold uppercase">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group">
              <div
                className="relative aspect-[3/4] overflow-hidden transition-all duration-700 mb-6 team-image-reveal"
                data-team-image
                style={{ ["--img-delay" as string]: "80ms" }}
              >
                <img
                  alt="Jung Woo Cho Program Director"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  src="/Jung Woo Cho.jpg"
                />
                <div className="absolute inset-0 bg-background-elevated/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="team-copy-reveal" data-reveal>
                <h3 className="text-3xl font-bold uppercase">Jung Woo Cho</h3>
                <p className="text-primary text-sm uppercase tracking-widest mt-1">
                  Executive Producer &amp; Program Director
                </p>
                <details className="group mt-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-primary/25 bg-background-dark/40 px-4 py-4 text-sm uppercase tracking-[0.2em] text-slate-100 transition-colors marker:content-none hover:border-primary/45">
                    <span>Read full details</span>
                    <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-4">
                    <p className="text-slate-300/90 text-base leading-relaxed normal-case tracking-normal">
                      Jung Woo has over a decade of experience writing music for
                      international brands and artists, including Samsung, Disney, and
                      Hyundai. Building on his years of coaching, he now focuses on
                      producing music primarily for the K-pop industry.
                    </p>
                  </div>
                </details>
              </div>
            </div>
            <div className="group">
              <div
                className="relative aspect-[3/4] overflow-hidden transition-all duration-700 mb-6 team-image-reveal"
                data-team-image
                style={{ ["--img-delay" as string]: "220ms" }}
              >
                <img
                  alt="Awrii Will Business Partner"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  src="/Awrii Will.jpg"
                />
                <div className="absolute inset-0 bg-background-elevated/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="team-copy-reveal" data-reveal>
                <h3 className="text-3xl font-bold uppercase">Awrii Will</h3>
                <p className="text-primary text-sm uppercase tracking-widest mt-1">
                  Creative Director &amp; Performance Architect
                </p>
                <details className="group mt-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-primary/25 bg-background-dark/40 px-4 py-4 text-sm uppercase tracking-[0.2em] text-slate-100 transition-colors marker:content-none hover:border-primary/45">
                    <span>Read full details</span>
                    <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="pt-4">
                    <p className="text-slate-300/90 text-base leading-relaxed normal-case tracking-normal">
                      As a multi-platinum songwriter signed to KMR (Kreation Music
                      Rights), a subsidiary of SM Entertainment and Kakao Group, Awrii has
                      contributed to major K-pop releases for ITZY, NMIXX, tripleS, and
                      more. She also has years of experience coaching upcoming groups
                      pre-debut in vocals, rap, and performance.
                    </p>
                  </div>
                </details>
              </div>
            </div>
            <div className="group">
              <div
                className="relative aspect-[3/4] overflow-hidden transition-all duration-700 mb-6 team-image-reveal"
                data-team-image
                style={{ ["--img-delay" as string]: "360ms" }}
              >
                <img
                  alt="Tina Mirae Dance Coach"
                  className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                  src="/Tina.jpg"
                />
                <div className="absolute inset-0 bg-background-elevated/20 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="team-copy-reveal" data-reveal>
                <h3 className="text-3xl font-bold uppercase">Tina Mirae</h3>
                <p className="text-primary text-sm uppercase tracking-widest mt-1">
                  Dance Coach &amp; Choreography
                </p>
                <details className="group mt-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg border border-primary/25 bg-background-dark/40 px-4 py-4 text-sm uppercase tracking-[0.2em] text-slate-100 transition-colors marker:content-none hover:border-primary/45">
                    <span>Read full details</span>
                    <span className="material-symbols-outlined text-base transition-transform group-open:rotate-180">
                      expand_more
                    </span>
                  </summary>
                  <div className="space-y-3 pt-4">
                    <p className="text-slate-300/90 text-base leading-relaxed normal-case tracking-normal">
                      Tina is a world-renowned K-pop choreographer and performance
                      director, known for her work with artists like AleXa, BoA, Lim Bona,
                      and Kim Jang Hoon, and for performing as a backup dancer for stars
                      such as Jay Park, Hwasa, Lee Hyori, and AleXa.
                    </p>
                    <p className="text-slate-300/90 text-base leading-relaxed normal-case tracking-normal">
                      With years of experience coaching trainees in dance and stage
                      performance, Tina has led workshops in Thailand, Korea, and the
                      U.S., focusing on strong dance foundations and elevated stage
                      presence.
                    </p>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

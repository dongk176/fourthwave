export default function ContactPage() {
  return (
    <main className="border-t border-primary/20 px-6 pb-16 pt-24 md:px-0 md:py-32">
      <div className="mx-auto max-w-7xl md:px-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h1 className="mb-8 text-5xl font-bold uppercase leading-none md:mb-10 md:text-7xl">Contact</h1>
            <div className="space-y-10">
              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">mail</span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-300/80 uppercase font-bold mb-1">Email</p>
                  <button
                    type="button"
                    data-copy-text="fourthwaveproduction@gmail.com"
                    className="text-left text-lg font-bold tracking-tighter transition-colors hover:text-primary [overflow-wrap:anywhere] md:text-2xl"
                  >
                    fourthwaveproduction@gmail.com
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">call</span>
                <div>
                  <p className="text-xs text-slate-300/80 uppercase font-bold mb-1">
                    Phone (South Korea)
                  </p>
                  <button
                    type="button"
                    data-copy-text="+82 010-3941-0467"
                    className="text-left text-2xl font-bold tracking-tighter transition-colors hover:text-primary"
                  >
                    +82 010-3941-0467
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <span className="material-symbols-outlined text-primary text-3xl">call</span>
                <div>
                  <p className="text-xs text-slate-300/80 uppercase font-bold mb-1">
                    Phone (Singapore)
                  </p>
                  <button
                    type="button"
                    data-copy-text="+65 8818 3909"
                    className="text-left text-2xl font-bold tracking-tighter transition-colors hover:text-primary"
                  >
                    +65 8818 3909
                  </button>
                </div>
              </div>

              <a
                href="https://www.instagram.com/fourthwave_productions/"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-6 transition-colors hover:text-primary"
              >
                <img alt="Instagram" className="h-8 w-8 object-contain" src="/SNS/instagram.png" />
                <div>
                  <p className="text-xs text-slate-300/80 uppercase font-bold mb-1">Instagram</p>
                  <p className="text-lg font-bold tracking-tighter">@fourthwave_productions</p>
                </div>
              </a>
            </div>
          </div>

          <div className="md:bg-background-elevated md:p-12 md:brutalist-border">
            <form action="/api/inquiries" method="post" className="space-y-8">
              <input type="hidden" name="source" value="contact" />
              <input type="hidden" name="returnTo" value="/contact" />
              <p className="block text-[10px] font-bold uppercase tracking-widest text-primary">
                Name
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-base font-bold uppercase tracking-widest text-primary mb-2">
                    First Name{" "}
                    <span className="text-[10px] text-[#e7d4ad] align-middle">(required)</span>
                  </label>
                  <input
                    required
                    name="firstName"
                    className="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary"
                    type="text"
                  />
                </div>
                <div>
                  <label className="block text-base font-bold uppercase tracking-widest text-primary mb-2">
                    Last Name{" "}
                    <span className="text-[10px] text-[#e7d4ad] align-middle">(required)</span>
                  </label>
                  <input
                    required
                    name="lastName"
                    className="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary"
                    type="text"
                  />
                </div>
              </div>
              <div>
                <label className="block text-base font-bold uppercase tracking-widest text-primary mb-2">
                  Email{" "}
                  <span className="text-[10px] text-[#e7d4ad] align-middle">(required)</span>
                </label>
                <input
                  required
                  name="email"
                  className="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-base font-bold uppercase tracking-widest text-primary mb-2">
                  Message{" "}
                  <span className="text-[10px] text-[#e7d4ad] align-middle">(required)</span>
                </label>
                <textarea
                  required
                  name="message"
                  className="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary"
                  rows={4}
                />
              </div>
              <button className="px-12 py-4 bg-primary text-background-dark font-bold uppercase tracking-widest hover:invert transition-all">
                Send Inquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

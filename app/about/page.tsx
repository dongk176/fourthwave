const aboutMarkup = `
<section class="relative flex h-[var(--initial-viewport-height,100vh)] min-h-[var(--initial-viewport-height,100vh)] w-full items-center justify-center overflow-hidden pt-32 pb-16 md:min-h-screen md:h-screen md:pt-32 md:pb-20">
<div class="absolute inset-0 z-0">
<div class="absolute inset-0 bg-[linear-gradient(160deg,#1d2329_0%,#242b32_42%,#1c2228_100%)]"></div>
<img alt="About hero background" class="about-hero-image-enter absolute inset-0 h-full w-full object-cover opacity-35" src="/about/about%20second.jpg"/>
<div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(35,40,46,0.55)_0%,rgba(35,40,46,0.86)_100%)]"></div>
<div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_12%,rgba(159,180,204,0.26)_0%,rgba(159,180,204,0)_46%),radial-gradient(95%_80%_at_88%_84%,rgba(216,192,143,0.2)_0%,rgba(216,192,143,0)_48%)]"></div>
<div class="absolute -left-24 top-10 h-[24rem] w-[24rem] rounded-full bg-primary/16 blur-[100px]"></div>
<div class="absolute -right-24 bottom-8 h-[22rem] w-[22rem] rounded-full bg-[#d8c08f]/12 blur-[110px]"></div>
<div class="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.55)_1px,transparent_0)] [background-size:30px_30px]"></div>
<div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,20,24,0.14)_0%,rgba(17,20,24,0.8)_100%)]"></div>
</div>
<div class="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
<div class="max-w-3xl mx-auto text-center">
<h2 class="home-title-enter mb-8 whitespace-nowrap italic text-[clamp(2.8rem,8.4vw,6.4rem)] font-bold leading-none tracking-tight">
<span class="hero-line-shell">
<span class="hero-line line-1 who-we-are who-we-are-line">Who We Are</span>
</span>
</h2>
<p class="typewriter-copy text-xl md:text-2xl font-light text-slate-300 max-w-3xl mx-auto leading-relaxed">
          Founded in 2025 in Seoul, South Korea, <span class="text-white font-semibold">FourthWave</span> delivers music-related services for international artists seeking meaningful access to Korea's music and K-pop industry.
        </p>
</div>
</div>
</section>

<div class="relative overflow-hidden border-t border-primary/10">
<div class="absolute inset-0 z-0">
<img alt="About content background" class="absolute inset-0 h-full w-full object-cover opacity-28" src="/about/anout%202.png"/>
<div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(30,36,42,0.82)_0%,rgba(30,36,42,0.88)_42%,rgba(24,29,34,0.94)_100%)]"></div>
<div class="absolute inset-0 bg-[radial-gradient(110%_85%_at_14%_18%,rgba(114,169,231,0.18)_0%,rgba(114,169,231,0)_42%),radial-gradient(95%_78%_at_82%_76%,rgba(220,104,255,0.12)_0%,rgba(220,104,255,0)_40%)]"></div>
</div>
<section class="relative py-32 px-6 overflow-hidden" id="about-story">
<div class="relative z-10 max-w-7xl mx-auto">
<h2 class="text-4xl md:text-6xl mb-20 tracking-tight">Built in Seoul.<br/><span class="italic world-connect">Connected to the World.</span></h2>
<div class="grid md:grid-cols-2 gap-16 md:gap-32 items-start">
<div class="space-y-6">
<h3 class="uppercase tracking-widest text-sm font-bold text-primary">The Mission</h3>
<p class="text-3xl font-light leading-snug">
              To dismantle the barriers between global creativity and the vibrant Korean music landscape.
            </p>
</div>
<div class="space-y-8 text-slate-300/85 text-lg leading-relaxed">
<p>
              K-pop is now a global standard, but international artists still face major barriers to entering Seoul's music ecosystem, from language and cultural gaps to complex industry systems.
            </p>
<p>
              FourthWave bridges that gap by combining local expertise with global vision, giving artists the support and access they need to thrive in Korea's most dynamic music hub.
            </p>
</div>
</div>
</div>
</section>


<section class="relative py-32 px-6" id="about-offer">
<div class="relative z-10 max-w-7xl mx-auto">
<div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
<h2 class="text-5xl italic">What We Offer</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-4 gap-6">
<div class="p-8 border border-primary/20 hover:border-primary/50 transition-all duration-500 bg-primary/5 rounded">
<span class="inline-flex items-center bg-[#d8c08f] text-[#1f2328] text-base px-8 py-3 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)] mb-8 uppercase tracking-widest">ACCESS</span>
<h4 class="text-xl mb-4">Korea's Creative Network</h4>
<p class="text-sm text-slate-300/80 leading-relaxed">Direct lines to top-tier studios, producers, and choreographers across Seoul.</p>
</div>
<div class="p-8 border border-primary/20 hover:border-primary/50 transition-all duration-500 bg-primary/5 rounded">
<span class="inline-flex items-center bg-[#d8c08f] text-[#1f2328] text-base px-8 py-3 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)] mb-8 uppercase tracking-widest">GUIDANCE</span>
<h4 class="text-xl mb-4">Personalized Support</h4>
<p class="text-sm text-slate-300/80 leading-relaxed">On-the-ground management and strategic consulting tailored to your specific goals.</p>
</div>
<div class="p-8 border border-primary/20 hover:border-primary/50 transition-all duration-500 bg-primary/5 rounded">
<span class="inline-flex items-center bg-[#d8c08f] text-[#1f2328] text-base px-8 py-3 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)] mb-8 uppercase tracking-widest">DEVELOPMENT</span>
<h4 class="text-xl mb-4">Professional Services</h4>
<p class="text-sm text-slate-300/80 leading-relaxed">Full-spectrum music services, from local marketing to creative production assistance.</p>
</div>
<div class="p-8 border border-primary/20 hover:border-primary/50 transition-all duration-500 bg-primary/5 rounded">
<span class="inline-flex items-center bg-[#d8c08f] text-[#1f2328] text-base px-8 py-3 rounded-none hover:bg-[#ead8b0] transition-all duration-300 font-bold shadow-[0_6px_20px_rgba(0,0,0,0.35)] mb-8 uppercase tracking-widest">CONNECTION</span>
<h4 class="text-xl mb-4">A Trusted Bridge</h4>
<p class="text-sm text-slate-300/80 leading-relaxed">Sustainable long-term relationships between your brand and the Korean market.</p>
</div>
</div>
</div>
</section>
</div>



<section class="py-32 px-6 bg-background-elevated border-t border-primary/10" id="about-contact">
<div class="max-w-4xl mx-auto">
<div class="text-center mb-16">
<h2 class="text-4xl mb-6">Contact Us</h2>
<p class="text-slate-300 text-lg">Interested in working together? Share a few details with us, and our team will be in touch soon. We look forward to hearing from you.</p>
</div>
<form action="#" class="grid grid-cols-1 md:grid-cols-2 gap-6" id="contact-form" method="POST">
<div class="space-y-2">
<label class="text-xs uppercase tracking-widest text-slate-400 font-bold" for="first-name">First Name</label>
<input class="w-full bg-background-dark border-primary/20 rounded focus:border-primary focus:ring-1 focus:ring-primary py-4 px-4 text-white placeholder-slate-500" id="first-name" name="first-name" placeholder="Jane" type="text"/>
</div>
<div class="space-y-2">
<label class="text-xs uppercase tracking-widest text-slate-400 font-bold" for="last-name">Last Name</label>
<input class="w-full bg-background-dark border-primary/20 rounded focus:border-primary focus:ring-1 focus:ring-primary py-4 px-4 text-white placeholder-slate-500" id="last-name" name="last-name" placeholder="Doe" type="text"/>
</div>
<div class="space-y-2 md:col-span-2">
<label class="text-xs uppercase tracking-widest text-slate-400 font-bold" for="email">Email Address</label>
<input class="w-full bg-background-dark border-primary/20 rounded focus:border-primary focus:ring-1 focus:ring-primary py-4 px-4 text-white placeholder-slate-500" id="email" name="email" placeholder="jane@example.com" type="email"/>
</div>
<div class="space-y-2 md:col-span-2">
<label class="text-xs uppercase tracking-widest text-slate-400 font-bold" for="message">Message</label>
<textarea class="w-full bg-background-dark border-primary/20 rounded focus:border-primary focus:ring-1 focus:ring-primary py-4 px-4 text-white placeholder-slate-500" id="message" name="message" placeholder="Tell us about your project..." rows="5"></textarea>
</div>
<div class="md:col-span-2 pt-4">
<button class="w-full bg-primary hover:bg-primary/90 text-background-dark font-bold py-5 rounded transition-all uppercase tracking-[0.2em] text-sm" type="submit">Send Inquiry</button>
</div>
</form>
</div>
</section>
<footer class="py-20 px-6 border-t border-primary/10">
<div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
<div class="text-sm text-slate-500">
        © 2025 FourthWave. Seoul, South Korea. All Rights Reserved.
      </div>
<div class="flex space-x-12 text-xs uppercase tracking-widest text-slate-400">
<a class="hover:text-white transition-colors" href="#">Privacy</a>
<a class="hover:text-white transition-colors" href="#">Terms</a>
<a class="hover:text-white transition-colors" href="#">Press</a>
</div>
</div>
</footer>
`;

export default function AboutPage() {
  return <main dangerouslySetInnerHTML={{ __html: aboutMarkup }} />;
}

import HomeWorksRail from "./home-works-rail";
import HomeFaqPreview from "./home-faq-preview";
import HomeScrollReveal from "./home-scroll-reveal";

const homeMarkup = `
<section class="relative flex h-[var(--initial-viewport-height,100vh)] min-h-[var(--initial-viewport-height,100vh)] w-full items-center justify-center overflow-hidden pt-32 pb-16 md:min-h-screen md:h-screen md:pt-32 md:pb-20" id="home">
<div class="absolute inset-0 z-0">
<div class="absolute inset-0 cinematic-overlay z-10"></div>
<img alt="Professional recording studio in Seoul" class="home-hero-image home-hero-image-enter w-full h-full object-cover opacity-58 brightness-[0.68]" data-alt="Cinematic dark music studio interior with professional equipment" src="/home/main.png"/>
</div>
<div class="relative z-20 container mx-auto px-6 text-center">
<h1 class="text-huge home-hero-title font-bold tracking-tighter uppercase mb-6 text-slate-100 home-title-enter">
<span class="hero-line-shell">
<span class="hero-line line-1">MAKE NOISE,</span>
</span>
<span class="hero-line-shell">
<span class="hero-line line-2 wave-text">MAKE WAVES</span>
</span>
</h1>
<p class="max-w-2xl mx-auto text-lg md:text-xl text-slate-200 mb-10 font-light tracking-wide typewriter-copy">
                FourthWave Productions empowers emerging artists to shape distinctive voices and lasting careers in K-pop and music.
            </p>
<div class="flex flex-col sm:flex-row gap-4 justify-center">
<a class="px-10 py-4 bg-primary text-background-dark font-bold uppercase tracking-widest hover:invert transition-all" href="/service">Explore Services</a>
<a class="px-10 py-4 border border-primary text-primary font-bold uppercase tracking-widest hover:bg-primary hover:text-background-dark transition-all" href="/service">Apply Now</a>
</div>
</div>
<div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
</div>
</section>
<section class="pt-12 pb-24 md:py-32 border-b border-primary/10" id="about">
<div class="container mx-auto px-6">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
<div>
<h2 class="text-5xl md:text-7xl font-bold uppercase leading-none mb-4 md:mb-8">GLOBAL ACCESS.<br/>REAL INDUSTRY<br/>SUPPORT.</h2>
</div>
<div class="space-y-4 md:space-y-6">
<p class="text-xl text-slate-300 leading-relaxed font-light">
                        Based in the heart of Seoul, we bridge the gap between international talent and the Korean music infrastructure. We don't just "train" - we architect careers using the exact same systems that produce global icons.
                    </p>
<p class="text-slate-300/80 italic border-l-2 border-primary pl-6">
                        "The standard of K-Pop is no longer local. It is the global benchmark for excellence. We provide the keys to that benchmark."
                    </p>
</div>
</div>
</div>
</section>
<section class="pt-12 pb-24 md:py-32 bg-background-elevated" id="team">
<div class="container mx-auto px-6">
<div class="mb-8 md:mb-20">
<h2 class="text-5xl md:text-7xl font-bold uppercase">Our Team</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
<div class="group">
<div class="relative aspect-[3/4] overflow-hidden transition-all duration-700 mb-4 md:mb-6 team-image-reveal" data-team-image style="--img-delay: 80ms">
<img alt="Jung Woo Cho Program Director" class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" data-alt="Editorial portrait of a male music producer in a studio" src="/Jung Woo Cho.jpg"/>
<div class="absolute inset-0 bg-background-elevated/20 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="team-copy-reveal" data-reveal>
<h3 class="text-3xl font-bold uppercase">Jung Woo Cho</h3>
<p class="text-primary text-sm uppercase tracking-widest mt-1">Executive Producer &amp; Program Director</p>
<p class="text-slate-300/90 text-base leading-relaxed mt-3 md:mt-4 normal-case tracking-normal">
                        Jung Woo has over a decade of experience writing music for international brands and artists, including Samsung, Disney, and Hyundai. Building on his years of coaching, he now focuses on producing music primarily for the K-pop industry.
                    </p>
</div>
</div>
<div class="group">
<div class="relative aspect-[3/4] overflow-hidden transition-all duration-700 mb-4 md:mb-6 team-image-reveal" data-team-image style="--img-delay: 220ms">
<img alt="Awrii Will Business Partner" class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" data-alt="Modern editorial portrait of a business professional" src="/Awrii Will.jpg"/>
<div class="absolute inset-0 bg-background-elevated/20 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="team-copy-reveal" data-reveal>
<h3 class="text-3xl font-bold uppercase">Awrii Will</h3>
<p class="text-primary text-sm uppercase tracking-widest mt-1">Creative Director &amp; Performance Architect</p>
<p class="text-slate-300/90 text-base leading-relaxed mt-3 md:mt-4 normal-case tracking-normal">
                        As a multi-platinum songwriter signed to KMR (Kreation Music Rights), a subsidiary of SM Entertainment and Kakao Group, Awrii has contributed to major K-pop releases for ITZY, NMIXX, tripleS, and more. She also has years of experience coaching upcoming groups pre-debut in vocals, rap, and performance.
                    </p>
</div>
</div>
<div class="group">
<div class="relative aspect-[3/4] overflow-hidden transition-all duration-700 mb-4 md:mb-6 team-image-reveal" data-team-image style="--img-delay: 360ms">
<img alt="Tina Mirae Dance Coach" class="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" data-alt="Sharp editorial portrait of a professional female choreographer" src="/Tina.jpg"/>
<div class="absolute inset-0 bg-background-elevated/20 group-hover:bg-transparent transition-colors"></div>
</div>
<div class="team-copy-reveal" data-reveal>
<h3 class="text-3xl font-bold uppercase">Tina Mirae</h3>
<p class="text-primary text-sm uppercase tracking-widest mt-1">Dance Coach &amp; Choreography</p>
<p class="text-slate-300/90 text-base leading-relaxed mt-3 md:mt-4 normal-case tracking-normal">
                        Tina is a world-renowned K-pop choreographer and performance director, known for her work with artists like AleXa, BoA, Lim Bona, and Kim Jang Hoon, and for performing as a backup dancer for stars such as Jay Park, Hwasa, Lee Hyori, and AleXa.
                    </p>
<p class="text-slate-300/90 text-base leading-relaxed mt-2 md:mt-3 normal-case tracking-normal">
                        With years of experience coaching trainees in dance and stage performance, Tina has led workshops in Thailand, Korea, and the U.S., focusing on strong dance foundations and elevated stage presence.
                    </p>
</div>
</div>
</div>
</div>
</section>
<section class="pt-12 pb-24 md:py-32" id="services">
<div class="container mx-auto px-6 space-y-20 md:space-y-32">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start border-t border-primary/20 pt-12 md:pt-16" id="apply">
<div class="lg:sticky lg:top-32">
<span class="text-primary tracking-[0.5em] text-xs font-bold uppercase mb-3 md:mb-4 block">Program 01</span>
<h2 class="text-5xl font-bold uppercase mb-5 md:mb-8">Music Production Camp in Korea</h2>
<p class="text-slate-300 mb-5 md:mb-8 max-w-lg">
                        An immersive 14-day intensive for international artists. Access Seoul's elite recording studios, work with veteran K-Pop topliners, and leave with a fully mastered 3-track EP.
                    </p>
<ul class="space-y-3 md:space-y-4 mb-7 md:mb-10">
<li class="flex items-center gap-4 text-sm uppercase tracking-wider font-bold">
<span class="material-symbols-outlined text-primary">check_circle</span>
                            Private Studio Access
                        </li>
<li class="flex items-center gap-4 text-sm uppercase tracking-wider font-bold">
<span class="material-symbols-outlined text-primary">check_circle</span>
                            Vocal Direction by Industry Pros
                        </li>
<li class="flex items-center gap-4 text-sm uppercase tracking-wider font-bold">
<span class="material-symbols-outlined text-primary">check_circle</span>
                            Global Distribution Networking
                        </li>
</ul>
</div>
<div class="bg-primary/5 p-10 border border-primary/10">
<form class="space-y-6">
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="FULL NAME" type="text"/>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="COUNTRY" type="text"/>
</div>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="EMAIL ADDRESS" type="email"/>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="SOCIAL MEDIA (INSTAGRAM/TIKTOK)" type="text"/>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<select class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary uppercase text-xs p-3 text-slate-600">
<option>SKILL LEVEL</option>
<option>EMERGING</option>
<option>PROFESSIONAL</option>
</select>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="GENRE" type="text"/>
</div>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="DEMO LINK (SOUNDCLOUD/DRIVE)" type="url"/>
<button class="w-full py-4 bg-primary text-background-dark font-bold uppercase tracking-widest hover:invert transition-all mt-4">Apply for Music Camp</button>
</form>
</div>
</div>
<div class="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start border-t border-primary/20 pt-12 md:pt-16">
<div class="order-1 lg:order-2 lg:sticky lg:top-32">
<span class="text-primary tracking-[0.5em] text-xs font-bold uppercase mb-3 md:mb-4 block">Program 02</span>
<h2 class="text-5xl font-bold uppercase mb-5 md:mb-8">K-pop Audition Preparation</h2>
<p class="text-slate-300 mb-5 md:mb-8 max-w-lg">
                        Tailored coaching for the global audition circuit. We refine your dance technique, vocal range, and camera charisma to meet the rigorous standards of Korea's major labels.
                    </p>
<ul class="space-y-3 md:space-y-4 mb-7 md:mb-10">
<li class="flex items-center gap-4 text-sm uppercase tracking-wider font-bold">
<span class="material-symbols-outlined text-primary">check_circle</span>
                            Mock Audition Evaluation
                        </li>
<li class="flex items-center gap-4 text-sm uppercase tracking-wider font-bold">
<span class="material-symbols-outlined text-primary">check_circle</span>
                            Visual &amp; Styling Consulting
                        </li>
<li class="flex items-center gap-4 text-sm uppercase tracking-wider font-bold">
<span class="material-symbols-outlined text-primary">check_circle</span>
                            Korean Culture &amp; Language Basics
                        </li>
</ul>
</div>
<div class="order-2 lg:order-1 bg-primary/5 p-10 border border-primary/10">
<form class="space-y-6">
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="FULL NAME" type="text"/>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="COUNTRY" type="text"/>
</div>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="EMAIL ADDRESS" type="email"/>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="PERFORMANCE VIDEO LINK (YOUTUBE)" type="url"/>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<select class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary uppercase text-xs p-3 text-slate-600">
<option>DANCE/VOCAL SKILL LEVEL</option>
<option>BEGINNER</option>
<option>INTERMEDIATE</option>
<option>ADVANCED</option>
</select>
<input class="w-full bg-transparent border-0 border-b border-primary/30 focus:ring-0 focus:border-primary placeholder:text-slate-400 uppercase text-xs p-3" placeholder="PREFERRED GENRE" type="text"/>
</div>
<button class="w-full py-4 bg-primary text-background-dark font-bold uppercase tracking-widest hover:invert transition-all mt-4">Apply for Audition Prep</button>
</form>
</div>
</div>
</div>
</section>
__HOME_WORKS_SECTION__
__HOME_FAQ_SECTION__
<section class="pt-12 pb-24 md:py-32 border-t border-primary/20" id="contact">
<div class="container mx-auto px-6">
<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20">
<div>
<h2 class="text-5xl md:text-7xl font-bold uppercase mb-6 md:mb-10">Contact</h2>
<div class="space-y-7 md:space-y-10">
<div class="flex items-start gap-6">
<span class="material-symbols-outlined text-primary text-3xl">mail</span>
<div class="min-w-0">
<p class="text-xs text-slate-300/80 uppercase font-bold mb-1">Email</p>
<button type="button" data-copy-text="fourthwaveproduction@gmail.com" class="text-left text-lg md:text-2xl font-bold tracking-tighter transition-colors hover:text-primary [overflow-wrap:anywhere]">fourthwaveproduction@gmail.com</button>
</div>
</div>
<div class="flex items-start gap-6">
<span class="material-symbols-outlined text-primary text-3xl">call</span>
<div>
<p class="text-xs text-slate-300/80 uppercase font-bold mb-1">Phone (South Korea)</p>
<button type="button" data-copy-text="+82 010-3941-0467" class="text-left text-2xl font-bold tracking-tighter transition-colors hover:text-primary">+82 010-3941-0467</button>
</div>
</div>
<div class="flex items-start gap-6">
<span class="material-symbols-outlined text-primary text-3xl">call</span>
<div>
<p class="text-xs text-slate-300/80 uppercase font-bold mb-1">Phone (Singapore)</p>
<button type="button" data-copy-text="+65 8818 3909" class="text-left text-2xl font-bold tracking-tighter transition-colors hover:text-primary">+65 8818 3909</button>
</div>
</div>
<div class="flex items-start gap-6">
<img alt="Instagram" class="h-8 w-8 object-contain" src="/SNS/instagram.png"/>
<div>
<p class="text-xs text-slate-300/80 uppercase font-bold mb-1">Instagram</p>
</div>
</div>
</div>
</div>
<div class="md:bg-background-elevated md:p-12 md:brutalist-border">
<form action="/api/inquiries" method="post" class="space-y-8">
<input type="hidden" name="source" value="home"/>
<input type="hidden" name="returnTo" value="/#contact"/>
<p class="block text-[10px] font-bold uppercase tracking-widest text-primary">Name</p>
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label class="block text-base font-bold uppercase tracking-widest text-primary mb-2">First Name <span class="text-[10px] text-[#e7d4ad] align-middle">(required)</span></label>
<input required name="firstName" class="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary" type="text"/>
</div>
<div>
<label class="block text-base font-bold uppercase tracking-widest text-primary mb-2">Last Name <span class="text-[10px] text-[#e7d4ad] align-middle">(required)</span></label>
<input required name="lastName" class="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary" type="text"/>
</div>
</div>
<div>
<label class="block text-base font-bold uppercase tracking-widest text-primary mb-2">Email <span class="text-[10px] text-[#e7d4ad] align-middle">(required)</span></label>
<input required name="email" class="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary" type="email"/>
</div>
<div>
<label class="block text-base font-bold uppercase tracking-widest text-primary mb-2">Message <span class="text-[10px] text-[#e7d4ad] align-middle">(required)</span></label>
<textarea required name="message" class="w-full bg-transparent border-0 border-b border-primary/30 px-4 py-3 focus:ring-0 focus:border-primary" rows="4"></textarea>
</div>
<button class="px-12 py-4 bg-primary text-background-dark font-bold uppercase tracking-widest hover:invert transition-all">Send Inquiry</button>
</form>
</div>
</div>
</div>
</section>
<footer class="py-16 bg-background-elevated border-t border-primary/10">
<div class="container mx-auto px-6">
<div class="flex flex-col md:flex-row justify-between items-center gap-10">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-primary text-2xl">layers</span>
<span class="text-lg font-bold tracking-tighter">FOURTHWAVE</span>
</div>
<div class="flex gap-8 uppercase text-[10px] font-bold tracking-widest text-slate-300/80">
<a class="hover:text-primary transition-colors" href="#">Instagram</a>
<a class="hover:text-primary transition-colors" href="#">TikTok</a>
<a class="hover:text-primary transition-colors" href="#">YouTube</a>
<a class="hover:text-primary transition-colors" href="#">LinkedIn</a>
</div>
<div class="text-[10px] text-slate-400/80 uppercase tracking-widest">
                    © 2024 FOURTHWAVE PRODUCTION. ALL RIGHTS RESERVED.
                </div>
</div>
</div>
</footer>
`;

export default function Home() {
  const [topMarkup, afterWorks] = homeMarkup.split("__HOME_WORKS_SECTION__");
  const [middleMarkup, bottomMarkup] = afterWorks.split("__HOME_FAQ_SECTION__");
  return (
    <>
      <HomeScrollReveal />
      <main dangerouslySetInnerHTML={{ __html: topMarkup }} />
      <HomeWorksRail />
      <main dangerouslySetInnerHTML={{ __html: middleMarkup }} />
      <HomeFaqPreview />
      <main dangerouslySetInnerHTML={{ __html: bottomMarkup }} />
    </>
  );
}

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { ArrowRight, CalendarDays, GraduationCap, Users, Accessibility } from 'lucide-react';

const pathwaySteps = [
  { n: '01', title: 'Apply & Intake', desc: 'Get matched to the right pathway based on your goals and experience.', image: '/apply.webp' },
  { n: '02', title: 'Train & Practice', desc: 'Hands-on modules built around real service delivery scenarios.', image: '/train.jpg' },
  { n: '03', title: 'Earn Credential(s)', desc: 'Complete assessments and verify your readiness for community impact.', image: '/earn.png' },
  { n: '04', title: 'Launch with ATN', desc: 'Translate training into listings, bookings, and mentorship support.', image: '/launch.png' },
];

const pillars = [
  { label: 'Credentials', desc: 'Industry-standard skills and certifications that translate into real-world service delivery excellence.' },
  { icon: Users, label: 'Mentorship', desc: 'Dedicated guidance for women-owned businesses, supporting you from initial training to successful launch.' },
  { icon: CalendarDays, label: 'Pathways', desc: 'Directly connect your learning milestones to real bookings and meaningful community impact.' },
];

export default function WomenRiseInitiative() {
  const heroVideos = ['/hero_vid1.mp4', '/hero_vid2.mp4'] as const;
  const [activeHeroVideo, setActiveHeroVideo] = React.useState(0);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="page-shell relative overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-hero border-b border-border/50">
        <video
          key={heroVideos[activeHeroVideo]}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setActiveHeroVideo((prev) => (prev + 1) % heroVideos.length)}
          aria-hidden="true"
        >
          <source src={heroVideos[activeHeroVideo]} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/62" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-background/95" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full translate-x-1/3 -translate-y-1/2 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="content-shell relative z-20 max-w-5xl text-center">
          <div className="flex flex-col items-center space-y-8">
            {/* Partnership badge */}
            <div className="relative inline-flex items-center gap-12 px-6 py-6 border-b border-white/30 animate-fade-down">
              <div
                className="absolute inset-0 -z-10"
                style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.00) 78%)' }}
                aria-hidden="true"
              />
              <img 
                src="/atn_logo_no_bg.png" 
                alt="ATN" 
                className="h-16 w-auto object-contain" 
                loading="lazy" 
              />
              <span className="text-white/55 font-extralight text-5xl">|</span>
              <img 
                src="/asu_logo-removebg-preview.png" 
                alt="Arkansas State University" 
                className="h-16 w-auto object-contain" 
                loading="lazy" 
              />
            </div>

            <div className="space-y-4 animate-fade-up">
              <h1 className="text-4xl lg:text-7xl leading-[1.1] font-bold text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
                Empowering women<br />
                <span className="text-gold">to rise & thrive</span>
              </h1>
              <p className="text-sm lg:text-base text-white/92 leading-relaxed mx-auto max-w-2xl">
                A strategic partnership between Access Terrain Network (ATN) and Arkansas State University focused on
                equipping women with high-value credentials and community-connected career pathways.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-up delay-200">
              <Button asChild className="h-12 px-10 text-base font-semibold shadow-lg bg-white text-primary hover:bg-white/90">
                <a href="/signup">Join the initiative</a>
              </Button>
              <Button asChild variant="outline" className="h-12 px-10 text-base border-white/60 text-white hover:bg-white/10 bg-transparent">
                <a href="/how-it-works">
                  See how it works <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bento Experience Grid ─────────────────────────── */}
      <section className="page-shell py-12 lg:py-16 bg-background border-b border-border/40">
        <div className="content-shell">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 md:auto-rows-[160px] lg:auto-rows-[180px]">
            <div className="md:col-span-4 md:row-span-2 relative overflow-hidden border border-border min-h-[240px] md:min-h-0 animate-fade-up">
              <img
                src="/women_emp.jpg"
                alt="Women collaborating in a learning environment"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute left-4 bottom-4 right-4">
                <p className="text-[11px] uppercase tracking-widest text-white/90 font-semibold">Women Rise Story</p>
                <p className="text-base lg:text-lg font-semibold text-white mt-1">Women collaborating in classroom and skills training</p>
              </div>
            </div>

            <div className="md:col-span-2 md:row-span-1 border border-border bg-background p-5 min-h-[180px] md:min-h-0 animate-fade-up delay-75">
              <div className="w-10 h-10 flex items-center justify-center text-primary bg-secondary">
                <GraduationCap size={20} />
              </div>
              <h3 className="text-base font-bold mt-3">Credentials</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{pillars[0].desc}</p>
            </div>

            <div className="md:col-span-2 md:row-span-1 relative overflow-hidden border border-border min-h-[180px] md:min-h-0 animate-fade-up delay-100">
              <img
                src="/mentor.webp"
                alt="Mentor guiding participant one-on-one"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <p className="absolute left-4 bottom-3 text-sm text-white font-medium">Mentor guidance in real time</p>
            </div>

            <div className="md:col-span-3 md:row-span-1 border border-border bg-background p-5 min-h-[180px] md:min-h-0 animate-fade-up delay-150">
              <div className="w-10 h-10 flex items-center justify-center text-primary bg-secondary">
                <Users size={20} />
              </div>
              <h3 className="text-base font-bold mt-3">Mentorship</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{pillars[1].desc}</p>
            </div>

            <div className="md:col-span-3 md:row-span-1 border border-border bg-background p-5 min-h-[180px] md:min-h-0 animate-fade-up delay-200">
              <div className="w-10 h-10 flex items-center justify-center text-primary bg-secondary">
                <CalendarDays size={20} />
              </div>
              <h3 className="text-base font-bold mt-3">Pathways</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{pillars[2].desc}</p>
            </div>

            <div className="md:col-span-2 md:row-span-2 relative overflow-hidden border border-border min-h-[260px] md:min-h-0 animate-fade-up delay-100">
              <img
                src="/graduation.avif"
                alt="Graduation and certification milestone"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <p className="absolute left-4 bottom-3 text-sm text-white font-medium">Credential milestones</p>
            </div>

            <div className="md:col-span-4 md:row-span-2 border border-border bg-background p-6 min-h-[260px] md:min-h-0 animate-fade-up delay-150">
              <div className="inline-flex items-center gap-2 bg-surface-teal text-primary px-3 py-1.5">
                <Accessibility size={15} />
                <span className="text-xs font-semibold tracking-widest uppercase">Opportunity Highlight Initiative</span>
              </div>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100%-42px)]">
                <div className="lg:col-span-3">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground">
                    Turning overlooked talent into visible opportunity.
                  </h2>
                  <p className="text-sm lg:text-base text-muted mt-3 leading-relaxed">
                    This initiative highlights talented entrepreneurs from underserved communities, including individuals
                    with disabilities, giving them greater visibility and access to local customers.
                  </p>
                  <p className="text-sm lg:text-base text-muted mt-3 leading-relaxed">
                    By showcasing their products, crafts, and services on the platform, ATN helps turn overlooked
                    skills into real economic opportunities.
                  </p>
                </div>
                <div className="lg:col-span-2 relative overflow-hidden border border-border rounded-2xl min-h-[160px] lg:min-h-0">
                  <img
                    src="/mobility.jpg"
                    alt="Inclusive training setting showing mobility support"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-3 md:row-span-2 relative overflow-hidden border border-border min-h-[220px] md:min-h-0 animate-fade-up delay-250">
              <img
                src="/client.webp"
                alt="Women-owned local service in action with a client"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <p className="absolute left-4 bottom-3 text-sm text-white font-medium">Real client outcomes</p>
            </div>
            <div className="md:col-span-3 md:row-span-2 relative overflow-hidden border border-border min-h-[220px] md:min-h-0 animate-fade-up delay-300">
              <img
                src="/celebration.jpg"
                alt="Community celebration and cohort success"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <p className="absolute left-4 bottom-3 text-sm text-white font-medium">Community celebration</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it helps ──────────────────────────────────── */}
      <section className="page-shell py-16 lg:py-20 bg-background/40">
        <div className="content-shell space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">ATN × ASU: How It Helps Participants</h2>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-medium">
              Designed to move women from learning to action — certifications build confidence,
              training develops service delivery skills, and courses strengthen business foundations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pathwaySteps.map((step, i) => (
              <div
                key={step.n}
                className="border border-border animate-fade-up bg-background shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="h-36 w-full overflow-hidden border-b border-border">
                  <img src={step.image} alt={step.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-5">
                  <div className="text-3xl font-black text-foreground/10 mb-3 chewy-regular">{step.n}</div>
                  <div className="font-bold text-foreground mb-2">{step.title}</div>
                  <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs (tabs) ───────────────────────────────── */}
      <section id="programs" className="page-shell py-16 lg:py-20">
        <div className="content-shell space-y-10">
          <div className="text-center space-y-4 max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">Certifications & Training</h2>
            <p className="text-sm lg:text-base text-muted-foreground leading-relaxed font-medium">
              Explore the pathways available now, with room to expand as ASU finalizes additional programming.
            </p>
          </div>

          <Tabs defaultValue="certifications" className="w-full">
            <TabsList className="w-full justify-start flex-wrap">
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="training">Training Programs</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            {[
              {
                value: 'certifications',
                cards: [
                  {
                    title: 'Community Service Provider Credential',
                    desc: 'A structured credential for service delivery fundamentals: quality standards, safety, and customer communication.',
                    bullets: ['Delivered in modules', 'Assessment + completion rubric', 'ATN onboarding readiness'],
                  },
                  {
                    title: 'Minority Women Entrepreneurship Certification',
                    desc: 'Training for sustainable business operations, pricing, scheduling, and growth strategy tailored to women-owned businesses.',
                    bullets: ['Business plan + execution outline', 'Mentored practice sessions', 'Resource navigation and next steps'],
                  },
                ],
              },
              {
                value: 'training',
                cards: [
                  {
                    title: 'ATN × ASU Service Excellence Sprint',
                    desc: 'Hands-on training focused on service quality, customer experience, and practical operations.',
                    bullets: ['Service standards & checklists', 'Communication & expectations', 'Scheduling and consistency'],
                  },
                  {
                    title: 'Women-Owned Business Growth Program',
                    desc: 'A mentorship-driven program for participants building or scaling local services and teams.',
                    bullets: ['Pricing, packages, and positioning', 'Marketing basics for local reach', 'Sustainable systems for day-to-day work'],
                  },
                ],
              },
              {
                value: 'courses',
                cards: [
                  {
                    title: 'Course: Customer-Centered Service Delivery',
                    desc: 'Learn how to deliver consistent experiences — before, during, and after the booking.',
                    bullets: ['Expectations, boundaries, and clarity', 'Documentation & follow-through', 'Feedback loops and improvement'],
                  },
                  {
                    title: 'Course: Local Business Branding & Outreach',
                    desc: 'Build your brand for the Jonesboro community — presentations, profiles, and service offerings.',
                    bullets: ['Profile story + service menu', 'Trust-building assets', 'Practical outreach plan'],
                  },
                ],
              },
            ].map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {tab.cards.map(card => (
                    <div key={card.title} className="bg-background border border-border rounded-2xl p-6 card-lift">
                      <h3 className="font-bold text-lg text-foreground mb-3">{card.title}</h3>
                      <p className="text-sm text-muted leading-relaxed mb-4">{card.desc}</p>
                      <Separator className="mb-4" />
                      <ul className="space-y-2">
                        {card.bullets.map(b => (
                          <li key={b} className="flex items-center gap-2 text-sm text-muted">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {tab.value === 'courses' && (
                  <div className="mt-5">
                    <div className="bg-background border border-border rounded-2xl p-6">
                      <h3 className="font-bold text-lg text-foreground mb-3">Course Catalog (Coming Soon)</h3>
                      <p className="text-sm text-muted leading-relaxed mb-5">
                        Additional courses as ASU finalizes programming — connected to ATN provider categories.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Operations & Scheduling Basics', 'Digital Presence for Women-Owned Brands', 'Pricing Packages & Service Bundles', 'Leadership & Mentorship Skills'].map((title) => (
                          <div key={title} className="border border-border p-4 bg-background/50">
                            <div className="text-sm font-semibold text-foreground">{title}</div>
                            <div className="text-xs text-muted mt-1">Status: In development</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="page-shell py-16 lg:py-20">
        <div className="content-shell">
          <div className="text-center animate-fade-up">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Empowerment in Action</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Ready to participate?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Access ASU-guided training and ATN pathways designed specifically to turn credentials into real
              economic opportunities for women-led services in Jonesboro.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="h-12 px-8 text-base shadow-sm font-semibold">
                <a href="/signup">Get started now</a>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 text-base">
                <a href="/how-it-works">Learn more</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';
import { ArrowRight, CalendarDays, GraduationCap, Users } from 'lucide-react';

const pathwaySteps = [
  { n: '01', title: 'Apply & Intake', desc: 'Get matched to the right pathway based on your goals and experience.' },
  { n: '02', title: 'Train & Practice', desc: 'Hands-on modules built around real service delivery scenarios.' },
  { n: '03', title: 'Earn Credential(s)', desc: 'Complete assessments and verify your readiness for community impact.' },
  { n: '04', title: 'Launch with ATN', desc: 'Translate training into listings, bookings, and mentorship support.' },
];

const pillars = [
  { label: 'Credentials', desc: 'Industry-standard skills and certifications that translate into real-world service delivery excellence.' },
  { icon: Users, label: 'Mentorship', desc: 'Dedicated guidance for women-owned businesses, supporting you from initial training to successful launch.' },
  { icon: CalendarDays, label: 'Pathways', desc: 'Directly connect your learning milestones to real bookings and meaningful community impact.' },
];

export default function WomenRiseInitiative() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 lg:px-[72px] pt-16 pb-12 lg:pt-24 lg:pb-20">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: 'url(/women_emp.jpg)' }} 
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-background/85 backdrop-blur-[1px]" aria-hidden="true" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/20 to-background" aria-hidden="true" />

        <div className="relative z-20 max-w-5xl mx-auto text-center">
          <div className="flex flex-col items-center space-y-8">
            {/* Partnership badge */}
            <div className="inline-flex items-center gap-12 px-0 py-6 border-b border-border/20 animate-fade-down">
              <img 
                src="/atn_logo_no_bg.png" 
                alt="ATN" 
                className="h-16 w-auto object-contain" 
                loading="lazy" 
              />
              <span className="text-muted/30 font-extralight text-5xl">|</span>
              <img 
                src="/asu_logo-removebg-preview.png" 
                alt="Arkansas State University" 
                className="h-16 w-auto object-contain" 
                loading="lazy" 
              />
            </div>

            <div className="space-y-4 animate-fade-up">
              <h1 className="text-4xl lg:text-7xl leading-[1.1] font-bold text-foreground">
                Empowering women<br />
                <span className="text-gradient-vibrant">to rise & thrive</span>
              </h1>
              <p className="text-sm lg:text-base text-muted leading-relaxed mx-auto max-w-2xl">
                A strategic partnership between Access Terrain Network (ATN) and Arkansas State University focused on
                equipping women with high-value credentials and community-connected career pathways.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-up delay-200">
              <Button asChild className="h-12 px-10 text-base font-semibold shadow-lg">
                <a href="/signup">Join the initiative</a>
              </Button>
              <Button asChild variant="outline" className="h-12 px-10 text-base bg-background/50">
                <a href="/how-it-works">
                  See how it works <ArrowRight size={16} className="ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pillars ────────────────────────────────────────── */}
      <section className="px-4 lg:px-[72px] py-16 lg:py-20 bg-background border-b border-border/40">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {pillars.map((p, i) => {
              return (
                <div 
                  key={p.label} 
                  className="border border-border p-8 bg-background shadow-sm hover:shadow-md transition-shadow animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {p.icon ? (
                    <div className="w-12 h-12 flex items-center justify-center mb-6 text-primary bg-background/50">
                      <p.icon size={22} />
                    </div>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center mb-6 text-primary bg-background/50">
                      <GraduationCap size={22} />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-foreground mb-3">{p.label}</h3>
                  <p className="text-sm text-muted leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it helps ──────────────────────────────────── */}
      <section className="px-4 lg:px-[72px] py-16 lg:py-20 bg-background/40">
        <div className="max-w-7xl mx-auto space-y-10">
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
                className="border border-border p-6 animate-fade-up bg-background shadow-sm hover:shadow-md transition-shadow"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl font-black text-foreground/10 mb-4 chewy-regular">{step.n}</div>
                <div className="font-bold text-foreground mb-2">{step.title}</div>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs (tabs) ───────────────────────────────── */}
      <section id="programs" className="px-4 lg:px-[72px] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto space-y-10">
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
      <section className="px-4 lg:px-[72px] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
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
              <Button asChild className="h-12 px-8 text-base shadow-sm">
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

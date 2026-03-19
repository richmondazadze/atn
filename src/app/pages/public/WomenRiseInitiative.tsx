import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ArrowRight, CalendarDays, GraduationCap, ShieldCheck, Users } from 'lucide-react';

export default function WomenRiseInitiative() {
  return (
    <div className="min-h-screen bg-background px-4 lg:px-[72px]">
      <div className="py-10 lg:py-14 max-w-7xl mx-auto space-y-28 lg:space-y-32">
        {/* Hero */}
        <section className="pt-2">
          <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
              <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-none border border-border/70 bg-background text-sm text-muted text-bold">
                ATN x Arkansas State University
              </div>

              <div className="space-y-3">
                <h1 className="text-3xl lg:text-[48px] lg:leading-[56px] font-semibold">
                  Women Rise Initiative
                </h1>
                <p className="text-base lg:text-lg text-muted leading-relaxed">
                  A partnership between Access Terrain Network (ATN) and Arkansas State University focused on
                  empowering women with credentials, practical training, and community-connected pathways.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Card className="border-border/70 p-4 bg-secondary/30">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck size={16} className="text-primary" />
                    Credentials
                  </div>
                  <p className="text-xs text-muted mt-2">Skills + standards that translate into real service delivery.</p>
                </Card>
                <Card className="border-border/70 p-4 bg-secondary/30">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Users size={16} className="text-primary" />
                    Mentorship
                  </div>
                  <p className="text-xs text-muted mt-2">Guidance for women-owned businesses from training to launch.</p>
                </Card>
                <Card className="border-border/70 p-4 bg-secondary/30">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <CalendarDays size={16} className="text-primary" />
                    Pathways
                  </div>
                  <p className="text-xs text-muted mt-2">Connect lessons to bookings and community impact.</p>
                </Card>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <a href="/signup">Join the initiative</a>
                </Button>
                <Button variant="outline" className="border-border" asChild>
                  <a href="/browse">Explore services</a>
                </Button>
              </div>
            </div>

            {/* Image placeholders */}
              <div className="space-y-4 lg:space-y-6">
              <div className="rounded-2xl overflow-hidden border border-border/70 bg-white shadow-sm">
                <img
                  src="/asu.webp"
                  alt="ATN x Arkansas State University"
                  className="w-full h-[340px] lg:h-[480px] object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

            {/* Workshop + Mentorship tiles (span full width under the full hero row) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="rounded-2xl border border-border/70 bg-background p-5 w-full">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-muted">Workshop space</div>
                </div>
                <div className="mt-4 aspect-[8/5] w-full rounded-xl overflow-hidden border border-border/70 bg-secondary">
                  <img
                    src="/space.jpg"
                    alt="Workshop space"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background p-5 w-full">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-muted">Mentorship moment</div>
                </div>
                <div className="mt-4 aspect-[8/5] w-full rounded-xl overflow-hidden border border-border/70 bg-secondary">
                  <img
                    src="/speech.jpg"
                    alt="Mentorship moment"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership + Next steps */}
        <section className="space-y-10">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-[28px] font-semibold">ATN x ASU: how it helps participants</h2>
              <p className="text-sm lg:text-base text-muted leading-relaxed">
                The initiative is designed to move women from learning to action: certifications build confidence,
                training develops service delivery skills, and courses strengthen business foundation.
              </p>
            </div>
            <Button variant="ghost" className="text-primary hover:text-primary/80" asChild>
              <a href="#programs">
                See programs <ArrowRight size={16} className="ml-2" />
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { n: '01', title: 'Apply & Intake', desc: 'Get matched to the right pathway based on goals and experience.' },
              { n: '02', title: 'Train & Practice', desc: 'Hands-on modules built around real service delivery scenarios.' },
              { n: '03', title: 'Earn Credential(s)', desc: 'Complete assessments and verify readiness for community impact.' },
              { n: '04', title: 'Launch with ATN', desc: 'Translate training into listings, bookings, and mentorship support.' },
            ].map(step => (
              <Card key={step.n} className="border-border/70 p-5 bg-secondary/20">
                <div className="text-sm font-semibold text-primary">{step.n}</div>
                <div className="mt-3 font-medium">{step.title}</div>
                <p className="text-sm text-muted mt-2 leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Programs */}
        <section id="programs" className="space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-[28px] font-semibold">Certifications & Training (ASU Collaboration)</h2>
              <p className="text-sm lg:text-base text-muted leading-relaxed">
                Explore the pathways available now, with room to expand as ASU finalizes additional programming.
              </p>
            </div>
            <Card className="border-border/70 bg-background p-5 max-w-xl">
              <div className="flex items-start gap-3">
                <GraduationCap size={18} className="text-primary mt-0.5" />
                <div>
                  <div className="font-medium">What you’ll be able to do</div>
                  <div className="text-sm text-muted mt-2 leading-relaxed">
                    Build service credibility, communicate clearly, and support women-led businesses with practical
                    tools from ATN and ASU collaboration.
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="certifications" className="w-full">
            <TabsList className="w-full justify-start flex-wrap">
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="training">Training Programs</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="certifications" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">Community Service Provider Credential</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    A structured credential for service delivery fundamentals: quality standards, safety,
                    and customer communication.
                  </p>
                  <Separator className="my-4" />
                  <div className="grid gap-2 text-sm text-muted">
                    <div>• Delivered in modules</div>
                    <div>• Assessment + completion rubric</div>
                    <div>• ATN onboarding readiness</div>
                  </div>
                </Card>

                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">Minority Women Entrepreneurship Certification</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    Training for sustainable business operations, pricing, scheduling, and growth strategy
                    tailored to women-owned businesses.
                  </p>
                  <Separator className="my-4" />
                  <div className="grid gap-2 text-sm text-muted">
                    <div>• Business plan + execution outline</div>
                    <div>• Mentored practice sessions</div>
                    <div>• Resource navigation and next steps</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="training" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">ATN x ASU Service Excellence Sprint</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    Hands-on training focused on service quality, customer experience, and practical operations.
                  </p>
                  <Separator className="my-4" />
                  <div className="grid gap-2 text-sm text-muted">
                    <div>• Service standards & checklists</div>
                    <div>• Communication & expectations</div>
                    <div>• Scheduling and consistency</div>
                  </div>
                </Card>

                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">Women-Owned Business Growth Program</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    A mentorship-driven program for participants building or scaling local services and teams.
                  </p>
                  <Separator className="my-4" />
                  <div className="grid gap-2 text-sm text-muted">
                    <div>• Pricing, packages, and positioning</div>
                    <div>• Marketing basics for local reach</div>
                    <div>• Sustainable systems for day-to-day work</div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">Course: Customer-Centered Service Delivery</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    Learn how to deliver consistent experiences—before, during, and after the booking.
                  </p>
                  <Separator className="my-4" />
                  <div className="grid gap-2 text-sm text-muted">
                    <div>• Expectations, boundaries, and clarity</div>
                    <div>• Documentation & follow-through</div>
                    <div>• Feedback loops and improvement</div>
                  </div>
                </Card>

                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">Course: Local Business Branding & Outreach</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    Build your brand for the Jonesboro community—presentations, profiles, and service offerings.
                  </p>
                  <Separator className="my-4" />
                  <div className="grid gap-2 text-sm text-muted">
                    <div>• Profile story + service menu</div>
                    <div>• Trust-building assets</div>
                    <div>• Practical outreach plan</div>
                  </div>
                </Card>
              </div>

              <div className="mt-6">
                <Card className="border-border/70 p-5">
                  <h3 className="font-semibold text-lg">Course Catalog (placeholder)</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">
                    Add additional course listings as ASU finalizes programming. These can later be connected to
                    ATN provider categories and resources.
                  </p>

                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      'Operations & Scheduling Basics',
                      'Digital Presence for Women-Owned Brands',
                      'Pricing Packages & Service Bundles',
                      'Leadership & Mentorship Skills',
                    ].map(title => (
                      <div key={title} className="rounded-xl border border-border/70 bg-background p-4">
                        <div className="text-sm font-medium">{title}</div>
                        <div className="text-xs text-muted mt-1">Placeholder course card</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-10">
          <Card className="border-border/70 bg-secondary/20 p-6 lg:p-8 rounded-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-2 space-y-3">
                <h3 className="text-xl lg:text-2xl font-semibold">Ready to participate?</h3>
                <p className="text-sm lg:text-base text-muted leading-relaxed">
                  Join the initiative to access ASU-guided training and ATN pathways—so credentials become real
                  opportunities for women-led services in Jonesboro.
                </p>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
                  <a href="/signup">Get started</a>
                </Button>
                <Button variant="outline" className="w-full border-border" asChild>
                  <a href="/how-it-works">See how it works</a>
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}


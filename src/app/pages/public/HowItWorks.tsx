import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Search, Calendar, UserCheck, CreditCard, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Browse & Compare',
    description: 'Explore vetted local providers across multiple service categories. Filter by price, rating, and real-time availability to find the exact help you need.',
  },
  {
    number: '02',
    icon: Calendar,
    title: 'Book Instantly',
    description: 'Select your preferred date and time. Confirm your booking in seconds with clear, upfront pricing — absolutely no hidden fees or last-minute surprises.',
  },
  {
    number: '03',
    icon: UserCheck,
    title: 'Get It Done',
    description: 'Meet your professional provider at the scheduled time. Once the job is complete, leave an honest review to help build our trusted community ecosystem.',
  },
];

const trust = [
  {
    icon: CheckCircle2,
    title: 'Verified Providers',
    description: 'Every single provider undergoes a thorough background check and manual review before they can join the ATN platform.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'We process all transactions using industry-leading encryption. You only pay the transparent price listed upfront.',
  },
  {
    icon: Star,
    title: 'Real Reviews',
    description: 'Honest, verified feedback from real customers ensures accountability and helps you make the best choice with confidence.',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative overflow-hidden px-4 md:px-6 lg:px-[72px] pt-28 pb-16 lg:pt-36 lg:pb-24">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full translate-x-1/3 -translate-y-1/2 blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl lg:text-[56px] leading-tight font-bold mb-5 animate-fade-up text-white drop-shadow-lg">
            How <span style={{ WebkitTextFillColor: 'transparent', background: 'linear-gradient(90deg, #FEF5DC 0%, #efb43d 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>ATN</span> Works
          </h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto animate-fade-up delay-100">
            Connect with trusted local service providers in three simple steps.
            Book in seconds, get it done with confidence.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative bg-background border border-border p-8 animate-fade-up shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  {/* Step number */}
                  <span className="absolute top-6 right-6 text-4xl font-black text-foreground/5 select-none">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 flex items-center justify-center mb-6 text-primary bg-background/50">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex items-center justify-center absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-background border border-border">
                      <ArrowRight size={16} className="text-muted" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-20 bg-background/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-[36px] font-bold text-foreground">Trust & Safety</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {trust.map((item, i) => {
              return (
                <div
                  key={item.title}
                  className="bg-background border border-border p-8 text-center animate-fade-up shadow-sm hover:shadow-md transition-shadow"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {item.icon && (
                    <div className="w-12 h-12 flex items-center justify-center mx-auto mb-5 text-primary bg-background/50">
                      <item.icon size={24} />
                    </div>
                  )}
                  <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-up">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Join the community</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Ready to get started?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Join hundreds of Jonesboro residents already using ATN to find and offer essential services.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="h-12 px-8 text-base shadow-sm font-semibold">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 text-base">
                <Link to="/browse">Browse Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

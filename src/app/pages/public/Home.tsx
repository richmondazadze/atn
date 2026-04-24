import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { ArrowRight, Search, Calendar, UserCheck, Star } from 'lucide-react';
import { getListingImageUrl } from '../../../lib/storage';
import { ListingCard } from '../../components/ListingCard';
import { RatingStars } from '../../components/RatingStars';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useListings } from '../../../hooks/useListings';
import { useTestimonials } from '../../../hooks/useTestimonials';

const howItWorksSteps = [
  {
    number: 1,
    title: 'Browse services',
    description: 'Explore vetted providers and services across 10 categories in Jonesboro.',
    icon: Search,
    color: 'bg-surface-teal text-primary',
    accent: 'from-surface-teal to-background',
  },
  {
    number: 2,
    title: 'Book instantly',
    description: 'Choose your date and time, then confirm your booking in seconds.',
    icon: Calendar,
    color: 'bg-surface-violet text-violet',
    accent: 'from-surface-violet to-background',
  },
  {
    number: 3,
    title: 'Get it done',
    description: 'Meet your provider at the scheduled time. Leave a review when complete.',
    icon: UserCheck,
    color: 'bg-surface-amber text-amber-700',
    accent: 'from-surface-amber to-background',
  },
];

const trustStats = [
  { value: '47+', label: 'Verified Providers' },
  { value: '128', label: 'Active Services' },
  { value: '4.9', label: 'Average Rating' },
];

function StatCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.]/g, '');
  const isFloat = value.includes('.');

  useEffect(() => {
    let start = 0;
    const end = numericPart;
    const duration = 1000; // fast animation
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function: easeOutExpo for a "fast" start and smooth finish
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const currentCount = easedProgress * end;
      setDisplayValue(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [numericPart]);

  return (
    <span className="chewy-regular">
      {isFloat ? displayValue.toFixed(1) : Math.floor(displayValue)}
      {suffix}
    </span>
  );
}

const avatarColors = [
  'bg-primary text-white',
  'bg-violet text-white',
  'bg-coral text-white',
  'bg-amber text-white',
  'bg-rose text-white',
];

export default function PublicHome() {
  const { listings, loading: listingsLoading } = useListings({ featured: true });
  const { testimonials, loading: testimonialsLoading } = useTestimonials();

  const featuredListings = listings.slice(0, 3);
  const loading = listingsLoading || testimonialsLoading;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner size="lg" label="Preparing your experience..." />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 md:px-6 lg:px-[72px] pt-20 pb-16 lg:pt-32 lg:pb-28">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1763048208932-cbe149724374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCbGFjayUyMHdvbWFuJTIwYnJhaWRpbmclMjBoYWlyJTIwc2Fsb258ZW58MXx8fHwxNzczNDQ1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080)' }} 
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-10 bg-background/65 backdrop-blur-[0.5px]" aria-hidden="true" />
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/20 to-background" aria-hidden="true" />

        <div className="relative z-20 max-w-5xl mx-auto text-center">
          <div className="flex flex-col items-center space-y-6">
            <div className="space-y-4 animate-fade-up max-w-4xl">
              <h1 className="text-4xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Book trusted<br />
                <span className="text-gradient-teal">local services</span><br />
                you can count on
              </h1>
              <p className="text-base lg:text-lg text-foreground/90 font-medium leading-relaxed mx-auto max-w-2xl animate-fade-up delay-100">
                Connect with vetted women service providers for cleaning, braiding, tutoring, home repair, and more. Instant booking, transparent pricing, and local expertise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-200">
              <Button asChild className="h-12 px-10 text-base font-semibold shadow-lg">
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-10 text-base bg-background/50">
                <Link to="/browse">
                  Browse Services
                  <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust strip ───────────────────────────────────── */}
      <section className="border-y border-border/60 bg-background px-4 md:px-6 lg:px-[72px]">
        <div className="py-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6 divide-x divide-border/60">
            {trustStats.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? 'pl-6' : ''} animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl lg:text-4xl font-bold mb-1 text-primary chewy-regular">
                  <StatCounter value={stat.value} />
                </div>
                <div className="text-xs lg:text-sm text-muted font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured services ─────────────────────────────── */}
      <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div className="space-y-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Featured Services</h2>
            </div>
            <Button asChild variant="ghost" className="text-primary hover:text-primary/80 gap-1 text-sm hidden sm:flex">
              <Link to="/browse">
                View all <ArrowRight size={14} />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.length > 0 ? (
              featuredListings.map((listing, i) => (
                <div key={listing.id} className={`animate-fade-up delay-${(i + 1) * 100}`}>
                  <ListingCard
                    id={listing.id}
                    title={listing.title}
                    providerName={listing.provider_name ?? ''}
                    price={listing.price}
                    duration={listing.duration}
                    rating={listing.rating}
                    reviewCount={listing.review_count}
                    nextAvailable={listing.next_available ?? ''}
                    featured={listing.featured}
                    category={listing.category_slug}
                    image={listing.images[0] ? getListingImageUrl(listing.images[0]) : undefined}
                  />
                </div>
              ))
            ) : (
              /* Placeholder cards while no listings */
              [0, 1, 2].map(i => (
                <div key={i} className={`h-80 bg-gradient-to-br from-surface-teal to-surface-violet rounded-2xl animate-shimmer delay-${(i + 1) * 100}`} />
              ))
            )}
          </div>

          <div className="mt-6 sm:hidden text-center">
            <Button asChild variant="outline" className="w-full">
              <Link to="/browse">View all services <ArrowRight size={14} className="ml-1" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────── */}
      <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-20 bg-background/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">How it Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10 relative">
            {/* Connector line — desktop */}
            <div className="hidden sm:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-border to-transparent" aria-hidden="true" />
            {howItWorksSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className={`relative text-center animate-fade-up delay-${(i + 1) * 150}`}>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${step.color} mb-5 shadow-sm`}>
                    <Icon size={26} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-[11px] font-bold flex items-center justify-center hidden sm:flex chewy-regular">
                    {step.number}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────── */}
      {testimonials.length > 0 && (
        <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 animate-fade-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">What the Community Says</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <div
                  key={t.id}
                  className={`bg-background border border-border rounded-2xl p-6 card-lift animate-fade-up delay-${(i + 1) * 100}`}
                >
                  <RatingStars rating={t.rating} showCount={false} size={15} />
                  <p className="text-sm text-foreground/80 mt-4 mb-5 leading-relaxed italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                      {t.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted">{t.service}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ───────────────────────────────────────────── */}
      <section className="px-4 md:px-6 lg:px-[72px] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-4">Join the community</p>
            <h2 className="text-3xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Ready to get started?
            </h2>
            <p className="text-muted text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Join Access Terrain Network as a customer or service provider today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild className="h-12 px-8 text-base shadow-sm">
                <Link to="/signup">Sign Up Free</Link>
              </Button>
              <Button asChild variant="outline" className="h-12 px-8 text-base">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    );
  }

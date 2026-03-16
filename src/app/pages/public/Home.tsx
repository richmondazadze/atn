import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowRight, Search, Calendar, UserCheck } from 'lucide-react';
import { listings, testimonials, howItWorksSteps } from '../../data/mockData';
import { getListingImage } from '../../data/images';
import { RatingStars } from '../../components/RatingStars';

export default function PublicHome() {
  const featuredListings = listings.filter(l => l.featured).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-border px-6 lg:px-[72px]">
        <div className="py-16 lg:py-24 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h1 className="text-4xl lg:text-[48px] lg:leading-[56px] font-semibold mb-4 lg:mb-6 text-foreground">
                Book trusted local services in Jonesboro
              </h1>
              <p className="text-lg lg:text-[20px] text-muted mb-6 lg:mb-8">
                Connect with vetted women service providers for cleaning, braiding, tutoring, home repair, and more. Instant booking, transparent pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button variant="outline" className="border-border px-8 py-6 text-base w-full sm:w-auto">
                    Browse Services
                  </Button>
                </Link>
              </div>
            </div>
            <div className="h-64 lg:h-[400px] rounded overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1763048208932-cbe149724374?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCbGFjayUyMHdvbWFuJTIwYnJhaWRpbmclMjBoYWlyJTIwc2Fsb258ZW58MXx8fHwxNzczNDQ1NjIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Hair braiding service provider working in salon"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-secondary px-6 lg:px-[72px]">
        <div className="py-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { value: '47+', label: 'Verified Providers' },
              { value: '128', label: 'Active Services' },
              { value: '4.9', label: 'Average Rating' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl lg:text-[32px] font-semibold text-primary mb-1">{stat.value}</div>
                <div className="text-xs lg:text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <section className="border-b border-border px-6 lg:px-[72px]">
        <div className="py-12 lg:py-16 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-2xl lg:text-[32px] font-semibold">Featured Services</h2>
            <Link to="/browse">
              <Button variant="ghost" className="text-primary hover:text-primary/80 text-sm">
                View all <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <Card key={listing.id} className="border-border overflow-hidden hover:border-primary transition-colors group">
                <div className="h-44 bg-gradient-to-br from-primary/20 to-primary/10">
                  {listing.images[0] && getListingImage(listing.images[0]) && (
                    <img src={getListingImage(listing.images[0])} alt={listing.title} className="w-full h-full object-cover" loading="lazy" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">{listing.title}</h3>
                  <p className="text-sm text-muted mt-1 mb-3">{listing.providerName}</p>
                  <RatingStars rating={listing.rating} reviewCount={listing.reviewCount} />
                  <div className="flex items-center justify-between text-sm mt-3 mb-4">
                    <span className="font-medium">${listing.price}</span>
                    <span className="text-muted">{listing.duration}m</span>
                  </div>
                  <Link to="/login">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                      Sign in to book
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-b border-border bg-secondary px-6 lg:px-[72px]">
        <div className="py-12 lg:py-16 max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-[32px] font-semibold mb-10 lg:mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
            {howItWorksSteps.map((step) => {
              const icons = [Search, Calendar, UserCheck];
              const Icon = icons[step.number - 1];
              return (
                <div key={step.number} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-primary/10 text-foreground mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-base lg:text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-border px-6 lg:px-[72px]">
        <div className="py-12 lg:py-16 max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-[32px] font-semibold mb-10 lg:mb-12 text-center">What Customers Say</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <Card key={i} className="border-border p-6 lg:p-8">
                <RatingStars rating={t.rating} showCount={false} size={16} />
                <p className="text-sm text-foreground mt-3 mb-4">"{t.text}"</p>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted">{t.service}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 lg:px-[72px]">
        <div className="py-12 lg:py-16 max-w-7xl mx-auto text-center">
          <h2 className="text-2xl lg:text-[32px] font-semibold mb-3">Ready to get started?</h2>
          <p className="text-base text-muted mb-6 lg:mb-8">Join Access Terrain Network as a customer or provider</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 w-full sm:w-auto">Sign Up</Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" className="border-border px-8 w-full sm:w-auto">Learn More</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

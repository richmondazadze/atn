import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Search, Calendar, UserCheck, Shield, CreditCard, Star } from 'lucide-react';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-white px-6 lg:px-[72px]">
      <div className="py-12 lg:py-16 max-w-7xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <h1 className="text-3xl lg:text-[48px] lg:leading-[56px] font-semibold mb-4">How ATN Works</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Connect with trusted service providers in three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 mb-16 lg:mb-20">
          {[
            { icon: Search, title: 'Browse & Compare', desc: 'Explore vetted providers across 10 service categories. Filter by price, rating, and availability.' },
            { icon: Calendar, title: 'Book Instantly', desc: 'Choose your date and time. Confirm your booking in seconds with transparent pricing.' },
            { icon: UserCheck, title: 'Get It Done', desc: 'Meet your provider at the scheduled time. Leave a review when complete.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary/10 mb-5">
                <Icon size={28} />
              </div>
              <h3 className="text-lg lg:text-xl font-semibold mb-2">{title}</h3>
              <p className="text-sm lg:text-base text-muted">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-16 lg:mb-20">
          <h2 className="text-2xl lg:text-[32px] font-semibold mb-8 text-center">Trust & Safety</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: Shield, title: 'Verified Providers', desc: 'All providers are background-checked and verified' },
              { icon: CreditCard, title: 'Secure Payments', desc: 'Encrypted transactions with transparent pricing' },
              { icon: Star, title: 'Rated Reviews', desc: 'Real reviews from verified customers' },
            ].map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border p-6 lg:p-8 text-center">
                <Icon size={28} className="mx-auto mb-3 text-primary" />
                <h3 className="font-medium mb-2">{title}</h3>
                <p className="text-sm text-muted">{desc}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl lg:text-[32px] font-semibold mb-5">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 w-full sm:w-auto">Sign Up Now</Button>
            </Link>
            <Link to="/browse">
              <Button variant="outline" className="border-border px-8 w-full sm:w-auto">Browse Services</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

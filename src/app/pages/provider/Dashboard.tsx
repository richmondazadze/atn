import { useMemo } from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, DollarSign, Star, Bot, Clock, MapPin, User } from 'lucide-react';
import { useBookings } from '../../../hooks/useBookings';
import { useReviews } from '../../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { bookings, loading: bookingsLoading } = useBookings();
  const { reviews, loading: reviewsLoading } = useReviews({ providerId: user.id });

  const firstName = user.name.split(' ')[0];
  const loading = bookingsLoading || reviewsLoading;

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === today && b.status === 'confirmed');

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekEarnings = bookings
      .filter(b => new Date(b.date) >= weekStart && (b.status === 'completed' || b.status === 'confirmed'))
      .reduce((s, b) => s + b.price, 0);

    const avgRating = reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0';

    return {
      todayCount: todayBookings.length,
      weekEarnings,
      avgRating,
      reviewCount: reviews.length,
    };
  }, [bookings, reviews]);

  const todaysBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(b => b.date === today && b.status === 'confirmed');
  }, [bookings]);

  const upcomingBookings = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return bookings
      .filter(b => b.date >= today && b.status === 'confirmed')
      .slice(0, 5);
  }, [bookings]);

  const displayBookings = todaysBookings.length > 0 ? todaysBookings : upcomingBookings;

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Welcome back, {firstName}</h1>
            <p className="text-sm text-muted">Here's how your business is doing</p>
          </div>
          <Link to="/provider/ai-coach">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground w-full sm:w-auto">
              <Bot size={15} className="mr-2" />
              Ask AI Coach
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
          <Card className="border-border p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={18} className="text-muted" />
              <span className="text-xs lg:text-sm text-muted">Bookings Today</span>
            </div>
            <div className="text-xl lg:text-[32px] font-semibold">{stats.todayCount}</div>
          </Card>
          <Card className="border-border p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={18} className="text-muted" />
              <span className="text-xs lg:text-sm text-muted">This Week</span>
            </div>
            <div className="text-xl lg:text-[32px] font-semibold">${stats.weekEarnings}</div>
          </Card>
          <Card className="border-border p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Star size={18} className="text-muted" />
              <span className="text-xs lg:text-sm text-muted">Rating</span>
            </div>
            <div className="text-xl lg:text-[32px] font-semibold">{stats.avgRating}</div>
            <span className="text-xs text-muted">{stats.reviewCount} reviews</span>
          </Card>
          <Card className="border-border p-4 lg:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Bot size={18} className="text-primary" />
              <span className="text-xs lg:text-sm text-muted">AI Coaching</span>
            </div>
            <div className="text-xl lg:text-[32px] font-semibold text-primary">Active</div>
          </Card>
        </div>

        <section className="mb-10 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-semibold">
              {todaysBookings.length > 0 ? "Today's Bookings" : 'Upcoming Bookings'}
            </h2>
            <Link to="/provider/bookings">
              <Button variant="ghost" className="text-primary text-sm">View all</Button>
            </Link>
          </div>

          {displayBookings.length === 0 ? (
            <EmptyState icon={<Calendar size={40} />} title="No upcoming bookings" description="Your confirmed appointments will appear here." />
          ) : (
            <div className="space-y-4">
              {displayBookings.map(booking => (
                <Card key={booking.id} className="border-border bg-white p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-primary text-primary-foreground border-0">Confirmed</Badge>
                        <span className="text-xs text-muted">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                      <h3 className="font-medium mb-0.5">{booking.title}</h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted mb-3">
                        <User size={13} />
                        <span>{booking.customer_name || 'Customer'}</span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex items-center gap-1.5 text-sm text-muted">
                          <Clock size={13} />
                          <span>{booking.time} ({booking.duration}m)</span>
                        </div>
                        {booking.address && (
                          <div className="flex items-center gap-1.5 text-sm text-muted">
                            <MapPin size={13} />
                            <span className="truncate">{booking.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                      <div className="text-xl font-semibold">${booking.price}</div>
                      <Link to="/provider/bookings">
                        <Button variant="outline" className="border-border text-sm">View details</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl lg:text-2xl font-semibold mb-4 lg:mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <Link to="/provider/listings/new">
              <Card className="border-border p-5 lg:p-6 hover:border-primary transition-colors cursor-pointer">
                <h3 className="font-medium mb-1">Create New Listing</h3>
                <p className="text-sm text-muted">Add a new service to your offerings</p>
              </Card>
            </Link>
            <Link to="/provider/availability">
              <Card className="border-border p-5 lg:p-6 hover:border-primary transition-colors cursor-pointer">
                <h3 className="font-medium mb-1">Update Availability</h3>
                <p className="text-sm text-muted">Set your weekly hours and blocked dates</p>
              </Card>
            </Link>
            <Link to="/provider/ai-coach">
              <Card className="border-accent bg-accent/10 p-5 lg:p-6 hover:border-accent transition-colors cursor-pointer">
                <h3 className="font-medium mb-1">Get AI Coaching</h3>
                <p className="text-sm text-muted">Pricing, descriptions, and business tips</p>
              </Card>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

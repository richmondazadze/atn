import { useMemo } from 'react';
import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, DollarSign, Star, Bot, Clock, MapPin, User, Zap, LayoutGrid, ArrowRight } from 'lucide-react';
import { useBookings } from '../../../hooks/useBookings';
import { useReviews } from '../../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';
import { LoadingSpinner } from '../../components/LoadingSpinner';

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
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-10 max-w-7xl mx-auto">

        {/* ── Page Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 lg:mb-12 animate-fade-up">
          <div>
            <h1 className="text-2xl lg:text-[32px] font-bold mb-1">
              Welcome back, <span className="text-primary">{firstName}</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium">Jonesboro, AR • Service Provider Overview</p>
          </div>
          <Link to="/provider/ai-coach">
            <Button className="h-11 px-6 font-bold gap-2">
              <Bot size={16} />
              Ask AI Coach
            </Button>
          </Link>
        </div>

        {/* ── Stat Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-16">

          {/* Card 1 – Bookings Today */}
          <Card className="p-5 lg:p-6 animate-fade-up delay-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span>Bookings</span>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-primary/20 text-primary font-bold">Today</Badge>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Bookings</p>
            <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1 chewy-regular">
              {stats.todayCount}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Confirmed appointments</p>
          </Card>

          {/* Card 2 – Revenue */}
          <Card className="p-5 lg:p-6 animate-fade-up delay-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center shrink-0">
                <DollarSign size={20} className="text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-status-green/20 text-status-green font-bold">MTD</Badge>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Earnings</p>
            <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1 chewy-regular">
              ${stats.weekEarnings}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">This week's revenue</p>
          </Card>

          {/* Card 3 – Reviews/Rating */}
          <Card className="p-5 lg:p-6 animate-fade-up delay-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center shrink-0">
                <Star size={20} className="text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-amber/20 text-amber-600 font-bold">Rating</Badge>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Feedback</p>
            <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1 chewy-regular">
              {stats.avgRating}
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">{stats.reviewCount} total reviews</p>
          </Card>

          {/* Card 4 – AI Coaching */}
          <Card className="p-5 lg:p-6 animate-fade-up delay-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center justify-center shrink-0">
                <Zap size={20} className="text-muted-foreground" />
              </div>
              <Badge variant="outline" className="text-[10px] uppercase tracking-tighter border-violet/20 text-violet-600 font-bold">Coach</Badge>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mb-1">Insights</p>
            <div className="text-3xl lg:text-4xl font-bold text-foreground mb-1 chewy-regular">
              Active
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">Smart business tips</p>
          </Card>
        </div>

        {/* ── Bookings Section ──────────────────────────────── */}
        <section className="mb-10 lg:mb-16 animate-fade-up delay-200">
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">
              {todaysBookings.length > 0 ? "Today's Schedule" : 'Upcoming Schedule'}
            </h2>
            <Link to="/provider/bookings">
              <Button variant="ghost" className="text-primary font-bold text-sm gap-1.5 px-0 hover:bg-transparent hover:underline">
                View full calendar <ArrowRight size={14} />
              </Button>
            </Link>
          </div>

          {displayBookings.length === 0 ? (
            <Card className="border-dashed py-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <Calendar size={24} className="text-muted-foreground" />
              </div>
              <h3 className="font-bold text-foreground mb-1">No bookings found</h3>
              <p className="text-sm text-muted-foreground">Your confirmed appointments will appear here.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {displayBookings.map((booking, idx) => (
                <Card
                  key={booking.id}
                  className="p-5 lg:p-6 group hover:border-primary/40 transition-colors animate-fade-up"
                  style={{ animationDelay: `${200 + idx * 60}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/5 px-2 py-0.5 border border-primary/10">
                          Confirmed
                        </span>
                        <span className="text-xs font-bold text-muted-foreground/80 uppercase tracking-tighter">
                          {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{booking.title}</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User size={14} className="text-muted-foreground" />
                          <span className="font-medium text-foreground">{booking.customer_name || 'Guest User'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock size={14} className="text-muted-foreground" />
                          <span className="font-medium text-foreground">{booking.time}</span>
                        </div>
                        {booking.address && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground lg:col-span-1">
                            <MapPin size={14} className="text-muted-foreground" />
                            <span className="truncate font-medium text-foreground">{booking.address}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-4 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-border/50 w-full md:w-auto">
                      <div className="flex items-center justify-between w-full chewy-regular">
                        <div className="text-xl font-bold text-foreground">${booking.price}</div>
                        <div className="text-xs text-muted">{booking.duration}m</div>
                      </div>
                      <Button variant="outline" className="h-11 sm:h-9 px-4 font-bold text-sm sm:text-xs w-full sm:w-auto" asChild>
                        <Link to="/provider/bookings">View Details</Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* ── Quick Actions ─────────────────────────────────── */}
        <section className="animate-fade-up delay-300">
          <div className="mb-6 lg:mb-8">
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">Management</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            <Link to="/provider/listings/new">
              <Card className="p-6 h-full transition-all cursor-pointer group">
                <div className="flex items-center justify-start mb-6">
                  <LayoutGrid size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">Service Listings</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Create and manage your professional service offerings.</p>
              </Card>
            </Link>
            <Link to="/provider/availability">
              <Card className="p-6 h-full transition-all cursor-pointer group">
                <div className="flex items-center justify-start mb-6">
                  <Calendar size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">Availability</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Set your working hours and manage blocked dates.</p>
              </Card>
            </Link>
            <Link to="/provider/ai-coach">
              <Card className="p-6 h-full transition-all cursor-pointer group">
                <div className="flex items-center justify-start mb-6">
                  <Zap size={24} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <h3 className="font-bold text-lg mb-2">AI Coaching</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">Get personalized business tips and pricing insights.</p>
              </Card>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

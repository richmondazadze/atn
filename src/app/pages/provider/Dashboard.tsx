import { Link } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Calendar, DollarSign, Star, Bot, Clock, MapPin } from 'lucide-react';
import { useBookings } from '../../../hooks/useBookings';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';

export default function ProviderDashboard() {
  const { user } = useAuth();
  const { bookings, loading } = useBookings();
  const firstName = user.name.split(' ')[0];
  const myBookings = bookings.filter(b => b.status === 'confirmed');

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Header */}
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

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-10 lg:mb-12">
          {[
            { icon: Calendar, label: 'Bookings Today', value: '3', sub: null },
            { icon: DollarSign, label: 'This Week', value: '$425', sub: null },
            { icon: Star, label: 'Rating', value: '4.9', sub: '47 reviews' },
            { icon: Bot, label: 'AI Coaching', value: 'Active', sub: null, green: true },
          ].map(({ icon: Icon, label, value, sub, green }) => (
            <Card key={label} className="border-border p-4 lg:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={green ? 'text-primary' : 'text-muted'} />
                <span className="text-xs lg:text-sm text-muted">{label}</span>
              </div>
              <div className={`text-xl lg:text-[32px] font-semibold ${green ? 'text-primary' : ''}`}>{value}</div>
              {sub && <span className="text-xs text-muted">{sub}</span>}
            </Card>
          ))}
        </div>

        {/* Today's Bookings */}
        <section className="mb-10 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-semibold">Today's Bookings</h2>
            <Link to="/provider/bookings">
              <Button variant="ghost" className="text-primary text-sm">View all</Button>
            </Link>
          </div>

          {myBookings.length === 0 ? (
            <EmptyState icon={<Calendar size={40} />} title="No bookings today" description="Your confirmed appointments will appear here." />
          ) : (
            <div className="space-y-4">
              {myBookings.map(booking => (
                <Card key={booking.id} className="border-border bg-white p-5 lg:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-primary text-primary-foreground border-0">Confirmed</Badge>
                        <span className="text-xs text-muted">Booked {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      <h3 className="font-medium mb-0.5">{booking.title}</h3>
                      <p className="text-sm text-muted mb-3">{booking.title}</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex items-center gap-1.5 text-sm text-muted">
                          <Clock size={13} />
                          <span>{booking.time} ({booking.duration}m)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted">
                          <MapPin size={13} />
                          <span className="truncate">{booking.address}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
                      <div className="text-xl font-semibold">${booking.price}</div>
                      <Button variant="outline" className="border-border text-sm">View details</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Quick Actions */}
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

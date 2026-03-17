import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Clock, MapPin, MessageSquare, Calendar } from 'lucide-react';
import { bookings } from '../../data/mockData';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router';
import { toast } from 'sonner';

function BookingCard({ booking, variant }: { booking: typeof bookings[0]; variant: 'upcoming' | 'past' | 'cancelled' }) {
  return (
    <Card className="border-border bg-white p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <h3 className="font-medium truncate">{booking.title}</h3>
              <p className="text-sm text-muted">{booking.providerName}</p>
            </div>
            {variant === 'upcoming' && <Badge className="bg-primary text-primary-foreground border-0 shrink-0 ml-3">Confirmed</Badge>}
            {variant === 'past' && <Badge variant="outline" className="border-border text-muted shrink-0 ml-3">Completed</Badge>}
            {variant === 'cancelled' && <Badge variant="outline" className="border-destructive text-destructive shrink-0 ml-3">Cancelled</Badge>}
          </div>

          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Clock size={13} />
              <span>
                {variant === 'past'
                  ? `Completed on ${new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                  : `${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${booking.time}`}
              </span>
            </div>
            {booking.address && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={13} />
                <span className="truncate">{booking.address}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {variant === 'upcoming' && (
              <>
                <Button variant="outline" className="border-border text-sm">View details</Button>
                <Button variant="ghost" className="text-destructive text-sm" onClick={() => toast.success('Booking cancelled')}>Cancel booking</Button>
              </>
            )}
            {variant === 'past' && (
              <>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
                  <MessageSquare size={14} className="mr-1.5" /> Leave review
                </Button>
                <Link to={`/customer/listing/${booking.listingId}`}>
                  <Button variant="outline" className="border-border text-sm">Book again</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="text-xl font-semibold">${booking.price}</div>
          <div className="text-xs text-muted">{booking.duration}m</div>
        </div>
      </div>
    </Card>
  );
}

export default function MyBookings() {
  const upcoming = bookings.filter(b => b.status === 'confirmed');
  const past = bookings.filter(b => b.status === 'completed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-[32px] font-semibold mb-6 lg:mb-8">My Bookings</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6 lg:mb-8">
            <TabsTrigger value="upcoming">Upcoming {upcoming.length > 0 && `(${upcoming.length})`}</TabsTrigger>
            <TabsTrigger value="past">Past {past.length > 0 && `(${past.length})`}</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<Calendar size={40} />}
                title="No upcoming bookings"
                description="Browse services to book your next appointment."
                action={<Link to="/customer/search"><Button className="bg-primary text-primary-foreground">Browse services</Button></Link>}
              />
            ) : (
              <div className="space-y-4">
                {upcoming.map(b => <BookingCard key={b.id} booking={b} variant="upcoming" />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {past.length === 0 ? (
              <EmptyState icon={<Clock size={40} />} title="No past bookings" description="Your completed bookings will appear here." />
            ) : (
              <div className="space-y-4">
                {past.map(b => <BookingCard key={b.id} booking={b} variant="past" />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cancelled">
            {cancelled.length === 0 ? (
              <EmptyState title="No cancelled bookings" description="You're all good — no cancelled bookings." />
            ) : (
              <div className="space-y-4">
                {cancelled.map(b => <BookingCard key={b.id} booking={b} variant="cancelled" />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

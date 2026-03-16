import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Calendar, Clock, MapPin, User, MessageCircle, Check, X } from 'lucide-react';
import { bookings } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner';

function statusBadge(status: string) {
  if (status === 'confirmed') return <Badge className="bg-primary text-primary-foreground border-0">Confirmed</Badge>;
  if (status === 'completed') return <Badge variant="secondary">Completed</Badge>;
  return <Badge variant="destructive">Cancelled</Badge>;
}

export default function BookingInbox() {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<typeof bookings[0] | null>(null);
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState('');

  const myBookings = bookings.filter(b => b.providerId === user.id);
  const upcoming = myBookings.filter(b => b.status === 'confirmed' && new Date(`${b.date} ${b.time}`) > new Date());
  const completed = myBookings.filter(b => b.status === 'completed');

  function BookingItem({ booking }: { booking: typeof bookings[0] }) {
    return (
      <Card
        className="border-border p-5 cursor-pointer hover:border-primary transition-colors"
        onClick={() => setSelectedBooking(booking)}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${booking.title} with ${booking.customerName}`}
        onKeyDown={e => e.key === 'Enter' && setSelectedBooking(booking)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {statusBadge(booking.status)}
              <span className="text-xs text-muted">Booked {new Date(booking.bookedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <h3 className="font-medium truncate">{booking.title}</h3>
          </div>
          <div className="text-lg font-semibold ml-4 shrink-0">${booking.price}</div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted mb-2">
          <User size={13} />
          <span>{booking.customerName}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{booking.time} ({booking.duration}m)</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Bookings</h1>
          <p className="text-sm text-muted">Manage your upcoming and past appointments</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-5">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
            <TabsTrigger value="all">All ({myBookings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length === 0
              ? <EmptyState icon={<Calendar size={40} />} title="No upcoming bookings" description="Your confirmed appointments will appear here." />
              : upcoming.map(b => <BookingItem key={b.id} booking={b} />)
            }
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completed.length === 0
              ? <EmptyState icon={<Calendar size={40} />} title="No completed bookings" description="Your booking history will appear here." />
              : completed.map(b => <BookingItem key={b.id} booking={b} />)
            }
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {myBookings.length === 0
              ? <EmptyState title="No bookings yet" description="Bookings from customers will appear here." />
              : myBookings.map(b => <BookingItem key={b.id} booking={b} />)
            }
          </TabsContent>
        </Tabs>
      </div>

      {/* Details dialog */}
      {selectedBooking && (
        <Dialog open onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {statusBadge(selectedBooking.status)}
                <span className="text-xs text-muted">ID: {selectedBooking.id.toUpperCase()}</span>
              </div>
              <h3 className="font-medium text-lg">{selectedBooking.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><div className="text-xs text-muted mb-0.5">Customer</div><div className="font-medium">{selectedBooking.customerName}</div></div>
                <div><div className="text-xs text-muted mb-0.5">Total</div><div className="font-medium text-lg">${selectedBooking.price}</div></div>
                <div><div className="text-xs text-muted mb-0.5">Date & Time</div><div className="font-medium">{new Date(selectedBooking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}<br />{selectedBooking.time} ({selectedBooking.duration}m)</div></div>
                <div><div className="text-xs text-muted mb-0.5">Location</div><div className="font-medium">{selectedBooking.address}</div></div>
              </div>
            </div>
            <DialogFooter className="gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setShowMsg(true)}>
                <MessageCircle size={14} className="mr-1.5" /> Message
              </Button>
              {selectedBooking.status === 'confirmed' && (
                <>
                  <Button variant="outline" size="sm" className="border-destructive text-destructive" onClick={() => { toast.success('Booking cancelled'); setSelectedBooking(null); }}>
                    <X size={14} className="mr-1.5" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground" onClick={() => { toast.success('Marked as complete'); setSelectedBooking(null); }}>
                    <Check size={14} className="mr-1.5" /> Mark Complete
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Message dialog */}
      <Dialog open={showMsg} onOpenChange={setShowMsg}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message Customer</DialogTitle></DialogHeader>
          <div>
            <Label className="mb-2 block text-sm">To: {selectedBooking?.customerName}</Label>
            <Textarea placeholder="Type your message…" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="resize-none" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMsg(false)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={() => { setShowMsg(false); setMessage(''); toast.success('Message sent'); }}>
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Calendar, Clock, MapPin, User, MessageCircle, Check, X } from 'lucide-react';
import { useBookings, type Booking } from '../../../hooks/useBookings';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner';

function statusBadge(status: string) {
  if (status === 'confirmed') return <Badge className="bg-primary text-primary-foreground border-0">Confirmed</Badge>;
  if (status === 'completed') return <Badge variant="secondary">Completed</Badge>;
  return <Badge variant="destructive">Cancelled</Badge>;
}

export default function BookingInbox() {
  const { user } = useAuth();
  const { bookings, loading, refetch } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date} ${b.time}`) > new Date());
  const completed = bookings.filter(b => b.status === 'completed');

  function BookingItem({ booking }: { booking: Booking }) {
    return (
      <Card
        className="border-border p-5 cursor-pointer hover:border-primary transition-colors"
        onClick={() => setSelectedBooking(booking)}
        tabIndex={0}
        role="button"
        aria-label={`View details for ${booking.title}`}
        onKeyDown={e => e.key === 'Enter' && setSelectedBooking(booking)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {statusBadge(booking.status)}
              <span className="text-xs text-muted">Booked {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <h3 className="font-medium truncate">{booking.title}</h3>
          </div>
          <div className="text-lg font-semibold ml-4 shrink-0">${booking.price}</div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted mb-2">
          <User size={13} />
          <span>{booking.customer_name || 'Customer'}</span>
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
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Bookings</h1>
          <p className="text-sm text-muted">Manage your upcoming and past appointments</p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-5">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
            <TabsTrigger value="all">All ({bookings.length})</TabsTrigger>
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
            {bookings.length === 0
              ? <EmptyState title="No bookings yet" description="Bookings from customers will appear here." />
              : bookings.map(b => <BookingItem key={b.id} booking={b} />)
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
                <div><div className="text-xs text-muted mb-0.5">Service</div><div className="font-medium">{selectedBooking.title}</div></div>
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
                  <Button variant="outline" size="sm" className="border-destructive text-destructive" onClick={async () => {
                    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', selectedBooking.id);
                    if (error) { toast.error('Failed to update'); return; }
                    toast.success('Booking cancelled');
                    setSelectedBooking(null);
                    refetch();
                  }}>
                    <X size={14} className="mr-1.5" /> Cancel
                  </Button>
                  <Button size="sm" className="bg-primary text-primary-foreground" onClick={async () => {
                    const { error } = await supabase.from('bookings').update({ status: 'completed' }).eq('id', selectedBooking.id);
                    if (error) { toast.error('Failed to update'); return; }
                    toast.success('Marked as complete');
                    setSelectedBooking(null);
                    refetch();
                  }}>
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
            <Label className="mb-2 block text-sm">To: {selectedBooking?.customer_name || 'Customer'}</Label>
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

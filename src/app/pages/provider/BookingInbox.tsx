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
import { useBookingMessages } from '../../../hooks/useBookingMessages';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { EmptyState } from '../../components/EmptyState';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

function statusBadge(status: string) {
  if (status === 'confirmed')
    return <Badge className="bg-surface-teal text-primary border-0 font-medium">Confirmed</Badge>;
  if (status === 'completed')
    return <Badge className="bg-surface-green text-status-green border-0 font-medium">Completed</Badge>;
  return <Badge className="bg-surface-coral text-coral border-0 font-medium">Cancelled</Badge>;
}

function statusBorderClass(status: string) {
  if (status === 'confirmed') return 'border-l-primary';
  if (status === 'completed') return 'border-l-[#16a34a]';
  return 'border-l-coral';
}

export default function BookingInbox() {
  const { user } = useAuth();
  const { bookings, loading, refetch } = useBookings();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { messages, sendMessage } = useBookingMessages(selectedBooking?.id ?? null);
  const [showMsg, setShowMsg] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date} ${b.time}`) > new Date());
  const completed = bookings.filter(b => b.status === 'completed');

  function BookingItem({ booking }: { booking: Booking }) {
    return (
      <Card
        className={`card-lift rounded-2xl border-l-4 ${statusBorderClass(booking.status)} cursor-pointer p-5 transition-all`}
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
              <span className="text-xs text-muted">
                Booked {new Date(booking.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h3 className="font-semibold text-foreground truncate">{booking.title}</h3>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted mb-2">
          <User size={13} />
          <span>{booking.customer_name || 'Customer'}</span>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>
              {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={13} />
            <span>{booking.time}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/40">
          <div className="text-lg font-bold text-primary">${booking.price}</div>
          <div className="text-xs text-muted bg-secondary px-2 py-0.5 rounded-full">{booking.duration}m</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-4xl mx-auto flex items-center gap-3 animate-fade-up">
          <div className="w-10 h-10 rounded-xl bg-surface-teal flex items-center justify-center shrink-0">
            <Calendar size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Booking Inbox</h1>
            <p className="text-sm text-muted mt-0.5">Manage your upcoming and past appointments</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="upcoming" className="space-y-5">
            <TabsList className="bg-secondary p-1 rounded-xl h-auto gap-1">
              <TabsTrigger
                value="upcoming"
                className="rounded-lg data-[state=active]:bg-surface-teal data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium transition-all"
              >
                Upcoming
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {upcoming.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="rounded-lg data-[state=active]:bg-surface-teal data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium transition-all"
              >
                Completed
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-muted text-xs font-semibold">
                  {completed.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="all"
                className="rounded-lg data-[state=active]:bg-surface-teal data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2 text-sm font-medium transition-all"
              >
                All
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary text-muted text-xs font-semibold">
                  {bookings.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 animate-fade-up">
              {upcoming.length === 0
                ? <EmptyState icon={<Calendar size={40} />} title="No upcoming bookings" description="Your confirmed appointments will appear here." />
                : upcoming.map(b => <BookingItem key={b.id} booking={b} />)
              }
            </TabsContent>

            <TabsContent value="completed" className="space-y-4 animate-fade-up">
              {completed.length === 0
                ? <EmptyState icon={<Calendar size={40} />} title="No completed bookings" description="Your booking history will appear here." />
                : completed.map(b => <BookingItem key={b.id} booking={b} />)
              }
            </TabsContent>

            <TabsContent value="all" className="space-y-4 animate-fade-up">
              {bookings.length === 0
                ? <EmptyState title="No bookings yet" description="Bookings from customers will appear here." />
                : bookings.map(b => <BookingItem key={b.id} booking={b} />)
              }
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Details dialog */}
      {selectedBooking && (
        <Dialog open onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="max-w-lg rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">Booking Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                {statusBadge(selectedBooking.status)}
                <span className="text-xs text-muted font-mono bg-secondary px-2 py-0.5 rounded">
                  #{selectedBooking.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <h3 className="font-semibold text-lg">{selectedBooking.title}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/60 rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">Service</div>
                  <div className="font-medium">{selectedBooking.title}</div>
                </div>
                <div className="bg-surface-teal rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">Total</div>
                  <div className="font-bold text-lg text-primary">${selectedBooking.price}</div>
                </div>
                <div className="bg-secondary/60 rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">Date &amp; Time</div>
                  <div className="font-medium text-sm">
                    {new Date(selectedBooking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    <br />
                    {selectedBooking.time} ({selectedBooking.duration}m)
                  </div>
                </div>
                <div className="bg-secondary/60 rounded-xl p-3">
                  <div className="text-xs text-muted mb-1">Location</div>
                  <div className="font-medium text-sm flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-muted" />
                    {selectedBooking.address}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => setShowMsg(true)} className="rounded-xl">
                <MessageCircle size={14} className="mr-1.5" /> Message
              </Button>
              {selectedBooking.status === 'confirmed' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-coral/40 text-coral hover:bg-surface-coral rounded-xl"
                    onClick={async () => {
                      const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', selectedBooking.id);
                      if (error) { toast.error('Failed to update'); return; }
                      toast.success('Booking cancelled');
                      setSelectedBooking(null);
                      refetch();
                    }}
                  >
                    <X size={14} className="mr-1.5" /> Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
                    onClick={async () => {
                      const { error } = await supabase.from('bookings').update({ status: 'completed' }).eq('id', selectedBooking.id);
                      if (error) { toast.error('Failed to update'); return; }
                      toast.success('Marked as complete');
                      setSelectedBooking(null);
                      refetch();
                    }}
                  >
                    <Check size={14} className="mr-1.5" /> Mark Complete
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Message dialog */}
      <Dialog open={showMsg} onOpenChange={(open) => { setShowMsg(open); if (!open) setMessage(''); }}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Message Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {messages.length > 0 && (
              <div className="border border-border rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto bg-secondary/30">
                <p className="text-xs font-medium text-muted mb-1">Conversation</p>
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`flex ${m.sender_role === 'provider' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                        m.sender_role === 'provider'
                          ? 'bg-surface-teal text-primary rounded-br-sm'
                          : 'bg-secondary text-foreground rounded-bl-sm'
                      }`}
                    >
                      <p className="text-xs font-medium opacity-60 mb-0.5">
                        {m.sender_role === 'provider' ? 'You' : selectedBooking?.customer_name || 'Customer'}
                      </p>
                      <p>{m.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div>
              <Label className="mb-2 block text-sm font-medium">
                To: <span className="text-primary">{selectedBooking?.customer_name || 'Customer'}</span>
              </Label>
              <Textarea
                placeholder="Type your message…"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                className="resize-none rounded-xl border-border focus:border-primary focus:ring-primary/20"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowMsg(false)} className="rounded-xl">Cancel</Button>
            <Button
              className="bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
              disabled={!message.trim()}
              onClick={async () => {
                if (!selectedBooking || !message.trim()) return;
                try {
                  await sendMessage(user.id, 'provider', message.trim());
                } catch {
                  toast.error('Failed to send message');
                  return;
                }
                setMessage('');
                setShowMsg(false);
                toast.success('Message sent');
              }}
            >
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

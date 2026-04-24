import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Clock, MapPin, MessageSquare, Calendar, AlertCircle, Star } from 'lucide-react';
import { useBookings, type Booking } from '../../../hooks/useBookings';
import { useBookingMessages } from '../../../hooks/useBookingMessages';
import { useAuth } from '../../context/AuthContext';
import { useReviews } from '../../../hooks/useReviews';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { RatingStars } from '../../components/RatingStars';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const badgeConfig = {
  upcoming: { label: 'Confirmed', className: 'bg-surface-teal text-primary border-primary/20' },
  pending:  { label: 'Pending',   className: 'bg-surface-amber text-amber-700 border-amber/20' },
  past:     { label: 'Completed', className: 'bg-surface-green text-status-green border-status-green/20' },
  cancelled:{ label: 'Cancelled', className: 'bg-surface-coral text-coral border-coral/20' },
};

function BookingCard({
  booking,
  variant,
  onCancel,
  onViewDetails,
  onLeaveReview,
  hasReviewed,
}: {
  booking: Booking;
  variant: 'upcoming' | 'past' | 'cancelled' | 'pending';
  onCancel?: (id: string) => void;
  onViewDetails?: (b: Booking) => void;
  onLeaveReview?: (b: Booking) => void;
  hasReviewed?: boolean;
}) {
  const cfg = badgeConfig[variant];

  return (
    <div className="bg-background border border-border rounded-2xl p-5 lg:p-6 transition-all duration-150 hover:border-border/80 hover:shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3 gap-2">
            <h3 className="font-semibold text-foreground truncate">{booking.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide border shrink-0 ${cfg.className}`}>
              {cfg.label}
            </span>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 text-sm text-muted">
              <Clock size={13} className="shrink-0 text-primary" />
              <span>
                {variant === 'past'
                  ? `Completed ${new Date(booking.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`
                  : `${new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at ${booking.time}`}
              </span>
            </div>
            {booking.address && (
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={13} className="shrink-0 text-primary" />
                <span className="truncate">{booking.address}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {variant === 'upcoming' && (
              <>
                <Button variant="outline" size="sm" onClick={() => onViewDetails?.(booking)}>View details</Button>
                <Button variant="ghost" size="sm" className="text-coral hover:bg-surface-coral" onClick={() => onCancel?.(booking.id)}>
                  Cancel
                </Button>
              </>
            )}
            {variant === 'pending' && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails?.(booking)}>View details</Button>
            )}
            {variant === 'past' && (
              <>
                <Button
                  size="sm"
                  disabled={hasReviewed}
                  onClick={() => onLeaveReview?.(booking)}
                  className={hasReviewed ? '' : ''}
                >
                  <Star size={13} className="mr-1.5" />
                  {hasReviewed ? 'Reviewed' : 'Leave review'}
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to={`/customer/listing/${booking.listing_id}`}>Book again</Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onViewDetails?.(booking)}>Details</Button>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/40 chewy-regular">
        <div className="text-xl font-bold text-foreground">${booking.price}</div>
        <div className="text-xs text-muted">{booking.duration}m</div>
      </div>
    </div>
  );
}

export default function MyBookings() {
  const { user } = useAuth();
  const { bookings, loading, refetch } = useBookings();
  const { reviews, refetch: refetchReviews } = useReviews({ customerId: user.id });
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const { messages, sendMessage } = useBookingMessages(detailsBooking?.id ?? null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [showDispute, setShowDispute] = useState(false);
  const [disputeIssue, setDisputeIssue] = useState('Service quality');
  const [disputeDesc, setDisputeDesc] = useState('');

  const now = new Date();
  const upcoming = bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.time}`) > now);
  const pending = bookings.filter(b => b.status === 'pending');
  const past = bookings.filter(b => b.status === 'completed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');
  const pastConfirmed = bookings.filter(b => b.status === 'confirmed' && new Date(`${b.date}T${b.time}`) <= now);
  const allPast = [...past, ...pastConfirmed];

  function hasReviewedListing(listingId: string) {
    return reviews.some(r => r.listing_id === listingId && r.customer_id === user.id);
  }

  async function handleCancel(bookingId: string) {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (error) { toast.error('Failed to cancel booking. Please try again.'); return; }
    toast.success('Booking cancelled');
    refetch();
  }

  async function handleSubmitReview() {
    if (!reviewBooking || !reviewText.trim()) return;
    setSubmittingReview(true);
    const { error } = await supabase.from('reviews').insert({
      customer_id: user.id,
      customer_name: user.name,
      listing_id: reviewBooking.listing_id,
      provider_id: reviewBooking.provider_id,
      rating: reviewRating,
      text: reviewText.trim(),
    });
    setSubmittingReview(false);
    if (error) { toast.error('Failed to submit review'); return; }
    toast.success('Thank you for your review!');
    setReviewBooking(null);
    setReviewText('');
    setReviewRating(5);
    refetchReviews();
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero border-b border-border/60 px-4 md:px-6 lg:px-[72px]">
        <div className="py-8 max-w-4xl mx-auto">
          <h1 className="text-2xl lg:text-[32px] font-bold text-foreground mb-1">My Bookings</h1>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px]">
        <div className="py-8 max-w-4xl mx-auto">
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-8 w-full sm:w-auto">
              <TabsTrigger value="upcoming">
                Upcoming {upcoming.length > 0 && <span className="ml-1.5 bg-primary/15 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full chewy-regular">{upcoming.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending {pending.length > 0 && <span className="ml-1.5 bg-amber/15 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full chewy-regular">{pending.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="past">Past {allPast.length > 0 && `(${allPast.length})`}</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled {cancelled.length > 0 && `(${cancelled.length})`}</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 animate-fade-up">
              {upcoming.length === 0 ? (
                <EmptyState
                  icon={<Calendar size={40} />}
                  title="No upcoming bookings"
                  description="Browse services to book your next appointment."
                  action={<Link to="/customer/search"><Button>Browse services</Button></Link>}
                />
              ) : upcoming.map(b => (
                <BookingCard key={b.id} booking={b} variant="upcoming" onCancel={handleCancel} onViewDetails={setDetailsBooking} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="space-y-4 animate-fade-up">
              {pending.length === 0 ? (
                <EmptyState icon={<Clock size={40} />} title="No pending bookings" description="Bookings awaiting provider confirmation will appear here." />
              ) : pending.map(b => (
                <BookingCard key={b.id} booking={b} variant="pending" onViewDetails={setDetailsBooking} />
              ))}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 animate-fade-up">
              {allPast.length === 0 ? (
                <EmptyState icon={<Clock size={40} />} title="No past bookings" description="Your completed bookings will appear here." />
              ) : allPast.map(b => (
                <BookingCard key={b.id} booking={b} variant="past" onViewDetails={setDetailsBooking} onLeaveReview={() => setReviewBooking(b)} hasReviewed={hasReviewedListing(b.listing_id)} />
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4 animate-fade-up">
              {cancelled.length === 0 ? (
                <EmptyState title="No cancelled bookings" description="You're all good — no cancelled bookings." />
              ) : cancelled.map(b => (
                <BookingCard key={b.id} booking={b} variant="cancelled" onViewDetails={setDetailsBooking} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Details dialog */}
      <Dialog open={!!detailsBooking} onOpenChange={() => setDetailsBooking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Booking Details</DialogTitle></DialogHeader>
          {detailsBooking && (
            <div className="space-y-4">
              <div className="bg-background rounded-xl p-4 space-y-3">
                <div><p className="text-xs text-muted mb-0.5">Service</p><p className="font-semibold">{detailsBooking.title}</p></div>
                <div><p className="text-xs text-muted mb-0.5">Date & Time</p><p className="font-medium">{new Date(detailsBooking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {detailsBooking.time} ({detailsBooking.duration}m)</p></div>
                <div><p className="text-xs text-muted mb-0.5">Total</p><p className="text-xl font-bold text-foreground chewy-regular">${detailsBooking.price}</p></div>
                {detailsBooking.address && <div><p className="text-xs text-muted mb-0.5">Address</p><p className="font-medium">{detailsBooking.address}</p></div>}
              </div>
              {messages.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Messages</p>
                  <div className="space-y-2 max-h-36 overflow-y-auto">
                    {messages.map(m => (
                      <div key={m.id} className={`p-3 rounded-xl text-sm ${m.sender_role === 'customer' ? 'bg-surface-teal text-primary ml-6' : 'bg-secondary mr-6'}`}>
                        <p className="text-[10px] font-semibold uppercase tracking-wide mb-1 opacity-60">{m.sender_role === 'customer' ? 'You' : 'Provider'}</p>
                        <p>{m.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {detailsBooking && detailsBooking.status !== 'cancelled' && (
            <DialogFooter className="gap-2 flex-wrap border-t border-border pt-4">
              <Button variant="outline" size="sm" onClick={() => setShowMsg(true)}>
                <MessageSquare size={14} className="mr-1.5" /> Message provider
              </Button>
              <Button variant="ghost" size="sm" className="text-coral hover:bg-surface-coral" onClick={() => setShowDispute(true)}>
                <AlertCircle size={14} className="mr-1.5" /> Report issue
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Message dialog */}
      <Dialog open={showMsg} onOpenChange={(open) => { setShowMsg(open); if (!open) setMsgText(''); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Message Provider</DialogTitle></DialogHeader>
          <div>
            <Label className="mb-2 block text-sm">Your message</Label>
            <Textarea placeholder="Type your message…" value={msgText} onChange={e => setMsgText(e.target.value)} rows={5} className="resize-none" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMsg(false)}>Cancel</Button>
            <Button disabled={!msgText.trim()} onClick={async () => {
              if (!detailsBooking || !msgText.trim()) return;
              try {
                await sendMessage(user.id, 'customer', msgText.trim());
                setMsgText(''); setShowMsg(false);
                toast.success('Message sent');
              } catch { toast.error('Failed to send'); }
            }}>Send</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dispute dialog */}
      <Dialog open={showDispute} onOpenChange={(open) => { if (!open) { setShowDispute(false); setDisputeDesc(''); } setShowDispute(open); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Report an Issue</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Issue type</Label>
              <select value={disputeIssue} onChange={e => setDisputeIssue(e.target.value)} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="Service quality">Service quality</option>
                <option value="No-show">Provider no-show</option>
                <option value="Payment">Payment / refund</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <Label className="mb-2 block">Describe the issue</Label>
              <Textarea value={disputeDesc} onChange={e => setDisputeDesc(e.target.value)} placeholder="Please describe what happened..." rows={4} className="resize-none" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDispute(false); setDisputeDesc(''); }}>Cancel</Button>
            <Button variant="coral" disabled={!disputeDesc.trim()} onClick={async () => {
              if (!detailsBooking || !disputeDesc.trim()) return;
              const { error } = await supabase.from('disputes').insert({
                booking_id: detailsBooking.id,
                customer_id: user.id,
                provider_id: detailsBooking.provider_id,
                listing_title: detailsBooking.title,
                issue: disputeIssue,
                description: disputeDesc.trim(),
                priority: 'medium',
              });
              if (error) { toast.error('Failed to submit'); return; }
              toast.success('Issue reported. We will review it shortly.');
              setShowDispute(false); setDisputeDesc(''); setDetailsBooking(null);
            }}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review dialog */}
      <Dialog open={!!reviewBooking} onOpenChange={() => { setReviewBooking(null); setReviewText(''); setReviewRating(5); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Leave a Review</DialogTitle></DialogHeader>
          {reviewBooking && (
            <div className="space-y-5">
              <p className="text-sm text-muted">How was your experience with <span className="font-semibold text-foreground">{reviewBooking.title}</span>?</p>
              <div>
                <Label className="mb-3 block">Your rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${star <= reviewRating ? 'bg-surface-amber' : 'bg-secondary hover:bg-surface-amber/50'}`}
                      aria-label={`${star} stars`}
                    >
                      <Star size={18} className={star <= reviewRating ? 'fill-amber text-amber' : 'text-muted'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-text" className="mb-2 block">Your review</Label>
                <Textarea id="review-text" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={4} className="resize-none" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setReviewBooking(null); setReviewText(''); }}>Cancel</Button>
                <Button onClick={handleSubmitReview} disabled={!reviewText.trim() || submittingReview}>
                  {submittingReview ? 'Submitting…' : 'Submit review'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

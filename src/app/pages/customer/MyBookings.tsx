import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Clock, MapPin, MessageSquare, Calendar } from 'lucide-react';
import { useBookings, type Booking } from '../../../hooks/useBookings';
import { useAuth } from '../../context/AuthContext';
import { useReviews } from '../../../hooks/useReviews';
import { EmptyState } from '../../components/EmptyState';
import { Link } from 'react-router';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { RatingStars } from '../../components/RatingStars';

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
  const badge =
    variant === 'pending' ? (
      <Badge variant="secondary" className="shrink-0 ml-3">Pending</Badge>
    ) : variant === 'upcoming' ? (
      <Badge className="bg-primary text-primary-foreground border-0 shrink-0 ml-3">Confirmed</Badge>
    ) : variant === 'past' ? (
      <Badge variant="outline" className="border-border text-muted shrink-0 ml-3">Completed</Badge>
    ) : (
      <Badge variant="outline" className="border-destructive text-destructive shrink-0 ml-3">Cancelled</Badge>
    );

  return (
    <Card className="border-border bg-white p-5 lg:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0">
              <h3 className="font-medium truncate">{booking.title}</h3>
            </div>
            {badge}
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
                <Button variant="outline" className="border-border text-sm" onClick={() => onViewDetails?.(booking)}>
                  View details
                </Button>
                <Button variant="ghost" className="text-destructive text-sm" onClick={() => onCancel?.(booking.id)}>
                  Cancel booking
                </Button>
              </>
            )}
            {variant === 'pending' && (
              <>
                <Button variant="outline" className="border-border text-sm" onClick={() => onViewDetails?.(booking)}>
                  View details
                </Button>
              </>
            )}
            {variant === 'past' && (
              <>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                  disabled={hasReviewed}
                  onClick={() => onLeaveReview?.(booking)}
                >
                  <MessageSquare size={14} className="mr-1.5" /> {hasReviewed ? 'Already reviewed' : 'Leave review'}
                </Button>
                <Link to={`/customer/listing/${booking.listing_id}`}>
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
  const { user } = useAuth();
  const { bookings, loading, refetch } = useBookings();
  const { reviews, refetch: refetchReviews } = useReviews({ customerId: user.id });
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const now = new Date();

  const upcoming = bookings.filter(b => {
    if (b.status !== 'confirmed') return false;
    const d = new Date(`${b.date}T${b.time}`);
    return d > now;
  });
  const pending = bookings.filter(b => b.status === 'pending');
  const past = bookings.filter(b => b.status === 'completed');
  const cancelled = bookings.filter(b => b.status === 'cancelled');

  // Past confirmed bookings (date passed but not yet marked completed) - treat as past for display
  const pastConfirmed = bookings.filter(b => {
    if (b.status !== 'confirmed') return false;
    const d = new Date(`${b.date}T${b.time}`);
    return d <= now;
  });
  const allPast = [...past, ...pastConfirmed];

  function hasReviewedListing(listingId: string) {
    return reviews.some(r => r.listing_id === listingId && r.customer_id === user.id);
  }

  async function handleCancel(bookingId: string) {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId);
    if (error) {
      toast.error('Failed to cancel booking. Please try again.');
      return;
    }
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
    if (error) {
      toast.error('Failed to submit review');
      return;
    }
    toast.success('Thank you for your review!');
    setReviewBooking(null);
    setReviewText('');
    setReviewRating(5);
    refetchReviews();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl lg:text-[32px] font-semibold mb-6 lg:mb-8">My Bookings</h1>

        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6 lg:mb-8">
            <TabsTrigger value="upcoming">Upcoming {upcoming.length > 0 && `(${upcoming.length})`}</TabsTrigger>
            <TabsTrigger value="pending">Pending {pending.length > 0 && `(${pending.length})`}</TabsTrigger>
            <TabsTrigger value="past">Past {allPast.length > 0 && `(${allPast.length})`}</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled {cancelled.length > 0 && `(${cancelled.length})`}</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length === 0 ? (
              <EmptyState
                icon={<Calendar size={40} />}
                title="No upcoming bookings"
                description="Browse services to book your next appointment."
                action={<Link to="/customer/search"><Button className="bg-primary text-primary-foreground">Browse services</Button></Link>}
              />
            ) : (
              upcoming.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  variant="upcoming"
                  onCancel={handleCancel}
                  onViewDetails={setDetailsBooking}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {pending.length === 0 ? (
              <EmptyState icon={<Clock size={40} />} title="No pending bookings" description="Bookings awaiting provider confirmation will appear here." />
            ) : (
              pending.map(b => (
                <BookingCard key={b.id} booking={b} variant="pending" onViewDetails={setDetailsBooking} />
              ))
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-4">
            {allPast.length === 0 ? (
              <EmptyState icon={<Clock size={40} />} title="No past bookings" description="Your completed bookings will appear here." />
            ) : (
              allPast.map(b => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  variant="past"
                  onViewDetails={setDetailsBooking}
                  onLeaveReview={() => setReviewBooking(b)}
                  hasReviewed={hasReviewedListing(b.listing_id)}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            {cancelled.length === 0 ? (
              <EmptyState title="No cancelled bookings" description="You're all good — no cancelled bookings." />
            ) : (
              cancelled.map(b => <BookingCard key={b.id} booking={b} variant="cancelled" onViewDetails={setDetailsBooking} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Details dialog */}
      <Dialog open={!!detailsBooking} onOpenChange={() => setDetailsBooking(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          {detailsBooking && (
            <div className="space-y-4">
              <div><span className="text-xs text-muted">Service</span><p className="font-medium">{detailsBooking.title}</p></div>
              <div><span className="text-xs text-muted">Date & Time</span><p className="font-medium">{new Date(detailsBooking.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {detailsBooking.time} ({detailsBooking.duration}m)</p></div>
              <div><span className="text-xs text-muted">Total</span><p className="font-medium text-lg">${detailsBooking.price}</p></div>
              {detailsBooking.address && (
                <div><span className="text-xs text-muted">Address</span><p className="font-medium">{detailsBooking.address}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Leave review dialog */}
      <Dialog open={!!reviewBooking} onOpenChange={() => { setReviewBooking(null); setReviewText(''); setReviewRating(5); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
          </DialogHeader>
          {reviewBooking && (
            <div className="space-y-4">
              <p className="text-sm text-muted">How was your experience with {reviewBooking.title}?</p>
              <div>
                <Label className="mb-2 block">Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 rounded hover:bg-secondary transition-colors"
                      aria-label={`${star} stars`}
                    >
                      <RatingStars rating={star} size={24} showCount={false} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="review-text" className="mb-2 block">Your review</Label>
                <Textarea id="review-text" value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." rows={5} className="resize-none" />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => { setReviewBooking(null); setReviewText(''); }}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitReview} disabled={!reviewText.trim() || submittingReview} className="bg-primary text-primary-foreground">
                  {submittingReview ? 'Submitting…' : 'Submit review'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState } from 'react';
import { useParams } from 'react-router';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { Calendar } from '../../components/ui/calendar';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Clock, DollarSign, MapPin, CheckCircle2, Calendar as CalendarIcon, Info, Heart } from 'lucide-react';
import { useListing } from '../../../hooks/useListings';
import { useReviews } from '../../../hooks/useReviews';
import { useFavorites } from '../../../hooks/useFavorites';
import { RatingStars } from '../../components/RatingStars';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { listing, loading: listingLoading } = useListing(id);
  const { reviews, loading: reviewsLoading } = useReviews({ listingId: id });
  const { favoriteIds, toggleFavorite } = useFavorites();

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingAddress, setBookingAddress] = useState('');
  const [booking, setBooking] = useState(false);

  const loading = listingLoading || reviewsLoading;
  const isFavorite = id ? favoriteIds.has(id) : false;

  async function handleConfirmBooking() {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both a date and time');
      return;
    }
    if (!listing || !user.id) return;

    setBooking(true);
    const { error } = await supabase.from('bookings').insert({
      listing_id: listing.id,
      customer_id: user.id,
      provider_id: listing.provider_id,
      title: listing.title,
      date: selectedDate.toISOString().split('T')[0],
      time: selectedTime,
      duration: listing.duration,
      price: listing.price,
      status: 'confirmed',
      address: bookingAddress.trim() || null,
    });
    setBooking(false);

    if (error) {
      toast.error('Failed to book. Please try again.');
      return;
    }

    setShowBookingModal(false);
    setSelectedDate(undefined);
    setSelectedTime('');
    setBookingAddress('');
    toast.success('Booking confirmed! Check your bookings for details.');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <p className="text-muted">Listing not found.</p>
      </div>
    );
  }

  const listingReviews = reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-secondary px-4 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="h-56 sm:h-80 lg:h-96 rounded overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 mb-6 lg:mb-8">
              {listing.images[0] && (
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
              )}
            </div>

            <div className="mb-6 lg:mb-8">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl lg:text-[32px] font-semibold mb-1.5">{listing.title}</h1>
                  <span className="text-primary text-sm font-medium">{listing.provider_name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {listing.featured && <Badge className="bg-primary/10 text-primary border-0">Featured</Badge>}
                  {user.id && (
                    <button
                      type="button"
                      onClick={() => id && toggleFavorite(id)}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      className={`p-2.5 rounded-full transition-colors ${
                        isFavorite ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted hover:text-primary'
                      }`}
                    >
                      <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={listing.rating} size={15} />
                  <span className="font-medium">{listing.rating}</span>
                  <span className="text-muted">({listing.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <MapPin size={14} />
                  <span>Jonesboro, AR</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="border-border p-5 mb-4">
              <h2 className="text-lg font-medium mb-3">About this service</h2>
              <p className="text-sm leading-relaxed">{listing.description}</p>
            </Card>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <Card className="border-border p-5 mb-4">
                <h2 className="text-lg font-medium mb-3">What's included</h2>
                <div className="space-y-2">
                  {listing.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card className="border-border p-5">
              <h2 className="text-lg font-medium mb-5">Reviews</h2>
              {listingReviews.length === 0 ? (
                <p className="text-sm text-muted">No reviews yet.</p>
              ) : (
                <div className="space-y-5">
                  {listingReviews.map(review => (
                    <div key={review.id} className="pb-5 border-b border-border last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2 gap-3">
                        <div>
                          <p className="font-medium text-sm">{review.customer_name}</p>
                          <p className="text-xs text-muted">
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <RatingStars rating={review.rating} size={13} />
                      </div>
                      <p className="text-sm">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <Card className="border-border p-5 lg:p-6 lg:sticky lg:top-8">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-semibold">${listing.price}</span>
                <span className="text-muted text-sm">/session</span>
              </div>

              <div className="space-y-2 text-sm text-muted mb-5">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  <span>{listing.duration} minutes</span>
                </div>
                {listing.next_available && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} />
                    <span>Next: {new Date(listing.next_available).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => setShowBookingModal(true)}
              >
                Book Now
              </Button>

              <p className="text-xs text-muted mt-3 text-center">Free cancellation up to 24 hours before</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-2xl gap-0">
          <DialogHeader className="mb-4">
            <DialogTitle>Book {listing.title}</DialogTitle>
          </DialogHeader>

          <Alert className="border-primary/20 bg-primary/5 mb-5">
            <Info size={15} className="text-foreground" />
            <AlertDescription>Select your date, time, and service address to confirm your booking.</AlertDescription>
          </Alert>

          {/* Address */}
          <div className="mb-5">
            <Label htmlFor="booking-address">Service address (optional)</Label>
            <Input
              id="booking-address"
              placeholder="e.g., 123 Main St, Jonesboro, AR"
              value={bookingAddress}
              onChange={e => setBookingAddress(e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Date picker */}
          <div className="mb-5">
            <h3 className="font-medium text-sm mb-3">Select date</h3>
            <div className="rounded-xl border border-border bg-background p-1 sm:p-2">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="bg-background w-full p-2"
                disabled={date => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const candidate = new Date(date);
                  candidate.setHours(0, 0, 0, 0);
                  return candidate < today;
                }}
              />
            </div>
          </div>

          {/* Time picker */}
          <div className="mb-5">
            <h3 className="font-medium text-sm mb-3">Select time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                    selectedTime === slot
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-foreground hover:bg-secondary'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Selected slot summary */}
          {(selectedDate || selectedTime) && (
            <div className="rounded-lg bg-secondary px-4 py-3 mb-5">
              <span className="block text-xs uppercase tracking-wide text-muted mb-1">Selected slot</span>
              {selectedDate && selectedTime ? (
                <span className="font-medium text-sm text-foreground">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at {selectedTime}
                </span>
              ) : (
                <span className="text-xs text-muted">Choose a {!selectedDate ? 'date' : 'time'} to continue</span>
              )}
            </div>
          )}

          {/* Pricing + CTA */}
          <div className="border-t border-border pt-4 mt-auto sticky bottom-0 bg-background pb-[env(safe-area-inset-bottom)]">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>${listing.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee</span>
                <span>$2.50</span>
              </div>
              <div className="flex justify-between font-semibold border-t border-border pt-2">
                <span>Total</span>
                <span>${(listing.price + 2.5).toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base"
              disabled={!selectedDate || !selectedTime || booking}
              onClick={handleConfirmBooking}
            >
              {booking ? 'Booking…' : 'Continue to payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

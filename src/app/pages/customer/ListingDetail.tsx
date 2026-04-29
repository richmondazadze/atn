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
import { Clock, DollarSign, MapPin, CheckCircle2, Calendar as CalendarIcon, Info, Heart, Star, User } from 'lucide-react';
import { useListing } from '../../../hooks/useListings';
import { useReviews } from '../../../hooks/useReviews';
import { useFavorites } from '../../../hooks/useFavorites';
import { RatingStars } from '../../components/RatingStars';
import { toast } from 'sonner';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/LoadingSpinner';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

function getAvatarColor(name: string): string {
  const colors = [
    'bg-surface-teal text-primary',
    'bg-surface-violet text-violet-700',
    'bg-surface-amber text-amber-700',
    'bg-surface-coral text-coral-700',
    'bg-surface-rose text-rose-700',
    'bg-surface-green text-status-green',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted">Listing not found.</p>
      </div>
    );
  }

  const listingReviews = reviews.slice(0, 3);

  return (
    <div className="min-h-screen bg-background page-shell">
      <div className="content-shell py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Hero Image */}
            <div className="h-56 sm:h-80 lg:h-96 rounded-2xl img-zoom overflow-hidden bg-gradient-to-br from-surface-teal to-surface-violet animate-fade-up">
              {listing.images[0] ? (
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-4xl font-bold text-gradient-teal opacity-40">{listing.title.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* Title & Meta */}
            <div className="animate-fade-up delay-100">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="min-w-0">
                  <h1 className="text-2xl lg:text-[32px] font-semibold mb-1.5 leading-tight">{listing.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-primary">{listing.provider_name}</span>
                    {listing.featured && (
                      <Badge className="bg-surface-teal text-primary border-0 text-[10px] font-semibold tracking-wide uppercase px-2">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                {user.id && (
                  <button
                    type="button"
                    onClick={() => id && toggleFavorite(id)}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    className={`p-2.5 rounded-full transition-all duration-200 shrink-0 ${
                      isFavorite
                        ? 'bg-surface-coral text-coral-600 shadow-sm'
                        : 'bg-secondary text-muted hover:bg-surface-coral hover:text-coral-600'
                    }`}
                  >
                    <Heart size={18} className={isFavorite ? 'fill-current' : ''} />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <RatingStars rating={listing.rating} size={15} />
                  <span className="font-semibold text-amber-500">{listing.rating}</span>
                  <span className="text-muted">({listing.review_count} reviews)</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted">
                  <MapPin size={14} />
                  <span>Jonesboro, AR</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="rounded-2xl border border-border card-lift p-5 animate-fade-up delay-200">
              <h2 className="text-base font-semibold mb-3 text-foreground">About this service</h2>
              <p className="text-sm leading-relaxed text-muted">{listing.description}</p>
            </Card>

            {/* Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <Card className="rounded-2xl border border-border card-lift p-5 animate-fade-up delay-300">
                <h2 className="text-base font-semibold mb-4 text-foreground">What's included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {listing.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 size={16} className="text-status-green shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Reviews */}
            <Card className="rounded-2xl border border-border card-lift p-5 animate-fade-up delay-400">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-semibold text-foreground">Reviews</h2>
                {listingReviews.length > 0 && (
                  <div className="flex items-center gap-1.5 bg-surface-amber rounded-full px-3 py-1">
                    <Star size={12} className="text-amber-500 fill-current" />
                    <span className="text-xs font-semibold text-amber-700">{listing.rating} average</span>
                  </div>
                )}
              </div>
              {listingReviews.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-teal flex items-center justify-center mx-auto mb-3">
                    <Star size={20} className="text-primary" />
                  </div>
                  <p className="text-sm text-muted">No reviews yet. Be the first to book!</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {listingReviews.map((review, idx) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-border card-lift p-4 animate-fade-up"
                      style={{ animationDelay: `${Math.min((idx + 1) * 100, 500)}ms` }}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${getAvatarColor(review.customer_name)}`}>
                          {review.customer_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm">{review.customer_name}</p>
                            <RatingStars rating={review.rating} size={13} />
                          </div>
                          <p className="text-xs text-muted">
                            {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted leading-relaxed pl-12">{review.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1 order-first lg:order-last">
            <Card className="rounded-2xl border border-border card-lift p-5 lg:p-6 lg:sticky lg:top-8 animate-fade-up delay-150">
              {/* Price */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-primary">${listing.price}</span>
                  <span className="text-muted text-sm">/session</span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-teal rounded-full px-3 py-1">
                  <Clock size={13} className="text-primary" />
                  <span className="text-xs font-semibold text-primary">{listing.duration}m</span>
                </div>
              </div>

              <div className="h-px bg-border my-4" />

              <div className="space-y-2.5 text-sm text-muted mb-5">
                <div className="flex items-center gap-2">
                  <Clock size={14} className="shrink-0" />
                  <span>Session duration: <span className="font-medium text-foreground">{listing.duration} minutes</span></span>
                </div>
                {listing.next_available && !isNaN(new Date(listing.next_available).getTime()) && (
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="shrink-0 text-primary" />
                    <span>
                      Next available:{' '}
                      <span className="font-medium text-foreground">
                        {new Date(listing.next_available).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>
                )}
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 font-semibold rounded-xl shadow-teal-sm transition-all"
                onClick={() => setShowBookingModal(true)}
              >
                Book Now
              </Button>

              <p className="text-xs text-muted mt-3 text-center">Free cancellation up to 24 hours before</p>

              {/* Provider trust row */}
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-surface-teal flex items-center justify-center shrink-0">
                  <User size={14} className="text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{listing.provider_name}</p>
                  <p className="text-[11px] text-muted">Verified provider</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Star size={11} className="text-amber-500 fill-current" />
                  <span className="text-xs font-semibold">{listing.rating}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-2xl gap-0 rounded-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold">Book {listing.title}</DialogTitle>
          </DialogHeader>

          <Alert className="border-primary/20 bg-surface-teal mb-5 rounded-xl">
            <Info size={15} className="text-primary" />
            <AlertDescription className="text-primary/80 text-sm">
              Select your date, time, and service address to confirm your booking.
            </AlertDescription>
          </Alert>

          {/* Address */}
          <div className="mb-5">
            <Label htmlFor="booking-address" className="text-sm font-medium">Service address <span className="text-muted font-normal">(optional)</span></Label>
            <Input
              id="booking-address"
              placeholder="e.g., 123 Main St, Jonesboro, AR"
              value={bookingAddress}
              onChange={e => setBookingAddress(e.target.value)}
              className="mt-1.5 rounded-xl focus-glow"
            />
          </div>

          {/* Date picker */}
          <div className="mb-5">
            <h3 className="font-semibold text-sm mb-3">Select date</h3>
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
            <h3 className="font-semibold text-sm mb-3">Select time</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {TIME_SLOTS.map(slot => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`h-11 rounded-full border text-sm font-semibold transition-all duration-150 ${
                    selectedTime === slot
                      ? 'bg-primary text-white border-primary shadow-teal-sm'
                      : 'bg-background border-border text-foreground hover:border-primary hover:bg-surface-teal'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Selected slot summary */}
          {(selectedDate || selectedTime) && (
            <div className="rounded-xl bg-surface-teal border border-primary/20 px-4 py-3 mb-5">
              <span className="block text-[10px] uppercase tracking-widest text-primary/70 font-semibold mb-1">Selected slot</span>
              {selectedDate && selectedTime ? (
                <span className="font-semibold text-sm text-primary">
                  {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at {selectedTime}
                </span>
              ) : (
                <span className="text-xs text-primary/60">Choose a {!selectedDate ? 'date' : 'time'} to continue</span>
              )}
            </div>
          )}

          {/* Pricing + CTA */}
          <div className="border-t border-border pt-4 mt-auto sticky bottom-0 bg-background pb-[env(safe-area-inset-bottom)]">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between text-muted">
                <span>Service fee</span>
                <span className="font-medium text-foreground">${listing.price}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Platform fee</span>
                <span className="font-medium text-foreground">$2.50</span>
              </div>
              <div className="flex justify-between font-bold border-t border-border pt-2 text-base">
                <span>Total</span>
                <span className="text-primary">${(listing.price + 2.5).toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold rounded-xl shadow-teal-sm transition-all"
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

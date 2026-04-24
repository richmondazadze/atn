import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { AlertCircle, Search, Calendar, FileText, MessageSquare, CheckCircle2, Info, XCircle } from 'lucide-react';

export default function States() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] p-16" style={{ width: '1440px', margin: '0 auto' }}>
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '72px', paddingRight: '72px' }}>
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[32px] leading-[40px] font-bold mb-2">06 • States</h1>
          <p className="text-[#6B7280]">Loading, empty, error, and success states</p>
        </div>

        {/* Loading Skeletons */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Loading Skeletons</h2>

          <div className="space-y-8">
            {/* Listing Card Skeleton */}
            <div>
              <h3 className="text-[11px] font-medium mb-4 text-[#6B7280] tracking-[1px] uppercase">Listing Card</h3>
              <Card className="border-border overflow-hidden">
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </Card>
            </div>

            {/* Feed Skeleton */}
            <div>
              <h3 className="text-[11px] font-medium mb-4 text-[#6B7280] tracking-[1px] uppercase">Feed</h3>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Skeleton */}
            <div>
              <h3 className="text-[11px] font-medium mb-4 text-[#6B7280] tracking-[1px] uppercase">Dashboard Cards</h3>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-border p-6">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-8 w-16" />
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Empty States */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Empty States</h2>

          <div className="grid grid-cols-2 gap-8">
            <Card className="border-border p-12 text-center">
              <div className="flex justify-center mb-4">
                <Search size={48} className="text-[#DDE8E8]" />
              </div>
              <h3 className="font-medium mb-2">No results found</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280] mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline">Clear filters</Button>
            </Card>

            <Card className="border-border p-12 text-center">
              <div className="flex justify-center mb-4">
                <Calendar size={48} className="text-[#DDE8E8]" />
              </div>
              <h3 className="font-medium mb-2">No bookings yet</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280] mb-4">
                Your upcoming bookings will appear here
              </p>
              <Button>Browse services</Button>
            </Card>

            <Card className="border-border p-12 text-center">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="text-[#DDE8E8]" />
              </div>
              <h3 className="font-medium mb-2">No active listings</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280] mb-4">
                Create your first listing to start accepting bookings
              </p>
              <Button>Create listing</Button>
            </Card>

            <Card className="border-border p-12 text-center">
              <div className="flex justify-center mb-4">
                <MessageSquare size={48} className="text-[#DDE8E8]" />
              </div>
              <h3 className="font-medium mb-2">No reviews yet</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280] mb-4">
                Complete a booking to receive your first review
              </p>
            </Card>
          </div>
        </section>

        {/* Error States */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Error States</h2>

          <div className="space-y-4">
            {[
              'Invalid OTP code. Please check and try again.',
              'Network error. Please check your connection and try again.',
              'Payment failed. Your card was declined. Please try another payment method.',
              'This time slot is no longer available. Please select another time.',
            ].map((msg, i) => (
              <Alert key={i} className="border-[#DA291C]/40 bg-[#DA291C]/10">
                <AlertCircle size={16} className="text-[#DA291C]" />
                <AlertDescription className="text-[#DA291C]">{msg}</AlertDescription>
              </Alert>
            ))}
          </div>
        </section>

        {/* Success States */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Success States</h2>

          <div className="space-y-4">
            {/* Booking Confirmed */}
            <Card className="border-primary/30  p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 size={48} className="text-primary" />
              </div>
              <h3 className="text-[20px] leading-[28px] font-semibold mb-2">Booking confirmed!</h3>
              <p className="text-[14px] leading-[20px] text-[#6B7280] mb-4">
                Your booking with Tasha Miles is confirmed for March 20 at 9:00 AM
              </p>
              <Button variant="outline">View booking details</Button>
            </Card>

            {[
              'Your listing has been published successfully!',
              'Review submitted. Thank you for your feedback!',
              'Dispute resolved. Customer has been refunded.',
            ].map((msg, i) => (
              <Alert key={i} className="border-[#7BC950]/40 bg-surface-green">
                <CheckCircle2 size={16} className="text-[#3A7A1A]" />
                <AlertDescription className="text-[#1A1A1A]">{msg}</AlertDescription>
              </Alert>
            ))}
          </div>
        </section>

        {/* Info Toasts */}
        <section>
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Info Toasts</h2>

          <div className="space-y-4">
            <Alert className="border-primary/30 ">
              <Info size={16} className="text-primary" />
              <AlertDescription className="text-[#1A1A1A]">Changes saved automatically</AlertDescription>
            </Alert>

            <Alert className="border-[#D4A853]/40 bg-surface-gold">
              <Info size={16} className="text-[#8A6A1E]" />
              <AlertDescription className="text-[#1A1A1A]">Your booking is on hold for 10 minutes</AlertDescription>
            </Alert>

            <Alert className="border-[#DA291C]/40 bg-[#DA291C]/10">
              <XCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">Unable to process request. Please try again.</AlertDescription>
            </Alert>
          </div>
        </section>
      </div>
    </div>
  );
}

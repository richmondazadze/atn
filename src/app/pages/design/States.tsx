import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { AlertCircle, Search, Calendar, FileText, MessageSquare, CheckCircle2, Info, XCircle } from 'lucide-react';

export default function States() {
  return (
    <div className="min-h-screen bg-white p-16" style={{ width: '1440px', margin: '0 auto' }}>
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: '72px', paddingRight: '72px' }}>
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-[32px] leading-[40px] font-semibold mb-2">06 • States</h1>
          <p className="text-[#4B5563]">Loading, empty, error, and success states</p>
        </div>

        {/* Loading Skeletons */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Loading Skeletons</h2>
          
          <div className="space-y-8">
            {/* Listing Card Skeleton */}
            <div>
              <h3 className="text-[14px] leading-[20px] font-medium mb-4 text-[#4B5563]">LISTING CARD</h3>
              <Card className="border-[#E5E7EB] overflow-hidden">
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
              <h3 className="text-[14px] leading-[20px] font-medium mb-4 text-[#4B5563]">FEED</h3>
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
              <h3 className="text-[14px] leading-[20px] font-medium mb-4 text-[#4B5563]">DASHBOARD CARDS</h3>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="border-[#E5E7EB] p-6">
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
            {/* No Results */}
            <Card className="border-[#E5E7EB] p-12 text-center">
              <div className="flex justify-center mb-4">
                <Search size={48} className="text-[#E5E7EB]" />
              </div>
              <h3 className="font-medium mb-2">No results found</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563] mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button variant="outline">Clear filters</Button>
            </Card>

            {/* No Bookings */}
            <Card className="border-[#E5E7EB] p-12 text-center">
              <div className="flex justify-center mb-4">
                <Calendar size={48} className="text-[#E5E7EB]" />
              </div>
              <h3 className="font-medium mb-2">No bookings yet</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563] mb-4">
                Your upcoming bookings will appear here
              </p>
              <Button className="bg-[#7BC950] hover:bg-[#6BA840] text-white">Browse services</Button>
            </Card>

            {/* No Listings */}
            <Card className="border-[#E5E7EB] p-12 text-center">
              <div className="flex justify-center mb-4">
                <FileText size={48} className="text-[#E5E7EB]" />
              </div>
              <h3 className="font-medium mb-2">No active listings</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563] mb-4">
                Create your first listing to start accepting bookings
              </p>
              <Button className="bg-[#7BC950] hover:bg-[#6BA840] text-white">Create listing</Button>
            </Card>

            {/* No Reviews */}
            <Card className="border-[#E5E7EB] p-12 text-center">
              <div className="flex justify-center mb-4">
                <MessageSquare size={48} className="text-[#E5E7EB]" />
              </div>
              <h3 className="font-medium mb-2">No reviews yet</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563] mb-4">
                Complete a booking to receive your first review
              </p>
            </Card>
          </div>
        </section>

        {/* Error States */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Error States</h2>
          
          <div className="space-y-4">
            <Alert className="border-[#DA291C] bg-[#DA291C]/10">
              <AlertCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                Invalid OTP code. Please check and try again.
              </AlertDescription>
            </Alert>

            <Alert className="border-[#DA291C] bg-[#DA291C]/10">
              <AlertCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                Network error. Please check your connection and try again.
              </AlertDescription>
            </Alert>

            <Alert className="border-[#DA291C] bg-[#DA291C]/10">
              <AlertCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                Payment failed. Your card was declined. Please try another payment method.
              </AlertDescription>
            </Alert>

            <Alert className="border-[#DA291C] bg-[#DA291C]/10">
              <AlertCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                This time slot is no longer available. Please select another time.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Success States */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Success States</h2>
          
          <div className="space-y-4">
            {/* Booking Confirmed */}
            <Card className="border-[#7BC950] bg-[#B6EFD4]/20 p-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 size={48} className="text-[#7BC950]" />
              </div>
              <h3 className="text-[20px] leading-[28px] font-medium mb-2">Booking confirmed!</h3>
              <p className="text-[14px] leading-[20px] text-[#4B5563] mb-4">
                Your booking with Tasha Miles is confirmed for March 20 at 9:00 AM
              </p>
              <Button variant="outline">View booking details</Button>
            </Card>

            {/* Success Alerts */}
            <Alert className="border-[#7BC950] bg-[#B6EFD4]/30">
              <CheckCircle2 size={16} className="text-[#7BC950]" />
              <AlertDescription className="text-[#111111]">
                Your listing has been published successfully!
              </AlertDescription>
            </Alert>

            <Alert className="border-[#7BC950] bg-[#B6EFD4]/30">
              <CheckCircle2 size={16} className="text-[#7BC950]" />
              <AlertDescription className="text-[#111111]">
                Review submitted. Thank you for your feedback!
              </AlertDescription>
            </Alert>

            <Alert className="border-[#7BC950] bg-[#B6EFD4]/30">
              <CheckCircle2 size={16} className="text-[#7BC950]" />
              <AlertDescription className="text-[#111111]">
                Dispute resolved. Customer has been refunded.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Info Toasts */}
        <section>
          <h2 className="text-[24px] leading-[32px] font-semibold mb-8">Info Toasts</h2>
          
          <div className="space-y-4">
            <Alert className="border-[#A0CCDA] bg-[#A0CCDA]/10">
              <Info size={16} className="text-[#111111]" />
              <AlertDescription className="text-[#111111]">
                Changes saved automatically
              </AlertDescription>
            </Alert>

            <Alert className="border-[#A0CCDA] bg-[#A0CCDA]/10">
              <Info size={16} className="text-[#111111]" />
              <AlertDescription className="text-[#111111]">
                Your booking is on hold for 10 minutes
              </AlertDescription>
            </Alert>

            <Alert className="border-[#DA291C] bg-[#DA291C]/10">
              <XCircle size={16} className="text-[#DA291C]" />
              <AlertDescription className="text-[#DA291C]">
                Unable to process request. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        </section>
      </div>
    </div>
  );
}

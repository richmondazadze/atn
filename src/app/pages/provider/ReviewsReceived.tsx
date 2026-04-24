import { useMemo, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Star, MessageCircle, TrendingUp, Award } from 'lucide-react';
import { useReviews, type Review } from '../../../hooks/useReviews';
import { useListings } from '../../../hooks/useListings';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../../lib/supabase';
import { EmptyState } from '../../components/EmptyState';
import { RatingStars } from '../../components/RatingStars';
import { toast } from 'sonner';
import { LoadingSpinner } from '../../components/LoadingSpinner';

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} stars`}>
      {[1, 2, 3, 4, 5].map(s => (
        <Star key={s} size={14} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-border'} />
      ))}
    </div>
  );
}

export default function ReviewsReceived() {
  const { user } = useAuth();
  const { reviews, loading: reviewsLoading } = useReviews({ providerId: user.id });
  const { listings, loading: listingsLoading } = useListings({ providerId: user.id });
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [reply, setReply] = useState('');

  const loading = reviewsLoading || listingsLoading;

  const stats = useMemo(() => {
    const total = reviews.length;
    const avg = total > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1) : '0.0';
    const dist = [5, 4, 3, 2, 1].map(n => ({ n, count: reviews.filter(r => r.rating === n).length }));
    const fiveStarCount = reviews.filter(r => r.rating === 5).length;
    return { total, avg, dist, fiveStarCount };
  }, [reviews]);

  async function postReply() {
    if (!selectedReview) return;
    const { error } = await supabase.from('reviews').update({ reply: reply }).eq('id', selectedReview.id);
    if (error) { toast.error('Failed to post reply'); return; }
    toast.success('Reply posted');
    setSelectedReview(null);
    setReply('');
  }

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 md:px-6 lg:px-[72px]">
      <div className="py-6 lg:py-8 max-w-7xl mx-auto">
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-[32px] font-semibold mb-1">Reviews</h1>
          <p className="text-sm text-muted">Customer feedback and ratings for your services</p>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><Star size={16} className="text-amber-400" /> Average Rating</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-[32px] font-semibold chewy-regular">{stats.avg}</span>
              <span className="text-muted text-sm">/ 5.0</span>
            </div>
          </Card>
          <Card className="border-border p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><MessageCircle size={16} /> Total Reviews</div>
            <div className="text-2xl lg:text-[32px] font-semibold chewy-regular">{stats.total}</div>
          </Card>
          <Card className="border-primary bg-primary/5 p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-muted"><Award size={16} className="text-primary" /> 5-Star Reviews</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl lg:text-[32px] font-semibold chewy-regular">{stats.fiveStarCount}</span>
              <span className="text-muted text-sm">({stats.total > 0 ? Math.round((stats.fiveStarCount / stats.total) * 100) : 0}%)</span>
            </div>
          </Card>
        </div>

        {reviews.length === 0 ? (
          <EmptyState icon={<Star size={40} />} title="No reviews yet" description="Customer reviews will appear here after completed bookings." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Distribution */}
            <Card className="border-border p-5 lg:p-6 self-start">
              <h2 className="font-medium mb-5">Rating Distribution</h2>
              <div className="space-y-3">
                {stats.dist.map(({ n, count }) => (
                  <div key={n} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-10 shrink-0 text-sm">{n} <Star size={11} className="fill-amber-400 text-amber-400" /></div>
                    <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }} />
                    </div>
                    <span className="text-sm text-muted w-4 text-right chewy-regular">{count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-5 border-t border-border flex items-center gap-2 text-sm text-primary">
                <TrendingUp size={14} /> +<span className="chewy-regular">12%</span> from last month
              </div>
            </Card>

            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-4">
              {reviews.map(review => {
                const listing = listings.find(l => l.id === review.listing_id);
                return (
                  <Card key={review.id} className="border-border p-5 lg:p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <StarRow rating={review.rating} />
                          {listing && <Badge variant="secondary" className="text-xs">{listing.title}</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{review.customer_name}</span>
                          <span className="text-muted">•</span>
                          <span className="text-muted">{new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted mb-4">{review.text}</p>

                    <div className="pt-4 border-t border-border">
                      <Button variant="outline" size="sm" onClick={() => { setSelectedReview(review); setReply(''); }}>
                        <MessageCircle size={13} className="mr-1.5" /> Reply
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reply dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reply to Review</DialogTitle></DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <Card className="border-border bg-background p-4">
                <div className="flex items-center gap-3 mb-2">
                  <StarRow rating={selectedReview.rating} />
                  <span className="text-sm font-medium">{selectedReview.customer_name}</span>
                </div>
                <p className="text-sm text-muted">{selectedReview.text}</p>
              </Card>
              <div>
                <Label htmlFor="reply-text" className="mb-1 block">Your Reply</Label>
                <Textarea id="reply-text" placeholder="Thank the customer and address any specific points…" value={reply} onChange={e => setReply(e.target.value)} rows={5} className="resize-none" />
                <p className="text-xs text-muted mt-1">Keep replies professional, grateful, and constructive.</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>Cancel</Button>
            <Button className="bg-primary text-primary-foreground" onClick={postReply} disabled={!reply.trim()}>Post Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

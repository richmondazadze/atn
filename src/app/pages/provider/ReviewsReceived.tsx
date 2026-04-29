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

function avatarColor(name: string): string {
  const colors = [
    'bg-surface-teal text-primary',
    'bg-surface-amber text-amber-700',
    'bg-surface-violet text-violet',
    'bg-surface-coral text-coral',
    'bg-surface-rose text-rose-600',
    'bg-surface-green text-status-green',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
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
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-gradient-hero border-b border-border px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto flex items-center gap-3 animate-fade-up">
          <div className="w-10 h-10 rounded-xl bg-surface-amber flex items-center justify-center shrink-0">
            <Star size={20} className="text-amber-500" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-[32px] font-semibold leading-tight">Reviews</h1>
            <p className="text-sm text-muted mt-0.5">Customer feedback and ratings for your services</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-[72px] py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up delay-100">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                <Star size={16} className="text-amber-400" />
                Average Rating
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl lg:text-4xl font-bold text-foreground">{stats.avg}</span>
                <span className="text-muted text-sm">/ 5.0</span>
              </div>
              <RatingStars rating={parseFloat(stats.avg)} size={16} />
            </Card>

            <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up delay-200">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                <MessageCircle size={16} />
                Total Reviews
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-foreground">{stats.total}</div>
              <p className="text-xs text-muted mt-1">All-time reviews received</p>
            </Card>

            <Card className="card-lift rounded-2xl border-primary/20 bg-surface-teal p-5 lg:p-6 animate-fade-up delay-300">
              <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                <Award size={16} className="text-primary" />
                5-Star Reviews
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-bold text-primary">{stats.fiveStarCount}</span>
                <span className="text-muted text-sm">
                  ({stats.total > 0 ? Math.round((stats.fiveStarCount / stats.total) * 100) : 0}%)
                </span>
              </div>
            </Card>
          </div>

          {reviews.length === 0 ? (
            <EmptyState icon={<Star size={40} />} title="No reviews yet" description="Customer reviews will appear here after completed bookings." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Distribution */}
              <Card className="card-lift rounded-2xl border-border p-5 lg:p-6 self-start animate-fade-up delay-200">
                <h2 className="font-semibold text-base mb-5">Rating Distribution</h2>
                <div className="space-y-3">
                  {stats.dist.map(({ n, count }) => (
                    <div key={n} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-10 shrink-0 text-sm font-medium">
                        {n}
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                      </div>
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted w-4 text-right font-medium">{count}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-5 border-t border-border flex items-center gap-2 text-sm text-primary font-medium">
                  <TrendingUp size={14} />
                  +12% from last month
                </div>
              </Card>

              {/* Reviews list */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.map((review, idx) => {
                  const listing = listings.find(l => l.id === review.listing_id);
                  const name = review.customer_name || 'Customer';
                  const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <Card
                      key={review.id}
                      className={`card-lift rounded-2xl border-border p-5 lg:p-6 animate-fade-up`}
                      style={{ animationDelay: `${(idx + 1) * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${avatarColor(name)}`}>
                            {initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-semibold text-sm">{name}</span>
                              <span className="text-muted text-xs">
                                {new Date(review.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <RatingStars rating={review.rating} size={13} />
                              {listing && (
                                <Badge variant="secondary" className="text-xs rounded-full">{listing.title}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-muted leading-relaxed mb-4 pl-[52px]">{review.text}</p>

                      {review.reply && (
                        <div className="ml-[52px] bg-surface-teal rounded-xl p-3 mb-3 border-l-2 border-primary">
                          <p className="text-xs font-medium text-primary mb-1">Your reply</p>
                          <p className="text-sm text-foreground">{review.reply}</p>
                        </div>
                      )}

                      <div className="pt-3 border-t border-border pl-[52px]">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs hover:bg-surface-teal hover:border-primary hover:text-primary transition-all"
                          onClick={() => { setSelectedReview(review); setReply(''); }}
                        >
                          <MessageCircle size={13} className="mr-1.5" />
                          {review.reply ? 'Edit Reply' : 'Reply'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reply dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Reply to Review</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <Card className="rounded-xl border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <StarRow rating={selectedReview.rating} />
                  <span className="text-sm font-medium">{selectedReview.customer_name}</span>
                </div>
                <p className="text-sm text-muted">{selectedReview.text}</p>
              </Card>
              <div>
                <Label htmlFor="reply-text" className="mb-1.5 block font-medium">Your Reply</Label>
                <Textarea
                  id="reply-text"
                  placeholder="Thank the customer and address any specific points…"
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  rows={5}
                  className="resize-none rounded-xl border-border focus:border-primary focus:ring-primary/20"
                />
                <p className="text-xs text-muted mt-1.5">Keep replies professional, grateful, and constructive.</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedReview(null)} className="rounded-xl">Cancel</Button>
            <Button
              className="bg-primary text-primary-foreground rounded-xl hover:bg-primary/90"
              onClick={postReply}
              disabled={!reply.trim()}
            >
              Post Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export function RatingStars({ rating, reviewCount, size = 14, showCount = true }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars${reviewCount !== undefined ? `, ${reviewCount} reviews` : ''}`}>
      <Star size={size} className="fill-primary text-primary" />
      <span className="text-sm font-medium text-foreground">{rating}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-sm text-muted">({reviewCount})</span>
      )}
    </div>
  );
}

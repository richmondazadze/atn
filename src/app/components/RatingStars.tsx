import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  showCount?: boolean;
}

export function RatingStars({ rating, reviewCount, size = 14, showCount = true }: RatingStarsProps) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars${reviewCount !== undefined ? `, ${reviewCount} reviews` : ''}`}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < Math.round(rating);
          return (
            <Star
              key={i}
              size={size}
              className={filled ? 'fill-primary text-primary' : 'fill-none text-border'}
            />
          );
        })}
      </div>
      <span className="text-sm font-medium text-foreground ml-0.5">{rating}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-sm text-muted">({reviewCount})</span>
      )}
    </div>
  );
}

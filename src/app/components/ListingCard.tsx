import { Link } from 'react-router';
import { Clock, Calendar, Heart } from 'lucide-react';
import { Badge } from './ui/badge';
import { RatingStars } from './RatingStars';

interface ListingCardProps {
  id: string;
  title: string;
  providerName: string;
  price: number;
  duration: number;
  rating: number;
  reviewCount: number;
  nextAvailable: string;
  featured?: boolean;
  category: string;
  image?: string;
  linkPrefix?: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const categoryColors: Record<string, string> = {
  cleaning: 'teal',
  braiding: 'violet',
  tutoring: 'gold',
  repair: 'coral',
  default: 'secondary',
};

function getCategoryVariant(cat: string): string {
  const key = cat?.toLowerCase() ?? '';
  for (const k of Object.keys(categoryColors)) {
    if (key.includes(k)) return categoryColors[k];
  }
  return categoryColors.default;
}

export function ListingCard({
  id,
  title,
  providerName,
  price,
  duration,
  rating,
  reviewCount,
  nextAvailable,
  featured,
  category,
  image,
  linkPrefix = '',
  isFavorite,
  onToggleFavorite,
}: ListingCardProps) {
  const numPrice = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, '')) || 0;
  const hasValidNext = nextAvailable && !isNaN(new Date(nextAvailable).getTime());
  const formattedDate = hasValidNext
    ? new Date(nextAvailable).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;
  const numDuration = Number(duration) || 0;
  const durationLabel = numDuration >= 60 ? `${Math.floor(numDuration / 60)}h ${numDuration % 60 > 0 ? `${numDuration % 60}m` : ''}`.trim() : `${numDuration}m`;

  return (
    <div className="relative group/card h-full flex flex-col">
      <Link
        to={`${linkPrefix}/listing/${id}`}
        className="flex flex-col flex-1 min-h-0 bg-background border border-border rounded-2xl overflow-hidden card-lift hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`${title} by ${providerName}, $${numPrice}`}
      >
        {/* Image */}
        <div className="aspect-[16/10] overflow-hidden bg-gradient-to-br from-surface-teal to-surface-violet relative shrink-0 img-zoom">
          {image ? (
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl opacity-20">✦</span>
            </div>
          )}
          {/* Category badge overlay */}
          <div className="absolute bottom-2 left-2">
            <Badge variant={getCategoryVariant(category) as any} className="text-[10px] capitalize shadow-sm">
              {category}
            </Badge>
          </div>
          {/* Featured badge */}
          {featured && (
            <div className="absolute top-2 left-2">
              <Badge variant="gold" className="text-[10px] shadow-sm">Featured</Badge>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1 min-h-0">
          {/* Title + provider */}
          <div className="mb-2 min-w-0">
            <h3 className="font-semibold text-foreground group-hover/card:text-primary transition-colors line-clamp-2 leading-snug" title={title}>
              {title}
            </h3>
            <p className="text-xs text-muted mt-1 truncate">{providerName}</p>
          </div>

          {/* Rating */}
          <div className="mb-3 shrink-0">
            <RatingStars rating={rating} reviewCount={reviewCount} size={13} />
          </div>

          {/* Price + duration + availability */}
          <div className="mt-auto flex items-center justify-between gap-3 w-full">
            <span className="text-lg font-bold text-foreground chewy-regular">${numPrice}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted flex items-center gap-1 chewy-regular">
                <Clock size={11} />
                {durationLabel}
              </span>
              {hasValidNext && formattedDate && (
                <div className="flex items-center gap-1 text-xs text-muted bg-secondary px-2 py-1 rounded-lg shrink-0">
                  <Calendar size={11} />
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Favorite button — outside the Link to avoid nested interactives */}
      {onToggleFavorite && (
        <button
          type="button"
          onClick={() => onToggleFavorite(id)}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-sm transition-all duration-150 z-10 ${
            isFavorite
              ? 'bg-coral text-white hover:bg-coral/90'
              : 'bg-white/90 text-muted hover:bg-white hover:text-coral'
          }`}
        >
          <Heart size={15} className={isFavorite ? 'fill-current' : ''} />
        </button>
      )}
    </div>
  );
}

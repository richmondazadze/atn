import { Link } from 'react-router';
import { Clock, DollarSign, Calendar, Heart } from 'lucide-react';
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
  image,
  linkPrefix = '',
  isFavorite,
  onToggleFavorite,
}: ListingCardProps) {
  const formattedDate = nextAvailable
    ? new Date(nextAvailable).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';

  return (
    <div className="relative group/card">
      <Link
        to={`${linkPrefix}/listing/${id}`}
        className="block bg-background border border-border rounded-lg hover:border-primary transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`${title} by ${providerName}, $${price}`}
      >
        <div className="aspect-[16/10] rounded-t-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10 relative">
          {image && (
            <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
          )}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(id); }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/90 shadow hover:bg-white transition-colors z-10"
            >
              <Heart size={16} className={isFavorite ? 'fill-primary text-primary' : 'text-muted'} />
            </button>
          )}
        </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="min-w-0">
            <h3 className="font-medium group-hover:text-primary transition-colors truncate" title={title}>{title}</h3>
            <p className="text-sm text-muted mt-0.5 truncate">{providerName}</p>
          </div>
          {featured && (
            <Badge className="bg-primary/10 text-primary border-0 shrink-0">Featured</Badge>
          )}
        </div>

        <div className="mb-3">
          <RatingStars rating={rating} reviewCount={reviewCount} size={13} />
        </div>

        <div className="space-y-1.5 text-sm text-muted">
          <div className="flex items-center gap-2">
            <DollarSign size={14} />
            <span>${price}</span>
            <span aria-hidden="true">·</span>
            <Clock size={14} />
            <span>{duration}m</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span className="text-xs">Next: {formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
    </div>
  );
}

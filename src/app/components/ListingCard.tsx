import { Link } from 'react-router';
import { Star, Clock, DollarSign, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

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
}: ListingCardProps) {
  const formattedDate = new Date(nextAvailable).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Link
      to={`${linkPrefix}/listing/${id}`}
      className="block bg-background border border-border rounded hover:border-primary transition-colors group"
      aria-label={`${title} by ${providerName}, $${price}`}
    >
      <div className="h-44 rounded-t overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
        {image && (
          <img src={image} alt={title} className="w-full h-full object-cover" loading="lazy" />
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="min-w-0">
            <h3 className="font-medium group-hover:text-primary transition-colors truncate">{title}</h3>
            <p className="text-sm text-muted mt-0.5 truncate">{providerName}</p>
          </div>
          {featured && (
            <Badge className="bg-primary/10 text-primary border-0 shrink-0">Featured</Badge>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star size={13} className="fill-amber-400 text-amber-400" />
          <span className="text-sm font-medium">{rating}</span>
          <span className="text-sm text-muted">({reviewCount})</span>
        </div>

        <div className="space-y-1.5 text-sm text-muted">
          <div className="flex items-center gap-2">
            <DollarSign size={13} />
            <span>${price}</span>
            <span aria-hidden="true">•</span>
            <Clock size={13} />
            <span>{duration}m</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={13} />
            <span className="text-xs">Next: {formattedDate}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

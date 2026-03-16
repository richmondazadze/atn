import { Link } from 'react-router';
import { Star, MapPin, CheckCircle2 } from 'lucide-react';
import { Badge } from './ui/badge';

interface ProviderCardProps {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  categories: string[];
  zipCodes: string[];
  avatarUrl?: string;
  linkPrefix?: string;
}

export function ProviderCard({
  id,
  name,
  rating,
  reviewCount,
  verified,
  categories,
  zipCodes,
  avatarUrl,
  linkPrefix = '',
}: ProviderCardProps) {
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <Link
      to={`${linkPrefix}/provider/${id}`}
      className="block bg-background border border-border rounded p-4 hover:border-primary transition-colors"
      aria-label={`${name}, ${rating} stars, ${verified ? 'verified provider' : 'provider'}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-full overflow-hidden bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm shrink-0" aria-hidden="true">
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
          ) : initials}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <h3 className="font-medium truncate">{name}</h3>
            {verified && <CheckCircle2 size={15} className="text-primary shrink-0" aria-label="Verified" />}
          </div>

          <div className="flex items-center gap-1 mb-2">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted">({reviewCount})</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-muted mb-2">
            <MapPin size={11} />
            <span className="truncate">{zipCodes.slice(0, 3).join(', ')}{zipCodes.length > 3 ? '…' : ''}</span>
          </div>

          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map(cat => (
              <Badge key={cat} variant="outline" className="text-xs border-border">{cat}</Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="outline" className="text-xs border-border">+{categories.length - 2}</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

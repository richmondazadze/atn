import { Link } from 'react-router';
import { MapPin, CheckCircle2 } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Badge } from './ui/badge';
import { RatingStars } from './RatingStars';

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

const avatarPalette = [
  'bg-primary text-primary-foreground',
  'bg-violet text-white',
  'bg-coral text-white',
  'bg-amber text-white',
  'bg-rose text-white',
];

function pickColor(name: string): string {
  const code = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return avatarPalette[code % avatarPalette.length];
}

const categoryVariants: NonNullable<ComponentProps<typeof Badge>['variant']>[] = ['teal', 'violet', 'gold', 'coral', 'success'];

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
  const avatarColor = pickColor(name);

  return (
    <Link
      to={`${linkPrefix}/provider/${id}`}
      className="group block bg-background border border-border rounded-2xl p-4 card-lift hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      aria-label={`${name}, ${rating} stars, ${verified ? 'verified provider' : 'provider'}`}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div
          className={`w-14 h-14 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-base shrink-0 transition-transform duration-200 group-hover:scale-105 ${avatarColor}`}
          aria-hidden="true"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={name} className="w-full h-full object-cover" loading="lazy" />
          ) : initials}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name + verified */}
          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {name}
            </h3>
            {verified && (
              <CheckCircle2 size={15} className="text-status-green shrink-0" aria-label="Verified" />
            )}
          </div>

          {/* Rating */}
          <div className="mb-2">
            <RatingStars rating={rating} reviewCount={reviewCount} size={13} />
          </div>

          {/* Zip codes */}
          {zipCodes?.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted mb-2.5">
              <MapPin size={11} className="shrink-0" />
              <span className="truncate">
                {zipCodes.slice(0, 3).join(', ')}{zipCodes.length > 3 ? ` +${zipCodes.length - 3}` : ''}
              </span>
            </div>
          )}

          {/* Category badges */}
          <div className="flex flex-wrap gap-1">
            {categories.slice(0, 2).map((cat, i) => (
              <Badge key={cat} variant={categoryVariants[i % categoryVariants.length]} className="text-[10px] capitalize">
                {cat}
              </Badge>
            ))}
            {categories.length > 2 && (
              <Badge variant="secondary" className="text-[10px]">+{categories.length - 2}</Badge>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

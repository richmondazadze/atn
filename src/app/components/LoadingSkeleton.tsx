interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-border rounded ${className}`} />
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-background border border-border rounded overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-[75%]" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-[33%]" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

export function ProviderCardSkeleton() {
  return (
    <div className="bg-background border border-border rounded p-4">
      <div className="flex items-start gap-4">
        <Skeleton className="w-16 h-16 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-[33%]" />
          <Skeleton className="h-3 w-[66%]" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-4">
      <Skeleton className="h-8 w-48 sm:w-64" />
      <Skeleton className="h-4 w-64 sm:w-96 max-w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

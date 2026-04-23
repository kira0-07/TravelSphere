export function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-surface-container-lowest shadow-card">
      <div className="skeleton aspect-video w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 w-2/3 rounded-xs" />
        <div className="skeleton h-3 w-1/2 rounded-xs" />
        <div className="skeleton h-3 w-3/4 rounded-xs" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-6 w-1/4 rounded-xs" />
          <div className="skeleton h-9 w-1/4 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className={`skeleton h-3 rounded-xs ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export default function SkeletonLoader({ type = 'card', count = 6 }) {
  if (type === 'grid') return <SkeletonGrid count={count} />;
  if (type === 'text') return <SkeletonText lines={count} />;
  return <SkeletonCard />;
}

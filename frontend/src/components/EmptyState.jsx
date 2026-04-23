import { Link } from 'react-router-dom';

export default function EmptyState({ title = 'Nothing found', description = 'Try adjusting your search or filters.', ctaLabel = 'Explore All', ctaTo = '/', icon = '🔍' }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <div className="w-20 h-20 rounded-xl bg-surface-container flex items-center justify-center text-4xl mb-6">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-headline-sm text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-xs mb-8">{description}</p>
      <Link to={ctaTo} className="btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}

const STATUS_CONFIG = {
  pending: { label: 'Pending', cls: 'badge-pending', dot: 'bg-secondary/60' },
  confirmed: { label: 'Confirmed', cls: 'badge-confirmed', dot: 'bg-primary/60' },
  completed: { label: 'Completed', cls: 'badge-completed', dot: 'bg-green-500' },
  cancelled: { label: 'Cancelled', cls: 'badge-cancelled', dot: 'bg-error/60' },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={config.cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}

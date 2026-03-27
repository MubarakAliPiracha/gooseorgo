type OccupancyStatus = "quiet" | "moderate" | "busy" | "full" | "very-busy";

const STATUS_CONFIG: Record<OccupancyStatus, { label: string; classes: string }> = {
  quiet: { label: "QUIET", classes: "bg-primary-fixed text-on-primary-fixed-variant" },
  moderate: { label: "MODERATE", classes: "bg-secondary-fixed text-on-secondary-fixed" },
  busy: { label: "BUSY", classes: "bg-secondary-fixed text-on-secondary-fixed" },
  "very-busy": { label: "VERY BUSY", classes: "bg-error-container text-on-error-container" },
  full: { label: "FULL", classes: "bg-error-container text-on-error-container" },
};

type Props = { status: OccupancyStatus };

export function StatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest ${config.classes}`}>
      {config.label}
    </span>
  );
}

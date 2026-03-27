type OccupancyStatus = "quiet" | "moderate" | "busy" | "full" | "very-busy";

const STATUS_GRADIENTS: Record<OccupancyStatus, string> = {
  quiet:      "linear-gradient(90deg, #5f5e5e 0%, #8a8989 100%)",
  moderate:   "linear-gradient(90deg, #735c00 0%, #a88700 100%)",
  busy:       "linear-gradient(90deg, #735c00 0%, #ebc23e 100%)",
  "very-busy":"linear-gradient(90deg, #ba1a1a 0%, #e53935 100%)",
  full:       "linear-gradient(90deg, #ba1a1a 0%, #e53935 100%)",
};

type Props = {
  percentage: number;
  status: OccupancyStatus;
};

export function OccupancyBar({ percentage, status }: Props) {
  return (
    <div
      className="h-1.5 w-full rounded-full overflow-hidden"
      style={{ background: "#e2e2e2" }}
    >
      <div
        className="h-full rounded-full kinetic-bar-transition"
        style={{
          width: `${Math.min(percentage, 100)}%`,
          background: STATUS_GRADIENTS[status],
        }}
      />
    </div>
  );
}

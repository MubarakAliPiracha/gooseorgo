"use client";

import useSWR from "swr";
import { fetchWaitzData, type FloorData } from "@/lib/waitz";

export function StatusPill() {
  const { data } = useSWR<FloorData[]>("waitz", fetchWaitzData, {
    refreshInterval: 120_000,
  });

  const avgPct = data
    ? Math.round(data.reduce((sum, f) => sum + f.percentage, 0) / data.length)
    : null;

  const label = avgPct === null ? "Loading…"
    : avgPct >= 85 ? "Full"
    : avgPct >= 65 ? "Busy"
    : avgPct >= 40 ? "Moderate"
    : "Quiet";

  return (
    <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
      <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
        Live Status: {label}
      </span>
    </div>
  );
}

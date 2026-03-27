"use client";

import useSWR from "swr";
import { fetchWaitzData, type FloorData } from "@/lib/waitz";
import { StatusBadge } from "@/components/StatusBadge";
import { OccupancyBar } from "@/components/OccupancyBar";

const FLOOR_META: Record<number, { name: string; description: string; peak: string }> = {
  1: { name: "Main Entry & Commons", description: "Reference Desk & Computer Lab", peak: "12:00 PM - 8:00 PM" },
  2: { name: "Collaborative Hub", description: "Group Tables & Media Labs", peak: "10:00 AM - 5:00 PM" },
  3: { name: "Silent Study Zone", description: "South Wing & Private Pods", peak: "9:00 AM - 3:00 PM" },
  4: { name: "Quiet Study", description: "Individual Carrels", peak: "2:00 PM - 5:00 PM" },
};

function deriveStatusType(pct: number): "quiet" | "moderate" | "busy" | "very-busy" | "full" {
  if (pct >= 90) return "full";
  if (pct >= 75) return "very-busy";
  if (pct >= 55) return "busy";
  if (pct >= 35) return "moderate";
  return "quiet";
}

export default function FloorsPage() {
  const { data, error, isLoading } = useSWR<FloorData[]>("waitz", fetchWaitzData, {
    refreshInterval: 120_000,
  });

  return (
    <div className="p-8">
      <section className="mb-12">
        <h1 className="font-headline text-[3.5rem] leading-none font-extrabold tracking-tighter text-on-surface">
          Floor Heatmaps
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl leading-relaxed mt-3">
          Live floor-by-floor occupancy across DC Library. Data refreshed every 2 minutes via Waitz sensors.
        </p>
      </section>

      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface-container-low rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="bg-error-container text-on-error-container rounded-xl p-4 text-sm">
          Failed to load occupancy data. Showing demo data.
        </div>
      )}

      {data && (
        <>
          {/* Floor list */}
          <div className="space-y-6 mb-12">
            {[...data].reverse().map((floor) => {
              const meta = FLOOR_META[floor.floor];
              const statusType = deriveStatusType(floor.percentage);
              const seats = Math.round((1 - floor.percentage / 100) * floor.capacity);
              return (
                <div
                  key={floor.floor}
                  className="bg-surface-container-low rounded-xl p-8 flex flex-col md:flex-row items-center gap-10 group hover:bg-surface-container transition-colors"
                >
                  <div className="flex flex-col items-center min-w-[48px]">
                    <span className="text-5xl font-headline font-black text-on-surface opacity-20 group-hover:opacity-100 transition-opacity">
                      {String(floor.floor).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] font-bold tracking-widest uppercase text-primary mt-1">Level</span>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <h3 className="text-2xl font-headline font-bold">{meta?.name ?? `Floor ${floor.floor}`}</h3>
                        <p className="text-sm text-on-surface-variant font-medium">{meta?.description}</p>
                      </div>
                      <StatusBadge status={statusType} />
                    </div>
                    <OccupancyBar percentage={floor.percentage} status={statusType} />
                    <div className="flex justify-between mt-3 text-xs font-semibold text-primary">
                      <span>{floor.percentage}% Occupancy</span>
                      <span>{seats} Seats Available</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floor breakdown cards grid */}
          <div className="flex items-center gap-4 mb-8">
            <h2 className="font-headline text-2xl font-bold">Floor-by-Floor Dynamics</h2>
            <div className="h-px flex-1 bg-surface-container-highest" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...data].reverse().map((floor) => {
              const meta = FLOOR_META[floor.floor];
              const statusType = deriveStatusType(floor.percentage);
              return (
                <div key={floor.floor} className="bg-surface-container-low p-6 rounded-xl hover:bg-surface-container transition-all">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-bold text-outline tracking-widest">
                      FLOOR {String(floor.floor).padStart(2, "0")}
                    </span>
                    <StatusBadge status={statusType} />
                  </div>
                  <p className="font-headline text-lg font-bold mb-1">{meta?.name}</p>
                  <p className="text-sm text-on-surface-variant mb-6">Peak: {meta?.peak}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-outline">
                      <span>OCCUPANCY</span>
                      <span>{floor.percentage}%</span>
                    </div>
                    <OccupancyBar percentage={floor.percentage} status={statusType} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

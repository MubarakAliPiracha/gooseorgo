"use client";

import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetchWaitzData, type FloorData } from "@/lib/waitz";

const LeafletMap = dynamic(
  () => import("@/components/LeafletMap").then((m) => m.LeafletMap),
  { ssr: false, loading: () => <div className="w-full h-full bg-surface-container animate-pulse" /> }
);

const FLOOR_NAMES: Record<number, string> = {
  1: "Main Entry & Commons",
  2: "Collaborative Hub",
  3: "Silent Study Zone",
  4: "Quiet Study",
};

export default function MapPage() {
  const { data: floors } = useSWR<FloorData[]>("waitz", fetchWaitzData, { refreshInterval: 120_000 });

  const avgPct = floors
    ? Math.round(floors.reduce((s, f) => s + f.percentage, 0) / floors.length)
    : 64;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Map */}
      <section className="flex-1 p-8 relative">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-1 block">System Status: Active</span>
            <h2 className="text-[3.5rem] font-headline font-extrabold text-on-surface leading-[0.9] -ml-0.5">Library Flow</h2>
          </div>
          <div className="flex items-center gap-6 bg-surface-container-low p-6 rounded-xl">
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-primary tracking-widest uppercase">Global Occupancy</span>
              <span className="text-2xl font-headline font-black text-secondary">{avgPct}%</span>
            </div>
            <div className="h-10 w-px bg-outline-variant/30" />
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-primary tracking-widest uppercase">Tim Hortons</span>
              <span className="text-2xl font-headline font-black text-error italic">Check App</span>
            </div>
          </div>
        </header>

        {/* Map Container */}
        <div className="rounded-xl overflow-hidden relative shadow-lg bg-surface-container border border-outline-variant/10 h-[500px]">
          <LeafletMap avgPct={avgPct} />

          {/* Glass overlay card */}
          <div className="absolute top-6 left-6 glass-panel p-6 rounded-xl shadow-xl max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-secondary opacity-80">Real-Time Status</span>
            <h3 className="font-headline text-2xl font-extrabold tracking-tighter mt-1">DC Library</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-end justify-between">
                <span className="text-3xl font-black font-headline text-primary">{avgPct}%</span>
                <span className="text-xs uppercase tracking-wider font-bold opacity-60 mb-1">Occupied</span>
              </div>
              <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full kinetic-bar-transition" style={{ width: `${avgPct}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Floor Quick Links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {[1, 2, 3, 4].map((floor) => (
            <button
              key={floor}
              className="glass-panel px-4 py-2 rounded-full text-sm font-semibold border border-outline-variant/20 hover:bg-surface-container transition-all flex items-center gap-2"
            >
              View Floor {floor}
              <span className="w-2 h-2 rounded-full bg-secondary" />
            </button>
          ))}
        </div>
      </section>

      {/* Right sidebar trends */}
      <aside className="w-full lg:w-96 p-8 flex flex-col gap-8 bg-surface-container-low/50 border-l border-surface-container-highest">
        <div>
          <h3 className="font-headline text-xl font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">trending_up</span>
            Campus-Wide Trends
          </h3>
          <div className="space-y-4">
            {floors?.map((floor) => {
              const pct = floor.percentage;
              const isHigh = pct >= 80;
              const isMid = pct >= 50;
              return (
                <div key={floor.floor} className="bg-surface p-5 rounded-xl shadow-sm border border-outline-variant/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm">{FLOOR_NAMES[floor.floor] ?? `Floor ${floor.floor}`}</h4>
                      <p className="text-[10px] opacity-60 font-semibold tracking-wider uppercase">Floor {floor.floor}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      isHigh ? "bg-error-container text-on-error-container"
                      : isMid ? "bg-secondary-fixed text-on-secondary-fixed"
                      : "bg-primary-fixed text-on-primary-fixed-variant"
                    }`}>
                      {floor.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isHigh ? "bg-error" : isMid ? "bg-secondary" : "bg-primary"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            }) ?? (
              <div className="h-24 bg-surface-container-low rounded-xl animate-pulse" />
            )}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-outline-variant/10">
          <div className="bg-secondary-container/30 p-6 rounded-xl border border-secondary-container">
            <p className="text-sm leading-relaxed mb-4 text-on-secondary-container">
              Floor 2 is strictly silent. Floors 1 and 3 allow collaborative work.
            </p>
            <button className="text-sm font-bold flex items-center gap-1 text-secondary">
              Read Floor Regulations
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

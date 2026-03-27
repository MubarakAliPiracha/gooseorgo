"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";

type WaitStatus = "empty" | "moving_fast" | "crawl" | "stalled";

type Report = {
  id: string;
  status: WaitStatus;
  reported_at: string;
};

const STATUS_OPTIONS: {
  value: WaitStatus;
  label: string;
  emoji: string;
  description: string;
}[] = [
  { value: "empty", label: "Empty", emoji: "☕", description: "No queue at all" },
  { value: "moving_fast", label: "Moving Fast", emoji: "🏃", description: "Quick turnaround" },
  { value: "crawl", label: "Crawl", emoji: "🐢", description: "Moving slowly" },
  { value: "stalled", label: "Stalled", emoji: "🛑", description: "Barely moving" },
];

const WAIT_MINUTES: Record<WaitStatus, string> = {
  empty: "< 2",
  moving_fast: "5 – 8",
  crawl: "10 – 18",
  stalled: "20+",
};

const fetcher = async (): Promise<Report[]> => {
  const { data } = await supabase
    .from("tims_reports")
    .select("*")
    .order("reported_at", { ascending: false })
    .limit(20);
  return data ?? [];
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// Mock hourly chart data
const CHART_HOURS = [
  { label: "8A", pct: 20 }, { label: "9A", pct: 40 }, { label: "10A", pct: 75 },
  { label: "11A", pct: 95 }, { label: "12P", pct: 100 }, { label: "1P", pct: 90 },
  { label: "2P", pct: 60 }, { label: "3P", pct: 45 }, { label: "4P", pct: 30 },
];

export default function TimsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { data: reports = [], mutate } = useSWR<Report[]>("tims_reports", fetcher, {
    refreshInterval: 30_000,
  });

  const latestStatus = reports.length > 0 ? reports[0].status : null;
  const latestOption = STATUS_OPTIONS.find((o) => o.value === latestStatus);
  const waitMins = latestStatus ? WAIT_MINUTES[latestStatus] : "–";

  const handleReport = async (status: WaitStatus) => {
    setSubmitting(true);
    await supabase.from("tims_reports").insert({ status });
    await mutate();
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-4xl font-extrabold font-headline tracking-tighter text-on-surface">Tim Hortons</h2>
          <p className="text-on-surface-variant font-medium">Outside DC Library &amp; Student Commons</p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          <span className="text-xs font-bold tracking-widest text-on-surface-variant uppercase">
            Live Status: {latestOption?.label ?? "No Data"}
          </span>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Hero Wait Time Card */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 flex flex-col justify-between min-h-[360px] relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold tracking-[0.15em] text-secondary uppercase">Current Wait Time</span>
            <h3 className="text-6xl font-extrabold font-headline tracking-tighter text-on-surface mt-2">
              {waitMins}
              <span className="text-xl font-light text-on-surface-variant ml-2">MINS</span>
            </h3>

            <div className="mt-8 space-y-6 max-w-sm">
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2 text-on-surface-variant">
                  <span>Line Length</span>
                  <span>{latestStatus === "empty" ? "0" : latestStatus === "moving_fast" ? "~5" : latestStatus === "crawl" ? "~12" : "~20+"} People</span>
                </div>
                <div className="h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary rounded-full kinetic-bar-transition"
                    style={{
                      width: latestStatus === "empty" ? "5%" : latestStatus === "moving_fast" ? "30%"
                        : latestStatus === "crawl" ? "65%" : "95%"
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Status</p>
                  <p className="text-xl font-bold font-headline mt-1">{latestOption?.label ?? "Unknown"}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">Reports Today</p>
                  <p className="text-xl font-bold font-headline mt-1">{reports.length}</p>
                </div>
              </div>
            </div>
          </div>

          {submitted && (
            <div className="absolute top-4 right-4 bg-secondary text-on-secondary text-xs font-bold px-3 py-1.5 rounded-full">
              Thanks for your report!
            </div>
          )}
        </div>

        {/* Crowd-Sourced Feedback */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-secondary-container p-8 rounded-xl h-full flex flex-col justify-center">
            <span className="material-symbols-outlined text-on-secondary-container text-4xl mb-4">group</span>
            <h4 className="text-2xl font-bold font-headline text-on-secondary-container tracking-tight">How&apos;s the line looking?</h4>
            <p className="text-on-secondary-fixed-variant mt-2 mb-6 text-sm">
              Contribute to live data. Your report helps fellow students plan their break.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleReport(option.value)}
                  disabled={submitting}
                  className={`bg-surface-container-lowest p-4 rounded-xl text-center hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed
                    ${latestStatus === option.value ? "ring-2 ring-secondary" : ""}`}
                >
                  <span className="block text-2xl mb-1">{option.emoji}</span>
                  <span className="text-xs font-bold uppercase text-on-surface">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Peak Hour Analytics Chart */}
        <div className="col-span-12 bg-surface-container p-10 rounded-xl">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Traffic Trends</span>
              <h4 className="text-3xl font-extrabold font-headline tracking-tighter mt-1">Peak Hour Analytics</h4>
            </div>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-xs font-medium text-on-surface-variant">
                <span className="w-3 h-3 rounded-sm bg-secondary" /> Typical
              </span>
            </div>
          </div>
          <div className="h-48 flex items-end gap-2 md:gap-4 px-4">
            {CHART_HOURS.map(({ label, pct }) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-2 group">
                <div
                  className="w-full bg-secondary-fixed/30 group-hover:bg-secondary rounded-t-lg transition-all relative"
                  style={{ height: `${pct}%` }}
                >
                  <div
                    className="absolute inset-x-0 bottom-0 bg-secondary rounded-t-lg"
                    style={{ height: "80%" }}
                  />
                </div>
                <span className="text-[10px] font-bold text-on-surface-variant">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Seating Area Status */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-low p-8 rounded-xl border border-outline-variant/15">
          <h5 className="font-headline font-bold text-xl mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">deck</span>
            Seating Area
          </h5>
          <div className="space-y-3">
            {[
              { area: "Indoor Bar Stools", status: "Full", classes: "bg-error-container text-on-error-container" },
              { area: "Patio Tables", status: "Busy", classes: "bg-secondary-fixed text-on-secondary-fixed" },
              { area: "Lounge Settees", status: "Quiet", classes: "bg-primary-fixed text-on-primary-fixed-variant" },
            ].map(({ area, status, classes }) => (
              <div key={area} className="flex justify-between items-center p-4 bg-surface rounded-xl">
                <span className="text-sm font-medium">{area}</span>
                <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full ${classes}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        {reports.length > 0 && (
          <div className="col-span-12 lg:col-span-8 bg-surface-container-low rounded-xl overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-6 py-4 border-b border-outline-variant/10">
              Recent Community Reports
            </p>
            <div className="divide-y divide-outline-variant/10">
              {reports.slice(0, 6).map((report) => {
                const opt = STATUS_OPTIONS.find((o) => o.value === report.status);
                return (
                  <div key={report.id} className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt?.emoji}</span>
                      <span className="text-sm font-medium">{opt?.label}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant">{formatTime(report.reported_at)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

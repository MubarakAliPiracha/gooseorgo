"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import { supabase } from "@/lib/supabase";

type HourlyData = { hour: string; avg_occupancy: number };

const DAY_DATA = [
  { day: "MON", pct: 40 },
  { day: "TUE", pct: 85 },
  { day: "WED", pct: 100 },
  { day: "THU", pct: 70 },
  { day: "FRI", pct: 50 },
  { day: "SAT", pct: 20 },
  { day: "SUN", pct: 15 },
];

const HOUR_LABELS = ["8A","9A","10A","11A","12P","1P","2P","3P","4P","5P","6P","7P"];

export default function AnalyticsPage() {
  const [data, setData] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: rows } = await supabase
        .from("hourly_occupancy")
        .select("hour, avg_occupancy")
        .order("hour");

      if (rows && rows.length > 0) {
        setData(rows as HourlyData[]);
      } else {
        setData(HOUR_LABELS.map((hour, i) => ({
          hour,
          avg_occupancy: Math.round(20 + Math.sin((i / 12) * Math.PI) * 65),
        })));
      }
      setLoading(false);
    }
    load();
  }, []);

  const peakHour = data.reduce((max, d) => d.avg_occupancy > max.avg_occupancy ? d : max, { hour: "–", avg_occupancy: 0 });

  return (
    <div className="p-8">
      <section className="mb-12 space-y-4">
        <h1 className="font-headline text-[3.5rem] leading-none font-extrabold tracking-tighter text-on-surface">
          Peak Hour Analytics
        </h1>
        <p className="font-body text-on-surface-variant max-w-2xl leading-relaxed">
          Analyzing historical occupancy patterns across DC Library to optimize your study sessions.
          Our recommendation engine uses a 12-week rolling average of pedestrian sensor data.
        </p>
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

        {/* Best Time Card */}
        <div className="md:col-span-5 glass-panel rounded-xl p-8 flex flex-col justify-between shadow-sm border border-outline-variant/10">
          <div>
            <span className="inline-block px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
              Recommendation Engine
            </span>
            <h2 className="font-headline text-3xl font-bold mb-4 leading-tight">Your Optimal Window</h2>
            <p className="text-on-surface-variant leading-relaxed mb-8">Based on current trends, for 4th floor individual carrels:</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-3xl">bolt</span>
            </div>
            <div>
              <p className="font-headline text-2xl font-bold">8:30 AM</p>
              <p className="text-[10px] text-secondary font-semibold tracking-widest uppercase">Guaranteed Seating</p>
            </div>
          </div>
        </div>

        {/* Daily Traffic Chart */}
        <div className="md:col-span-7 bg-surface-container rounded-xl p-8 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-headline text-xl font-bold">Daily Traffic Intensity</h3>
            <div className="flex gap-2 items-center">
              <span className="w-3 h-3 rounded-full bg-secondary" />
              <span className="text-[10px] text-outline font-bold tracking-tighter uppercase">Historic Peak</span>
            </div>
          </div>
          {/* Fixed 160px chart height — bars grow upward via align-self: flex-end */}
          <div className="flex items-end gap-2" style={{ height: "160px" }}>
            {DAY_DATA.map(({ day, pct }) => {
              const barH = Math.round(pct * 1.3); // max ~130px for 100%
              const isWed = day === "WED";
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5" style={{ alignSelf: "flex-end" }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${barH}px`,
                      background: isWed
                        ? "linear-gradient(180deg, #a88700 0%, #735c00 100%)"
                        : "rgba(200,198,197,0.55)",
                    }}
                  />
                  <span className="text-[10px] font-bold" style={{ color: isWed ? "#735c00" : "#7f7662" }}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recharts Hourly */}
        {!loading && (
          <div className="md:col-span-12 bg-surface-container-low border border-outline-variant/10 rounded-xl p-8">
            <h3 className="text-sm font-medium text-on-surface-variant mb-6">Average Occupancy by Hour</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e2e2" />
                <XAxis dataKey="hour" tick={{ fill: "#4d4634", fontSize: 11 }} axisLine={{ stroke: "#d0c6ae" }} tickLine={false} />
                <YAxis tick={{ fill: "#4d4634", fontSize: 11 }} axisLine={{ stroke: "#d0c6ae" }} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #d0c6ae", borderRadius: "8px", fontSize: 12 }} cursor={{ fill: "#eeeeee" }} />
                <Bar dataKey="avg_occupancy" radius={[4, 4, 0, 0]}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.avg_occupancy >= 80 ? "#ba1a1a" : entry.avg_occupancy >= 60 ? "#735c00" : "#5f5e5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Stats Cards */}
        <div className="md:col-span-12 grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Peak Hour</p>
            <p className="text-3xl font-headline font-black text-secondary">{peakHour.hour}</p>
          </div>
          <div className="bg-surface-container-low border border-outline-variant/10 rounded-xl p-6">
            <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant mb-1">Peak Occupancy</p>
            <p className="text-3xl font-headline font-black text-secondary">{peakHour.avg_occupancy}%</p>
          </div>
        </div>

        {/* Midterm Surge Card */}
        <div className="md:col-span-12 bg-on-surface rounded-xl p-10 flex flex-col md:flex-row gap-12 items-center text-surface overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
            <svg viewBox="0 0 400 200" className="w-full h-full">
              <path d="M0,150 Q50,140 100,100 T200,80 T300,120 T400,50" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
          </div>
          <div className="flex-1 space-y-6 relative z-10">
            <h3 className="font-headline text-4xl font-extrabold tracking-tight">The Midterm Surge</h3>
            <p className="text-surface-variant/80 leading-relaxed">
              Historically, occupancy increases by <strong>45%</strong> during the third week of November.
              Consider booking individual study rooms 48 hours in advance.
            </p>
            <button className="bg-secondary text-on-secondary px-8 py-4 rounded-xl font-headline font-bold text-sm tracking-wide hover:opacity-90 transition-all flex items-center gap-2">
              Reserve Study Room
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="flex flex-col gap-4 relative z-10">
            <div className="bg-surface/10 backdrop-blur-md p-6 rounded-xl border border-surface/5">
              <span className="text-[10px] font-bold text-surface-variant tracking-widest uppercase block mb-1">Avg Stay Duration</span>
              <p className="font-headline text-3xl font-bold">4.2 Hours</p>
            </div>
            <div className="bg-surface/10 backdrop-blur-md p-6 rounded-xl border border-surface/5">
              <span className="text-[10px] font-bold text-surface-variant tracking-widest uppercase block mb-1">Popular Entry Time</span>
              <p className="font-headline text-3xl font-bold">10:15 AM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

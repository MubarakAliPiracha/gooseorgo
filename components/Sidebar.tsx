"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Floor Overviews", icon: "layers" },
  { href: "/floors", label: "Heatmaps", icon: "wb_sunny" },
  { href: "/analytics", label: "Analytics", icon: "leaderboard" },
  { href: "/tims", label: "Tim Hortons", icon: "coffee" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 z-50"
      style={{ background: "#f3f3f3", borderRight: "1px solid #e2e2e2" }}
    >
      {/* Brand */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="font-headline font-black text-xl tracking-tighter" style={{ color: "#1a1c1c" }}>
          DC Library
        </h1>
        <p className="text-[10px] font-label font-bold uppercase tracking-[0.12em] mt-0.5" style={{ color: "#7f7662", opacity: 0.8 }}>
          Live Occupancy
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={isActive ? {
                color: "#1a1c1c",
                background: "#eeeeee",
                borderRight: "3px solid #735c00",
                fontWeight: 700,
              } : {
                color: "#5f5e5e",
                opacity: 0.75,
              }}
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-l-lg transition-all duration-150 hover:opacity-100"
              onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "#e8e8e8"; (e.currentTarget as HTMLElement).style.opacity = "1"; } }}
              onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.opacity = "0.75"; } }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "20px",
                  color: isActive ? "#735c00" : "#5f5e5e",
                  fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
                }}
              >
                {icon}
              </span>
              <span className="tracking-wide font-label">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-6 py-6 space-y-3" style={{ borderTop: "1px solid rgba(208,198,174,0.15)" }}>
        <button
          className="w-full py-3 px-4 rounded-xl text-sm font-bold tracking-tight transition-all hover:opacity-90 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #735c00 0%, #a88700 100%)",
            color: "#ffffff",
          }}
        >
          Reserve Study Room
        </button>
        <div className="space-y-0.5">
          {[
            { icon: "help", label: "Support" },
            { icon: "person", label: "Account" },
          ].map(({ icon, label }) => (
            <Link
              key={label}
              href="#"
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all"
              style={{ color: "#5f5e5e", opacity: 0.65 }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#e2e2e2"; (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.opacity = "0.65"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>{icon}</span>
              {label}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

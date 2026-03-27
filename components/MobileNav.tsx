"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Floors", icon: "layers" },
  { href: "/floors", label: "Heat", icon: "wb_sunny" },
  { href: "/analytics", label: "Stats", icon: "leaderboard" },
  { href: "/tims", label: "Tims", icon: "coffee" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant/10 flex justify-around items-center h-16 z-50">
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold font-label transition-colors
              ${isActive ? "text-secondary" : "text-primary opacity-60"}`}
          >
            <span className="material-symbols-outlined text-2xl">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

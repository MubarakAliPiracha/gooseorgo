import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: ["400", "700", "800"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "GooseOrGo – DC Library",
  description: "Real-time occupancy tracker for UW's Davis Centre Library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className={`${manrope.variable} ${inter.variable} bg-surface text-on-surface font-body antialiased`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
            {children}
          </div>
        </div>
        <MobileNav />
      </body>
    </html>
  );
}

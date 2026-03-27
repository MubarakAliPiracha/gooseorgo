"use client";

import { useEffect, useRef } from "react";

const DC_LIBRARY = { lat: 43.4723, lng: -80.5449 };
const TIMS = { lat: 43.4718, lng: -80.5442 };

type Props = { avgPct: number };

export function LeafletMap({ avgPct }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Dynamically import Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      // Fix default icon paths broken by webpack
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(containerRef.current!, {
        center: [DC_LIBRARY.lat, DC_LIBRARY.lng],
        zoom: 18,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      mapRef.current = map;

      // OpenStreetMap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 20,
      }).addTo(map);

      // DC Library marker — gold pulsing circle + custom icon
      const dcIcon = L.divIcon({
        html: `
          <div style="position:relative;width:48px;height:48px;">
            <div style="
              position:absolute;inset:0;border-radius:50%;
              background:rgba(115,92,0,0.25);
              animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
            "></div>
            <div style="
              position:relative;width:48px;height:48px;border-radius:50%;
              background:#735c00;display:flex;align-items:center;justify-content:center;
              box-shadow:0 4px 16px rgba(115,92,0,0.4);
            ">
              <span class="material-symbols-outlined" style="color:#fff;font-size:22px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">school</span>
            </div>
          </div>
          <style>
            @keyframes ping {
              75%,100%{transform:scale(2);opacity:0}
            }
          </style>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        className: "",
      });

      // Tim Hortons marker — amber
      const timsIcon = L.divIcon({
        html: `
          <div style="
            width:40px;height:40px;border-radius:50%;
            background:#ffe087;display:flex;align-items:center;justify-content:center;
            box-shadow:0 3px 10px rgba(0,0,0,0.18);border:2px solid #ebc23e;
          ">
            <span class="material-symbols-outlined" style="color:#735c00;font-size:20px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">coffee</span>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        className: "",
      });

      L.marker([DC_LIBRARY.lat, DC_LIBRARY.lng], { icon: dcIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;padding:4px 2px;min-width:160px">
            <p style="font-weight:700;font-size:14px;margin:0 0 4px">DC Library</p>
            <p style="font-size:12px;color:#4d4634;margin:0 0 6px">Davis Centre, UW</p>
            <div style="display:flex;align-items:center;gap:8px">
              <div style="flex:1;height:6px;background:#e2e2e2;border-radius:3px;overflow:hidden">
                <div style="height:100%;width:${avgPct}%;background:linear-gradient(90deg,#735c00,#a88700);border-radius:3px"></div>
              </div>
              <span style="font-size:11px;font-weight:700;color:#735c00">${avgPct}%</span>
            </div>
          </div>
        `);

      L.marker([TIMS.lat, TIMS.lng], { icon: timsIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:Inter,sans-serif;padding:4px 2px">
            <p style="font-weight:700;font-size:14px;margin:0 0 2px">Tim Hortons</p>
            <p style="font-size:12px;color:#4d4634;margin:0">DC Campus · Check wait time →</p>
          </div>
        `);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [avgPct]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}

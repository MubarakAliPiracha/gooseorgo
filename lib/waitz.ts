export type OccupancyStatus = "quiet" | "moderate" | "busy" | "full";

export type FloorData = {
  floor: number;
  count: number;
  capacity: number;
  percentage: number;
  status: OccupancyStatus;
};

function deriveStatus(percentage: number): OccupancyStatus {
  if (percentage >= 85) return "full";
  if (percentage >= 65) return "busy";
  if (percentage >= 40) return "moderate";
  return "quiet";
}

type WaitzLocation = {
  name: string;
  busyness: number;
  count: number;
  capacity: number;
};

type WaitzResponse = {
  data: {
    locations: WaitzLocation[];
  };
};

function parseFloorNumber(name: string): number | null {
  const match = name.match(/floor\s*(\d)/i) ?? name.match(/(\d)(?:st|nd|rd|th)?\s*floor/i);
  return match ? parseInt(match[1], 10) : null;
}

export async function fetchWaitzData(): Promise<FloorData[]> {
  try {
    // Use local API proxy to avoid CORS issues in the browser
    const response = await fetch("/api/waitz");

    if (!response.ok) throw new Error(`Waitz API returned ${response.status}`);

    const json: WaitzResponse = await response.json();
    const locations = json?.data?.locations ?? [];

    const floorLocations = locations
      .map((loc) => ({
        floor: parseFloorNumber(loc.name),
        count: loc.count,
        capacity: loc.capacity,
        percentage: Math.round((loc.count / loc.capacity) * 100),
      }))
      .filter(
        (loc): loc is { floor: number; count: number; capacity: number; percentage: number } =>
          loc.floor !== null && loc.floor >= 1 && loc.floor <= 4
      )
      .map((loc) => ({ ...loc, status: deriveStatus(loc.percentage) }));

    if (floorLocations.length === 0) return generateFallbackData();
    return floorLocations.sort((a, b) => a.floor - b.floor);
  } catch {
    return generateFallbackData();
  }
}

function generateFallbackData(): FloorData[] {
  const CAPACITIES: Record<number, number> = { 1: 200, 2: 150, 3: 180, 4: 100 };
  const DEMO: Record<number, number> = { 1: 89, 2: 42, 3: 67, 4: 22 };
  return [1, 2, 3, 4].map((floor) => {
    const capacity = CAPACITIES[floor];
    const percentage = DEMO[floor];
    const count = Math.round((percentage / 100) * capacity);
    return { floor, count, capacity, percentage, status: deriveStatus(percentage) };
  });
}

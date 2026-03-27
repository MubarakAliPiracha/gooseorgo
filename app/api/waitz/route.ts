import { NextResponse } from "next/server";

export const revalidate = 120;

export async function GET() {
  try {
    const response = await fetch("https://waitz.io/live/waterloo", {
      next: { revalidate: 120 },
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Waitz returned ${response.status}` }, { status: 502 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 502 });
  }
}

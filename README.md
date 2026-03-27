# GooseOrGo

Real-time occupancy tracker for UW's Davis Centre Library.

## Features
- Campus map with DC Library & Tim Hortons markers
- Floor-by-floor occupancy from Waitz (auto-refreshes every 2 min)
- Peak hour analytics from Supabase
- Crowdsourced Tim Hortons wait tracker

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local`** (copy from `.env.local.example`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...
   ```

3. **Set up Supabase tables** — run `lib/schema.sql` in the Supabase SQL editor.

4. **Run the dev server**:
   ```bash
   npm run dev
   ```

## Google Maps
Enable the **Maps JavaScript API** and create an API key in Google Cloud Console. Optionally restrict the key to your domain.

## Waitz Data
Fetches live occupancy from `https://waitz.io/live/waterloo` with 2-minute polling via SWR. Falls back to demo data if the API is unavailable.

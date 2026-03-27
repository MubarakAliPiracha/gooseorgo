-- Tim Hortons crowdsourced wait reports
CREATE TABLE IF NOT EXISTS tims_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('empty', 'moving_fast', 'crawl', 'stalled')),
  reported_at TIMESTAMPTZ DEFAULT NOW()
);

-- Historical hourly occupancy for analytics
CREATE TABLE IF NOT EXISTS hourly_occupancy (
  id BIGSERIAL PRIMARY KEY,
  hour TEXT NOT NULL,          -- e.g. '9am', '10am'
  day_of_week INT,             -- 0=Sunday ... 6=Saturday
  avg_occupancy NUMERIC(5,2),  -- 0-100
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE tims_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE hourly_occupancy ENABLE ROW LEVEL SECURITY;

-- Allow anonymous reads and inserts for tims_reports
CREATE POLICY "public read tims_reports" ON tims_reports FOR SELECT USING (true);
CREATE POLICY "public insert tims_reports" ON tims_reports FOR INSERT WITH CHECK (true);

-- Allow anonymous reads for hourly_occupancy
CREATE POLICY "public read hourly_occupancy" ON hourly_occupancy FOR SELECT USING (true);

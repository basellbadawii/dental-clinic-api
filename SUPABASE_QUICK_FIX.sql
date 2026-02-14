-- Quick Fix for Supabase RLS Issues
-- Run this in Supabase SQL Editor if you're having trouble saving data

-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all access to patients" ON patients;
DROP POLICY IF EXISTS "Allow all access to appointments" ON appointments;
DROP POLICY IF EXISTS "Allow all access to visits" ON visits;
DROP POLICY IF EXISTS "Allow all access to users" ON users;
DROP POLICY IF EXISTS "Allow all access to clinic_settings" ON clinic_settings;

-- Create open policies for ALL operations (INSERT, SELECT, UPDATE, DELETE)
CREATE POLICY "Allow all access to patients" ON patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to appointments" ON appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to visits" ON visits FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to clinic_settings" ON clinic_settings FOR ALL USING (true) WITH CHECK (true);

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('patients', 'appointments', 'visits', 'users', 'clinic_settings');

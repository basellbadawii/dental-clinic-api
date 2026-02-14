-- Dental Clinic Database Setup Script
-- Execute this SQL in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================
-- 1. USERS TABLE (for authentication)
-- ====================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'doctor' CHECK (role IN ('admin', 'doctor', 'receptionist')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ====================================
-- 2. PATIENTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20) CHECK (gender IN ('ذكر', 'أنثى', 'male', 'female')),
    address TEXT,
    medical_history TEXT,
    allergies TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
CREATE INDEX IF NOT EXISTS idx_patients_created_at ON patients(created_at DESC);

-- ====================================
-- 3. APPOINTMENTS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_date TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    treatment_type VARCHAR(255),
    status VARCHAR(50) DEFAULT 'مجدول' CHECK (status IN ('مجدول', 'مكتمل', 'ملغي', 'scheduled', 'completed', 'cancelled')),
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- ====================================
-- 4. VISITS TABLE (Treatment Records)
-- ====================================
CREATE TABLE IF NOT EXISTS visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    visit_date TIMESTAMPTZ DEFAULT NOW(),
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    cost DECIMAL(10, 2) DEFAULT 0,
    paid BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_visits_patient_id ON visits(patient_id);
CREATE INDEX IF NOT EXISTS idx_visits_date ON visits(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visits_paid ON visits(paid);

-- ====================================
-- 5. TRIGGER FUNCTIONS FOR updated_at
-- ====================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
    BEFORE UPDATE ON patients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visits_updated_at ON visits;
CREATE TRIGGER update_visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================
-- Enable RLS on all tables
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create open policies for all operations (for development/testing)
-- PATIENTS
DROP POLICY IF EXISTS "Allow all access to patients" ON patients;
CREATE POLICY "Allow all access to patients" ON patients FOR ALL USING (true);

-- APPOINTMENTS
DROP POLICY IF EXISTS "Allow all access to appointments" ON appointments;
CREATE POLICY "Allow all access to appointments" ON appointments FOR ALL USING (true);

-- VISITS
DROP POLICY IF EXISTS "Allow all access to visits" ON visits;
CREATE POLICY "Allow all access to visits" ON visits FOR ALL USING (true);

-- USERS
DROP POLICY IF EXISTS "Allow all access to users" ON users;
CREATE POLICY "Allow all access to users" ON users FOR ALL USING (true);

-- ====================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ====================================
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;

-- Create policies for anon key access (for demo purposes)
-- In production, you should use proper authentication and more restrictive policies

-- Users policies
CREATE POLICY "Allow read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow insert access to users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update access to users" ON users FOR UPDATE USING (true);

-- Patients policies
CREATE POLICY "Allow all access to patients" ON patients FOR ALL USING (true);

-- Appointments policies
CREATE POLICY "Allow all access to appointments" ON appointments FOR ALL USING (true);

-- Visits policies
CREATE POLICY "Allow all access to visits" ON visits FOR ALL USING (true);

-- ====================================
-- 7. INSERT DEFAULT ADMIN USER
-- ====================================
-- Password: admin123 (in production, this should be properly hashed)
INSERT INTO users (email, password_hash, full_name, role)
VALUES ('admin@dental.com', 'admin123', 'المسؤول', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ====================================
-- 8. INSERT SAMPLE DATA (Optional)
-- ====================================
-- Insert sample patients
INSERT INTO patients (name, phone, email, gender, medical_history, notes)
VALUES 
    ('أحمد محمد', '01012345678', 'ahmed@example.com', 'ذكر', 'لا يوجد', 'مريض منتظم'),
    ('فاطمة علي', '01098765432', 'fatima@example.com', 'أنثى', 'حساسية من البنسلين', 'تحتاج متابعة شهرية'),
    ('محمود حسن', '01123456789', 'mahmoud@example.com', 'ذكر', 'ضغط دم مرتفع', 'يتناول أدوية الضغط')
ON CONFLICT DO NOTHING;

-- Insert sample appointments (for today and tomorrow)
INSERT INTO appointments (patient_id, appointment_date, treatment_type, status)
SELECT 
    (SELECT id FROM patients WHERE name = 'أحمد محمد' LIMIT 1),
    NOW() + INTERVAL '2 hours',
    'فحص دوري',
    'مجدول'
WHERE EXISTS (SELECT 1 FROM patients WHERE name = 'أحمد محمد');

INSERT INTO appointments (patient_id, appointment_date, treatment_type, status)
SELECT 
    (SELECT id FROM patients WHERE name = 'فاطمة علي' LIMIT 1),
    NOW() + INTERVAL '1 day',
    'تنظيف أسنان',
    'مجدول'
WHERE EXISTS (SELECT 1 FROM patients WHERE name = 'فاطمة علي');

-- ====================================
-- 9. CLINIC SETTINGS TABLE
-- ====================================
CREATE TABLE IF NOT EXISTS clinic_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clinic_name VARCHAR(255) DEFAULT 'عيادة الأسنان',
    clinic_phone VARCHAR(50),
    clinic_email VARCHAR(255),
    clinic_address TEXT,
    clinic_logo_url TEXT,
    
    -- WhatsApp Integration Settings
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    whatsapp_phone VARCHAR(50),
    whatsapp_api_key TEXT,
    
    -- n8n Integration Settings
    n8n_enabled BOOLEAN DEFAULT FALSE,
    n8n_webhook_url TEXT,
    n8n_api_key TEXT,
    
    -- Working Hours (JSON format)
    working_hours JSONB DEFAULT '{
        "saturday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "sunday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "monday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "tuesday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "wednesday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "thursday": {"enabled": true, "start": "09:00", "end": "17:00"},
        "friday": {"enabled": false, "start": "09:00", "end": "17:00"}
    }'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger for clinic_settings
DROP TRIGGER IF EXISTS update_clinic_settings_updated_at ON clinic_settings;
CREATE TRIGGER update_clinic_settings_updated_at
    BEFORE UPDATE ON clinic_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all access to clinic_settings" ON clinic_settings FOR ALL USING (true);

-- Insert default clinic settings (only one row should exist)
INSERT INTO clinic_settings (clinic_name, clinic_phone)
VALUES ('عيادة الأسنان', '01000000000')
ON CONFLICT DO NOTHING;

-- ====================================
-- SETUP COMPLETE!
-- ====================================
-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Verify tables are created in Table Editor
-- 3. Test the application connection

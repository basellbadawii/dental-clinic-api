-- ====================================
-- CREATE SERVICES TABLE FOR DENTAL CLINIC
-- ====================================
-- This script creates a proper services table for dental services
-- and adds sample data with default prices

-- Drop existing services table if it exists (be careful - this will delete all data!)
DROP TABLE IF EXISTS services CASCADE;

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    duration_minutes INTEGER DEFAULT 30,
    category VARCHAR(100),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access
DROP POLICY IF EXISTS "Allow all access to services" ON services;
CREATE POLICY "Allow all access to services" ON services FOR ALL USING (true) WITH CHECK (true);

-- ====================================
-- INSERT SAMPLE DENTAL SERVICES
-- ====================================
INSERT INTO services (name, name_en, description, price, duration_minutes, category, active) VALUES
    -- خدمات الكشف والتشخيص
    ('كشف', 'Examination', 'كشف عام وفحص الأسنان', 100.00, 20, 'كشف وتشخيص', true),
    ('كشف متخصص', 'Specialized Examination', 'كشف متخصص وتشخيص شامل', 200.00, 30, 'كشف وتشخيص', true),
    ('أشعة بانوراما', 'Panoramic X-Ray', 'أشعة بانوراما للفكين', 150.00, 15, 'كشف وتشخيص', true),
    ('أشعة رقمية', 'Digital X-Ray', 'أشعة رقمية للأسنان', 50.00, 10, 'كشف وتشخيص', true),
    
    -- خدمات التنظيف والوقاية
    ('تنظيف أسنان', 'Teeth Cleaning', 'تنظيف الأسنان وإزالة الجير', 200.00, 30, 'تنظيف ووقاية', true),
    ('تنظيف عميق', 'Deep Cleaning', 'تنظيف عميق للثة والأسنان', 400.00, 60, 'تنظيف ووقاية', true),
    ('فلورايد', 'Fluoride Treatment', 'علاج بالفلورايد لتقوية الأسنان', 100.00, 15, 'تنظيف ووقاية', true),
    ('تلميع أسنان', 'Teeth Polishing', 'تلميع الأسنان', 150.00, 20, 'تنظيف ووقاية', true),
    
    -- خدمات الحشو والعلاج
    ('حشو عادي', 'Regular Filling', 'حشو السن المسوس', 200.00, 30, 'حشو وعلاج', true),
    ('حشو تجميلي', 'Cosmetic Filling', 'حشو تجميلي بلون السن', 350.00, 40, 'حشو وعلاج', true),
    ('حشو عصب - قناة واحدة', 'Root Canal - Single', 'علاج عصب قناة واحدة', 800.00, 60, 'حشو وعلاج', true),
    ('حشو عصب - قناتين', 'Root Canal - Double', 'علاج عصب قناتين', 1200.00, 90, 'حشو وعلاج', true),
    ('حشو عصب - ثلاث قنوات', 'Root Canal - Triple', 'علاج عصب ثلاث قنوات', 1500.00, 120, 'حشو وعلاج', true),
    
    -- خدمات التركيبات
    ('تاج خزفي', 'Ceramic Crown', 'تاج خزفي للسن', 1500.00, 45, 'تركيبات', true),
    ('تاج زيركون', 'Zirconia Crown', 'تاج زيركون عالي الجودة', 2000.00, 45, 'تركيبات', true),
    ('جسر ثابت', 'Fixed Bridge', 'جسر ثابت (لكل وحدة)', 1200.00, 60, 'تركيبات', true),
    ('طقم أسنان كامل', 'Complete Denture', 'طقم أسنان كامل متحرك', 2500.00, 90, 'تركيبات', true),
    ('طقم أسنان جزئي', 'Partial Denture', 'طقم أسنان جزئي متحرك', 1500.00, 60, 'تركيبات', true),
    
    -- خدمات الزراعة
    ('زراعة سن', 'Dental Implant', 'زراعة سن واحد', 8000.00, 120, 'زراعة', true),
    ('زراعة سن مع التاج', 'Implant with Crown', 'زراعة سن كاملة مع التاج', 10000.00, 180, 'زراعة', true),
    
    -- خدمات التجميل
    ('تبييض أسنان', 'Teeth Whitening', 'تبييض الأسنان بالليزر', 1500.00, 60, 'تجميل', true),
    ('فينير', 'Veneer', 'قشرة تجميلية (لكل سن)', 1800.00, 45, 'تجميل', true),
    ('ابتسامة هوليود', 'Hollywood Smile', 'تجميل الابتسامة الكامل', 35000.00, 180, 'تجميل', true),
    
    -- خدمات الخلع والجراحة
    ('خلع سن عادي', 'Simple Extraction', 'خلع سن عادي', 200.00, 20, 'جراحة', true),
    ('خلع سن جراحي', 'Surgical Extraction', 'خلع سن جراحي', 500.00, 45, 'جراحة', true),
    ('خلع ضرس عقل', 'Wisdom Tooth Extraction', 'خلع ضرس العقل', 800.00, 60, 'جراحة', true),
    ('خلع ضرس عقل مدفون', 'Impacted Wisdom Tooth', 'خلع ضرس عقل مدفون', 1500.00, 90, 'جراحة', true),
    
    -- خدمات الأطفال
    ('كشف أطفال', 'Children Examination', 'كشف وفحص أسنان الأطفال', 100.00, 20, 'أطفال', true),
    ('حشو أطفال', 'Children Filling', 'حشو أسنان الأطفال', 150.00, 30, 'أطفال', true),
    ('خلع لبني', 'Baby Tooth Extraction', 'خلع سن لبني', 100.00, 15, 'أطفال', true),
    ('جلسة فلورايد للأطفال', 'Children Fluoride', 'جلسة فلورايد وقائية للأطفال', 80.00, 15, 'أطفال', true),
    
    -- خدمات التقويم
    ('استشارة تقويم', 'Orthodontic Consultation', 'استشارة تقويم أسنان', 200.00, 30, 'تقويم', true),
    ('تقويم معدني', 'Metal Braces', 'تقويم أسنان معدني (كامل)', 15000.00, 60, 'تقويم', true),
    ('تقويم شفاف', 'Clear Braces', 'تقويم أسنان شفاف', 25000.00, 60, 'تقويم', true),
    ('متابعة تقويم', 'Braces Follow-up', 'جلسة متابعة تقويم شهرية', 300.00, 20, 'تقويم', true)
ON CONFLICT DO NOTHING;

-- ====================================
-- VERIFY DATA
-- ====================================
-- Count total services
SELECT 'Total Services Created:' as info, COUNT(*) as count FROM services;

-- Show services by category
SELECT category, COUNT(*) as count, 
       MIN(price) as min_price, 
       MAX(price) as max_price,
       AVG(price)::DECIMAL(10,2) as avg_price
FROM services 
GROUP BY category
ORDER BY category;

-- Show all services
SELECT id, name, name_en, price, duration_minutes, category
FROM services
ORDER BY category, price;

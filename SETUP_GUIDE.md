# 📘 دليل الإعداد والتشغيل - نظام إدارة عيادة الأسنان

## 🚀 البدء السريع

### المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- Node.js (الإصدار 18 أو أحدث)
- npm أو yarn
- حساب Supabase (مجاني)
- Evolution API (اختياري - للواتساب)

---

## 📦 خطوات التثبيت

### 1. تثبيت المكتبات

```bash
cd dental-clinic-app
npm install
```

### 2. إعداد قاعدة البيانات (Supabase)

#### أ. إنشاء مشروع جديد

1. اذهب إلى [Supabase](https://supabase.com)
2. أنشئ حساب جديد أو سجل الدخول
3. أنشئ مشروع جديد
4. احفظ **Project URL** و **Anon Key**

#### ب. إنشاء الجداول

انسخ والصق SQL التالي في **SQL Editor** في Supabase:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create patients table
CREATE TABLE patients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female')),
  medical_history TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create visits table
CREATE TABLE visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  service_type TEXT NOT NULL,
  diagnosis TEXT,
  treatment TEXT,
  cost DECIMAL(10,2) DEFAULT 0,
  paid BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (for authentication)
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'doctor' CHECK (role IN ('doctor', 'admin', 'receptionist')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role) 
VALUES ('admin@dental.com', 'admin123', 'د. أحمد محمد', 'admin');

-- Create indexes for better performance
CREATE INDEX idx_patients_phone ON patients(phone);
CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_visits_patient ON visits(patient_id);
CREATE INDEX idx_visits_date ON visits(visit_date);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### ج. إضافة بيانات تجريبية (اختياري)

```sql
-- Insert sample patients
INSERT INTO patients (name, phone, age, gender, medical_history) VALUES
('محمد أحمد السعيد', '0501234567', 35, 'male', 'لا يوجد'),
('فاطمة علي الشمري', '0509876543', 28, 'female', 'حساسية من البنسلين'),
('عبدالله خالد المطيري', '0555555555', 42, 'male', 'ضغط دم مرتفع');

-- Insert sample appointments (adjust dates as needed)
INSERT INTO appointments (patient_id, appointment_date, duration, status, notes)
SELECT id, NOW() + INTERVAL '1 day', 30, 'scheduled', 'كشف دوري'
FROM patients LIMIT 1;
```

### 3. إعداد ملف البيئة (.env)

انسخ ملف `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

افتح `.env` وأضف البيانات التالية:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Evolution API Configuration (اختياري)
VITE_EVOLUTION_API_URL=http://localhost:8080
VITE_EVOLUTION_API_KEY=your-api-key
VITE_EVOLUTION_INSTANCE_NAME=dental_clinic

# n8n Webhook URL (اختياري)
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/dental
```

### 4. تشغيل التطبيق

```bash
npm run dev
```

سيعمل التطبيق على: `http://localhost:3000`

---

## 🔐 تسجيل الدخول

### البيانات الافتراضية:
- **البريد الإلكتروني:** admin@dental.com
- **كلمة المرور:** admin123

⚠️ **مهم:** غيّر كلمة المرور الافتراضية فوراً في بيئة الإنتاج!

---

## 📱 إعداد Evolution API (للواتساب)

### الخيار 1: Docker (الموصى به)

```bash
docker run -d \
  --name evolution-api \
  -p 8080:8080 \
  -e AUTHENTICATION_API_KEY=your-secret-key \
  atendai/evolution-api:latest
```

### الخيار 2: التثبيت اليدوي

```bash
git clone https://github.com/EvolutionAPI/evolution-api.git
cd evolution-api
npm install
npm run build
npm run start
```

### إنشاء Instance جديد

استخدم Postman أو curl:

```bash
curl -X POST http://localhost:8080/instance/create \
  -H "Content-Type: application/json" \
  -H "apikey: your-secret-key" \
  -d '{
    "instanceName": "dental_clinic",
    "qrcode": true
  }'
```

سيظهر QR Code - قم بمسحه من تطبيق واتساب.

---

## 🔗 إعداد n8n (للأتمتة)

### 1. تثبيت n8n

```bash
npm install -g n8n
```

### 2. تشغيل n8n

```bash
n8n start
```

### 3. إنشاء Workflow للتذكير بالمواعيد

1. افتح n8n في المتصفح
2. أنشئ workflow جديد
3. أضف **Webhook** node
4. انسخ URL الـ webhook
5. أضفه في ملف `.env`

**مثال على workflow بسيط:**
- Webhook يستقبل بيانات الموعد
- Schedule لإرسال تذكير قبل 24 ساعة
- HTTP Request لإرسال رسالة واتساب عبر Evolution API

---

## 🏗️ بناء المشروع للإنتاج

```bash
npm run build
```

سيتم إنشاء المشروع في مجلد `dist/`

### نشر على Vercel

```bash
npm install -g vercel
vercel
```

### نشر على Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🔧 استكشاف الأخطاء

### المشكلة: لا يمكن الاتصال بـ Supabase

**الحل:**
1. تأكد من صحة `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`
2. تحقق من اتصال الإنترنت
3. تأكد من تفعيل Row Level Security (RLS) في Supabase

### المشكلة: رسائل الواتساب لا ترسل

**الحل:**
1. تحقق من تشغيل Evolution API
2. تأكد من مسح QR Code وتفعيل الجلسة
3. تحقق من صحة رقم الهاتف (يجب أن يبدأ بـ 05)

### المشكلة: الخطوط العربية لا تظهر بشكل صحيح

**الحل:**
تأكد من إضافة خطوط Cairo و Tajawal في `index.html` - تم إضافتها مسبقاً.

---

## 📚 الموارد المفيدة

- [Supabase Documentation](https://supabase.com/docs)
- [Evolution API Documentation](https://doc.evolution-api.com/)
- [n8n Documentation](https://docs.n8n.io/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 🆘 الدعم

للمساعدة والدعم:
- افتح Issue على GitHub
- راسلنا على: support@dentalclinic.com

---

## 📄 الترخيص

MIT License - يمكنك استخدام المشروع بحرية للأغراض الشخصية والتجارية.

---

**تم بناء النظام بـ ❤️ لخدمة عيادات الأسنان في العالم العربي**

# دليل إعداد Supabase - خطوة بخطوة

## 🎯 المشكلة: عمليات الحفظ تفشل

إذا كانت عمليات "إضافة مريض" أو "حجز موعد" أو "تسجيل زيارة" **تفشل في الحفظ**، السبب على الأرجح هو:

1. ❌ عدم تشغيل سكريبت SQL في Supabase
2. ❌ سياسات RLS (Row Level Security) تمنع الوصول
3. ❌ بيانات `.env` غير صحيحة

---

## ✅ الحل الشامل (خطوة بخطوة)

### الخطوة 1️⃣: تحديث ملف .env

**افتح ملف `.env` في المجلد الرئيسي وتأكد من:**

```env
VITE_SUPABASE_URL=https://dnzuljmguutvummtwljj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRuenVsam1ndXV0dnVtbXR3bGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0MTQ4NjksImV4cCI6MjA1NDk5MDg2OX0.sb_publishable_3AYK-XNTuhT-7p_28rIedQ_0VEJG84x
```

**ملاحظة:** إذا كانت لديك قاعدة بيانات Supabase أخرى، استبدل القيم أعلاه ببيانات مشروعك.

---

### الخطوة 2️⃣: تشغيل سكريبت SQL الأساسي

1. **افتح Supabase Dashboard:**
   ```
   https://app.supabase.com/project/YOUR_PROJECT_ID
   ```

2. **اذهب إلى SQL Editor:**
   - من القائمة الجانبية، اختر **SQL Editor**
   - انقر على **+ New query**

3. **انسخ والصق سكريبت SQL:**
   - افتح ملف `supabase_setup.sql`
   - انسخ المحتوى بالكامل
   - الصقه في SQL Editor
   - اضغط **Run** أو **F5**

4. **تحقق من النجاح:**
   - يجب أن ترى رسالة "Success. No rows returned"
   - اذهب إلى **Table Editor**
   - يجب أن ترى الجداول التالية:
     - ✅ `patients`
     - ✅ `appointments`
     - ✅ `visits`
     - ✅ `users`
     - ✅ `clinic_settings`

---

### الخطوة 3️⃣: إصلاح سياسات RLS (الأهم!)

**إذا كانت الجداول موجودة لكن الحفظ يفشل:**

1. **افتح SQL Editor مرة أخرى**

2. **انسخ والصق هذا السكريبت:**

```sql
-- Quick Fix for RLS - نسخ من ملف SUPABASE_QUICK_FIX.sql

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

-- Create OPEN policies (allow everything)
CREATE POLICY "Allow all access to patients" 
  ON patients FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access to appointments" 
  ON appointments FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access to visits" 
  ON visits FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access to users" 
  ON users FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all access to clinic_settings" 
  ON clinic_settings FOR ALL 
  USING (true) 
  WITH CHECK (true);
```

3. **اضغط Run**

4. **تحقق من السياسات:**

```sql
-- تحقق من أن السياسات تم إنشاؤها
SELECT schemaname, tablename, policyname, permissive, cmd 
FROM pg_policies 
WHERE tablename IN ('patients', 'appointments', 'visits', 'users', 'clinic_settings');
```

يجب أن ترى سياسة واحدة لكل جدول.

---

### الخطوة 4️⃣: اختبار الاتصال

1. **أعد تشغيل التطبيق:**
   ```bash
   cd dental-clinic-app
   npm run dev
   ```

2. **افتح Console (F12)**
   - اذهب إلى تبويب **Console**

3. **جرّب إضافة مريض:**
   - اضغط "إضافة مريض"
   - املأ النموذج
   - اضغط "إضافة المريض"

4. **افحص Console:**
   - ✅ إذا رأيت "تم إضافة المريض بنجاح" → كل شيء يعمل!
   - ❌ إذا رأيت خطأ أحمر → راجع الخطوات أدناه

---

## 🔍 حل المشاكل الشائعة

### مشكلة 1: "new row violates row-level security policy"

**السبب:** سياسات RLS تمنع الإدراج

**الحل:**
```sql
-- تأكد من تشغيل سكريبت RLS من الخطوة 3
-- أو قم بتعطيل RLS مؤقتاً:
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE visits DISABLE ROW LEVEL SECURITY;
```

---

### مشكلة 2: "relation does not exist"

**السبب:** الجداول غير موجودة

**الحل:**
- قم بتشغيل `supabase_setup.sql` كاملاً
- تحقق من Table Editor أن الجداول موجودة

---

### مشكلة 3: "column does not exist"

**السبب:** أسماء الأعمدة غير متطابقة

**الحل:**
```sql
-- تحقق من أعمدة جدول patients:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'patients';
```

يجب أن ترى:
- `id` (uuid)
- `name` (varchar)
- `phone` (varchar)
- `email` (varchar)
- `date_of_birth` (date)
- `gender` (varchar)
- `address` (text)
- `medical_history` (text)
- `allergies` (text)
- `notes` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

---

### مشكلة 4: "Failed to fetch"

**السبب:** مشكلة في الاتصال بـ Supabase

**الحل:**
1. تحقق من `.env` أن الـ URL و ANON_KEY صحيحين
2. تحقق من الإنترنت
3. تحقق من Supabase Dashboard أن المشروع يعمل

---

## 📊 التحقق من البيانات

بعد إضافة بيانات، تحقق منها في Supabase:

1. **اذهب إلى Table Editor**
2. **اختر جدول `patients`**
3. **يجب أن ترى الصفوف المُضافة**

---

## 🔐 ملاحظات أمنية

⚠️ **تحذير:** السياسات الحالية تسمح بالوصول الكامل (مناسبة للتطوير فقط)

**للإنتاج، استخدم سياسات محددة:**

```sql
-- مثال: سماح فقط للمستخدمين المصادق عليهم
CREATE POLICY "Authenticated users can read patients" 
  ON patients FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patients" 
  ON patients FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');
```

---

## ✅ قائمة التحقق النهائية

قبل أن تبدأ باستخدام التطبيق:

- [ ] ملف `.env` يحتوي على VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY
- [ ] تم تشغيل `supabase_setup.sql` في Supabase SQL Editor
- [ ] الجداول موجودة في Table Editor (patients, appointments, visits, users, clinic_settings)
- [ ] سياسات RLS مُعدّة بشكل صحيح (SUPABASE_QUICK_FIX.sql)
- [ ] تم اختبار إضافة مريض وحجز موعد
- [ ] لا توجد أخطاء في Console (F12)

---

## 🆘 المساعدة السريعة

إذا استمرت المشكلة:

1. **افتح Console (F12)**
2. **جرّب إضافة مريض**
3. **انسخ رسالة الخطأ الحمراء**
4. **أرسلها للحصول على مساعدة**

---

## 📁 الملفات المرجعية

- `supabase_setup.sql` - السكريبت الأساسي الكامل
- `SUPABASE_QUICK_FIX.sql` - إصلاح سريع لسياسات RLS
- `.env` - إعدادات الاتصال
- `src/services/supabase.js` - كود الاتصال

---

**تاريخ التحديث:** 10 فبراير 2026
**الإصدار:** 2.3 - Supabase Setup Guide

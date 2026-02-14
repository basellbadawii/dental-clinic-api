# تحديث قاعدة البيانات - إضافة جدول clinic_settings

## 🎯 المطلوب

لتفعيل صفحة الإعدادات، يجب إضافة جدول `clinic_settings` إلى قاعدة بيانات Supabase.

## 📝 الخطوات

### الطريقة 1: تشغيل السكريبت الكامل (مستحسن للمشاريع الجديدة)

1. افتح Supabase Dashboard الخاص بمشروعك
2. اذهب إلى **SQL Editor** من القائمة الجانبية
3. افتح ملف `supabase_setup.sql` الموجود في مجلد المشروع
4. انسخ محتوى الملف بالكامل
5. الصقه في SQL Editor
6. اضغط على **Run** أو **RUN** (F5)

### الطريقة 2: إضافة الجدول فقط (للمشاريع الموجودة)

إذا كانت قاعدة البيانات موجودة بالفعل، قم بتشغيل هذا السكريبت فقط:

```sql
-- إنشاء جدول clinic_settings
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

-- إنشاء Trigger للتحديث التلقائي
DROP TRIGGER IF EXISTS update_clinic_settings_updated_at ON clinic_settings;
CREATE TRIGGER update_clinic_settings_updated_at
    BEFORE UPDATE ON clinic_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- تفعيل Row Level Security
ALTER TABLE clinic_settings ENABLE ROW LEVEL SECURITY;

-- إنشاء Policies
CREATE POLICY "Allow all access to clinic_settings" ON clinic_settings FOR ALL USING (true);

-- إدراج البيانات الافتراضية
INSERT INTO clinic_settings (clinic_name, clinic_phone)
VALUES ('عيادة الأسنان', '01000000000')
ON CONFLICT DO NOTHING;
```

## ✅ التحقق من النجاح

بعد تشغيل السكريبت:

1. اذهب إلى **Table Editor** في Supabase
2. ابحث عن جدول `clinic_settings`
3. يجب أن تجد صف واحد بالبيانات الافتراضية

## 🚀 الخطوة التالية

بعد تحديث قاعدة البيانات:
1. شغل التطبيق: `npm run dev`
2. اذهب إلى صفحة الإعدادات من القائمة الجانبية
3. ابدأ بتخصيص معلومات عيادتك!

## ⚠️ ملاحظات مهمة

- الجدول يحتوي على صف واحد فقط (إعدادات العيادة الواحدة)
- جميع الحقول اختيارية ما عدا `id`
- `working_hours` تُخزن بصيغة JSON
- يمكنك تعديل القيم الافتراضية حسب احتياجاتك

## 🆘 في حالة وجود مشاكل

إذا واجهت خطأ عند تشغيل السكريبت:
- تأكد من وجود دالة `update_updated_at_column()` (موجودة في السكريبت الكامل)
- تأكد من تفعيل UUID extension في قاعدة البيانات
- راجع رسالة الخطأ في Supabase وتواصل للمساعدة

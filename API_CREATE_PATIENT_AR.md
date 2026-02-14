# API لإضافة مريض جديد - دليل الاستخدام

## 📌 معلومات الـ API

### الرابط (Endpoint)
```
POST http://localhost:3001/api/create-patient
```

### طريقة الإرسال (Method)
```
POST
```

### نوع المحتوى (Content-Type)
```
application/json
```

---

## 📋 صيغة الـ JSON المطلوبة

### الحد الأدنى (الاسم والهاتف فقط):
```json
{
  "name": "محمد أحمد",
  "phone": "0501234567"
}
```

---

## ✅ الاستجابة عند النجاح (Success Response)

**الكود:** `201 Created`

**مثال على الاستجابة:**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "message_ar": "تم إضافة المريض بنجاح",
  "patient": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "محمد أحمد",
    "phone": "0501234567",
    "created_at": "2024-02-14T10:30:00.000Z"
  }
}
```

---

## ❌ حالات الخطأ (Error Responses)

### 1. بيانات ناقصة (Missing Data)
**الكود:** `400 Bad Request`
```json
{
  "success": false,
  "error": "Name and phone are required",
  "error_ar": "الاسم والهاتف مطلوبان"
}
```

### 2. مريض موجود مسبقاً (Duplicate Phone)
**الكود:** `409 Conflict`
```json
{
  "success": false,
  "error": "Patient with this phone number already exists",
  "error_ar": "يوجد مريض بهذا الرقم مسبقاً",
  "existingPatient": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "محمد أحمد",
    "phone": "0501234567"
  }
}
```

### 3. خطأ في الخادم (Server Error)
**الكود:** `500 Internal Server Error`
```json
{
  "success": false,
  "error": "Database connection failed",
  "error_ar": "حدث خطأ في إضافة المريض"
}
```

---

## 🔧 استخدام الـ API في n8n

### الخطوات:

1. **أضف عقدة HTTP Request جديدة**

2. **اضبط الإعدادات التالية:**
   - **Method:** `POST`
   - **URL:** `http://localhost:3001/api/create-patient`
   - **Authentication:** `None`
   
3. **في قسم Body:**
   - **Body Content Type:** `JSON`
   - **Specify Body:** `Using JSON`
   
4. **أضف البيانات بصيغة JSON:**
   ```json
   {
     "name": "{{ $json.patientName }}",
     "phone": "{{ $json.patientPhone }}"
   }
   ```

5. **في قسم Options (اختياري):**
   - **Response Format:** `JSON`

---

## 📝 مثال عملي في n8n

### السيناريو: المساعد يستقبل رسالة من واتساب لإضافة مريض جديد

```
1. Webhook Trigger (من Evolution API)
   ↓
2. Code Node (استخراج الاسم والهاتف من الرسالة)
   ↓
3. HTTP Request (POST إلى /api/create-patient)
   ↓
4. IF Node (التحقق من النجاح)
   ↓
5. Send WhatsApp Message (إرسال رد للمستخدم)
```

### مثال على Code Node لاستخراج البيانات:
```javascript
// افترض أن الرسالة بصيغة: "إضافة مريض: محمد أحمد، 0501234567"
const message = $input.item.json.message.text;

// استخراج البيانات
const match = message.match(/إضافة مريض:\s*(.+),\s*(\d+)/);

if (match) {
  return {
    json: {
      patientName: match[1].trim(),
      patientPhone: match[2].trim()
    }
  };
} else {
  return {
    json: {
      error: "لم يتم التعرف على صيغة الرسالة"
    }
  };
}
```

---

## 🧪 اختبار الـ API

### باستخدام cURL:
```bash
curl -X POST http://localhost:3001/api/create-patient \
  -H "Content-Type: application/json" \
  -d '{"name":"محمد أحمد","phone":"0501234567"}'
```

### باستخدام Postman:
1. افتح Postman
2. اختر `POST`
3. أدخل الرابط: `http://localhost:3001/api/create-patient`
4. اذهب إلى تبويب `Body`
5. اختر `raw` و `JSON`
6. أدخل:
   ```json
   {
     "name": "محمد أحمد",
     "phone": "0501234567"
   }
   ```
7. اضغط `Send`

---

## 🔒 ملاحظات أمنية

1. **التحقق من التكرار:** يتحقق الـ API تلقائياً من عدم وجود مريض بنفس رقم الهاتف
2. **تنظيف البيانات:** يتم إزالة المسافات الزائدة من الاسم والهاتف تلقائياً باستخدام `.trim()`
3. **التحقق من الصلاحية:** يتم التأكد من وجود الاسم والهاتف قبل الإضافة

---

## ⚙️ المتطلبات قبل الاستخدام

### 1. تشغيل السيرفر
```bash
cd server
npm start
```
**يجب أن تظهر رسالة:**
```
🚀 Dental Clinic API Server running on port 3001
📍 http://localhost:3001
```

### 2. التأكد من قاعدة البيانات
**مهم جداً:** يجب تنفيذ SQL التالي في Supabase SQL Editor أولاً:

```sql
-- تأكد من تنفيذ هذا الكود في Supabase
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

CREATE INDEX IF NOT EXISTS idx_patients_phone ON patients(phone);
```

**أو استخدم الملف الجاهز:**
```bash
# في Supabase SQL Editor، نفذ محتوى الملف:
supabase_setup.sql
```

### 3. التحقق من ملف .env
تأكد من وجود ملف `.env` في مجلد `server` يحتوي على:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=3001
```

## 📞 الدعم الفني وحل المشاكل

### المشكلة: "Could not find the table 'public.patients'"
**الحل:** لم يتم إنشاء جدول المرضى في Supabase
1. افتح Supabase Dashboard
2. اذهب إلى SQL Editor
3. نفذ الكود SQL الموجود في ملف `supabase_setup.sql`
4. أو نفذ الكود في القسم "المتطلبات قبل الاستخدام" أعلاه

### المشكلة: "Connection refused" أو "ECONNREFUSED"
**الحل:** السيرفر غير مشغل
```bash
cd server
npm start
```

### المشكلة: خطأ في الاتصال بـ Supabase
**الحل:** تحقق من ملف `.env`
1. تأكد من صحة `SUPABASE_URL`
2. تأكد من صحة `SUPABASE_ANON_KEY`
3. تحقق من اتصالك بالإنترنت

### تحقق من السيرفر:
```bash
# اختبار بسيط
curl http://localhost:3001/api/health
```
**النتيجة المتوقعة:**
```json
{
  "status": "ok",
  "message": "Dental Clinic API is running"
}
```

---

## 🎯 الخطوات التالية المقترحة

بعد إنشاء المريض، يمكنك:
1. استخدام `patient.id` المُرجع لإنشاء موعد جديد
2. إرسال رسالة تأكيد للمريض عبر WhatsApp
3. إضافة المريض إلى قائمة المتابعة
4. حفظ معلومات إضافية لاحقاً (عنوان، تاريخ ميلاد، إلخ)

---

**تم إنشاء هذا الملف في:** {{ new Date().toLocaleString('ar-SA') }}

# 🚀 دليل استخدام API مع n8n

## ✅ تم التنفيذ بنجاح!

تم إنشاء **بوابة بيانات (API Endpoint)** جاهزة للربط مع n8n لسحب بيانات المرضى من قاعدة بيانات Supabase.

---

## 📡 معلومات الـ API

### 🔗 الرابط الأساسي (Base URL)
```
http://localhost:3001
```

### 🌐 Endpoint لسحب جميع المرضى
```
GET http://localhost:3001/api/patients
```

---

## 📊 تنسيق البيانات المُرجعة

### مثال على الـ Response:

```json
{
  "success": true,
  "count": 4,
  "patients": [
    {
      "id": "23d9c029-73e0-47da-9415-a8307941b4b3",
      "name": "أحمد محمد",
      "phone": "01012345678",
      "email": "ahmed@example.com",
      "date_of_birth": "1990-05-15",
      "gender": "ذكر",
      "medical_history": "لا يوجد أمراض مزمنة",
      "created_at": "2026-02-10T22:44:37.281319+00:00"
    },
    {
      "id": "bbe046b7-0e44-426a-919d-f7697b85b1b5",
      "name": "فاطمة علي",
      "phone": "01098765432",
      "email": "fatima@example.com",
      "date_of_birth": "1985-12-20",
      "gender": "أنثى",
      "medical_history": "حساسية من البنسلين",
      "created_at": "2026-02-10T22:42:12.865483+00:00"
    }
  ]
}
```

### 📋 الحقول المتاحة:

| الحقل | النوع | الوصف |
|------|------|-------|
| `id` | UUID | معرف فريد للمريض |
| `name` | String | اسم المريض |
| `phone` | String | رقم الهاتف |
| `email` | String | البريد الإلكتروني (اختياري) |
| `date_of_birth` | Date | تاريخ الميلاد (اختياري) |
| `gender` | String | الجنس (ذكر/أنثى) |
| `medical_history` | String | السجل الطبي (اختياري) |
| `created_at` | DateTime | تاريخ إضافة المريض |

---

## 🔧 كيفية الاستخدام في n8n

### الخطوة 1️⃣: إضافة HTTP Request Node

1. في n8n، أضف node جديد من نوع **HTTP Request**
2. اختر Method: **GET**
3. ضع الـ URL:
   ```
   http://localhost:3001/api/patients
   ```

### الخطوة 2️⃣: إعدادات إضافية (اختيارية)

#### Headers:
- **Content-Type**: `application/json`
- **Accept**: `application/json`

#### Authentication:
- لا يوجد authentication مطلوب حالياً (API مفتوح للاستخدام المحلي)

### الخطوة 3️⃣: معالجة البيانات

البيانات ترجع بتنسيق **Array of Objects**، يمكنك استخدامها مباشرة في:

- **Function Node** لمعالجة البيانات
- **Set Node** لتحويل البيانات
- **Google Sheets** لحفظ البيانات في جدول
- **Email Node** لإرسال تقارير
- **WhatsApp Node** (Evolution API) لإرسال رسائل للمرضى

---

## 🎯 Endpoints إضافية متاحة

### 1. فحص صحة الـ API
```
GET http://localhost:3001/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Dental Clinic API is running"
}
```

---

### 2. سحب بيانات مريض معين
```
GET http://localhost:3001/api/patients/:id
```

**مثال:**
```
GET http://localhost:3001/api/patients/23d9c029-73e0-47da-9415-a8307941b4b3
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "id": "23d9c029-73e0-47da-9415-a8307941b4b3",
    "name": "أحمد محمد",
    "phone": "01012345678",
    ...
  }
}
```

---

### 3. سحب مواعيد اليوم
```
GET http://localhost:3001/api/appointments/today
```

---

### 4. سحب المواعيد في فترة معينة
```
GET http://localhost:3001/api/appointments/range?start=2026-02-01&end=2026-02-28
```

---

### 5. إنشاء موعد جديد
```
POST http://localhost:3001/api/appointments/create
```

**Body (JSON):**
```json
{
  "patient_id": "23d9c029-73e0-47da-9415-a8307941b4b3",
  "appointment_date": "2026-02-15T10:00:00Z",
  "treatment_type": "كشف",
  "notes": "موعد متابعة"
}
```

---

### 6. سحب الزيارات غير المدفوعة
```
GET http://localhost:3001/api/visits/unpaid
```

---

### 7. إحصائيات يومية
```
GET http://localhost:3001/api/statistics/daily
```

---

### 8. Webhook لاستقبال بيانات من n8n
```
POST http://localhost:3001/api/webhook/n8n
```

---

## 🚀 كيفية تشغيل الـ API Server

### الطريقة 1️⃣: تشغيل يدوي

```bash
cd dental-clinic-app/server
npm install
npm start
```

### الطريقة 2️⃣: وضع التطوير (مع auto-reload)

```bash
cd dental-clinic-app/server
npm run dev
```

### ✅ تأكيد التشغيل

ستظهر لك هذه الرسالة:
```
🚀 Dental Clinic API Server running on port 3001
📍 http://localhost:3001

Available endpoints:
  GET  /api/health
  GET  /api/patients - Get all patients (for n8n)
  GET  /api/patients/:id
  GET  /api/appointments/today
  ...
```

---

## 🔒 CORS Settings

الـ API مُعد بالفعل مع **CORS enabled** بشكل افتراضي، مما يعني:

✅ يمكن الوصول إليه من أي مصدر (n8n, Postman, المتصفح)  
✅ يدعم جميع الـ Methods (GET, POST, PUT, DELETE)  
✅ لا توجد قيود على الـ Headers  

---

## 📝 ملاحظات مهمة

### 1. البورت (Port)
- البورت الافتراضي: **3001**
- إذا كان مشغول، يمكن تغييره في ملف `.env`:
  ```
  PORT=3002
  ```

### 2. قاعدة البيانات
- الـ API يتصل مباشرة بـ **Supabase**
- تأكد من وجود ملف `.env` في مجلد `server`:
  ```env
  SUPABASE_URL=https://dnzuljmguutvummtwljj.supabase.co
  SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  PORT=3001
  ```

### 3. الأمان
⚠️ **هام:** هذا الـ API مُعد للاستخدام المحلي فقط (localhost)

للاستخدام في بيئة الإنتاج:
- أضف Authentication (JWT, API Keys)
- استخدم HTTPS
- حدد CORS لنطاقات محددة فقط
- أضف Rate Limiting

---

## 🎯 مثال عملي: Workflow في n8n

### السيناريو: إرسال رسالة واتساب لكل المرضى

```
1. [HTTP Request] → سحب جميع المرضى من API
   URL: http://localhost:3001/api/patients
   
2. [Split In Batches] → تقسيم المرضى لدفعات

3. [Function] → تجهيز رسالة مخصصة
   return {
     phone: item.phone,
     message: `مرحباً ${item.name}، نذكرك بموعدك القادم`
   }

4. [HTTP Request] → إرسال رسالة واتساب (Evolution API)
   URL: http://localhost:8080/message/sendText/dental_clinic
   Body: { number: {{$json.phone}}, text: {{$json.message}} }
```

---

## 📞 الرابط المطلوب لـ n8n

### 🔗 استخدم هذا الرابط في n8n:

```
http://localhost:3001/api/patients
```

### ✅ الاختبار

يمكنك اختبار الرابط في المتصفح مباشرة:
```
http://localhost:3001/api/patients
```

أو باستخدام cURL:
```bash
curl http://localhost:3001/api/patients
```

أو PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/patients" -Method Get
```

---

## 🎉 الخلاصة

✅ **تم إنشاء API بنجاح**  
✅ **CORS مفعّل للربط مع n8n**  
✅ **البيانات بتنسيق JSON جدولي (Array of Objects)**  
✅ **جاهز للاستخدام الفوري**  

**الرابط:** `http://localhost:3001/api/patients`

---

## 📚 موارد إضافية

- [n8n Documentation](https://docs.n8n.io/)
- [Supabase API Reference](https://supabase.com/docs/reference/javascript)
- [Express.js Guide](https://expressjs.com/)

---

**تم التنفيذ بنجاح! المشروع جاهز للربط مع n8n 🚀💙**

# 📚 دليل API Endpoints - نظام إدارة العيادة

## 🔗 Base URL
```
http://localhost:3001
```

---

## 📋 جدول المحتويات
1. [AI Agent APIs](#ai-agent-apis) 🤖 **جديد**
2. [Health Check](#health-check)
3. [Patients APIs](#patients-apis)
4. [Appointments APIs](#appointments-apis)
5. [Visits APIs](#visits-apis)
6. [Statistics APIs](#statistics-apis)
7. [Webhooks](#webhooks)

---

## 🤖 AI Agent APIs

### POST `/api/ai/get-patient`
البحث عن مريض باستخدام رقم الهاتف - للمساعد الذكي

**Request Body:**
```json
{
  "phone": "01234567890"
}
```

**Response (Found):**
```json
{
  "success": true,
  "found": true,
  "patient": {
    "id": 1,
    "name": "أحمد محمد",
    "phone": "01234567890",
    "email": "ahmed@example.com",
    "medical_history": "..."
  },
  "message_ar": "مرحباً أحمد محمد! وجدنا ملفك في النظام."
}
```

**Response (Not Found):**
```json
{
  "success": true,
  "found": false,
  "message": "No patient found with this phone number",
  "message_ar": "لم يتم العثور على مريض بهذا الرقم"
}
```

---

### POST `/api/ai/check-availability`
التحقق من توفر موعد معين

**Request Body:**
```json
{
  "date": "2024-02-20",
  "time": "14:30"
}
```

**Response (Available):**
```json
{
  "success": true,
  "available": true,
  "date": "2024-02-20",
  "time": "14:30",
  "message": "This time slot is available",
  "message_ar": "هذا الموعد متاح"
}
```

**Response (Not Available):**
```json
{
  "success": true,
  "available": false,
  "date": "2024-02-20",
  "time": "14:30",
  "message": "This time slot is already taken",
  "message_ar": "هذا الموعد محجوز بالفعل",
  "nextAvailable": {
    "date": "2024-02-20",
    "time": "15:00",
    "message_ar": "الموعد القريب المتاح هو الساعة 15:00"
  }
}
```

**Validation:**
- Date format: `YYYY-MM-DD`
- Time format: `HH:mm` (24-hour)
- Working hours: 09:00 - 18:00
- Slot duration: 30 minutes

---

### POST `/api/ai/book-appointment`
حجز موعد لمريض موجود

**Request Body:**
```json
{
  "phone": "01234567890",
  "date": "2024-02-20",
  "time": "14:30",
  "notes": "فحص دوري"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "message_ar": "تم حجز موعدك بنجاح يا أحمد محمد! نتطلع لرؤيتك يوم 2024-02-20 الساعة 14:30",
  "appointment": {
    "id": 123,
    "patient_name": "أحمد محمد",
    "date": "2024-02-20",
    "time": "14:30",
    "status": "scheduled"
  }
}
```

**Response (Patient Not Found - 404):**
```json
{
  "success": false,
  "error": "Patient not found. Please create patient first.",
  "error_ar": "المريض غير موجود. يرجى إنشاء ملف المريض أولاً"
}
```

**Response (Slot Not Available - 409):**
```json
{
  "success": false,
  "error": "This time slot is no longer available",
  "error_ar": "هذا الموعد لم يعد متاحاً"
}
```

---

## Health Check

### GET `/api/health`
فحص حالة السيرفر

**Response:**
```json
{
  "status": "ok",
  "message": "Dental Clinic API is running"
}
```

---

## Patients APIs

### 1. GET `/api/patients`
الحصول على جميع المرضى

**Response:**
```json
{
  "success": true,
  "count": 10,
  "patients": [
    {
      "id": "uuid",
      "name": "محمد أحمد",
      "phone": "0501234567",
      "email": "mohammed@example.com",
      "date_of_birth": "1990-01-01",
      "gender": "ذكر",
      "medical_history": "...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### 2. GET `/api/patients/:id`
الحصول على مريض محدد

**Parameters:**
- `id` (UUID) - معرف المريض

**Response:**
```json
{
  "success": true,
  "patient": {
    "id": "uuid",
    "name": "محمد أحمد",
    "phone": "0501234567",
    ...
  }
}
```

---

### 3. POST `/api/create-patient` ⭐ جديد
إضافة مريض جديد (للمساعد الذكي)

**Request Body:**
```json
{
  "name": "محمد أحمد",
  "phone": "0501234567"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Patient created successfully",
  "message_ar": "تم إضافة المريض بنجاح",
  "patient": {
    "id": "uuid",
    "name": "محمد أحمد",
    "phone": "0501234567",
    "created_at": "2024-02-14T10:30:00Z"
  }
}
```

**Error Responses:**
- `400` - بيانات ناقصة
- `409` - مريض موجود مسبقاً بنفس رقم الهاتف
- `500` - خطأ في السيرفر

---

## Appointments APIs

### 1. GET `/api/appointments/today`
الحصول على مواعيد اليوم

**Response:**
```json
{
  "success": true,
  "count": 5,
  "appointments": [
    {
      "id": "uuid",
      "patient_id": "uuid",
      "appointment_date": "2024-02-14T10:00:00Z",
      "duration": 30,
      "status": "scheduled",
      "notes": "فحص دوري",
      "patient": {
        "id": "uuid",
        "name": "محمد أحمد",
        "phone": "0501234567"
      }
    }
  ]
}
```

---

### 2. GET `/api/appointments/range`
الحصول على مواعيد في فترة معينة

**Query Parameters:**
- `start` (ISO Date) - تاريخ البداية
- `end` (ISO Date) - تاريخ النهاية

**Example:**
```
GET /api/appointments/range?start=2024-02-01&end=2024-02-28
```

**Response:**
```json
{
  "success": true,
  "count": 20,
  "appointments": [...]
}
```

---

### 3. POST `/api/appointments/create`
إنشاء موعد جديد

**Request Body:**
```json
{
  "patient_id": "uuid",
  "appointment_date": "2024-02-15T10:00:00Z",
  "duration": 30,
  "notes": "فحص دوري"
}
```

**Response:**
```json
{
  "success": true,
  "appointment": {
    "id": "uuid",
    "patient_id": "uuid",
    "appointment_date": "2024-02-15T10:00:00Z",
    "duration": 30,
    "status": "scheduled",
    "notes": "فحص دوري"
  }
}
```

---

## Visits APIs

### GET `/api/visits/unpaid`
الحصول على الزيارات غير المدفوعة

**Response:**
```json
{
  "success": true,
  "count": 3,
  "totalUnpaid": 1500,
  "visits": [
    {
      "id": "uuid",
      "patient_id": "uuid",
      "visit_date": "2024-02-10T14:00:00Z",
      "diagnosis": "تنظيف أسنان",
      "treatment": "تنظيف",
      "cost": 500,
      "paid": false,
      "patient": {
        "id": "uuid",
        "name": "محمد أحمد",
        "phone": "0501234567"
      }
    }
  ]
}
```

---

## Statistics APIs

### GET `/api/statistics/daily`
إحصائيات يومية

**Response:**
```json
{
  "success": true,
  "date": "2024-02-14T00:00:00Z",
  "statistics": {
    "totalPatients": 100,
    "todayAppointments": 8,
    "todayVisits": 5,
    "todayRevenue": 2500,
    "appointmentsByStatus": {
      "scheduled": 3,
      "confirmed": 2,
      "completed": 2,
      "cancelled": 1
    }
  }
}
```

---

## Webhooks

### POST `/api/webhook/n8n`
استقبال البيانات من n8n

**Request Body:**
```json
{
  "event": "patient_created",
  "data": {...}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook received successfully",
  "receivedData": {...}
}
```

---

## 🔒 ملاحظات الأمان

1. جميع البيانات يتم التحقق منها قبل الإدخال
2. يتم استخدام `.trim()` لتنظيف البيانات
3. يتم التحقق من عدم التكرار في أرقام الهواتف
4. جميع التواريخ بصيغة ISO 8601

---

## 📝 أمثلة استخدام في n8n

### إضافة مريض جديد:
```
HTTP Request Node
- Method: POST
- URL: http://localhost:3001/api/create-patient
- Body: {"name": "{{ $json.name }}", "phone": "{{ $json.phone }}"}
```

### الحصول على مواعيد اليوم:
```
HTTP Request Node
- Method: GET
- URL: http://localhost:3001/api/appointments/today
```

### إنشاء موعد جديد:
```
HTTP Request Node
- Method: POST
- URL: http://localhost:3001/api/appointments/create
- Body: {
    "patient_id": "{{ $json.patient.id }}",
    "appointment_date": "{{ $json.date }}",
    "duration": 30
  }
```

---

## 🚀 بدء الاستخدام

1. **تشغيل السيرفر:**
   ```bash
   cd server
   npm install
   npm start
   ```

2. **التأكد من قاعدة البيانات:**
   - نفذ `supabase_setup.sql` في Supabase SQL Editor

3. **اختبار الاتصال:**
   ```bash
   curl http://localhost:3001/api/health
   ```

---

**تاريخ آخر تحديث:** 14 فبراير 2024

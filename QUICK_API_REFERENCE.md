# 🚀 مرجع سريع - API إضافة مريض جديد

## معلومات الـ API

**الرابط:**
```
http://localhost:3001/api/create-patient
```

**الطريقة:** `POST`

**Content-Type:** `application/json`

---

## 📋 JSON المطلوب

```json
{
  "name": "محمد أحمد",
  "phone": "0501234567"
}
```

---

## ✅ الرد عند النجاح (201)

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

## ❌ الرد عند الخطأ

### بيانات ناقصة (400)
```json
{
  "success": false,
  "error": "Name and phone are required",
  "error_ar": "الاسم والهاتف مطلوبان"
}
```

### مريض موجود مسبقاً (409)
```json
{
  "success": false,
  "error": "Patient with this phone number already exists",
  "error_ar": "يوجد مريض بهذا الرقم مسبقاً",
  "existingPatient": {
    "id": "...",
    "name": "محمد أحمد",
    "phone": "0501234567"
  }
}
```

---

## 🔧 استخدام في n8n

### عقدة HTTP Request:
- **Method:** POST
- **URL:** `http://localhost:3001/api/create-patient`
- **Body Content Type:** JSON
- **JSON Body:**
  ```json
  {
    "name": "{{ $json.patientName }}",
    "phone": "{{ $json.patientPhone }}"
  }
  ```

---

## 🧪 اختبار سريع

### PowerShell:
```powershell
$body = @{
    name = "محمد أحمد"
    phone = "0501234567"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/create-patient" -Method Post -Body $body -ContentType "application/json"
```

### cURL:
```bash
curl -X POST http://localhost:3001/api/create-patient \
  -H "Content-Type: application/json" \
  -d '{"name":"محمد أحمد","phone":"0501234567"}'
```

---

## ⚠️ ملاحظات مهمة

1. ✅ **تأكد من تشغيل السيرفر:**
   ```bash
   cd server
   npm start
   ```

2. ✅ **تأكد من وجود جدول patients في Supabase**
   - افتح Supabase SQL Editor
   - نفذ محتوى ملف `supabase_setup.sql`

3. ✅ **تأكد من ملف `.env` في مجلد server**

---

للمزيد من التفاصيل، راجع: **API_CREATE_PATIENT_AR.md**

# 🤖 دليل إعداد مساعد الاستقبال الذكي - AI Receptionist Setup Guide

## نظرة عامة - Overview

هذا الدليل يشرح كيفية إعداد مساعد الاستقبال الذكي الذي يعمل على الواتساب لحجز المواعيد تلقائياً.

This guide explains how to set up the AI receptionist that works on WhatsApp to automatically book appointments.

---

## 🎯 وظائف المساعد الذكي - AI Agent Functions

المساعد الذكي يعمل كموظف استقبال محترف ويقوم بـ:

1. **التعرف على المريض** - يطلب رقم الهاتف ويبحث في قاعدة البيانات
2. **التحقق من المواعيد** - يتحقق من توفر الموعد المطلوب
3. **حجز الموعد** - يقوم بحجز الموعد تلقائياً بعد التأكيد

---

## 📋 المتطلبات - Prerequisites

قبل البدء، تأكد من تشغيل:

- ✅ Supabase Database
- ✅ Evolution API (WhatsApp)
- ✅ Express API Server (port 3001)
- ✅ n8n Workflow Engine
- ✅ Typebot أو Flowise (للذكاء الاصطناعي)

---

## 🔧 الإعداد - Setup

### 1️⃣ إعداد API Endpoints

تم إضافة 3 API endpoints جديدة للمساعد الذكي:

#### **GET Patient - البحث عن مريض**
```bash
POST http://localhost:3001/api/ai/get-patient
Content-Type: application/json

{
  "phone": "01234567890"
}
```

**Response:**
```json
{
  "success": true,
  "found": true,
  "patient": {
    "id": 1,
    "name": "أحمد محمد",
    "phone": "01234567890",
    "email": "ahmed@example.com"
  },
  "message_ar": "مرحباً أحمد محمد! وجدنا ملفك في النظام."
}
```

#### **Check Availability - التحقق من توفر الموعد**
```bash
POST http://localhost:3001/api/ai/check-availability
Content-Type: application/json

{
  "date": "2024-02-20",
  "time": "14:30"
}
```

**Response - Available:**
```json
{
  "success": true,
  "available": true,
  "date": "2024-02-20",
  "time": "14:30",
  "message_ar": "هذا الموعد متاح"
}
```

**Response - Not Available:**
```json
{
  "success": true,
  "available": false,
  "date": "2024-02-20",
  "time": "14:30",
  "message_ar": "هذا الموعد محجوز بالفعل",
  "nextAvailable": {
    "date": "2024-02-20",
    "time": "15:00",
    "message_ar": "الموعد القريب المتاح هو الساعة 15:00"
  }
}
```

#### **Book Appointment - حجز الموعد**
```bash
POST http://localhost:3001/api/ai/book-appointment
Content-Type: application/json

{
  "phone": "01234567890",
  "date": "2024-02-20",
  "time": "14:30",
  "notes": "فحص دوري"
}
```

**Response:**
```json
{
  "success": true,
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

---

### 2️⃣ تشغيل API Server

```bash
cd server
npm install
node api.js
```

سترى:
```
🚀 Dental Clinic API Server running on port 3001
📍 http://localhost:3001

🤖 AI Agent Tools:
  POST /api/ai/get-patient - Get patient by phone
  POST /api/ai/check-availability - Check appointment slot
  POST /api/ai/book-appointment - Book appointment
```

---

### 3️⃣ إعداد Typebot أو Flowise

#### **Option A: استخدام Typebot**

1. أنشئ Typebot جديد في [typebot.io](https://typebot.io)

2. أضف **System Prompt** التالي:

```
Role: You are a smart medical receptionist for a Dental Clinic. Your goal is to book appointments with the least amount of friction.

Instructions:

1. Identify Patient: Always start by asking for the patient's phone number. Use the get-patient tool to check if they have an existing file. If found, greet them by their name.

2. Check Slot: When the patient suggests a date and time (e.g., "Tomorrow at 5 PM"), you MUST first use the check-availability tool.
   - If the slot is Available: Proceed to the next step.
   - If the slot is Taken: Inform the patient and suggest the next closest available time.

3. Book Appointment: Only after confirming availability and having the patient's phone number, use the book-appointment tool to finalize the booking.

4. Conciseness: Be professional, brief, and helpful. Do not ask for information you already have.

Data Formatting:
- Dates should be in YYYY-MM-DD format.
- Times should be in HH:mm format.
```

3. أضف **Tools/Functions** الثلاثة:

**Tool 1: get-patient**
- Name: `get-patient`
- Description: Get patient information by phone number
- Endpoint: `http://localhost:3001/api/ai/get-patient`
- Parameters:
  - `phone` (string, required): Patient's phone number

**Tool 2: check-availability**
- Name: `check-availability`
- Description: Check if an appointment slot is available
- Endpoint: `http://localhost:3001/api/ai/check-availability`
- Parameters:
  - `date` (string, required): Date in YYYY-MM-DD format
  - `time` (string, required): Time in HH:mm format

**Tool 3: book-appointment**
- Name: `book-appointment`
- Description: Book an appointment for a patient
- Endpoint: `http://localhost:3001/api/ai/book-appointment`
- Parameters:
  - `phone` (string, required): Patient's phone number
  - `date` (string, required): Date in YYYY-MM-DD format
  - `time` (string, required): Time in HH:mm format
  - `notes` (string, optional): Optional notes

4. احصل على API URL و API Key

#### **Option B: استخدام Flowise**

1. أنشئ Chatflow جديد في Flowise

2. استخدم **ChatOpenAI** أو **ChatAnthropic** node

3. أضف **System Message** مع نفس الـ prompt أعلاه

4. أضف **Tool Agent** واربطه بالـ API endpoints

5. احصل على Webhook URL

---

### 4️⃣ إعداد n8n Workflow

1. افتح n8n: `http://localhost:5678`

2. استورد workflow من:
   ```
   n8n-workflows/ai-receptionist-workflow.json
   ```

3. عدّل الإعدادات:

   **في Node "Call AI Agent":**
   - URL: ضع رابط Typebot/Flowise الخاص بك
   - API Key: ضع مفتاح API الخاص بك

   **في Node "Send WhatsApp Response":**
   - API Key: ضع مفتاح Evolution API الخاص بك

4. احفظ وفعّل الـ workflow

5. انسخ الـ Webhook URL (سيكون مثل):
   ```
   https://your-n8n.com/webhook/ai-receptionist
   ```

---

### 5️⃣ ربط Evolution API بـ n8n

في Evolution API، قم بإعداد webhook للرسائل الواردة:

```bash
POST http://localhost:8080/webhook/set/dental_clinic
Content-Type: application/json
apikey: YOUR_EVOLUTION_API_KEY

{
  "url": "https://your-n8n.com/webhook/ai-receptionist",
  "webhook_by_events": true,
  "events": [
    "messages.upsert"
  ]
}
```

---

### 6️⃣ إعداد ملف `.env`

أضف في ملف `.env`:

```env
# AI Agent Configuration
VITE_AI_AGENT_URL=your_typebot_or_flowise_url_here
VITE_AI_AGENT_API_KEY=your_ai_agent_api_key_here
VITE_AI_AGENT_TYPE=typebot
```

---

## 🧪 اختبار النظام - Testing

### Test 1: البحث عن مريض موجود

أرسل رسالة واتساب:
```
مرحباً، أريد حجز موعد
```

المساعد:
```
مرحباً! يسعدني مساعدتك. ما هو رقم هاتفك؟
```

أنت:
```
01234567890
```

المساعد:
```
مرحباً أحمد محمد! وجدنا ملفك في النظام. متى تريد الموعد؟
```

### Test 2: التحقق من موعد متاح

أنت:
```
غداً الساعة 2 مساءً
```

المساعد:
```
جاري التحقق من توفر الموعد...
✅ الموعد متاح! هل تريد تأكيد الحجز؟
```

### Test 3: حجز الموعد

أنت:
```
نعم
```

المساعد:
```
✅ تم حجز موعدك بنجاح يا أحمد محمد!
📅 التاريخ: 2024-02-20
🕐 الوقت: 14:00
نتطلع لرؤيتك!
```

---

## 📊 مراقبة الأداء - Monitoring

### في n8n:
- تابع Executions لرؤية جميع المحادثات
- راقب الأخطاء في Error Workflow

### في Supabase:
- راجع جدول `appointments` للتأكد من الحجوزات
- راجع جدول `patients` للمرضى الجدد

### في Evolution API:
- راجع logs الرسائل المرسلة والمستقبلة

---

## 🔒 الأمان - Security

### ✅ Best Practices:

1. **حماية API Endpoints**
   ```javascript
   // أضف Authentication في server/api.js
   app.use('/api/ai/*', (req, res, next) => {
     const apiKey = req.headers['x-api-key']
     if (apiKey !== process.env.AI_AGENT_API_KEY) {
       return res.status(401).json({ error: 'Unauthorized' })
     }
     next()
   })
   ```

2. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   ```

3. **Validate Input**
   - تحقق من صحة أرقام الهواتف
   - تحقق من صحة التواريخ
   - منع SQL Injection

---

## 🐛 حل المشاكل - Troubleshooting

### المشكلة: المساعد لا يرد

**الحل:**
1. تحقق من أن API Server يعمل على port 3001
2. تحقق من أن n8n workflow مفعّل
3. تحقق من Evolution API webhook settings

### المشكلة: Tools لا تعمل

**الحل:**
1. تحقق من الـ URLs في Typebot/Flowise
2. تحقق من أن API endpoints تستجيب:
   ```bash
   curl -X POST http://localhost:3001/api/ai/get-patient \
     -H "Content-Type: application/json" \
     -d '{"phone":"01234567890"}'
   ```

### المشكلة: الموعد لا يُحجز

**الحل:**
1. تحقق من Supabase connection
2. تحقق من صلاحيات الجداول
3. راجع logs في n8n

---

## 📈 تطوير مستقبلي - Future Enhancements

- [ ] دعم اللغة العربية الكاملة في المحادثات
- [ ] إضافة تذكيرات تلقائية قبل الموعد
- [ ] إمكانية إلغاء/تعديل المواعيد
- [ ] ربط مع Google Calendar
- [ ] تقارير أداء المساعد الذكي
- [ ] دعم الرسائل الصوتية

---

## 📞 الدعم - Support

إذا واجهت أي مشاكل:
1. راجع [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. راجع logs في n8n و API Server
3. تحقق من [Evolution API Documentation](https://doc.evolution-api.com/)

---

## 🎉 مبروك!

أصبح لديك الآن مساعد استقبال ذكي يعمل 24/7 على الواتساب! 🤖✨

---

**Created:** 2024-02-15  
**Version:** 1.0.0  
**Author:** Dental Clinic Management System

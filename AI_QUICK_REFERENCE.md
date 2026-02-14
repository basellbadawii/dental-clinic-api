# 🤖 AI Agent Quick Reference - مرجع سريع للمساعد الذكي

## 🎯 System Prompt (Copy-Paste Ready)

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

---

## 🛠️ Tools Configuration

### Tool 1: get-patient
```json
{
  "name": "get-patient",
  "description": "Get patient information by phone number",
  "url": "http://localhost:3001/api/ai/get-patient",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "Patient's phone number"
      }
    },
    "required": ["phone"]
  }
}
```

### Tool 2: check-availability
```json
{
  "name": "check-availability",
  "description": "Check if an appointment slot is available",
  "url": "http://localhost:3001/api/ai/check-availability",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format"
      },
      "time": {
        "type": "string",
        "description": "Time in HH:mm format (24-hour)"
      }
    },
    "required": ["date", "time"]
  }
}
```

### Tool 3: book-appointment
```json
{
  "name": "book-appointment",
  "description": "Book an appointment for a patient",
  "url": "http://localhost:3001/api/ai/book-appointment",
  "method": "POST",
  "parameters": {
    "type": "object",
    "properties": {
      "phone": {
        "type": "string",
        "description": "Patient's phone number"
      },
      "date": {
        "type": "string",
        "description": "Date in YYYY-MM-DD format"
      },
      "time": {
        "type": "string",
        "description": "Time in HH:mm format"
      },
      "notes": {
        "type": "string",
        "description": "Optional notes"
      }
    },
    "required": ["phone", "date", "time"]
  }
}
```

---

## 🚀 Quick Setup Steps

### 1. Start API Server
```bash
cd server
node api.js
```

### 2. Configure AI Agent (Typebot/Flowise)
1. Copy System Prompt above
2. Add 3 tools with configurations above
3. Get API URL and API Key

### 3. Import n8n Workflow
```bash
n8n-workflows/ai-receptionist-workflow.json
```

### 4. Set Evolution Webhook
```bash
POST http://localhost:8080/webhook/set/dental_clinic
{
  "url": "YOUR_N8N_WEBHOOK_URL",
  "events": ["messages.upsert"]
}
```

---

## 🧪 Test Commands

```bash
# Test 1: Get Patient
curl -X POST http://localhost:3001/api/ai/get-patient \
  -H "Content-Type: application/json" \
  -d '{"phone":"01234567890"}'

# Test 2: Check Availability
curl -X POST http://localhost:3001/api/ai/check-availability \
  -H "Content-Type: application/json" \
  -d '{"date":"2024-12-25","time":"14:30"}'

# Test 3: Book Appointment
curl -X POST http://localhost:3001/api/ai/book-appointment \
  -H "Content-Type: application/json" \
  -d '{"phone":"01234567890","date":"2024-12-25","time":"14:30"}'
```

---

## 📱 Environment Variables

Add to `.env`:
```env
# AI Agent Configuration
VITE_AI_AGENT_URL=your_typebot_or_flowise_url_here
VITE_AI_AGENT_API_KEY=your_ai_agent_api_key_here
VITE_AI_AGENT_TYPE=typebot
```

---

## 🔍 Common Issues

| Problem | Solution |
|---------|----------|
| Tools not working | Check API server is running on port 3001 |
| Date format error | Use YYYY-MM-DD (e.g., 2024-02-20) |
| Time format error | Use HH:mm in 24-hour format (e.g., 14:30) |
| Patient not found | Create patient first using `/api/create-patient` |
| Slot not available | AI should suggest next available time |

---

## 📚 Full Documentation

- **Setup Guide**: [AI_RECEPTIONIST_SETUP.md](AI_RECEPTIONIST_SETUP.md)
- **System Prompt**: [AI_AGENT_SYSTEM_PROMPT.md](AI_AGENT_SYSTEM_PROMPT.md)
- **Integration Summary**: [AI_INTEGRATION_SUMMARY.md](AI_INTEGRATION_SUMMARY.md)
- **API Endpoints**: [server/API_ENDPOINTS.md](server/API_ENDPOINTS.md)

---

**Version:** 1.0.0  
**Last Updated:** 2024-02-15

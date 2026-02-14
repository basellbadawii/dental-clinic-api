import axios from 'axios'

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'http://localhost:8080'
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || ''
const INSTANCE_NAME = import.meta.env.VITE_EVOLUTION_INSTANCE_NAME || 'dental_clinic'

const evolutionClient = axios.create({
  baseURL: EVOLUTION_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': EVOLUTION_API_KEY
  }
})

// Send WhatsApp message - exported as named export for compatibility
export const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await evolutionClient.post(`/message/sendText/${INSTANCE_NAME}`, {
      number: phoneNumber.replace(/[^0-9]/g, ''), // Remove non-numeric characters
      textMessage: {
        text: message
      }
    })
    return response.data
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    throw new Error('فشل إرسال الرسالة عبر الواتساب')
  }
}

export const evolutionAPI = {
  // Send text message
  sendMessage: sendWhatsAppMessage,

  // Send appointment reminder
  sendAppointmentReminder: async (phoneNumber, patientName, appointmentDate) => {
    const message = `مرحباً ${patientName}،\n\nنذكركم بموعدكم في عيادة الأسنان:\n📅 التاريخ: ${appointmentDate}\n\nنتطلع لرؤيتكم.\n\nعيادة الأسنان`
    
    return await evolutionAPI.sendMessage(phoneNumber, message)
  },

  // Send payment reminder
  sendPaymentReminder: async (phoneNumber, patientName, amount) => {
    const message = `مرحباً ${patientName}،\n\nنذكركم بوجود مبلغ متبقي:\n💰 المبلغ: ${amount} ج.م\n\nيرجى التواصل معنا لسداد المبلغ.\n\nعيادة الأسنان`
    
    return await evolutionAPI.sendMessage(phoneNumber, message)
  },

  // Send visit confirmation
  sendVisitConfirmation: async (phoneNumber, patientName, service, cost) => {
    const message = `مرحباً ${patientName}،\n\nشكراً لزيارتكم عيادتنا.\n\n🦷 الخدمة: ${service}\n💵 التكلفة: ${cost} ج.م\n\nنتمنى لكم السلامة.\n\nعيادة الأسنان`
    
    return await evolutionAPI.sendMessage(phoneNumber, message)
  },

  // Check instance status
  getInstanceStatus: async () => {
    try {
      const response = await evolutionClient.get(`/instance/connectionState/${INSTANCE_NAME}`)
      return response.data
    } catch (error) {
      console.error('Error checking instance status:', error)
      return null
    }
  }
}

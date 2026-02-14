import axios from 'axios'

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || ''

export const n8nAPI = {
  // Send appointment data to n8n
  sendAppointmentData: async (appointmentData) => {
    if (!N8N_WEBHOOK_URL) {
      console.warn('N8N Webhook URL not configured')
      return
    }

    try {
      const response = await axios.post(N8N_WEBHOOK_URL, {
        event: 'appointment_created',
        data: appointmentData,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error sending data to n8n:', error)
      throw error
    }
  },

  // Send reminder trigger to n8n
  triggerReminder: async (appointmentId, patientData, appointmentDate) => {
    if (!N8N_WEBHOOK_URL) {
      console.warn('N8N Webhook URL not configured')
      return
    }

    try {
      const response = await axios.post(N8N_WEBHOOK_URL, {
        event: 'send_reminder',
        data: {
          appointmentId,
          patient: patientData,
          appointmentDate
        },
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error triggering reminder:', error)
      throw error
    }
  },

  // Send daily summary to n8n
  sendDailySummary: async (summaryData) => {
    if (!N8N_WEBHOOK_URL) {
      console.warn('N8N Webhook URL not configured')
      return
    }

    try {
      const response = await axios.post(N8N_WEBHOOK_URL, {
        event: 'daily_summary',
        data: summaryData,
        timestamp: new Date().toISOString()
      })
      return response.data
    } catch (error) {
      console.error('Error sending daily summary:', error)
      throw error
    }
  }
}

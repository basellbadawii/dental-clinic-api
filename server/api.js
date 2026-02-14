/**
 * Express API Server for n8n Integration
 * This server provides REST API endpoints that n8n can call
 */

import express from 'express'
import cors from 'cors'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Dental Clinic API is running' })
})

// Get today's appointments for n8n
app.get('/api/appointments/today', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*)
      `)
      .gte('appointment_date', today.toISOString())
      .lt('appointment_date', tomorrow.toISOString())
      .order('appointment_date', { ascending: true })

    if (error) throw error

    res.json({
      success: true,
      count: data.length,
      appointments: data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get appointments by date range
app.get('/api/appointments/range', async (req, res) => {
  try {
    const { start, end } = req.query

    if (!start || !end) {
      return res.status(400).json({
        success: false,
        error: 'Start and end dates are required'
      })
    }

    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*)
      `)
      .gte('appointment_date', start)
      .lte('appointment_date', end)
      .order('appointment_date', { ascending: true })

    if (error) throw error

    res.json({
      success: true,
      count: data.length,
      appointments: data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get all patients (for n8n integration)
app.get('/api/patients', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Format data for n8n - select only needed fields
    const formattedData = data.map(patient => ({
      id: patient.id,
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      date_of_birth: patient.date_of_birth || patient.birth_date || null,
      gender: patient.gender,
      medical_history: patient.medical_history,
      created_at: patient.created_at
    }))

    res.json({
      success: true,
      count: formattedData.length,
      patients: formattedData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get patient by ID
app.get('/api/patients/:id', async (req, res) => {
  try {
    const { id } = req.params

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    res.json({
      success: true,
      patient: data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Create new patient (for n8n/Assistant)
app.post('/api/create-patient', async (req, res) => {
  try {
    const { name, phone } = req.body

    // Validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone are required',
        error_ar: 'الاسم والهاتف مطلوبان'
      })
    }

    // Check if patient with same phone already exists
    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id, name, phone')
      .eq('phone', phone)
      .maybeSingle()

    if (existingPatient) {
      return res.status(409).json({
        success: false,
        error: 'Patient with this phone number already exists',
        error_ar: 'يوجد مريض بهذا الرقم مسبقاً',
        existingPatient: {
          id: existingPatient.id,
          name: existingPatient.name,
          phone: existingPatient.phone
        }
      })
    }

    // Create new patient
    const { data, error } = await supabase
      .from('patients')
      .insert([{
        name: name.trim(),
        phone: phone.trim()
      }])
      .select()
      .single()

    if (error) throw error

    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      message_ar: 'تم إضافة المريض بنجاح',
      patient: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        created_at: data.created_at
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      error_ar: 'حدث خطأ في إضافة المريض'
    })
  }
})

// Create appointment (for n8n)
app.post('/api/appointments/create', async (req, res) => {
  try {
    const { patient_id, appointment_date, duration, notes } = req.body

    if (!patient_id || !appointment_date) {
      return res.status(400).json({
        success: false,
        error: 'patient_id and appointment_date are required'
      })
    }

    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        patient_id,
        appointment_date,
        duration: duration || 30,
        status: 'scheduled',
        notes
      }])
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      appointment: data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get unpaid visits
app.get('/api/visits/unpaid', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        patient:patients(*)
      `)
      .eq('paid', false)
      .order('visit_date', { ascending: false })

    if (error) throw error

    const totalUnpaid = data.reduce((sum, visit) => sum + (visit.cost || 0), 0)

    res.json({
      success: true,
      count: data.length,
      totalUnpaid,
      visits: data
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get statistics (for n8n daily reports)
app.get('/api/statistics/daily', async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Get today's appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', today.toISOString())
      .lt('appointment_date', tomorrow.toISOString())

    // Get today's visits
    const { data: visits } = await supabase
      .from('visits')
      .select('*')
      .gte('visit_date', today.toISOString())
      .lt('visit_date', tomorrow.toISOString())

    // Get total patients
    const { count: totalPatients } = await supabase
      .from('patients')
      .select('*', { count: 'exact', head: true })

    const todayRevenue = visits?.reduce((sum, v) => sum + (v.cost || 0), 0) || 0

    res.json({
      success: true,
      date: today.toISOString(),
      statistics: {
        totalPatients,
        todayAppointments: appointments?.length || 0,
        todayVisits: visits?.length || 0,
        todayRevenue,
        appointmentsByStatus: {
          scheduled: appointments?.filter(a => a.status === 'scheduled').length || 0,
          confirmed: appointments?.filter(a => a.status === 'confirmed').length || 0,
          completed: appointments?.filter(a => a.status === 'completed').length || 0,
          cancelled: appointments?.filter(a => a.status === 'cancelled').length || 0
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// ==========================================
// AI AGENT ENDPOINTS (for Typebot/Flowise)
// ==========================================

// Tool 1: Get Patient by Phone Number
app.post('/api/ai/get-patient', async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: 'Phone number is required',
        error_ar: 'رقم الهاتف مطلوب'
      })
    }

    // Clean phone number (remove spaces, dashes, etc.)
    const cleanPhone = phone.replace(/[^0-9+]/g, '')

    const { data, error } = await supabase
      .from('patients')
      .select('id, name, phone, email, medical_history, created_at')
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (error) throw error

    if (!data) {
      return res.json({
        success: true,
        found: false,
        message: 'No patient found with this phone number',
        message_ar: 'لم يتم العثور على مريض بهذا الرقم'
      })
    }

    res.json({
      success: true,
      found: true,
      patient: {
        id: data.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
        medical_history: data.medical_history
      },
      message_ar: `مرحباً ${data.name}! وجدنا ملفك في النظام.`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Tool 2: Check Appointment Availability
app.post('/api/ai/check-availability', async (req, res) => {
  try {
    const { date, time } = req.body

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Date and time are required',
        error_ar: 'التاريخ والوقت مطلوبان'
      })
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(date)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
        error_ar: 'صيغة التاريخ غير صحيحة. استخدم YYYY-MM-DD'
      })
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid time format. Use HH:mm (24-hour format)',
        error_ar: 'صيغة الوقت غير صحيحة. استخدم HH:mm'
      })
    }

    // Combine date and time into ISO timestamp
    const appointmentDateTime = new Date(`${date}T${time}:00`)

    // Check if there's already an appointment at this time
    const { data: existingAppointments, error } = await supabase
      .from('appointments')
      .select('id, appointment_date, patient_id, status')
      .eq('appointment_date', appointmentDateTime.toISOString())
      .neq('status', 'cancelled')

    if (error) throw error

    const isAvailable = !existingAppointments || existingAppointments.length === 0

    if (isAvailable) {
      return res.json({
        success: true,
        available: true,
        date,
        time,
        message: 'This time slot is available',
        message_ar: 'هذا الموعد متاح'
      })
    }

    // If not available, suggest next available slot
    // Get all appointments for that day
    const dayStart = new Date(date)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(date)
    dayEnd.setHours(23, 59, 59, 999)

    const { data: dayAppointments } = await supabase
      .from('appointments')
      .select('appointment_date')
      .gte('appointment_date', dayStart.toISOString())
      .lte('appointment_date', dayEnd.toISOString())
      .neq('status', 'cancelled')
      .order('appointment_date', { ascending: true })

    // Working hours: 9 AM to 6 PM, 30-minute slots
    const workStart = 9
    const workEnd = 18
    const slotDuration = 30 // minutes

    let nextAvailableTime = null
    for (let hour = workStart; hour < workEnd; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const slotTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const slotDateTime = new Date(`${date}T${slotTime}:00`)
        
        const isSlotTaken = dayAppointments?.some(apt => {
          const aptDate = new Date(apt.appointment_date)
          return aptDate.getTime() === slotDateTime.getTime()
        })

        if (!isSlotTaken && slotDateTime > appointmentDateTime) {
          nextAvailableTime = slotTime
          break
        }
      }
      if (nextAvailableTime) break
    }

    res.json({
      success: true,
      available: false,
      date,
      time,
      message: 'This time slot is already taken',
      message_ar: 'هذا الموعد محجوز بالفعل',
      nextAvailable: nextAvailableTime ? {
        date,
        time: nextAvailableTime,
        message_ar: `الموعد القريب المتاح هو الساعة ${nextAvailableTime}`
      } : {
        message_ar: 'لا توجد مواعيد متاحة في هذا اليوم'
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Tool 3: Book Appointment
app.post('/api/ai/book-appointment', async (req, res) => {
  try {
    const { phone, date, time, notes } = req.body

    if (!phone || !date || !time) {
      return res.status(400).json({
        success: false,
        error: 'Phone, date, and time are required',
        error_ar: 'رقم الهاتف والتاريخ والوقت مطلوبان'
      })
    }

    // Clean phone number
    const cleanPhone = phone.replace(/[^0-9+]/g, '')

    // Get patient by phone
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('id, name, phone')
      .eq('phone', cleanPhone)
      .maybeSingle()

    if (patientError) throw patientError

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found. Please create patient first.',
        error_ar: 'المريض غير موجود. يرجى إنشاء ملف المريض أولاً'
      })
    }

    // Combine date and time
    const appointmentDateTime = new Date(`${date}T${time}:00`)

    // Double-check availability
    const { data: existingAppointments } = await supabase
      .from('appointments')
      .select('id')
      .eq('appointment_date', appointmentDateTime.toISOString())
      .neq('status', 'cancelled')

    if (existingAppointments && existingAppointments.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'This time slot is no longer available',
        error_ar: 'هذا الموعد لم يعد متاحاً'
      })
    }

    // Create appointment
    const { data: appointment, error: appointmentError } = await supabase
      .from('appointments')
      .insert([{
        patient_id: patient.id,
        appointment_date: appointmentDateTime.toISOString(),
        duration: 30,
        status: 'scheduled',
        notes: notes || null
      }])
      .select()
      .single()

    if (appointmentError) throw appointmentError

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      message_ar: `تم حجز موعدك بنجاح يا ${patient.name}! نتطلع لرؤيتك يوم ${date} الساعة ${time}`,
      appointment: {
        id: appointment.id,
        patient_name: patient.name,
        date,
        time,
        status: appointment.status
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Webhook receiver (for n8n to send data)
app.post('/api/webhook/n8n', async (req, res) => {
  try {
    console.log('Received webhook from n8n:', req.body)
    
    // Process the webhook data here
    // You can trigger actions based on the data received
    
    res.json({
      success: true,
      message: 'Webhook received successfully',
      receivedData: req.body
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dental Clinic API Server running on port ${PORT}`)
  console.log(`📍 http://localhost:${PORT}`)
  console.log(`\nAvailable endpoints:`)
  console.log(`  GET  /api/health`)
  console.log(`  GET  /api/patients - Get all patients (for n8n)`)
  console.log(`  GET  /api/patients/:id`)
  console.log(`  POST /api/create-patient - Create new patient (name & phone only)`)
  console.log(`  GET  /api/appointments/today`)
  console.log(`  GET  /api/appointments/range?start=...&end=...`)
  console.log(`  POST /api/appointments/create`)
  console.log(`  GET  /api/visits/unpaid`)
  console.log(`  GET  /api/statistics/daily`)
  console.log(`  POST /api/webhook/n8n`)
  console.log(`\n🤖 AI Agent Tools:`)
  console.log(`  POST /api/ai/get-patient - Get patient by phone`)
  console.log(`  POST /api/ai/check-availability - Check appointment slot`)
  console.log(`  POST /api/ai/book-appointment - Book appointment`)
})

export default app

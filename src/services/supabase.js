import { createClient } from '@supabase/supabase-js'
import { mockPatients, mockAppointments, mockVisits, mockStats } from '../utils/mockData'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check if Supabase is properly configured
const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key' &&
         supabaseUrl.includes('supabase.co')
}

// Helper to use mock data on error
const withMockFallback = async (apiCall, mockData, errorMessage = 'استخدام البيانات التجريبية') => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using mock data')
    return mockData
  }
  
  try {
    const result = await apiCall()
    // If empty data and mock data available, use mock data
    if ((!result || result.length === 0) && mockData && mockData.length > 0) {
      console.log('Empty data from Supabase, using mock data')
      return mockData
    }
    return result
  } catch (error) {
    console.error('Supabase error:', error)
    console.log(errorMessage)
    return mockData
  }
}

// Patients API
export const patientsAPI = {
  // Get all patients
  getAll: async () => {
    return await withMockFallback(
      async () => {
        const { data, error } = await supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        return data
      },
      mockPatients,
      'تم تحميل مرضى تجريبيين'
    )
  },

  // Get single patient
  getById: async (id) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  // Create patient
  create: async (patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update patient
  update: async (id, patientData) => {
    const { data, error } = await supabase
      .from('patients')
      .update({ ...patientData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete patient
  delete: async (id) => {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Search patients
  search: async (query) => {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }
}

// Appointments API
export const appointmentsAPI = {
  // Get all appointments
  getAll: async () => {
    return await withMockFallback(
      async () => {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients(*)
          `)
          .order('appointment_date', { ascending: true })
        
        if (error) throw error
        return data
      },
      mockAppointments,
      'تم تحميل مواعيد تجريبية'
    )
  },

  // Get today's appointments
  getToday: async () => {
    return await withMockFallback(
      async () => {
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
        return data
      },
      mockAppointments.filter(a => {
        const today = new Date()
        const appointmentDate = new Date(a.appointmentDate)
        return appointmentDate.toDateString() === today.toDateString()
      }),
      'تم تحميل مواعيد اليوم التجريبية'
    )
  },

  // Get appointments by date range
  getByDateRange: async (startDate, endDate) => {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*)
      `)
      .gte('appointment_date', startDate)
      .lte('appointment_date', endDate)
      .order('appointment_date', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Create appointment
  create: async (appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update appointment
  update: async (id, appointmentData) => {
    const { data, error } = await supabase
      .from('appointments')
      .update({ ...appointmentData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete appointment
  delete: async (id) => {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get upcoming appointments (next 7 days)
  getUpcoming: async () => {
    return await withMockFallback(
      async () => {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)

        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:patients(*)
          `)
          .gte('appointment_date', today.toISOString())
          .lte('appointment_date', nextWeek.toISOString())
          .eq('status', 'مجدول')
          .order('appointment_date', { ascending: true })
        
        if (error) throw error
        return data
      },
      mockAppointments.filter(a => {
        const today = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)
        const appointmentDate = new Date(a.appointmentDate)
        return appointmentDate >= today && appointmentDate <= nextWeek
      }),
      'تم تحميل المواعيد القادمة التجريبية'
    )
  }
}

// Visits API
export const visitsAPI = {
  // Get all visits
  getAll: async () => {
    return await withMockFallback(
      async () => {
        const { data, error } = await supabase
          .from('visits')
          .select(`
            *,
            patient:patients(*)
          `)
          .order('visit_date', { ascending: false })
        
        if (error) throw error
        return data
      },
      mockVisits,
      'تم تحميل زيارات تجريبية'
    )
  },

  // Get visits by patient
  getByPatient: async (patientId) => {
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('patient_id', patientId)
      .order('visit_date', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Create visit
  create: async (visitData) => {
    const { data, error } = await supabase
      .from('visits')
      .insert([visitData])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Update visit
  update: async (id, visitData) => {
    const { data, error } = await supabase
      .from('visits')
      .update({ ...visitData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Delete visit
  delete: async (id) => {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  // Get statistics
  getStats: async () => {
    return await withMockFallback(
      async () => {
        const { data: visits, error } = await supabase
          .from('visits')
          .select('cost, paid, visit_date')
        
        if (error) throw error

        // Calculate total revenue
        const totalRevenue = visits.reduce((sum, visit) => sum + (visit.cost || 0), 0)
        const paidRevenue = visits.filter(v => v.paid).reduce((sum, visit) => sum + (visit.cost || 0), 0)
        const unpaidRevenue = totalRevenue - paidRevenue

        // Calculate monthly revenue
        const now = new Date()
        const currentMonth = now.getMonth()
        const currentYear = now.getFullYear()
        
        const monthlyRevenue = visits
          .filter(v => {
            const visitDate = new Date(v.visit_date)
            return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear
          })
          .reduce((sum, visit) => sum + (visit.cost || 0), 0)

        // Calculate last month revenue
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear
        
        const lastMonthRevenue = visits
          .filter(v => {
            const visitDate = new Date(v.visit_date)
            return visitDate.getMonth() === lastMonth && visitDate.getFullYear() === lastMonthYear
          })
          .reduce((sum, visit) => sum + (visit.cost || 0), 0)

        return {
          totalRevenue,
          paidRevenue,
          unpaidRevenue,
          totalVisits: visits.length,
          monthlyRevenue,
          lastMonthRevenue
        }
      },
      {
        totalRevenue: mockVisits.reduce((sum, v) => sum + (v.cost || 0), 0),
        paidRevenue: mockVisits.filter(v => v.paid).reduce((sum, v) => sum + (v.cost || 0), 0),
        unpaidRevenue: mockVisits.filter(v => !v.paid).reduce((sum, v) => sum + (v.cost || 0), 0),
        totalVisits: mockVisits.length,
        monthlyRevenue: 45000,
        lastMonthRevenue: 38000
      },
      'تم تحميل إحصائيات تجريبية'
    )
  }
}

// Users/Auth API
export const authAPI = {
  // Login
  login: async (email, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error) throw new Error('بيانات الدخول غير صحيحة')
    
    // In production, use proper password hashing (bcrypt)
    // This is simplified for demo
    if (data.password_hash === password) {
      return {
        id: data.id,
        email: data.email,
        fullName: data.full_name,
        role: data.role
      }
    } else {
      throw new Error('بيانات الدخول غير صحيحة')
    }
  },

  // Register (for admin use)
  register: async (userData) => {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        password_hash: userData.password, // In production, hash this!
        full_name: userData.fullName,
        role: userData.role || 'doctor'
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

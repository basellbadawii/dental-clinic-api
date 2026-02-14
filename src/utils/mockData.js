// Mock/Dummy Data for Development and Preview
// Used when Supabase is not configured or returns empty data

export const mockPatients = [
  {
    id: 'mock-patient-1',
    name: 'أحمد محمد علي',
    phone: '01012345678',
    email: 'ahmed.mohamed@example.com',
    dateOfBirth: '1990-05-15',
    gender: 'ذكر',
    address: 'القاهرة، مصر الجديدة',
    medicalHistory: 'لا يوجد',
    allergies: 'لا يوجد',
    notes: 'مريض منتظم',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-patient-2',
    name: 'فاطمة حسن إبراهيم',
    phone: '01098765432',
    email: 'fatima.hassan@example.com',
    dateOfBirth: '1985-08-22',
    gender: 'أنثى',
    address: 'الجيزة، المهندسين',
    medicalHistory: 'ضغط دم مرتفع',
    allergies: 'حساسية من البنسلين',
    notes: 'تحتاج متابعة دورية كل 3 أشهر',
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-patient-3',
    name: 'محمود سعيد أحمد',
    phone: '01123456789',
    email: 'mahmoud.saeed@example.com',
    dateOfBirth: '1995-12-10',
    gender: 'ذكر',
    address: 'الإسكندرية، سموحة',
    medicalHistory: 'لا يوجد',
    allergies: 'لا يوجد',
    notes: 'مريض جديد',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-patient-4',
    name: 'نور الدين عبد الرحمن',
    phone: '01234567890',
    email: 'nour.abdulrahman@example.com',
    dateOfBirth: '1988-03-25',
    gender: 'ذكر',
    address: 'القاهرة، مدينة نصر',
    medicalHistory: 'سكري من النوع الثاني',
    allergies: 'لا يوجد',
    notes: 'يحتاج رعاية خاصة بسبب السكري',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-patient-5',
    name: 'سارة أحمد محمود',
    phone: '01156789012',
    email: 'sara.ahmed@example.com',
    dateOfBirth: '1992-07-18',
    gender: 'أنثى',
    address: 'القاهرة، الزمالك',
    medicalHistory: 'لا يوجد',
    allergies: 'حساسية من المضادات الحيوية',
    notes: 'علاج تقويم أسنان',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const mockAppointments = [
  {
    id: 'mock-appointment-1',
    patient_id: 'mock-patient-1',
    patientId: 'mock-patient-1',
    patient: mockPatients[0],
    appointment_date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    appointmentDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    durationMinutes: 30,
    treatment_type: 'فحص دوري',
    treatmentType: 'فحص دوري',
    status: 'scheduled',
    notes: 'فحص عام',
    reminder_sent: false,
    reminderSent: false,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-appointment-2',
    patient_id: 'mock-patient-2',
    patientId: 'mock-patient-2',
    patient: mockPatients[1],
    appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
    appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration: 45,
    durationMinutes: 45,
    treatment_type: 'تنظيف أسنان',
    treatmentType: 'تنظيف أسنان',
    status: 'scheduled',
    notes: 'تنظيف عميق',
    reminder_sent: true,
    reminderSent: true,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-appointment-3',
    patient_id: 'mock-patient-3',
    patientId: 'mock-patient-3',
    patient: mockPatients[2],
    appointment_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 60,
    durationMinutes: 60,
    treatment_type: 'حشو أسنان',
    treatmentType: 'حشو أسنان',
    status: 'completed',
    notes: 'حشو ضرس علوي',
    reminder_sent: true,
    reminderSent: true,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-appointment-4',
    patient_id: 'mock-patient-4',
    patientId: 'mock-patient-4',
    patient: mockPatients[3],
    appointment_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 30,
    durationMinutes: 30,
    treatment_type: 'استشارة',
    treatmentType: 'استشارة',
    status: 'scheduled',
    notes: 'استشارة زراعة أسنان',
    reminder_sent: false,
    reminderSent: false,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'mock-appointment-5',
    patient_id: 'mock-patient-5',
    patientId: 'mock-patient-5',
    patient: mockPatients[4],
    appointment_date: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), // 5 hours from now
    appointmentDate: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    duration: 90,
    durationMinutes: 90,
    treatment_type: 'تقويم أسنان',
    treatmentType: 'تقويم أسنان',
    status: 'scheduled',
    notes: 'جلسة تقويم شهرية',
    reminder_sent: true,
    reminderSent: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const mockVisits = [
  {
    id: 'mock-visit-1',
    patientId: 'mock-patient-1',
    patient: mockPatients[0],
    visitDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: 'تسوس في الضرس الأول العلوي',
    treatment: 'حشو كومبوزيت',
    prescription: 'مسكن ألم عند الحاجة',
    cost: 500,
    paid: true,
    notes: 'العلاج ناجح، موعد متابعة بعد أسبوعين',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-visit-2',
    patientId: 'mock-patient-2',
    patient: mockPatients[1],
    visitDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: 'التهاب اللثة',
    treatment: 'تنظيف عميق وإزالة الجير',
    prescription: 'غسول فم مضاد للبكتيريا',
    cost: 350,
    paid: true,
    notes: 'نصحت المريضة بالعناية اليومية باللثة',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-visit-3',
    patientId: 'mock-patient-3',
    patient: mockPatients[2],
    visitDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: 'كسر جزئي في القاطع الأمامي',
    treatment: 'ترميم الأسنان بالفينير',
    prescription: 'لا يوجد',
    cost: 1200,
    paid: false,
    notes: 'المريض سيدفع في الزيارة القادمة',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-visit-4',
    patientId: 'mock-patient-4',
    patient: mockPatients[3],
    visitDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: 'فقدان ضرس سفلي',
    treatment: 'استشارة زراعة أسنان',
    prescription: 'لا يوجد',
    cost: 0,
    paid: true,
    notes: 'الاستشارة مجانية، سعر الزراعة 8000 جنيه',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'mock-visit-5',
    patientId: 'mock-patient-5',
    patient: mockPatients[4],
    visitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    diagnosis: 'عدم انتظام الأسنان',
    treatment: 'تركيب تقويم معدني',
    prescription: 'شمع طبي للتقويم',
    cost: 3500,
    paid: true,
    notes: 'جلسة شهرية للمتابعة',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
]

// Statistics based on mock data
export const mockStats = {
  totalPatients: mockPatients.length,
  todayAppointments: mockAppointments.filter(a => {
    const today = new Date()
    const appointmentDate = new Date(a.appointmentDate)
    return appointmentDate.toDateString() === today.toDateString()
  }).length,
  monthlyRevenue: mockVisits.reduce((sum, v) => sum + (v.paid ? v.cost : 0), 0),
  pendingPayments: mockVisits.reduce((sum, v) => sum + (!v.paid ? v.cost : 0), 0)
}

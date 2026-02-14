// Format currency in Egyptian Pound (EGP)
export const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0 ج.م'
  return `${parseFloat(amount).toLocaleString('ar-EG')} ج.م`
}

// Format phone number (Egyptian)
export const formatPhoneNumber = (phone) => {
  if (!phone) return ''
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Format as: 01XX XXX XXXX (Egyptian format)
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`
  }
  
  return phone
}

// Validate Egyptian phone number
export const validateEgyptianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, '')
  return /^01[0125]\d{8}$/.test(cleaned)
}

// Format patient ID
export const formatPatientId = (id) => {
  if (!id) return ''
  return `P-${id.slice(0, 8).toUpperCase()}`
}

// Format appointment status
export const formatAppointmentStatus = (status) => {
  const statusMap = {
    scheduled: 'محجوز',
    confirmed: 'مؤكد',
    completed: 'مكتمل',
    cancelled: 'ملغي',
    rescheduled: 'معاد جدولته'
  }
  return statusMap[status] || status
}

// Format service type
export const formatServiceType = (service) => {
  const serviceMap = {
    cleaning: 'تنظيف',
    filling: 'حشو',
    extraction: 'خلع',
    rootcanal: 'علاج جذور',
    crown: 'تاج',
    bridge: 'جسر',
    braces: 'تقويم',
    whitening: 'تبييض',
    checkup: 'كشف',
    other: 'أخرى'
  }
  return serviceMap[service] || service
}

// Get status color
export const getStatusColor = (status) => {
  const colorMap = {
    scheduled: 'bg-blue-100 text-blue-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    cancelled: 'bg-red-100 text-red-800',
    rescheduled: 'bg-yellow-100 text-yellow-800'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

// Sanitize input
export const sanitizeInput = (input) => {
  if (!input) return ''
  return input.trim().replace(/[<>]/g, '')
}

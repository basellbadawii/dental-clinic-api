import { format, parseISO, isToday, isTomorrow, isPast, isFuture } from 'date-fns'
import { ar } from 'date-fns/locale'

// Format date in Arabic
export const formatDateArabic = (date, formatStr = 'dd/MM/yyyy') => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, formatStr, { locale: ar })
}

// Format time in Arabic
export const formatTimeArabic = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'hh:mm a', { locale: ar })
}

// Format full date and time
export const formatDateTimeArabic = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'dd/MM/yyyy - hh:mm a', { locale: ar })
}

// Get relative date (today, tomorrow, etc.)
export const getRelativeDate = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  
  if (isToday(dateObj)) return 'اليوم'
  if (isTomorrow(dateObj)) return 'غداً'
  if (isPast(dateObj)) return 'منتهي'
  if (isFuture(dateObj)) return 'قادم'
  
  return formatDateArabic(dateObj)
}

// Convert time to 12-hour format
export const convertTo12Hour = (time24) => {
  if (!time24) return ''
  const [hours, minutes] = time24.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'م' : 'ص'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minutes} ${ampm}`
}

// Get day name in Arabic
export const getDayNameArabic = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'EEEE', { locale: ar })
}

// Get month name in Arabic
export const getMonthNameArabic = (date) => {
  if (!date) return ''
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMMM', { locale: ar })
}

// Calculate age from birthdate
export const calculateAge = (birthdate) => {
  if (!birthdate) return null
  const today = new Date()
  const birth = typeof birthdate === 'string' ? parseISO(birthdate) : birthdate
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

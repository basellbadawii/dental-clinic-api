import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  CalendarPlus, 
  Clock, 
  User, 
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Header from '../components/layout/Header'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Modal from '../components/common/Modal'
import Badge from '../components/common/Badge'
import { appointmentsAPI, patientsAPI } from '../services/supabase'
import { evolutionAPI } from '../services/evolutionApi'
import { n8nAPI } from '../services/n8nApi'
import { formatDateArabic, formatTimeArabic, getRelativeDate } from '../utils/dateHelpers'
import { formatPhoneNumber } from '../utils/formatters'
import toast from 'react-hot-toast'

const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [filterStatus, setFilterStatus] = useState('all')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [appointmentsData, patientsData] = await Promise.all([
        appointmentsAPI.getAll(),
        patientsAPI.getAll()
      ])
      setAppointments(appointmentsData || [])
      setPatients(patientsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      // Don't show error toast if using mock data
      // toast.error('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAppointment = () => {
    reset()
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      // Combine date and time
      const appointmentDateTime = `${data.date}T${data.time}:00`
      
      const appointmentData = {
        patient_id: data.patient_id,
        appointment_date: appointmentDateTime,
        duration: parseInt(data.duration) || 30,
        status: 'scheduled',
        notes: data.notes
      }

      const newAppointment = await appointmentsAPI.create(appointmentData)
      
      // Send to n8n for automation
      try {
        await n8nAPI.sendAppointmentData(newAppointment)
      } catch (n8nError) {
        console.error('n8n webhook failed:', n8nError)
      }

      toast.success('تم حجز الموعد بنجاح')
      setIsModalOpen(false)
      reset()
      loadData()
    } catch (error) {
      toast.error('فشل حجز الموعد')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmAppointment = async (appointment) => {
    try {
      await appointmentsAPI.update(appointment.id, { status: 'confirmed' })
      
      // Send WhatsApp confirmation
      const patient = appointment.patient
      if (patient?.phone) {
        try {
          await evolutionAPI.sendAppointmentReminder(
            patient.phone,
            patient.name,
            formatDateArabic(appointment.appointment_date, 'dd/MM/yyyy') + ' - ' + formatTimeArabic(appointment.appointment_date)
          )
          toast.success('تم تأكيد الموعد وإرسال رسالة واتساب')
        } catch (whatsappError) {
          toast.success('تم تأكيد الموعد (فشل إرسال الرسالة)')
        }
      } else {
        toast.success('تم تأكيد الموعد')
      }
      
      loadData()
    } catch (error) {
      toast.error('فشل تأكيد الموعد')
    }
  }

  const handleCancelAppointment = async (appointment) => {
    if (!window.confirm('هل أنت متأكد من إلغاء هذا الموعد؟')) {
      return
    }

    try {
      await appointmentsAPI.update(appointment.id, { status: 'cancelled' })
      toast.success('تم إلغاء الموعد')
      loadData()
    } catch (error) {
      toast.error('فشل إلغاء الموعد')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'info',
      confirmed: 'success',
      completed: 'default',
      cancelled: 'danger'
    }
    return colors[status] || 'default'
  }

  const getStatusLabel = (status) => {
    const labels = {
      scheduled: 'محجوز',
      confirmed: 'مؤكد',
      completed: 'مكتمل',
      cancelled: 'ملغي'
    }
    return labels[status] || status
  }

  const filteredAppointments = appointments.filter(apt => {
    if (filterStatus !== 'all' && apt.status !== filterStatus) return false
    return true
  })

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce((groups, apt) => {
    // Safe check for appointment_date
    if (!apt.appointment_date && !apt.appointmentDate) return groups
    
    const dateStr = apt.appointment_date || apt.appointmentDate
    const date = dateStr.split('T')[0]
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(apt)
    return groups
  }, {})

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="جدول المواعيد" 
        subtitle={`إجمالي ${appointments.length} موعد`}
      />

      <div className="p-8">
        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="max-w-xs"
              />
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                options={[
                  { value: 'all', label: 'جميع الحالات' },
                  { value: 'scheduled', label: 'محجوز' },
                  { value: 'confirmed', label: 'مؤكد' },
                  { value: 'completed', label: 'مكتمل' },
                  { value: 'cancelled', label: 'ملغي' }
                ]}
                className="max-w-xs"
              />
            </div>
            <Button
              variant="primary"
              icon={<CalendarPlus className="w-5 h-5" />}
              onClick={handleAddAppointment}
            >
              حجز موعد جديد
            </Button>
          </div>
        </div>

        {/* Appointments Timeline */}
        <div className="space-y-6">
          {Object.keys(groupedAppointments).length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <CalendarPlus className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">لا توجد مواعيد مجدولة</p>
            </div>
          ) : (
            Object.entries(groupedAppointments)
              .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
              .map(([date, dayAppointments]) => (
                <div key={date} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-3">
                    <h3 className="text-white font-semibold">
                      {formatDateArabic(date, 'EEEE، dd MMMM yyyy')}
                      <span className="mr-3 text-primary-100">
                        ({dayAppointments.length} موعد)
                      </span>
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {dayAppointments
                      .sort((a, b) => {
                        const dateA = a.appointment_date || a.appointmentDate || ''
                        const dateB = b.appointment_date || b.appointmentDate || ''
                        return dateA.localeCompare(dateB)
                      })
                      .map((appointment) => (
                        <div
                          key={appointment.id}
                          className="p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 space-x-reverse flex-1">
                              {/* Time */}
                              <div className="flex-shrink-0 text-center">
                                <div className="bg-primary-100 rounded-lg p-3">
                                  <Clock className="w-6 h-6 text-primary-600 mb-1" />
                                  <p className="text-sm font-semibold text-primary-700">
                                    {formatTimeArabic(appointment.appointment_date || appointment.appointmentDate)}
                                  </p>
                                </div>
                              </div>

                              {/* Patient Info */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 space-x-reverse mb-2">
                                  <h4 className="font-bold text-gray-800 text-lg">
                                    {appointment.patient?.name || 'غير محدد'}
                                  </h4>
                                  <Badge variant={getStatusColor(appointment.status)}>
                                    {getStatusLabel(appointment.status)}
                                  </Badge>
                                </div>
                                <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600">
                                  <span className="flex items-center space-x-1 space-x-reverse">
                                    <Phone className="w-4 h-4" />
                                    <span>{formatPhoneNumber(appointment.patient?.phone)}</span>
                                  </span>
                                  <span className="flex items-center space-x-1 space-x-reverse">
                                    <Clock className="w-4 h-4" />
                                    <span>{appointment.duration || appointment.durationMinutes || 30} دقيقة</span>
                                  </span>
                                </div>
                                {appointment.notes && (
                                  <p className="text-sm text-gray-500 mt-2">
                                    ملاحظات: {appointment.notes}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2 space-x-reverse">
                              {appointment.status === 'scheduled' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  icon={<CheckCircle className="w-4 h-4" />}
                                  onClick={() => handleConfirmAppointment(appointment)}
                                >
                                  تأكيد
                                </Button>
                              )}
                              {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                                <Button
                                  variant="danger"
                                  size="sm"
                                  icon={<XCircle className="w-4 h-4" />}
                                  onClick={() => handleCancelAppointment(appointment)}
                                >
                                  إلغاء
                                </Button>
                              )}
                              {appointment.patient?.phone && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  icon={<MessageSquare className="w-4 h-4" />}
                                  onClick={() => {
                                    evolutionAPI.sendMessage(
                                      appointment.patient.phone,
                                      `مرحباً ${appointment.patient.name}، نذكركم بموعدكم في ${formatDateArabic(appointment.appointment_date)}`
                                    )
                                    toast.success('تم إرسال الرسالة')
                                  }}
                                >
                                  واتساب
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Add Appointment Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="حجز موعد جديد"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            >
              حجز الموعد
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          {/* Patient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المريض <span className="text-red-500">*</span>
            </label>
            <Select
              options={patients.map(p => ({
                value: p.id,
                label: `${p.name} - ${formatPhoneNumber(p.phone)}`
              }))}
              placeholder="اختر المريض"
              {...register('patient_id', { required: 'يجب اختيار المريض' })}
              error={errors.patient_id?.message}
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التاريخ <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...register('date', { required: 'التاريخ مطلوب' })}
                error={errors.date?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الوقت <span className="text-red-500">*</span>
              </label>
              <Input
                type="time"
                {...register('time', { required: 'الوقت مطلوب' })}
                error={errors.time?.message}
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المدة (بالدقائق)
            </label>
            <Select
              options={[
                { value: '15', label: '15 دقيقة' },
                { value: '30', label: '30 دقيقة' },
                { value: '45', label: '45 دقيقة' },
                { value: '60', label: '60 دقيقة' },
                { value: '90', label: '90 دقيقة' }
              ]}
              {...register('duration')}
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات
            </label>
            <Textarea
              placeholder="أي ملاحظات إضافية..."
              rows={3}
              {...register('notes')}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Appointments

import { Calendar, Clock, User, Phone } from 'lucide-react'
import { formatDateArabic, formatTimeArabic } from '../../utils/dateHelpers'
import { formatPhoneNumber } from '../../utils/formatters'
import Badge from '../common/Badge'
import Card from '../common/Card'

const RecentAppointments = ({ appointments = [] }) => {
  const getStatusVariant = (status) => {
    const variants = {
      scheduled: 'info',
      confirmed: 'success',
      completed: 'default',
      cancelled: 'danger'
    }
    return variants[status] || 'default'
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

  return (
    <Card 
      title="المواعيد القادمة" 
      subtitle="آخر المواعيد المحجوزة"
      icon={<Calendar className="w-6 h-6 text-primary-500" />}
    >
      <div className="space-y-3">
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد مواعيد قادمة</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    {appointment.patient?.name || 'غير محدد'}
                  </h4>
                  <div className="flex items-center space-x-3 space-x-reverse text-sm text-gray-600 mt-1">
                    <span className="flex items-center space-x-1 space-x-reverse">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeArabic(appointment.appointment_date)}</span>
                    </span>
                    <span className="flex items-center space-x-1 space-x-reverse">
                      <Phone className="w-4 h-4" />
                      <span>{formatPhoneNumber(appointment.patient?.phone)}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-left">
                <Badge variant={getStatusVariant(appointment.status)}>
                  {getStatusLabel(appointment.status)}
                </Badge>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDateArabic(appointment.appointment_date)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

export default RecentAppointments

import { useState, useEffect } from 'react'
import { Bell, Calendar, Clock, X } from 'lucide-react'
import { appointmentsAPI } from '../../services/supabase'
import { formatDateArabic } from '../../utils/dateHelpers'

const NotificationsModal = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const upcomingAppts = await appointmentsAPI.getUpcoming()
      
      const notifs = upcomingAppts.map(appt => ({
        id: appt.id,
        type: 'appointment',
        title: 'موعد قادم',
        message: `موعد مع ${appt.patient?.name || 'مريض'} - ${appt.treatment_type || 'فحص'}`,
        date: appt.appointment_date,
        read: false
      }))
      
      setNotifications(notifs)
    } catch (error) {
      console.error('Error loading notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-16 left-4 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Bell className="w-5 h-5 text-primary-600" />
          <h3 className="font-bold text-gray-800">الإشعارات</h3>
          {notifications.length > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {notifications.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">جاري التحميل...</p>
          </div>
        )}

        {!loading && notifications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>لا توجد إشعارات جديدة</p>
          </div>
        )}

        {!loading && notifications.length > 0 && (
          <div className="divide-y divide-gray-200">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {notif.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notif.message}
                    </p>
                    <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-500 mt-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDateArabic(new Date(notif.date), 'dd MMMM yyyy - HH:mm')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
            عرض جميع الإشعارات
          </button>
        </div>
      )}
    </div>
  )
}

export default NotificationsModal

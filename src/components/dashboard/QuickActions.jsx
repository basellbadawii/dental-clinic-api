import { UserPlus, CalendarPlus, FileText, MessageSquare } from 'lucide-react'
import Card from '../common/Card'

const QuickActions = ({ onAddPatient, onAddAppointment, onAddVisit, onSendMessage }) => {
  const actions = [
    {
      icon: <UserPlus className="w-6 h-6" />,
      label: 'إضافة مريض',
      color: 'bg-blue-500',
      onClick: onAddPatient
    },
    {
      icon: <CalendarPlus className="w-6 h-6" />,
      label: 'حجز موعد',
      color: 'bg-green-500',
      onClick: onAddAppointment
    },
    {
      icon: <FileText className="w-6 h-6" />,
      label: 'تسجيل زيارة',
      color: 'bg-purple-500',
      onClick: onAddVisit
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      label: 'إرسال رسالة',
      color: 'bg-orange-500',
      onClick: onSendMessage
    }
  ]

  return (
    <Card title="إجراءات سريعة" subtitle="الوصول السريع للعمليات الشائعة">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:shadow-md group"
          >
            <div className={`${action.color} w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
              <div className="text-white">
                {action.icon}
              </div>
            </div>
            <span className="text-sm font-semibold text-gray-700">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}

export default QuickActions

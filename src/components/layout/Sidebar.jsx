import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList, 
  Activity,
  LogOut,
  Settings,
  X,
  Menu
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuthStore()

  const menuItems = [
    {
      path: '/',
      icon: <LayoutDashboard className="w-5 h-5" />,
      label: 'لوحة التحكم',
      exact: true
    },
    {
      path: '/patients',
      icon: <Users className="w-5 h-5" />,
      label: 'سجل المرضى'
    },
    {
      path: '/appointments',
      icon: <Calendar className="w-5 h-5" />,
      label: 'جدول المواعيد'
    },
    {
      path: '/visits',
      icon: <ClipboardList className="w-5 h-5" />,
      label: 'سجل الزيارات'
    }
  ]

  return (
    <>
      {/* Hamburger Menu Button - Only visible when sidebar is closed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-20 right-4 z-50 p-2 bg-primary-600 text-white rounded-lg shadow-lg hover:bg-primary-700 transition-colors"
          title="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`h-screen w-64 bg-white border-l border-gray-200 flex flex-col fixed right-0 top-0 shadow-lg z-40 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Logo Section with Close Button */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3 space-x-reverse">
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-md">
              <Activity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">عيادة الأسنان</h1>
              <p className="text-xs text-gray-500">نظام الإدارة المتكامل</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="إغلاق القائمة"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="px-6 py-4 bg-gradient-to-r from-primary-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.fullName?.charAt(0) || 'د'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">
              {user?.fullName || 'الطبيب'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'doctor' ? 'طبيب' : user?.role}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-500'}>
                      {item.icon}
                    </span>
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200 space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Settings className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
              <span className="font-medium">الإعدادات</span>
            </>
          )}
        </NavLink>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
    </>
  )
}

export default Sidebar

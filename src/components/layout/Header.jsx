import { useState, useEffect } from 'react'
import { Bell, Search, MessageSquare } from 'lucide-react'
import { formatDateArabic, getDayNameArabic } from '../../utils/dateHelpers'
import SearchModal from '../modals/SearchModal'
import NotificationsModal from '../modals/NotificationsModal'
import ChatModal from '../modals/ChatModal'
import { appointmentsAPI } from '../../services/supabase'

const Header = ({ title, subtitle }) => {
  const today = new Date()
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(0)

  useEffect(() => {
    loadNotificationCount()
  }, [])

  const loadNotificationCount = async () => {
    try {
      const upcoming = await appointmentsAPI.getUpcoming()
      setNotificationCount(upcoming?.length || 0)
    } catch (error) {
      console.error('Error loading notification count:', error)
    }
  }

  // Close modals on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setChatOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Close all modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside any modal
      const isClickInsideModal = e.target.closest('.modal-content')
      if (!isClickInsideModal && !e.target.closest('button')) {
        setSearchOpen(false)
        setNotificationsOpen(false)
        setChatOpen(false)
      }
    }
    
    if (searchOpen || notificationsOpen || chatOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchOpen, notificationsOpen, chatOpen])

  // Close other modals when opening one
  const handleOpenSearch = () => {
    setNotificationsOpen(false)
    setChatOpen(false)
    setSearchOpen(true)
  }

  const handleOpenNotifications = () => {
    setSearchOpen(false)
    setChatOpen(false)
    setNotificationsOpen(true)
  }

  const handleOpenChat = () => {
    setSearchOpen(false)
    setNotificationsOpen(false)
    setChatOpen(true)
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          {/* Title Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* Date Display */}
            <div className="hidden md:flex items-center px-4 py-2 bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {getDayNameArabic(today)}
                </p>
                <p className="text-xs text-gray-600">
                  {formatDateArabic(today, 'dd MMMM yyyy')}
                </p>
              </div>
            </div>

            {/* Search */}
            <button 
              onClick={handleOpenSearch}
              className={`p-2 rounded-lg transition-colors relative ${searchOpen ? 'bg-primary-100' : 'hover:bg-gray-100'}`}
              title="البحث عن مريض"
            >
              <Search className={`w-5 h-5 ${searchOpen ? 'text-primary-600' : 'text-gray-600'}`} />
            </button>

            {/* Messages */}
            <button 
              onClick={handleOpenChat}
              className={`p-2 rounded-lg transition-colors relative ${chatOpen ? 'bg-green-100' : 'hover:bg-gray-100'}`}
              title="المحادثات"
            >
              <MessageSquare className={`w-5 h-5 ${chatOpen ? 'text-green-600' : 'text-gray-600'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
            </button>

            {/* Notifications */}
            <button 
              onClick={handleOpenNotifications}
              className={`p-2 rounded-lg transition-colors relative ${notificationsOpen ? 'bg-red-100' : 'hover:bg-gray-100'}`}
              title="الإشعارات"
            >
              <Bell className={`w-5 h-5 ${notificationsOpen ? 'text-red-600' : 'text-gray-600'}`} />
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <NotificationsModal isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}

export default Header

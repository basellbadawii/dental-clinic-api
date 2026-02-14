import { useState, useEffect } from 'react'
import { MessageSquare, X, Send, User } from 'lucide-react'
import { patientsAPI } from '../../services/supabase'

const ChatModal = ({ isOpen, onClose }) => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadRecentPatients()
    }
  }, [isOpen])

  const loadRecentPatients = async () => {
    try {
      setLoading(true)
      const data = await patientsAPI.getAll()
      setPatients(data?.slice(0, 10) || [])
    } catch (error) {
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    if (!selectedPatient || !message.trim()) return
    
    // Here you would integrate with WhatsApp API
    console.log('Sending message to:', selectedPatient.name, message)
    setMessage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-16 left-4 w-96 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-green-500 to-green-600">
        <div className="flex items-center space-x-2 space-x-reverse">
          <MessageSquare className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">المحادثات السريعة</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Patients List */}
      {!selectedPatient && (
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-gray-600 text-sm">جاري التحميل...</p>
            </div>
          )}

          {!loading && patients.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد محادثات</p>
            </div>
          )}

          {!loading && patients.length > 0 && (
            <div className="divide-y divide-gray-200">
              {patients.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className="w-full p-4 hover:bg-gray-50 transition-colors text-right"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        {patient.name}
                      </h4>
                      <p className="text-xs text-gray-500">{patient.phone}</p>
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chat Interface */}
      {selectedPatient && (
        <>
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center space-x-3 space-x-reverse">
            <button
              onClick={() => setSelectedPatient(null)}
              className="text-gray-600 hover:text-gray-800"
            >
              ←
            </button>
            <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{selectedPatient.name}</h4>
              <p className="text-xs text-gray-500">{selectedPatient.phone}</p>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
            <div className="text-center text-gray-500 text-sm py-8">
              ابدأ محادثة مع {selectedPatient.name}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2 space-x-reverse">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ChatModal

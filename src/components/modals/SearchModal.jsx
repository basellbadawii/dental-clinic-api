import { useState, useEffect } from 'react'
import { Search, User, Phone, Mail } from 'lucide-react'
import { patientsAPI } from '../../services/supabase'
import { useNavigate } from 'react-router-dom'

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchTerm.length >= 2) {
      searchPatients()
    } else {
      setResults([])
    }
  }, [searchTerm])

  const searchPatients = async () => {
    try {
      setLoading(true)
      const patients = await patientsAPI.getAll()
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.includes(searchTerm)
      )
      setResults(filtered)
    } catch (error) {
      console.error('Error searching patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPatient = (patient) => {
    navigate('/patients')
    onClose()
    setSearchTerm('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ابحث عن مريض بالاسم أو رقم الهاتف..."
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              autoFocus
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">جاري البحث...</p>
            </div>
          )}

          {!loading && searchTerm.length < 2 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>ابدأ بكتابة اسم المريض أو رقم الهاتف</p>
            </div>
          )}

          {!loading && searchTerm.length >= 2 && results.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>لا توجد نتائج</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-2">
              {results.map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className="w-full text-right p-4 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors border border-transparent hover:border-primary-300"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{patient.name}</h4>
                      <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-600 mt-1">
                        <span className="flex items-center space-x-1 space-x-reverse">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </span>
                        {patient.email && (
                          <span className="flex items-center space-x-1 space-x-reverse">
                            <Mail className="w-4 h-4" />
                            <span>{patient.email}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <button
            onClick={() => {
              onClose()
              setSearchTerm('')
            }}
            className="w-full py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            إغلاق (ESC)
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchModal

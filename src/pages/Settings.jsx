import { useState, useEffect } from 'react'
import { Save, Building2, MessageSquare, Workflow, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { 
  getClinicSettings, 
  updateClinicInfo,
  updateWhatsAppSettings,
  updateN8nSettings,
  updateWorkingHours
} from '../services/settingsService'

const Settings = () => {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Clinic Info State
  const [clinicInfo, setClinicInfo] = useState({
    clinic_name: '',
    clinic_phone: '',
    clinic_email: '',
    clinic_address: ''
  })

  // WhatsApp Settings State
  const [whatsappSettings, setWhatsappSettings] = useState({
    whatsapp_enabled: false,
    whatsapp_phone: '',
    whatsapp_api_key: ''
  })

  // n8n Settings State
  const [n8nSettings, setN8nSettings] = useState({
    n8n_enabled: false,
    n8n_webhook_url: '',
    n8n_api_key: ''
  })

  // Working Hours State
  const [workingHours, setWorkingHours] = useState({
    saturday: { enabled: true, start: '09:00', end: '17:00' },
    sunday: { enabled: true, start: '09:00', end: '17:00' },
    monday: { enabled: true, start: '09:00', end: '17:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00' },
    friday: { enabled: false, start: '09:00', end: '17:00' }
  })

  const daysInArabic = {
    saturday: 'السبت',
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة'
  }

  // Load settings on component mount
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const settings = await getClinicSettings()
      
      // Set clinic info
      setClinicInfo({
        clinic_name: settings.clinic_name || '',
        clinic_phone: settings.clinic_phone || '',
        clinic_email: settings.clinic_email || '',
        clinic_address: settings.clinic_address || ''
      })

      // Set WhatsApp settings
      setWhatsappSettings({
        whatsapp_enabled: settings.whatsapp_enabled || false,
        whatsapp_phone: settings.whatsapp_phone || '',
        whatsapp_api_key: settings.whatsapp_api_key || ''
      })

      // Set n8n settings
      setN8nSettings({
        n8n_enabled: settings.n8n_enabled || false,
        n8n_webhook_url: settings.n8n_webhook_url || '',
        n8n_api_key: settings.n8n_api_key || ''
      })

      // Set working hours
      if (settings.working_hours) {
        setWorkingHours(settings.working_hours)
      }
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.error('فشل تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }

  // Save Clinic Info
  const handleSaveClinicInfo = async () => {
    try {
      setSaving(true)
      await updateClinicInfo(clinicInfo)
      toast.success('تم حفظ معلومات العيادة بنجاح')
    } catch (error) {
      console.error('Error saving clinic info:', error)
      toast.error('فشل حفظ معلومات العيادة')
    } finally {
      setSaving(false)
    }
  }

  // Save WhatsApp Settings
  const handleSaveWhatsApp = async () => {
    try {
      setSaving(true)
      await updateWhatsAppSettings(whatsappSettings)
      toast.success('تم حفظ إعدادات الواتساب بنجاح')
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error)
      toast.error('فشل حفظ إعدادات الواتساب')
    } finally {
      setSaving(false)
    }
  }

  // Save n8n Settings
  const handleSaveN8n = async () => {
    try {
      setSaving(true)
      await updateN8nSettings(n8nSettings)
      toast.success('تم حفظ إعدادات n8n بنجاح')
    } catch (error) {
      console.error('Error saving n8n settings:', error)
      toast.error('فشل حفظ إعدادات n8n')
    } finally {
      setSaving(false)
    }
  }

  // Save Working Hours
  const handleSaveWorkingHours = async () => {
    try {
      setSaving(true)
      await updateWorkingHours(workingHours)
      toast.success('تم حفظ مواعيد العمل بنجاح')
    } catch (error) {
      console.error('Error saving working hours:', error)
      toast.error('فشل حفظ مواعيد العمل')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الإعدادات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800">الإعدادات</h1>
        <p className="text-gray-600 mt-1">إدارة إعدادات العيادة والتكاملات</p>
      </div>

      {/* Clinic Info Section */}
      <Card>
        <div className="flex items-center space-x-3 space-x-reverse mb-6">
          <div className="p-3 bg-primary-100 rounded-lg">
            <Building2 className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">معلومات العيادة</h2>
            <p className="text-sm text-gray-600">البيانات الأساسية للعيادة</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="اسم العيادة"
            value={clinicInfo.clinic_name}
            onChange={(e) => setClinicInfo({ ...clinicInfo, clinic_name: e.target.value })}
            placeholder="أدخل اسم العيادة"
          />
          <Input
            label="رقم الهاتف"
            value={clinicInfo.clinic_phone}
            onChange={(e) => setClinicInfo({ ...clinicInfo, clinic_phone: e.target.value })}
            placeholder="01XXXXXXXXX"
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={clinicInfo.clinic_email}
            onChange={(e) => setClinicInfo({ ...clinicInfo, clinic_email: e.target.value })}
            placeholder="clinic@example.com"
          />
          <Input
            label="العنوان"
            value={clinicInfo.clinic_address}
            onChange={(e) => setClinicInfo({ ...clinicInfo, clinic_address: e.target.value })}
            placeholder="أدخل عنوان العيادة"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveClinicInfo}
            disabled={saving}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ المعلومات'}</span>
          </Button>
        </div>
      </Card>

      {/* WhatsApp Integration Section */}
      <Card>
        <div className="flex items-center space-x-3 space-x-reverse mb-6">
          <div className="p-3 bg-green-100 rounded-lg">
            <MessageSquare className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">إعدادات ربط الواتساب</h2>
            <p className="text-sm text-gray-600">تكامل مع Evolution API لإرسال الرسائل</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="whatsapp_enabled"
              checked={whatsappSettings.whatsapp_enabled}
              onChange={(e) => setWhatsappSettings({ ...whatsappSettings, whatsapp_enabled: e.target.checked })}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="whatsapp_enabled" className="mr-3 text-gray-700 font-medium">
              تفعيل إرسال رسائل الواتساب
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="رقم الواتساب"
              value={whatsappSettings.whatsapp_phone}
              onChange={(e) => setWhatsappSettings({ ...whatsappSettings, whatsapp_phone: e.target.value })}
              placeholder="966XXXXXXXXX"
              disabled={!whatsappSettings.whatsapp_enabled}
            />
            <Input
              label="API Key"
              type="password"
              value={whatsappSettings.whatsapp_api_key}
              onChange={(e) => setWhatsappSettings({ ...whatsappSettings, whatsapp_api_key: e.target.value })}
              placeholder="أدخل مفتاح الـ API"
              disabled={!whatsappSettings.whatsapp_enabled}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveWhatsApp}
            disabled={saving}
            className="flex items-center space-x-2 space-x-reverse bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ إعدادات الواتساب'}</span>
          </Button>
        </div>
      </Card>

      {/* n8n Integration Section */}
      <Card>
        <div className="flex items-center space-x-3 space-x-reverse mb-6">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Workflow className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">إعدادات ربط n8n</h2>
            <p className="text-sm text-gray-600">تكامل مع n8n للأتمتة والتنبيهات</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="n8n_enabled"
              checked={n8nSettings.n8n_enabled}
              onChange={(e) => setN8nSettings({ ...n8nSettings, n8n_enabled: e.target.checked })}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="n8n_enabled" className="mr-3 text-gray-700 font-medium">
              تفعيل تكامل n8n
            </label>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Input
              label="Webhook URL"
              value={n8nSettings.n8n_webhook_url}
              onChange={(e) => setN8nSettings({ ...n8nSettings, n8n_webhook_url: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/..."
              disabled={!n8nSettings.n8n_enabled}
            />
            <Input
              label="API Key (اختياري)"
              type="password"
              value={n8nSettings.n8n_api_key}
              onChange={(e) => setN8nSettings({ ...n8nSettings, n8n_api_key: e.target.value })}
              placeholder="أدخل مفتاح الـ API إن وجد"
              disabled={!n8nSettings.n8n_enabled}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveN8n}
            disabled={saving}
            className="flex items-center space-x-2 space-x-reverse bg-purple-600 hover:bg-purple-700"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ إعدادات n8n'}</span>
          </Button>
        </div>
      </Card>

      {/* Working Hours Section */}
      <Card>
        <div className="flex items-center space-x-3 space-x-reverse mb-6">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">مواعيد العمل</h2>
            <p className="text-sm text-gray-600">تحديد أوقات عمل العيادة خلال الأسبوع</p>
          </div>
        </div>

        <div className="space-y-4">
          {Object.keys(workingHours).map((day) => (
            <div key={day} className="flex items-center space-x-4 space-x-reverse p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center min-w-[120px]">
                <input
                  type="checkbox"
                  id={`${day}_enabled`}
                  checked={workingHours[day].enabled}
                  onChange={(e) => setWorkingHours({
                    ...workingHours,
                    [day]: { ...workingHours[day], enabled: e.target.checked }
                  })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor={`${day}_enabled`} className="mr-3 text-gray-700 font-medium">
                  {daysInArabic[day]}
                </label>
              </div>

              <div className="flex items-center space-x-3 space-x-reverse flex-1">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <label className="text-sm text-gray-600">من:</label>
                  <input
                    type="time"
                    value={workingHours[day].start}
                    onChange={(e) => setWorkingHours({
                      ...workingHours,
                      [day]: { ...workingHours[day], start: e.target.value }
                    })}
                    disabled={!workingHours[day].enabled}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <label className="text-sm text-gray-600">إلى:</label>
                  <input
                    type="time"
                    value={workingHours[day].end}
                    onChange={(e) => setWorkingHours({
                      ...workingHours,
                      [day]: { ...workingHours[day], end: e.target.value }
                    })}
                    disabled={!workingHours[day].enabled}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSaveWorkingHours}
            disabled={saving}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'جاري الحفظ...' : 'حفظ مواعيد العمل'}</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default Settings

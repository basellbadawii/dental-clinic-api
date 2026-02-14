import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import Button from '../common/Button'
import { patientsAPI } from '../../services/supabase'
import { sendWhatsAppMessage } from '../../services/evolutionApi'
import toast from 'react-hot-toast'

const SendMessageModal = ({ isOpen, onClose, onSuccess }) => {
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({
    patient_id: '',
    message: ''
  })
  const [sending, setSending] = useState(false)

  const messageTemplates = [
    { label: 'رسالة مخصصة', value: '' },
    { label: 'تذكير بموعد', value: 'عزيزي المريض، هذا تذكير بموعدك القادم في العيادة. نتطلع لرؤيتك!' },
    { label: 'شكر بعد الزيارة', value: 'شكراً لزيارتك عيادتنا. نتمنى لك دوام الصحة والعافية!' },
    { label: 'تأكيد الموعد', value: 'تم تأكيد موعدك بنجاح. في حال الرغبة بالإلغاء أو التعديل، يرجى الاتصال بنا.' }
  ]

  useEffect(() => {
    if (isOpen) {
      loadPatients()
    }
  }, [isOpen])

  const loadPatients = async () => {
    try {
      const data = await patientsAPI.getAll()
      setPatients(data || [])
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTemplateChange = (e) => {
    setFormData(prev => ({ ...prev, message: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.patient_id || !formData.message) {
      toast.error('الرجاء اختيار المريض وكتابة الرسالة')
      return
    }

    try {
      setSending(true)
      
      const patient = patients.find(p => p.id === formData.patient_id)
      if (!patient) {
        toast.error('المريض غير موجود')
        return
      }

      await sendWhatsAppMessage(patient.phone, formData.message)
      
      toast.success('تم إرسال الرسالة بنجاح')
      setFormData({
        patient_id: '',
        message: ''
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('فشل إرسال الرسالة. تأكد من إعدادات WhatsApp')
    } finally {
      setSending(false)
    }
  }

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.name} - ${p.phone}`
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إرسال رسالة واتساب">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="المريض *"
          name="patient_id"
          value={formData.patient_id}
          onChange={handleChange}
          options={[
            { value: '', label: 'اختر المريض' },
            ...patientOptions
          ]}
          required
        />

        <Select
          label="قالب الرسالة"
          onChange={handleTemplateChange}
          options={messageTemplates}
        />

        <Textarea
          label="الرسالة *"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="اكتب رسالتك هنا..."
          rows={5}
          required
        />

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            💡 تأكد من تفعيل إعدادات WhatsApp من صفحة الإعدادات
          </p>
        </div>

        <div className="flex justify-end space-x-3 space-x-reverse pt-4 border-t">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={sending}
            className="bg-green-600 hover:bg-green-700"
          >
            {sending ? 'جاري الإرسال...' : 'إرسال الرسالة'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default SendMessageModal

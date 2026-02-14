import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import Button from '../common/Button'
import { patientsAPI, appointmentsAPI } from '../../services/supabase'
import toast from 'react-hot-toast'

const AddAppointmentModal = ({ isOpen, onClose, onSuccess }) => {
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({
    patient_id: '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: 30,
    treatment_type: '',
    notes: ''
  })
  const [saving, setSaving] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.patient_id || !formData.appointment_date || !formData.appointment_time) {
      toast.error('الرجاء إدخال جميع الحقول المطلوبة')
      return
    }

    try {
      setSaving(true)
      
      // Combine date and time
      const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`
      
      await appointmentsAPI.create({
        patient_id: formData.patient_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        duration_minutes: parseInt(formData.duration_minutes),
        treatment: formData.treatment_type,
        status: 'مجدول',
        notes: formData.notes
      })
      
      toast.success('تم حجز الموعد بنجاح')
      setFormData({
        patient_id: '',
        appointment_date: '',
        appointment_time: '',
        duration_minutes: 30,
        treatment_type: '',
        notes: ''
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error adding appointment:', error)
      toast.error('فشل حجز الموعد')
    } finally {
      setSaving(false)
    }
  }

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.name} - ${p.phone}`
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="حجز موعد جديد">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="تاريخ الموعد *"
            name="appointment_date"
            type="date"
            value={formData.appointment_date}
            onChange={handleChange}
            required
          />
          
          <Input
            label="وقت الموعد *"
            name="appointment_time"
            type="time"
            value={formData.appointment_time}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="مدة الموعد"
            name="duration_minutes"
            value={formData.duration_minutes}
            onChange={handleChange}
            options={[
              { value: 15, label: '15 دقيقة' },
              { value: 30, label: '30 دقيقة' },
              { value: 45, label: '45 دقيقة' },
              { value: 60, label: '60 دقيقة' },
              { value: 90, label: '90 دقيقة' },
              { value: 120, label: '120 دقيقة' }
            ]}
          />
          
          <Input
            label="نوع العلاج"
            name="treatment_type"
            value={formData.treatment_type}
            onChange={handleChange}
            placeholder="مثال: فحص دوري، تنظيف أسنان"
          />
        </div>

        <Textarea
          label="ملاحظات"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="أدخل أي ملاحظات للموعد"
          rows={3}
        />

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
            disabled={saving}
          >
            {saving ? 'جاري الحفظ...' : 'حجز الموعد'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddAppointmentModal

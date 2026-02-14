import { useState, useEffect } from 'react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import Button from '../common/Button'
import { patientsAPI, visitsAPI } from '../../services/supabase'
import toast from 'react-hot-toast'

const AddVisitModal = ({ isOpen, onClose, onSuccess }) => {
  const [patients, setPatients] = useState([])
  const [formData, setFormData] = useState({
    patient_id: '',
    visit_date: new Date().toISOString().split('T')[0],
    visit_time: new Date().toTimeString().slice(0, 5),
    diagnosis: '',
    treatment: '',
    cost: '',
    paid: false,
    notes: ''
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadPatients()
      // Reset time to current
      const now = new Date()
      setFormData(prev => ({
        ...prev,
        visit_date: now.toISOString().split('T')[0],
        visit_time: now.toTimeString().slice(0, 5)
      }))
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
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.patient_id || !formData.visit_date) {
      toast.error('الرجاء اختيار المريض وتحديد تاريخ الزيارة')
      return
    }

    try {
      setSaving(true)
      
      // Combine date and time
      const visitDateTime = `${formData.visit_date}T${formData.visit_time}:00`
      
      await visitsAPI.create({
        patient_id: formData.patient_id,
        visit_date: visitDateTime,
        diagnosis: formData.diagnosis,
        treatment: formData.treatment,
        cost: parseFloat(formData.cost) || 0,
        paid: formData.paid,
        notes: formData.notes
      })
      
      toast.success('تم تسجيل الزيارة بنجاح')
      setFormData({
        patient_id: '',
        visit_date: new Date().toISOString().split('T')[0],
        visit_time: new Date().toTimeString().slice(0, 5),
        diagnosis: '',
        treatment: '',
        cost: '',
        paid: false,
        notes: ''
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error adding visit:', error)
      toast.error('فشل تسجيل الزيارة')
    } finally {
      setSaving(false)
    }
  }

  const patientOptions = patients.map(p => ({
    value: p.id,
    label: `${p.name} - ${p.phone}`
  }))

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="تسجيل زيارة جديدة">
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
            label="تاريخ الزيارة *"
            name="visit_date"
            type="date"
            value={formData.visit_date}
            onChange={handleChange}
            required
          />
          
          <Input
            label="وقت الزيارة"
            name="visit_time"
            type="time"
            value={formData.visit_time}
            onChange={handleChange}
          />
        </div>

        <Textarea
          label="التشخيص *"
          name="diagnosis"
          value={formData.diagnosis}
          onChange={handleChange}
          placeholder="أدخل التشخيص"
          rows={3}
          required
        />

        <Textarea
          label="العلاج المقدم *"
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          placeholder="أدخل العلاج المقدم"
          rows={3}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="التكلفة (ج.م)"
            name="cost"
            type="number"
            value={formData.cost}
            onChange={handleChange}
            placeholder="0"
            min="0"
            step="0.01"
          />
          
          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              id="paid"
              name="paid"
              checked={formData.paid}
              onChange={handleChange}
              className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="paid" className="mr-3 text-gray-700 font-medium">
              تم الدفع
            </label>
          </div>
        </div>

        <Textarea
          label="ملاحظات"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="أدخل أي ملاحظات إضافية"
          rows={2}
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
            {saving ? 'جاري الحفظ...' : 'تسجيل الزيارة'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddVisitModal

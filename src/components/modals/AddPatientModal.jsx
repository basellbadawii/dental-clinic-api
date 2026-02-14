import { useState } from 'react'
import { X } from 'lucide-react'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Select from '../common/Select'
import Textarea from '../common/Textarea'
import Button from '../common/Button'
import { patientsAPI } from '../../services/supabase'
import toast from 'react-hot-toast'

const AddPatientModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: 'ذكر',
    address: '',
    medical_history: ''
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.phone) {
      toast.error('الرجاء إدخال الاسم ورقم الهاتف')
      return
    }

    try {
      setSaving(true)
      await patientsAPI.create(formData)
      toast.success('تم إضافة المريض بنجاح')
      setFormData({
        name: '',
        phone: '',
        email: '',
        date_of_birth: '',
        gender: 'ذكر',
        address: '',
        medical_history: ''
      })
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error adding patient:', error)
      toast.error('فشل إضافة المريض')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="إضافة مريض جديد">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="الاسم الكامل *"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="أدخل اسم المريض"
            required
          />
          
          <Input
            label="رقم الهاتف *"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
            required
          />
          
          <Input
            label="البريد الإلكتروني"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="patient@example.com"
          />
          
          <Input
            label="تاريخ الميلاد"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
          
          <Select
            label="النوع"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            options={[
              { value: 'ذكر', label: 'ذكر' },
              { value: 'أنثى', label: 'أنثى' }
            ]}
          />
          
          <Input
            label="العنوان"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="أدخل العنوان"
          />
        </div>

        <Textarea
          label="التاريخ المرضي"
          name="medical_history"
          value={formData.medical_history}
          onChange={handleChange}
          placeholder="أدخل التاريخ المرضي للمريض"
          rows={4}
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
            {saving ? 'جاري الحفظ...' : 'إضافة المريض'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default AddPatientModal

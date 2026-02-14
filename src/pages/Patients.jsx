import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail,
  Calendar,
  AlertCircle
} from 'lucide-react'
import Header from '../components/layout/Header'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import Badge from '../components/common/Badge'
import { patientsAPI } from '../services/supabase'
import { formatPhoneNumber, formatPatientId } from '../utils/formatters'
import { calculateAge } from '../utils/dateHelpers'
import toast from 'react-hot-toast'

const Patients = () => {
  const [patients, setPatients] = useState([])
  const [filteredPatients, setFilteredPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState(null)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    loadPatients()
  }, [])

  useEffect(() => {
    filterPatients()
  }, [searchQuery, patients])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const data = await patientsAPI.getAll()
      setPatients(data || [])
      setFilteredPatients(data || [])
    } catch (error) {
      console.error('Error loading patients:', error)
      // Don't show error toast if using mock data
      // toast.error('فشل تحميل بيانات المرضى')
    } finally {
      setLoading(false)
    }
  }

  const filterPatients = () => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = patients.filter(patient =>
      patient.name.toLowerCase().includes(query) ||
      patient.phone.includes(query)
    )
    setFilteredPatients(filtered)
  }

  const handleAddPatient = () => {
    setEditingPatient(null)
    reset()
    setIsModalOpen(true)
  }

  const handleEditPatient = (patient) => {
    setEditingPatient(patient)
    setValue('name', patient.name)
    setValue('phone', patient.phone)
    setValue('age', patient.age)
    setValue('gender', patient.gender)
    setValue('medical_history', patient.medical_history)
    setValue('allergies', patient.allergies)
    setIsModalOpen(true)
  }

  const handleDeletePatient = async (patient) => {
    if (!window.confirm(`هل أنت متأكد من حذف المريض ${patient.name}؟`)) {
      return
    }

    try {
      await patientsAPI.delete(patient.id)
      toast.success('تم حذف المريض بنجاح')
      loadPatients()
    } catch (error) {
      toast.error('فشل حذف المريض')
    }
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      if (editingPatient) {
        await patientsAPI.update(editingPatient.id, data)
        toast.success('تم تحديث بيانات المريض بنجاح')
      } else {
        await patientsAPI.create(data)
        toast.success('تم إضافة المريض بنجاح')
      }
      setIsModalOpen(false)
      reset()
      loadPatients()
    } catch (error) {
      toast.error(editingPatient ? 'فشل تحديث المريض' : 'فشل إضافة المريض')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      header: 'رقم المريض',
      accessor: 'id',
      render: (row) => (
        <span className="font-mono text-xs text-gray-600">
          {formatPatientId(row.id)}
        </span>
      )
    },
    {
      header: 'الاسم',
      accessor: 'name',
      render: (row) => (
        <div className="font-semibold text-gray-800">{row.name}</div>
      )
    },
    {
      header: 'رقم الهاتف',
      accessor: 'phone',
      render: (row) => (
        <span className="text-gray-700">{formatPhoneNumber(row.phone)}</span>
      )
    },
    {
      header: 'العمر',
      accessor: 'age',
      render: (row) => (
        <span className="text-gray-700">{row.age} سنة</span>
      )
    },
    {
      header: 'الجنس',
      accessor: 'gender',
      render: (row) => (
        <Badge variant={row.gender === 'male' ? 'info' : 'primary'}>
          {row.gender === 'male' ? 'ذكر' : 'أنثى'}
        </Badge>
      )
    },
    {
      header: 'الإجراءات',
      accessor: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleEditPatient(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="تعديل"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeletePatient(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="حذف"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="سجل المرضى" 
        subtitle={`إجمالي ${patients.length} مريض مسجل`}
      />

      <div className="p-8">
        {/* Search and Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="البحث عن مريض (الاسم، رقم الهاتف)..."
                icon={<Search className="w-5 h-5 text-gray-400" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              icon={<UserPlus className="w-5 h-5" />}
              onClick={handleAddPatient}
            >
              إضافة مريض جديد
            </Button>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <Table
            columns={columns}
            data={filteredPatients}
            emptyMessage="لا يوجد مرضى مسجلين"
          />
        </div>
      </div>

      {/* Add/Edit Patient Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPatient ? 'تعديل بيانات المريض' : 'إضافة مريض جديد'}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              إلغاء
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            >
              {editingPatient ? 'تحديث' : 'إضافة'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الاسم الكامل <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="أدخل الاسم الكامل"
              {...register('name', { required: 'الاسم مطلوب' })}
              error={errors.name?.message}
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الهاتف <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="05XXXXXXXX"
              icon={<Phone className="w-5 h-5 text-gray-400" />}
              {...register('phone', {
                required: 'رقم الهاتف مطلوب',
                pattern: {
                  value: /^05\d{8}$/,
                  message: 'رقم الهاتف غير صحيح'
                }
              })}
              error={errors.phone?.message}
            />
          </div>

          {/* Age and Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العمر
              </label>
              <Input
                type="number"
                placeholder="25"
                {...register('age', { min: 0, max: 150 })}
                error={errors.age?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الجنس
              </label>
              <Select
                options={[
                  { value: 'male', label: 'ذكر' },
                  { value: 'female', label: 'أنثى' }
                ]}
                {...register('gender')}
              />
            </div>
          </div>

          {/* Medical History */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التاريخ الطبي
            </label>
            <Textarea
              placeholder="أي أمراض مزمنة، عمليات سابقة، أدوية..."
              rows={3}
              {...register('medical_history')}
            />
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              الحساسية
            </label>
            <Textarea
              placeholder="أي حساسية من أدوية أو مواد..."
              rows={2}
              {...register('allergies')}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Patients

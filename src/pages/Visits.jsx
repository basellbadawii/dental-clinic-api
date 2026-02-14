import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { 
  ClipboardPlus, 
  DollarSign, 
  Calendar,
  User,
  Filter
} from 'lucide-react'
import Header from '../components/layout/Header'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Textarea from '../components/common/Textarea'
import Modal from '../components/common/Modal'
import Table from '../components/common/Table'
import Badge from '../components/common/Badge'
import { visitsAPI, patientsAPI } from '../services/supabase'
import { formatCurrency } from '../utils/formatters'
import { formatDateArabic } from '../utils/dateHelpers'
import toast from 'react-hot-toast'

const Visits = () => {
  const [visits, setVisits] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterPaid, setFilterPaid] = useState('all')

  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [visitsData, patientsData] = await Promise.all([
        visitsAPI.getAll(),
        patientsAPI.getAll()
      ])
      setVisits(visitsData || [])
      setPatients(patientsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      // Don't show error toast if using mock data
      // toast.error('فشل تحميل البيانات')
    } finally {
      setLoading(false)
    }
  }

  const handleAddVisit = () => {
    reset()
    setIsModalOpen(true)
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      
      const visitData = {
        patient_id: data.patient_id,
        visit_date: new Date().toISOString(),
        service_type: data.service_type,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        cost: parseFloat(data.cost) || 0,
        paid: data.paid === 'true',
        notes: data.notes
      }

      await visitsAPI.create(visitData)
      toast.success('تم تسجيل الزيارة بنجاح')
      setIsModalOpen(false)
      reset()
      loadData()
    } catch (error) {
      toast.error('فشل تسجيل الزيارة')
    } finally {
      setLoading(false)
    }
  }

  const filteredVisits = visits.filter(visit => {
    if (filterPaid === 'paid') return visit.paid
    if (filterPaid === 'unpaid') return !visit.paid
    return true
  })

  const columns = [
    {
      header: 'التاريخ',
      accessor: 'visit_date',
      render: (row) => formatDateArabic(row.visit_date, 'dd/MM/yyyy')
    },
    {
      header: 'المريض',
      accessor: 'patient',
      render: (row) => (
        <div className="font-semibold text-gray-800">
          {row.patient?.name || 'غير محدد'}
        </div>
      )
    },
    {
      header: 'نوع الخدمة',
      accessor: 'service_type',
      render: (row) => (
        <Badge variant="info">{row.service_type}</Badge>
      )
    },
    {
      header: 'التشخيص',
      accessor: 'diagnosis',
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.diagnosis || '-'}
        </span>
      )
    },
    {
      header: 'التكلفة',
      accessor: 'cost',
      render: (row) => (
        <span className="font-semibold text-gray-800">
          {formatCurrency(row.cost)}
        </span>
      )
    },
    {
      header: 'حالة الدفع',
      accessor: 'paid',
      render: (row) => (
        <Badge variant={row.paid ? 'success' : 'warning'}>
          {row.paid ? 'مدفوع' : 'غير مدفوع'}
        </Badge>
      )
    }
  ]

  const totalRevenue = filteredVisits.reduce((sum, v) => sum + (v.cost || 0), 0)
  const paidRevenue = filteredVisits.filter(v => v.paid).reduce((sum, v) => sum + (v.cost || 0), 0)
  const unpaidRevenue = totalRevenue - paidRevenue

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="سجل الزيارات" 
        subtitle={`إجمالي ${visits.length} زيارة`}
      />

      <div className="p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium mb-1">المبالغ المدفوعة</p>
                <p className="text-2xl font-bold text-green-700">{formatCurrency(paidRevenue)}</p>
              </div>
              <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium mb-1">المبالغ المتبقية</p>
                <p className="text-2xl font-bold text-orange-700">{formatCurrency(unpaidRevenue)}</p>
              </div>
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select
                value={filterPaid}
                onChange={(e) => setFilterPaid(e.target.value)}
                options={[
                  { value: 'all', label: 'جميع الزيارات' },
                  { value: 'paid', label: 'المدفوعة فقط' },
                  { value: 'unpaid', label: 'غير المدفوعة فقط' }
                ]}
                className="max-w-xs"
              />
            </div>
            <Button
              variant="primary"
              icon={<ClipboardPlus className="w-5 h-5" />}
              onClick={handleAddVisit}
            >
              تسجيل زيارة جديدة
            </Button>
          </div>
        </div>

        {/* Visits Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <Table
            columns={columns}
            data={filteredVisits}
            emptyMessage="لا توجد زيارات مسجلة"
          />
        </div>
      </div>

      {/* Add Visit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="تسجيل زيارة جديدة"
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
              تسجيل الزيارة
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المريض <span className="text-red-500">*</span>
            </label>
            <Select
              options={patients.map(p => ({
                value: p.id,
                label: p.name
              }))}
              placeholder="اختر المريض"
              {...register('patient_id', { required: 'يجب اختيار المريض' })}
              error={errors.patient_id?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نوع الخدمة <span className="text-red-500">*</span>
            </label>
            <Select
              options={[
                { value: 'تنظيف', label: 'تنظيف' },
                { value: 'حشو', label: 'حشو' },
                { value: 'خلع', label: 'خلع' },
                { value: 'علاج جذور', label: 'علاج جذور' },
                { value: 'تقويم', label: 'تقويم' },
                { value: 'تبييض', label: 'تبييض' },
                { value: 'تاج', label: 'تاج' },
                { value: 'كشف', label: 'كشف' }
              ]}
              {...register('service_type', { required: 'نوع الخدمة مطلوب' })}
              error={errors.service_type?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              التشخيص
            </label>
            <Textarea
              placeholder="تشخيص الحالة..."
              rows={2}
              {...register('diagnosis')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              العلاج المقدم
            </label>
            <Textarea
              placeholder="تفاصيل العلاج..."
              rows={2}
              {...register('treatment')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                التكلفة (ج.م) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('cost', { required: 'التكلفة مطلوبة' })}
                error={errors.cost?.message}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                حالة الدفع
              </label>
              <Select
                options={[
                  { value: 'true', label: 'مدفوع' },
                  { value: 'false', label: 'غير مدفوع' }
                ]}
                {...register('paid')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ملاحظات
            </label>
            <Textarea
              placeholder="أي ملاحظات إضافية..."
              rows={2}
              {...register('notes')}
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Visits

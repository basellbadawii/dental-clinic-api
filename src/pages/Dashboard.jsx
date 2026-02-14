import { useState, useEffect } from 'react'
import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react'
import Header from '../components/layout/Header'
import StatCard from '../components/dashboard/StatCard'
import RecentAppointments from '../components/dashboard/RecentAppointments'
import QuickActions from '../components/dashboard/QuickActions'
import RevenueChart from '../components/dashboard/RevenueChart'
import AddPatientModal from '../components/modals/AddPatientModal'
import AddAppointmentModal from '../components/modals/AddAppointmentModal'
import AddVisitModal from '../components/modals/AddVisitModal'
import SendMessageModal from '../components/modals/SendMessageModal'
import { patientsAPI, appointmentsAPI, visitsAPI } from '../services/supabase'
import { formatCurrency } from '../utils/formatters'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    lastMonthRevenue: 0
  })
  const [recentAppointments, setRecentAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Modal states
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const [showAddVisit, setShowAddVisit] = useState(false)
  const [showSendMessage, setShowSendMessage] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load all data in parallel
      const [patients, todayAppts, visitStats] = await Promise.all([
        patientsAPI.getAll(),
        appointmentsAPI.getToday(),
        visitsAPI.getStats()
      ])

      // Calculate monthly revenue and growth
      const monthlyRevenue = visitStats?.monthlyRevenue || 0
      const lastMonthRevenue = visitStats?.lastMonthRevenue || 0
      const growth = lastMonthRevenue > 0 
        ? ((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
        : 0

      setStats({
        totalPatients: patients?.length || 0,
        todayAppointments: todayAppts?.length || 0,
        totalRevenue: visitStats?.totalRevenue || 0,
        monthlyRevenue: monthlyRevenue,
        monthlyGrowth: parseFloat(growth),
        lastMonthRevenue: lastMonthRevenue
      })

      setRecentAppointments(todayAppts?.slice(0, 5) || [])
    } catch (error) {
      console.error('Error loading dashboard:', error)
      // Don't show error toast if using mock data
      // toast.error('فشل تحميل بيانات لوحة التحكم')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPatient = () => {
    setShowAddPatient(true)
  }

  const handleAddAppointment = () => {
    setShowAddAppointment(true)
  }

  const handleAddVisit = () => {
    setShowAddVisit(true)
  }

  const handleSendMessage = () => {
    setShowSendMessage(true)
  }

  const handleModalSuccess = () => {
    loadDashboardData() // Reload data after successful operation
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="لوحة التحكم" 
        subtitle="نظرة عامة على أداء العيادة اليوم"
      />

      <div className="p-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="إجمالي المرضى"
            value={stats.totalPatients}
            icon={<Users className="w-6 h-6" />}
            color="blue"
            trend="up"
            trendValue="+15%"
            subtitle="مقارنة بالشهر الماضي"
          />
          
          <StatCard
            title="مواعيد اليوم"
            value={stats.todayAppointments}
            icon={<Calendar className="w-6 h-6" />}
            color="green"
            subtitle={`${stats.todayAppointments} موعد مجدول`}
          />
          
          <StatCard
            title="إيرادات الشهر"
            value={formatCurrency(stats.monthlyRevenue)}
            icon={<DollarSign className="w-6 h-6" />}
            color="purple"
            trend={stats.monthlyGrowth >= 0 ? "up" : "down"}
            trendValue={`${stats.monthlyGrowth >= 0 ? '+' : ''}${stats.monthlyGrowth}%`}
            subtitle="مقارنة بالشهر الماضي"
          />
          
          <StatCard
            title="معدل النمو"
            value={`${stats.monthlyGrowth}%`}
            icon={<TrendingUp className="w-6 h-6" />}
            color="orange"
            trend="up"
            trendValue="+2.5%"
            subtitle="مقارنة بالربع السابق"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments - Takes 2 columns */}
          <div className="lg:col-span-2">
            <RecentAppointments appointments={recentAppointments} />
          </div>

          {/* Quick Actions - Takes 1 column */}
          <div>
            <QuickActions
              onAddPatient={handleAddPatient}
              onAddAppointment={handleAddAppointment}
              onAddVisit={handleAddVisit}
              onSendMessage={handleSendMessage}
            />
          </div>
        </div>

        {/* Additional Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Revenue Chart */}
          <RevenueChart />

          {/* Revenue Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              ملخص الإيرادات
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">إيرادات هذا الشهر</p>
                  <p className="text-2xl font-bold text-purple-700">{formatCurrency(stats.monthlyRevenue)}</p>
                </div>
                <DollarSign className="w-12 h-12 text-purple-500" />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">إيرادات الشهر الماضي</p>
                  <p className="text-xl font-semibold text-gray-700">{formatCurrency(stats.lastMonthRevenue)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الإيرادات</p>
                  <p className="text-xl font-semibold text-gray-700">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">معدل النمو</p>
                  <p className="text-xl font-bold text-green-700">
                    {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth}%
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${stats.monthlyGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          </div>

          {/* Popular Services Placeholder */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              الخدمات الأكثر طلباً
            </h3>
            <div className="space-y-3">
              {[
                { name: 'تنظيف الأسنان', count: 45, percentage: 35 },
                { name: 'حشو الأسنان', count: 32, percentage: 25 },
                { name: 'تبييض الأسنان', count: 28, percentage: 22 },
                { name: 'تقويم الأسنان', count: 23, percentage: 18 }
              ].map((service, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        {service.name}
                      </span>
                      <span className="text-sm text-gray-600">
                        {service.count} مرة
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${service.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPatientModal 
        isOpen={showAddPatient} 
        onClose={() => setShowAddPatient(false)}
        onSuccess={handleModalSuccess}
      />
      <AddAppointmentModal 
        isOpen={showAddAppointment} 
        onClose={() => setShowAddAppointment(false)}
        onSuccess={handleModalSuccess}
      />
      <AddVisitModal 
        isOpen={showAddVisit} 
        onClose={() => setShowAddVisit(false)}
        onSuccess={handleModalSuccess}
      />
      <SendMessageModal 
        isOpen={showSendMessage} 
        onClose={() => setShowSendMessage(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}

export default Dashboard

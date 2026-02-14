import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { visitsAPI } from '../../services/supabase'
import { formatCurrency } from '../../utils/formatters'

const RevenueChart = () => {
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [trend, setTrend] = useState(0)

  useEffect(() => {
    loadChartData()
  }, [])

  const loadChartData = async () => {
    try {
      setLoading(true)
      
      // Get last 6 months data
      const visits = await visitsAPI.getAll()
      
      // Group by month
      const monthlyData = {}
      const now = new Date()
      
      // Initialize last 6 months
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        monthlyData[key] = {
          month: date.toLocaleDateString('ar-EG', { month: 'short' }),
          revenue: 0,
          count: 0
        }
      }

      // Calculate revenue per month
      visits?.forEach(visit => {
        const visitDate = new Date(visit.visit_date)
        const key = `${visitDate.getFullYear()}-${String(visitDate.getMonth() + 1).padStart(2, '0')}`
        
        if (monthlyData[key]) {
          monthlyData[key].revenue += visit.cost || 0
          monthlyData[key].count += 1
        }
      })

      const data = Object.values(monthlyData)
      setChartData(data)
      
      // Calculate total and trend
      const total = data.reduce((sum, item) => sum + item.revenue, 0)
      setTotalRevenue(total)
      
      // Calculate trend (compare last month with previous)
      if (data.length >= 2) {
        const lastMonth = data[data.length - 1].revenue
        const previousMonth = data[data.length - 2].revenue
        const trendValue = previousMonth > 0 
          ? ((lastMonth - previousMonth) / previousMonth * 100).toFixed(1)
          : 0
        setTrend(parseFloat(trendValue))
      }
    } catch (error) {
      console.error('Error loading chart data:', error)
    } finally {
      setLoading(false)
    }
  }

  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1)

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">الإيرادات الشهرية</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">الإيرادات الشهرية</h3>
          <p className="text-sm text-gray-600">آخر 6 أشهر</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalRevenue)}</p>
          <div className="flex items-center justify-end space-x-1 space-x-reverse mt-1">
            {trend >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend}%
            </span>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="relative h-48">
        <div className="absolute inset-0 flex items-end justify-between space-x-2 space-x-reverse">
          {chartData.map((item, index) => {
            const height = (item.revenue / maxRevenue) * 100
            const isLastMonth = index === chartData.length - 1
            
            return (
              <div key={index} className="flex-1 flex flex-col items-center group relative">
                {/* Bar */}
                <div className="relative w-full flex items-end" style={{ height: '180px' }}>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                      isLastMonth 
                        ? 'bg-gradient-to-t from-purple-500 to-purple-400' 
                        : 'bg-gradient-to-t from-primary-500 to-primary-400'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      <div className="font-semibold">{formatCurrency(item.revenue)}</div>
                      <div className="text-gray-300">{item.count} زيارة</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  </div>
                </div>
                
                {/* Month Label */}
                <div className="mt-2 text-xs text-gray-600 font-medium">
                  {item.month}
                </div>
                
                {/* Revenue Label */}
                {item.revenue > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {(item.revenue / 1000).toFixed(0)}k
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-primary-500 to-primary-400"></div>
          <span className="text-xs text-gray-600">الأشهر السابقة</span>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <div className="w-3 h-3 rounded bg-gradient-to-br from-purple-500 to-purple-400"></div>
          <span className="text-xs text-gray-600">الشهر الحالي</span>
        </div>
      </div>
    </div>
  )
}

export default RevenueChart

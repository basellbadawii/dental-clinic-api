import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Activity, Mail, Lock, LogIn, UserCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authAPI } from '../services/supabase'
import Button from '../components/common/Button'
import Input from '../components/common/Input'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [loading, setLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const userData = await authAPI.login(data.email, data.password)
      login(userData)
      toast.success(`مرحباً ${userData.fullName}`)
      navigate('/')
    } catch (error) {
      toast.error(error.message || 'فشل تسجيل الدخول')
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    // Guest user data
    const guestUser = {
      id: 'guest-user',
      email: 'guest@dental.com',
      fullName: 'زائر تجريبي',
      role: 'admin'
    }
    
    login(guestUser)
    toast.success(`مرحباً ${guestUser.fullName}! دخول تجريبي بدون قاعدة البيانات`)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4 shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            نظام إدارة عيادة الأسنان
          </h1>
          <p className="text-gray-600">
            قم بتسجيل الدخول للوصول إلى لوحة التحكم
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slideInRight">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <Input
                type="email"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                placeholder="example@dental.com"
                {...register('email', {
                  required: 'البريد الإلكتروني مطلوب',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'البريد الإلكتروني غير صحيح'
                  }
                })}
                error={errors.email?.message}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <Input
                type="password"
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                placeholder="••••••••"
                {...register('password', {
                  required: 'كلمة المرور مطلوبة',
                  minLength: {
                    value: 6,
                    message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
                  }
                })}
                error={errors.password?.message}
              />
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  {...register('remember')}
                />
                <span className="mr-2 text-sm text-gray-600">تذكرني</span>
              </label>
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                نسيت كلمة المرور؟
              </a>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
              icon={<LogIn className="w-5 h-5" />}
            >
              تسجيل الدخول
            </Button>
          </form>

          {/* Divider */}
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Guest Login Button */}
          <Button
            type="button"
            variant="secondary"
            className="w-full mt-6"
            onClick={handleGuestLogin}
            icon={<UserCircle className="w-5 h-5" />}
          >
            دخول تجريبي (معاينة التصميم)
          </Button>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 text-center mb-2 font-medium">
              بيانات تجريبية للدخول (بعد إعداد Supabase):
            </p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>البريد:</strong> admin@dental.com</p>
              <p><strong>كلمة المرور:</strong> admin123</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          © 2024 نظام إدارة عيادة الأسنان. جميع الحقوق محفوظة.
        </p>
      </div>
    </div>
  )
}

export default Login

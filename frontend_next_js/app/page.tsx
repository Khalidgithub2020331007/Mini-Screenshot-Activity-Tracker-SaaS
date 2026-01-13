'use client'

import { useEffect, useState } from 'react'
import api from '@/app/api/axios'
import { useRouter } from 'next/navigation'

export default function LoginRedirect() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.post('/checklogin')
        const role = res.data.user.role

        if (role === 'owner') {
          router.push('/dashboard/owner')
        } else if (role === 'employee') {
          router.push('/dashboard/employee/upload_screenshot')
        } else {
          router.push('/auth/login')
        }
      } catch {
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkLogin()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center gap-4">
        {/* Logo or title */}
        <h1 className="text-2xl font-bold text-blue-700">My App</h1>

        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-blue-300 border-t-blue-700 rounded-full animate-spin"></div>

        {/* Status text */}
        <p className="text-gray-600 font-medium">Checking login status...</p>
      </div>
    </div>
  )
}

'use client'
import React, { useEffect, useState } from 'react'
import api from '@/app/api/axios'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { Cog } from 'lucide-react'

export default function EmployeeListLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
    const router = useRouter()
    const pathname = usePathname()
    console.log(pathname)

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const res = await api.post('/checklogin')
        setName(res.data.user.name)
        setRole(res.data.user.role)
      } catch (err) {
        console.error('Failed to fetch user data', err)
        router.push('/login_register/login') // redirect if not logged in
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (err: unknown) {
      console.error('Logout failed:', err)
    } finally {
      router.push('/auth/login')
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-md p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Logged in as: <span className="font-semibold">{name || 'N/A'}</span> | Role: <span className="font-semibold capitalize">{role || 'N/A'}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
          { pathname!=='/dashboard/owner/employee_create' &&<button
            onClick={() => router.push('/dashboard/owner/employee_create')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
          >
            Create Employee
          </button>}

          {pathname !== '/dashboard/owner/employee_list'
            && !pathname.includes('show_screenshot')
            && <button
                      onClick={() => router.push('/dashboard/owner/employee_list')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
                  >
                      Employee List
                  </button>}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <svg
              className="animate-spin h-10 w-10 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
              ></path>
            </svg>
          </div>
        ) : (
          <div className="w-full">{children}</div>
        )}
      </main>
    </div>
  )
}

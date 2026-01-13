'use client'

import { useEffect, useState } from 'react'
import api from '@/app/api/axios'
import { Trash2 } from 'lucide-react'
import type { User } from '@/app/types'
import { useRouter } from 'next/navigation'

type Meta = {
  currentPage: number
  firstPage: number
  lastPage: number
  totalPages: number
  perPage: number
  total: number
}

const EmployeeListShow = () => {
  const router = useRouter()

  const [employees, setEmployees] = useState<User[]>([])
  const [meta, setMeta] = useState<Meta>({
    currentPage: 1,
    firstPage: 1,
    lastPage: 1,
    totalPages: 1,
    perPage: 10,
    total: 0,
  })

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(5)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  /* ---------------- FETCH EMPLOYEES ---------------- */
  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const res = await api.get('/employees_list', {
        params: {
          page,
          limit,
          name: searchQuery || '',
        },
      })
      console.log(res)
      

      const responseData = res.data?.data
      if (!responseData) {
        setEmployees([])
        return
      }

      setEmployees(responseData.data)

      const m = responseData.meta
      setMeta({
        currentPage: m.currentPage,
        firstPage: m.firstPage,
        lastPage: m.lastPage,
        perPage: m.perPage,
        totalPages: Math.ceil(m.total / m.perPage),
        total: m.total,
      })
    } catch (error) {
      console.error(error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    const t = setTimeout(fetchEmployees, 300)
    return () => clearTimeout(t)
  }, [page, searchQuery])

  /* ---------------- DELETE ---------------- */
  const confirmDelete = async () => {
    if (!deleteUserId) return
    setDeleting(true)
    try {
      await api.delete('/delete-employee', {
        params: { employeeId: deleteUserId },
      })
      setDeleteUserId(null)
      fetchEmployees()
    } finally {
      setDeleting(false)
    }
  }

  /* ---------------- NAVIGATION ---------------- */
  const showScreenshots = (id: number) => {
    const date = new Date().toISOString().split('T')[0]
    console.log(date)
    router.push(`/dashboard/owner/employee_list/show_screenshot/${id}?date=${date}`)
  }

  /* ---------------- RENDER ---------------- */
  return (
    <div className="p-6 bg-gray-50 min-h-[70vh] rounded-lg shadow">
      <h2 className="text-2xl font-bold text-center mb-6">
        Employee List
        

      </h2>
      <p className="text-center text-sm text-gray-600 mb-4">
          Total Employees: <span className="font-semibold">{meta.total}</span>
        </p>

      {/* Search */}
      <div className="mb-6 flex justify-center">
        <input
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setPage(1)
          }}
          placeholder="Search employee..."
          className="w-full max-w-sm px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="text-center">No employees found</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((emp) => (
            <li
              key={emp.id}
              onClick={() => showScreenshots(emp.id)}
              className="relative bg-white rounded-xl p-5 shadow hover:shadow-lg cursor-pointer group"
            >
              <p className="font-semibold">{emp.name}</p>
              <p className="text-sm text-gray-500">{emp.email}</p>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteUserId(emp.id)
                }}
                className="absolute top-3 right-3 p-2 bg-red-50 text-red-600 rounded-full opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ---------------- PAGINATION ---------------- */}
      {meta.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Prev */}
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {/* Pages */}
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 border rounded ${
                  page === p
                    ? 'bg-blue-600 text-white'
                    : 'bg-white'
                }`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            disabled={page === meta.totalPages}
            onClick={() =>
              setPage((p) =>
                Math.min(meta.totalPages, p + 1)
              )
            }
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* ---------------- DELETE MODAL ---------------- */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <p className="text-center font-medium">
              Delete this employee?
            </p>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setDeleteUserId(null)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeListShow

// app.tsx
import { useEffect, useState } from 'react'
import CompanyRegister from './login_registration/Compnay_register'
import Login from './login_registration/Login'
import MemberDashboard from './dashboard/employee_dashboard/Employee_template'
import OwnerDashboard from './dashboard/company_dashboard/Owner_template'
import api from './api/axios'

type Page ='login'| 'companyRegister'| 'employeeDashboard'| 'ownerDashboard'

function App() {
  const [page, setPage] = useState<Page>('login')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await api.post('/checklogin', {
        })

        if (res.status === 200) {
          if (res.data.role === 'owner') {
            setPage('ownerDashboard')
          } else {
            setPage('employeeDashboard')
          }
        }
      } catch  {
        setPage('login')
      } finally {
        setLoading(false)
      }
    }

    checkLogin()
  }, [])

  const handleSetPage = (newPage: Page) => {
    setPage(newPage)
  }

  const showAuthLayout =
    page !== 'ownerDashboard' && page !== 'employeeDashboard'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">Checking session...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      {showAuthLayout && (
        <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
          Mini Screenshot Activity Tracker SaaS
        </header>
      )}

      {/* Auth Pages */}
      {showAuthLayout ? (
        <div className="flex min-h-[calc(100vh-64px)]">
          <main className="w-full p-6">
            {page === 'login' && (
              <Login setname={setName} goToPage={handleSetPage} />
            )}
            {page === 'companyRegister' && (
              <CompanyRegister goToPage={handleSetPage} />
            )}
          </main>
        </div>
      ) : (
        /* Dashboards */
        <main className="p-4">
          {page === 'ownerDashboard' && (
            <OwnerDashboard
              name={name}
              onLogout={() => handleSetPage('login')}
            />
          )}

          {page === 'employeeDashboard' && (
            <MemberDashboard
              name={name}
              onLogout={() => handleSetPage('login')}
            />
          )}
        </main>
      )}
    </div>
  )
}

export default App

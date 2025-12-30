import { useState } from 'react';
import compnay_register from './login_registration/compnay_register';
import login from './login_registration/login';
import employee_template from './dashboard/employee_dashboard/employee_template';
import owner_template from './dashboard/company_dashboard/owner_template';

type Page =  'login' | 'companyRegister' | 'employeeDashboard' | 'ownerDashboard';
function App() {
  const getInitialPage = (): Page => {
    const savedPage = localStorage.getItem('page') as Page | null;
    if (savedPage) {
      return savedPage;
    }

    const userStr = localStorage.getItem('loggedInUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.role === 'owner' ? 'ownerDashboard' : 'employeeDashboard';
    }
    return 'login';
  };
  const handleSetPage = (newPage:Page) => {
    setPage(newPage);
    localStorage.setItem('page', newPage);
  }

  const [page, setPage] = useState<Page>(getInitialPage);

  const showAuthLayout = page !== 'ownerDashboard' && page !== 'employeeDashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      {showAuthLayout && (
        <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
          Multi-Tenant-SaaS-Workspace-Notes
        </header>
      )}

      {/* ===== 20% / 80% Layout ===== */}
      {showAuthLayout ? (
        <div className="flex min-h-[calc(100vh-64px)]">
          {/* 🔹 Left Sidebar (20%) */}
          <aside className="w-1/5 bg-gray-200 p-4 border-r">
            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSetPage('companyRegister')}
                className={`px-4 py-2 rounded text-left hover:bg-gray-300 transition
                  ${page === 'companyRegister' ? 'bg-gray-300 font-semibold' : ''}`}
              >
                User Register
              </button>

              <button
                onClick={() => handleSetPage('login')}
                className={`px-4 py-2 rounded text-left hover:bg-gray-300 transition
                  ${page === 'login' ? 'bg-gray-300 font-semibold' : ''}`}
              >
                User Login
              </button>

            
            </div>
          </aside>

          {/* 🔹 Right Content (80%) */}
          <main className="w-4/5 p-6">
            {page === 'companyRegister' && <compnay_regist goToPage={handleSetPage} />}
            {page === 'login' && <Login goToPage={handleSetPage} />}
            {page === 'companyRegister' && <CompanyRegister goToPage={handleSetPage} />}
          </main>
        </div>
      ) : (
        /* Dashboards (full width) */
        <main className="p-4">
          {page === 'ownerDashboard' && (
            <OwnerDashboard onLogout={() => handleSetPage('userLogin')} />
          )}
          {page === 'employeeDashboard' && (
            <MemberDashboard onLogout={() => handleSetPage('userLogin')} />
          )}
        </main>
      )}
    </div>
  );
}
export default App;
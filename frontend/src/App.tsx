import { useState } from 'react';
import CompanyRegister from './login_registration/Compnay_register';
import Login from './login_registration/Login';
import MemberDashboard from './dashboard/employee_dashboard/Employee_template';
import OwnerDashboard from './dashboard/company_dashboard/Owner_template';

type Page =  'login' | 'companyRegister' | 'employeeDashboard' | 'ownerDashboard';
function App() {
  const getInitialPage = (): Page => {
    
    return 'login';
  };
  const handleSetPage = (newPage:Page) => {
    setPage(newPage);
    localStorage.setItem('page', newPage);
  }
  const [name, setName] = useState('');

  const [page, setPage] = useState<Page>(getInitialPage);

  const showAuthLayout = page !== 'ownerDashboard' && page !== 'employeeDashboard';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      {showAuthLayout && (
        <header className="bg-blue-600 text-white p-4 text-center text-xl font-bold">
          Mini Screenshot Activity Tracker SaaS
        </header>
      )}

      {/* ===== 20% / 80% Layout ===== */}
      {showAuthLayout ? (
        <div className="flex min-h-[calc(100vh-64px)]">
          {/* 🔹 Left Sidebar (20%) */}
          

          {/* 🔹 Right Content (80%) */}
          <main className="w-5/5 p-6">
            {page === 'login' && <Login setname={setName} goToPage={handleSetPage} />}
            {page === 'companyRegister' && <CompanyRegister goToPage={handleSetPage} />}
          </main>
        </div>
      ) : (
        /* Dashboards (full width) */
        <main className="p-4">
          {page === 'ownerDashboard' && (
            <OwnerDashboard name={name} onLogout={() => handleSetPage('login')} />
          )}
          {/* {page === 'employeeDashboard' && ( */}
            {/* // <MemberDashboard name={name} onLogout={() => handleSetPage('login')} /> */}
          {/* )} */}
        </main>
      )}
    </div>
  );
}
export default App;
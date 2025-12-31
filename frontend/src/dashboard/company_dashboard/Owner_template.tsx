import { useState } from 'react';
import TopNavbar from './TopNavbar';
import EmployeeRegister from './Employee_register';
import EmployeeList from './Employee_List_Show';

type Page = 'createEmployee' | 'employeeList';

const OwnerTemplate = ({ onLogout }: { onLogout: () => void }) => {
  const [activePage, setActivePage] = useState<Page>('createEmployee');

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10">
        <TopNavbar onLogout={onLogout} />
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left Sidebar - 20% */}
        <aside className="w-1/5 bg-gray-100 p-4 space-y-4">
          <button
            onClick={() => setActivePage('createEmployee')}
            className={`w-full p-2 rounded ${
              activePage === 'createEmployee' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Create Employee
          </button>
          <button
            onClick={() => setActivePage('employeeList')}
            className={`w-full p-2 rounded ${
              activePage === 'employeeList' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Employee List
          </button>
        </aside>

        {/* Right Content - 80% */}
        <main className="w-4/5 p-4">
          {activePage === 'createEmployee' && (
            <EmployeeRegister onEmployeeCreated={() => setActivePage('employeeList')} />
          )}
          {activePage === 'employeeList' && <EmployeeList />}
        </main>
      </div>
    </div>
  );
};

export default OwnerTemplate;

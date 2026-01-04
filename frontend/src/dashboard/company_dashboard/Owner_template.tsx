import { useState } from 'react';
import TopNavbar from './TopNavbar';
import EmployeeRegister from './Employee_register';
import EmployeeList from './Employee_List_Show';
import Add_ScreenShots from './Add_ScreenShots';
import Show_Screenshot from './Show_Screenshot';

type Page = 'createEmployee' | 'employeeList' | 'addScreenShots' | 'showScreenShots';

type OwnerTemplateProps = {
  onLogout: () => void;
  name: string;
};

const OwnerTemplate: React.FC<OwnerTemplateProps> = ({ onLogout, name }) => {
  const [activePage, setActivePage] = useState<Page>('createEmployee');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-20 shadow-md bg-white">
        <TopNavbar name={name} onLogout={onLogout} />
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-1/5 bg-white shadow-lg p-4 space-y-4 h-screen sticky top-16 overflow-y-auto rounded-r-lg">
          <button
            onClick={() => setActivePage('createEmployee')}
            className={`w-full p-3 rounded-lg font-medium text-left transition-all duration-200
              ${
                activePage === 'createEmployee'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
              }`}
          >
            Create Employee
          </button>

          <button
            onClick={() => setActivePage('employeeList')}
            className={`w-full p-3 rounded-lg font-medium text-left transition-all duration-200
              ${
                activePage === 'employeeList'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
              }`}
          >
            Employee List
          </button>

          <button
            onClick={() => setActivePage('addScreenShots')}
            className={`w-full p-3 rounded-lg font-medium text-left transition-all duration-200
              ${
                activePage === 'addScreenShots'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
              }`}
          >
            Add Screenshots
          </button>

          <button
            onClick={() => setActivePage('showScreenShots')}
            className={`w-full p-3 rounded-lg font-medium text-left transition-all duration-200
              ${
                activePage === 'showScreenShots'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                  : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
              }`}
          >
            Show Own Screenshots
          </button>
        </aside>

        {/* Right Content */}
        <main className="w-4/5 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 min-h-[80vh]">
            {activePage === 'createEmployee' && (
              <EmployeeRegister onEmployeeCreated={() => setActivePage('employeeList')} />
            )}
            {activePage === 'employeeList' && <EmployeeList />}
            {activePage === 'addScreenShots' && <Add_ScreenShots />}
            {activePage === 'showScreenShots' && <Show_Screenshot />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerTemplate;

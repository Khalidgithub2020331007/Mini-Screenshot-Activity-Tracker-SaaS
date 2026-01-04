import React, { useState } from 'react';
import TopNavbar from './TopNavbar';
import Show_Screenshot from './Show_Screenshot';
import Add_ScreenShots from './Add_ScreenShots';

type Page = 'showScreenshot' | 'addScreenShots';

type EmployeeTemplateProps = {
  onLogout: () => void;
  name: string;
};

const EmployeeTemplate: React.FC<EmployeeTemplateProps> = ({ onLogout, name }) => {
  const [activePage, setActivePage] = useState<Page>('showScreenshot');
  // console.log(name)

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-10 shadow bg-white">
        <TopNavbar onLogout={onLogout} name={name} />
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-2">
          <button
            onClick={() => setActivePage('showScreenshot')}
            className={`w-full py-2 px-4 rounded-lg text-left font-medium transition-colors ${
              activePage === 'showScreenshot'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-blue-100 text-gray-700'
            }`}
          >
            Show Own Screenshots
          </button>
          <button
            onClick={() => setActivePage('addScreenShots')}
            className={`w-full py-2 px-4 rounded-lg text-left font-medium transition-colors ${
              activePage === 'addScreenShots'
                ? 'bg-blue-500 text-white'
                : 'hover:bg-blue-100 text-gray-700'
            }`}
          >
            Add Screenshots
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activePage === 'showScreenshot' && <Show_Screenshot />}
          {activePage === 'addScreenShots' && <Add_ScreenShots />}
        </main>
      </div>
    </div>
  );
};

export default EmployeeTemplate;

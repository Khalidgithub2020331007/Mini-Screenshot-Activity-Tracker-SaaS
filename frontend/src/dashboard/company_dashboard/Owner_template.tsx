import { useEffect, useState } from 'react'
import TopNavbar from './TopNavbar'
import EmployeeRegister from './Employee_register'
import EmployeeList from './Employee_List_Show'
// import Add_ScreenShots from './Add_ScreenShots'
// import Show_Screenshot from './Show_Screenshot'

type Page =
  | 'createEmployee'
  | 'employeeList'
  | 'addScreenShots'
  | 'showScreenShots'

type OwnerTemplateProps = {
  onLogout: () => void
  name: string
}

const STORAGE_KEY = 'owner_active_page'

const OwnerTemplate: React.FC<OwnerTemplateProps> = ({ onLogout, name }) => {
  const [activePage, setActivePage] = useState<Page>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return (saved as Page) || 'createEmployee'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, activePage)
    // console.log('dependenci usesseffect')
  }, [activePage])

 

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 shadow-md bg-white">
        <TopNavbar name={name} onLogout={onLogout} />
      </header>

      <div className="flex flex-1">
        <aside className="w-1/5 bg-white shadow-lg p-4 space-y-4 h-screen sticky top-16 overflow-y-auto rounded-r-lg">
          <SidebarButton
            label="Create Employee"
            active={activePage === 'createEmployee'}
            onClick={() => setActivePage('createEmployee')}
          />

          <SidebarButton
            label="Employee List"
            active={activePage === 'employeeList'}
            onClick={() => setActivePage('employeeList')}
          />

          {/* <SidebarButton
            label="Add Screenshots"
            active={activePage === 'addScreenShots'}
            onClick={() => setActivePage('addScreenShots')}
          />

          <SidebarButton
            label="Show Own Screenshots"
            active={activePage === 'showScreenShots'}
            onClick={() => setActivePage('showScreenShots')}
          /> */}
        </aside>

        <main className="w-4/5 p-6">
          <div className="bg-white shadow-lg rounded-lg p-6 min-h-[80vh]">
            {activePage === 'createEmployee' && (
              <EmployeeRegister
                onEmployeeCreated={() => setActivePage('employeeList')}
              />
            )}
            {activePage === 'employeeList' && <EmployeeList />}
            {/* {activePage === 'addScreenShots' && <Add_ScreenShots />} */}
            {/* {activePage === 'showScreenShots' && <Show_Screenshot />} */}
          </div>
        </main>
      </div>
    </div>
  )
}

export default OwnerTemplate

function SidebarButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-3 rounded-lg font-medium text-left transition-all duration-200 ${
        active
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
          : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
      }`}
    >
      {label}
    </button>
  )
}

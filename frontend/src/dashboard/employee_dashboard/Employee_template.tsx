import React from 'react'
import TopNavbar from './TopNavbar'

const employee_template = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
            <header className="sticky top-0 z-10">
        <TopNavbar onLogout={onLogout} />
      </header>

      
      
    </div>
  )
}

export default employee_template

import React from 'react'
import Navbar from '../Navbar'
import Dashboard from '../Dashboard';
const AdminDashboardPage = () => {
    const tabs = [
        {
          id: 'AttendenceDashboardTab',
          label: 'Attendence Dashboard',
          component: <Dashboard />,
        },
        {
          id: 'classesTab',
          label: 'Today Classes',
          component: <div>Analytics</div>,
        },
        
      ];
    
      return (
        <div className="font-sans p-4 w-full flex flex-col items-center ml-[18%] bg-gray-100" >
          <Navbar tabs={tabs} />
        </div>
      );
    };

export default AdminDashboardPage

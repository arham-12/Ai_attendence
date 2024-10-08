import React from 'react'
import Navbar from '../components/Navbar'
import Dashboard from '../components/Dashboard';
import TodayClasses from '../components/TodayClasses';
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
          component: <TodayClasses/>,
        },
        
      ];
    
      return (
        <div className="font-sans p-4 w-full flex flex-col items-center ml-[18%] bg-gray-100" >
          <Navbar tabs={tabs} />
        </div>
      );
    };

export default AdminDashboardPage

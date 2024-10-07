import React from 'react'
import Navbar from '../Navbar'
import Students from './Studends'
import Teacher from './Teacher'
import AttendanceAnalytics from './AttendenceAnalytics'
import { Outlet } from 'react-router-dom'
const UserAnalitics = () => {
  const tabs = [
    {
      id: 'StudentsTab',
      label: 'Students',
      component: <Students />,
    },
    {
      id: 'TeachersTab',
      label: 'Teachers',
      component: <Teacher />,
    },
    {
      id: 'AttendanceAnalyticsTab',
      label: 'Attendance Analysis',
      component: <AttendanceAnalytics />,
    },
  ];

  return (
    <div className="font-sans p-4 w-full flex flex-col items-center ml-[18%]" >
      <Navbar tabs={tabs} />
    </div>
  );
};


export default UserAnalitics

import React from 'react'
import Navbar from '../components/Navbar'
import ExisitingSchedule from '../components/ExisitingSchedule';
import StepForm from '../components/SetNewSchedule';
import ScheduleForm from '../components/SschduleForm';
const SchedulePage = () => {
  const tabs = [
    {
      id: 'existingscheduleTab',
      label: 'Existing Schedule',
      component: <ExisitingSchedule />,
    },
    {
      id: 'setnewscheduleTab',
      label: 'Set New Schedule',
      component: <StepForm/>,
    },
    
  ];

  return (
    <div className="font-sans p-4 w-full flex flex-col items-center ml-[18%] bg-gray-100">
      <Navbar tabs={tabs} />
    </div>
  )
}

export default SchedulePage

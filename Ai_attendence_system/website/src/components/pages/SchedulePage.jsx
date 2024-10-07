import React from 'react'
import Navbar from '../Navbar'
import ExisitingSchedule from '../ExisitingSchedule';
import StepForm from '../SetNewSchedule';
import ScheduleForm from '../SschduleForm';
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
      component: <ScheduleForm/>,
    },
    
  ];

  return (
    <div className="font-sans p-4 w-full flex flex-col items-center ml-[18%] bg-gray-100">
      <Navbar tabs={tabs} />
    </div>
  )
}

export default SchedulePage

import React from 'react'
import Navbar from '../components/Navbar'
import AddStudentIDs from '../components/AddStudentIDs';
// import DbCredential from '../components/DbCredential';
import DatabaseCOnectionPage from './DatabaseConectionPage';
const ManageStudents = () => {
    const tabs = [
        {
          id: 'StudentIDsTab',
          label: 'Students Details',
          component: <AddStudentIDs />,
        },
        {
          id: 'DbcredentialTab',
          label: 'Add Database',
          component: <DatabaseCOnectionPage/>,
        },
        
      ];
    
      return (
        <div className="font-sans relative h-screen overflow-hidden w-full flex flex-col items-center lg:ml-[18%] bg-gray-100">
          <Navbar tabs={tabs} />
        </div>
      )
    }

export default ManageStudents

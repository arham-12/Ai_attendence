import React from 'react'
import Navbar from '../components/Navbar'
import AddStudentIDs from '../components/AddStudentIDs';
import DbCredential from '../components/DbCredential';
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
          component: <DbCredential/>,
        },
        
      ];
    
      return (
        <div className="font-sans p-4 w-full flex flex-col items-center ml-[18%] bg-gray-100">
          <Navbar tabs={tabs} />
        </div>
      )
    }

export default ManageStudents

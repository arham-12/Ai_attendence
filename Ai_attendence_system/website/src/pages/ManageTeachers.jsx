import React from 'react'
import Navbar from '../components/Navbar';
import SearchStudent from '../components/SearchStudent';
import AddStudentIDs from '../components/AddStudentIDs';
import DatabaseConnectionPage from './DatabaseConectionPage';

const ManageTeachers = () => {
        const tabs = [
          {
            id: 'SearchStudent',
            label: 'Search Student',
            component: <SearchStudent/>,
          },
            {
              id: 'StudentIDsTab',
              label: 'Add Students',
              component: <AddStudentIDs />,
            },
            {
              id: 'DbcredentialTab',
              label: 'Import Data',
              component: <DatabaseConnectionPage/>,
            },
         
            
          ];
        
          return (
            <div className="font-sans relative h-screen overflow-hidden w-full flex flex-col items-center lg:ml-[18%] bg-gray-100">
              <Navbar tabs={tabs} />
            </div>
          )
        
}

export default ManageTeachers
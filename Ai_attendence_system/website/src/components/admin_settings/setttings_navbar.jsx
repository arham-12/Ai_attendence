// ParentComponent.js
import React, { useState } from 'react';
import Navbar from '../Navbar';
import { Outlet } from 'react-router-dom';
import { MdBusiness, MdSupervisorAccount, MdSchool, MdSettings } from 'react-icons/md'; // Import icons

const ParentComponent = () => {
  const [activeLink, setActiveLink] = useState('department');

  // Define the links with icons
  const links = [
    { key: 'department', label: 'Departments', path: '/settings', icon: MdBusiness },
    {key: 'see departments', label: 'See departments', path: '/settings/see-departments', icon: MdBusiness},
    // { key: 'students', label: 'Manage Students', path: '/settings/students', icon: MdSupervisorAccount },
    // { key: 'teachers', label: 'Manage Teachers', path: '/settings/teachers', icon: MdSchool },
    { key: 'adminSettings', label: 'Admin Settings', path: '/settings/admin-settings', icon: MdSettings },
  ];

  // Handler to set the active link
  const handleLinkClick = (key) => {
    setActiveLink(key);
  };

  return (
    <>
    <div className="ml-[35%] w-[50%]">
      <Navbar links={links} activeLink={activeLink} handleLinkClick={handleLinkClick} />
      {/* Add your Routes here */}

    </div>
    </>
    
  );
};

export default ParentComponent;

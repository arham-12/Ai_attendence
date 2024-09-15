import React from 'react';
import { FiHome, FiUsers, FiSettings, FiLogOut, FiPieChart } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed h-screen w-[20%] bg-blue-900 text-white flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-blue-800">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col py-4 space-y-4">
        <Link to = "/" className="flex items-center px-4 py-2 text-white hover:bg-blue-700">
          <FiHome className="mr-3" />
          <span>Dashboard</span>
        </Link>
        <Link to = "/schedule" className="flex items-center px-4 py-2 text-white hover:bg-blue-700">
          <FiPieChart className="mr-3" />
          <span>Schedule Classes</span>
        </Link>
        <Link to = "/manage-students" className="flex items-center px-4 py-2 text-white hover:bg-blue-700">
          <FiUsers className="mr-3" />
          <span>Manage Students</span>
        </Link>
        <Link to =  "/settings" className="flex items-center px-4 py-2 text-white hover:bg-blue-700">
          <MdSchool className="mr-3" />
          <span>Manage Teachers</span>
        </Link>
        <Link to = "/logout" className="mt-auto flex items-center px-4 py-2 text-white hover:bg-blue-700">
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

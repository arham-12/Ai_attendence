import React from 'react';
import { FiHome, FiSearch, FiSettings, FiLogOut, FiPieChart } from 'react-icons/fi';

import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed h-screen w-[20%] bg-secondary text-white flex flex-col">
      {/* Logo Section */}
      <div className="flex items-center justify-center bg-primary h-20 border-b border-blue-800">
        <h1 className="text-2xl font-semibold text-gray-800">Admin Pannel</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col py-4 space-y-4 " >
        <Link to = "/" className="flex items-center px-4 py-2 text-gray-700 hover:text-white hover:bg-blue-700">
          <FiHome className="mr-3" />
          <span>Dashboard</span>
        </Link>
        <Link to = "/schedule" className="flex items-center px-4 py-2 text-gray-700 hover:text-white hover:bg-blue-700">
          <FiPieChart className="mr-3" />
          <span>Schedule Classes</span>
        </Link>
        <Link to = "/search-content" className="flex items-center px-4 py-2 text-gray-700 hover:text-white hover:bg-blue-700">
          <FiSearch className="mr-3" />
          <span>Smart Content Retriever</span>
        </Link>
        <Link to =  "/settings" className="flex items-center px-4 py-2 text-gray-700 hover:text-white hover:bg-blue-700">
          <FiSettings className="mr-3" />
          <span>Settings </span>
        </Link>
        <Link to = "/logout" className="mt-auto flex items-center px-4 py-2 text-gray-700 hover:text-white hover:bg-blue-700">
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

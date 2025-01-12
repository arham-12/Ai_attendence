import React, { useState } from 'react';

const Navbar = ({ tabs }) => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div className="font-sans p-4 w-full flex flex-col items-center ">
      <ul className="flex gap-4 bg-gray-100 rounded-lg p-1 w-max overflow-hidden shadow-md">
        {tabs.map((tab) => (
          <li
            key={tab.id}
            id={tab.id}
            className={`tab text-sm py-3 px-6 tracking-wide cursor-pointer rounded-md ${
              activeTab === tab.id
                ? 'text-white font-bold bg-gradient-to-r bg-primary'
                : 'text-black text-[12px]'
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </li>
        ))}
      </ul>

      {/* Conditional Rendering of Content */}
      <div className="mt-4 w-full">
        {tabs.map((tab) => (
          activeTab === tab.id && <div key={tab.id}>{tab.component}</div>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
import React from 'react';

const StatsCard = ({ title, value, icon }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-5 flex flex-row items-center space-x-4">
      {/* Conditionally render the icon if it's provided */}
      {icon && (
        <div className="text-primary text-4xl">
          {icon}
        </div>
      )}
      
      <div className="flex flex-col">
        <h2 className="text-lg font-semibold text-gray-600">{title}</h2>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;

  
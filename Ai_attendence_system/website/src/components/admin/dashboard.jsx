import React from 'react';
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt, FaCheckCircle, FaUsers } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="ml-[20%] h-screen flex w-[80%] flex-col flex-1 p-6 bg-blue-100">
      {/* Header Section */}
      <div className=" container  bg-primary mt-[5%]  rounded-lg ml-[37%] w-[20%] mb-6 justify-center items-center flex drop-shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800">DASHBOARD</h1>
        {/* <p className="text-gray-600">Overview of the system's performance and statistics</p> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 lg:grid-cols-4 gap-24 mb-6 ml-[15%]">
        {/* Total Students */}
        <div className="bg-white shadow-md w-56 rounded-lg p-6 flex items-center space-x-4 ">
          <div className="p-4 bg-blue-500 text-white rounded-full">
            <FaUserGraduate size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Students</p>
            <h2 className="text-2xl font-bold">1,200</h2>
          </div>
        </div>

        {/* Total Teachers */}
        <div className="bg-white shadow-md w-56  rounded-lg p-6 flex items-center space-x-4">
          <div className="p-4 bg-green-500 text-white rounded-full">
            <FaChalkboardTeacher size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Teachers</p>
            <h2 className="text-2xl font-bold">80</h2>
          </div>
        </div>

        {/* Today's Attendance */}
        <div className="bg-white shadow-md w-56  rounded-lg p-6 flex items-center space-x-4">
          <div className="p-4 bg-purple-500 text-white rounded-full">
            <FaCalendarAlt size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Today’s Classes</p>
            <h2 className="text-2xl font-bold">5</h2>
          </div>
        </div>
      </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-md mt-[3%] rounded-lg p-6 ml-[20%] w-[60%]">
          <h3 className="text-xl font-semibold mb-4">Todays Classes</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-4">
              <div className="p-2 bg-blue-500 text-white rounded-full">
                <FaUsers size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">John Doe marked present</p>
                <span className="text-gray-400 text-xs">2 hours ago</span>
              </div>
            </li>
            <li className="flex items-center space-x-4">
              <div className="p-2 bg-green-500 text-white rounded-full">
                <FaUsers size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Mary Jane marked absent</p>
                <span className="text-gray-400 text-xs">3 hours ago</span>
              </div>
            </li>
            <li className="flex items-center space-x-4">
              <div className="p-2 bg-yellow-500 text-white rounded-full">
                <FaUsers size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Alex Johnson marked late</p>
                <span className="text-gray-400 text-xs">4 hours ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
  );
};

export default Dashboard;

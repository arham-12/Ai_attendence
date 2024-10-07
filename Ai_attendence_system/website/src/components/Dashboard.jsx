import React from 'react';
import StatsCard from './cards/StatsCard';
import Chart from './charts/BarCharts';
import PieChart from './charts/PeiChart';
const Dashboard = () => {
  const attendanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Attendance',
        data: [65, 59, 80, 81, 56],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <div className="container mx-auto p-5 bg-gray-100">
      
      <h1 className="text-3xl text-center font-bold mb-5">Attendence Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatsCard title="Total Students" value="200" />
        <StatsCard title="Total Classes" value="50" />
        <StatsCard title="Total Teachers" value="10" />
        <StatsCard title="Attendance Rate" value="85%" />
      </div >
      <div className="bg-white shadow-lg rounded-lg p-5 flex">
      {/* Left side: Pie Chart */}
      <div className="w-1/2 p-2 flex items-center justify-center">
        <div className="h-96 w-full">
          <PieChart data={[100, 50, 30]} />
        </div>
      </div>

      {/* Right side: Bar Chart */}
      <div className="w-1/2 p-2 flex items-center justify-center">
        <div className="h-96 w-full">
          <Chart data={attendanceData} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;

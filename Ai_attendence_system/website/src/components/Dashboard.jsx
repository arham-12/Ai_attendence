import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import StatsCard from '../cards/StatsCard';
import Chart from '../charts/BarCharts';
import PieChart from '../charts/PeiChart';
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaChartBar } from 'react-icons/fa';
import { AuthContext } from '../context/auth';

const Dashboard = () => {
  const { authToken } = useContext(AuthContext);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalClasses, setTotalClasses] = useState(5); // Optional: Set static class count
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(85); // Set default attendance rate

  // Static bar chart data (Attendance over weekdays)
  const [attendanceData, setAttendanceData] = useState({
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [
      {
        label: 'Attendance',
        data: [75, 82, 68, 91, 87],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  });

  // Static pie chart data (Attendance breakdown)
  const [pieChartData, setPieChartData] = useState([
    { name: 'Present', value: 70, color: '#4CAF50' },
    { name: 'Absent', value: 20, color: '#F44336' },
    { name: 'Late', value: 10, color: '#FF9800' },
  ]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await axios.get(
          'http://localhost:8000/api/student-count/',
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        );

        const teachersResponse = await axios.get(
          'http://localhost:8000/api/teacher-count/',
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        );

        setTotalStudents(studentsResponse.data.student_count);
        setTotalTeachers(teachersResponse.data.teacher_count);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-5 bg-gray-100 min-h-screen">
      <h1 className="text-3xl text-center font-bold mb-5">Attendance Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <StatsCard 
          title="Total Students" 
          value={totalStudents} 
          icon={<FaUserGraduate className="text-primary text-4xl" />} 
        />
        <StatsCard 
          title="Total Classes" 
          value={totalClasses} 
          icon={<FaChalkboardTeacher className="text-primary text-4xl" />} 
        />
        <StatsCard 
          title="Total Teachers" 
          value={totalTeachers} 
          icon={<FaUsers className="text-primary text-4xl" />} 
        />
        <StatsCard 
          title="Attendance Rate" 
          value={`${attendanceRate}%`} 
          icon={<FaChartBar className="text-primary text-4xl" />} 
        />
      </div>

      <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col lg:flex-row">
        {/* Pie Chart */}
        <div className="lg:w-1/2 p-2 flex items-center justify-center">
          <div className="h-96 w-full">
            <PieChart data={pieChartData} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lg:w-1/2 p-2 flex items-center justify-center">
          <div className="h-96 w-full">
            <Chart data={attendanceData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

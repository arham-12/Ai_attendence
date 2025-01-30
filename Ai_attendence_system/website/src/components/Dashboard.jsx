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
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [attendanceData, setAttendanceData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]); // Initialize as empty array

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const studentsResponse = await axios.get(
          'http://localhost:8000/api/student-count/',
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        );
        // const classesResponse = await axios.get('/api/total-classes');
        const teachersResponse = await axios.get(
          'http://localhost:8000/api/teacher-count/',
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        );
        console.log(teachersResponse);

        // const attendanceResponse = await axios.get('/api/attendance-rate');
        // const attendanceChartResponse = await axios.get('/api/attendance-chart-data');
        // const pieChartResponse = await axios.get('/api/pie-chart-data');

        setTotalStudents(studentsResponse.data.student_count);
        // setTotalClasses(classesResponse.data.total);
        setTotalTeachers(teachersResponse.data.teacher_count);
        // setAttendanceRate(attendanceResponse.data.rate);
        // setAttendanceData({
        //   labels: attendanceChartResponse.data.labels,
        //   datasets: [
        //     {
        //       label: 'Attendance',
        //       data: attendanceChartResponse.data.values,
        //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
        //     },
        //   ],
        // });
        // setPieChartData(pieChartResponse.data.values || []); // Ensure pieChartData is always an array
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto p-5 bg-gray-100">
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

      <div className="bg-white shadow-lg rounded-lg p-5 flex">
        {/* Left side: Pie Chart */}
        <div className="w-1/2 p-2 flex items-center justify-center">
          <div className="h-96 w-full">
            {pieChartData.length > 0 ? <PieChart data={pieChartData} /> : <p>Loading Pie Chart...</p>}
          </div>
        </div>

        {/* Right side: Bar Chart */}
        <div className="w-1/2 p-2 flex items-center justify-center">
          <div className="h-96 w-full">
            {attendanceData ? <Chart data={attendanceData} /> : <p>Loading Bar Chart...</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

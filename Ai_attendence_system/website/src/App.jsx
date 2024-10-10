import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
// import Dashboard from './components/Dashboard';
import LoginPage from './pages/LoginPage';
import SchedulePage from './pages/SchedulePage';
import SmartSerch from './pages/UserAnalitics';
import ManageStudents from './pages/ManageStudents';
// import AdminSettingsForm from './components/admin_settings/AdminSettings';
import AdminSettings from './pages/AdminSettingPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AddDepartmentPage from './pages/AddDepartment';
import AddDegreeProgramPage from './pages/AddDegreeProgram';
// import AttendenceAnalytics from './components/pages/AttendenceAnalytics';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
  
    <div className='flex overflow-hidden'>
    <Sidebar />
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/add-department" element={<AddDepartmentPage />} />
      <Route path="/add-degreeprograms" element={<AddDegreeProgramPage />} />
      {/* Main routes */}
      <Route path="/" element={<AdminDashboardPage />} />
      <Route path="/users-analytics" element={<SmartSerch />} />
      
      {/* Schedule route */}
      <Route path="/set-schedule" element={<SchedulePage />} />
      <Route path="/manage-students" element={<ManageStudents />} />
      {/* Settings with nested routes */}
      <Route path="/settings" element={<AdminSettings />}>
        {/* Add nested routes here if needed */}
      </Route>
      
    </Routes>
  </div>
    
  );
};

export default App;

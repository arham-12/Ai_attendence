import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import Dashboard from './components/Dashboard';
import LoginPage from './components/pages/LoginPage'
import SchedulePage from './components/pages/SchedulePage';
import UserAnalitics from './components/pages/UserAnalitics';

// import AdminSettingsForm from './components/admin_settings/AdminSettings';
import AdminSettings from './components/pages/AdminSettingPage';
import AdminDashboardPage from './components/pages/AdminDashboardPage';
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
  
      {/* Main routes */}
      <Route path="/" element={<AdminDashboardPage />} />
      <Route path="/users-analytics" element={<UserAnalitics />} />
      
      {/* Schedule route */}
      <Route path="/set-schedule" element={<SchedulePage />} />
  
      {/* Settings with nested routes */}
      <Route path="/settings" element={<AdminSettings />}>
        {/* Add nested routes here if needed */}
      </Route>
      
    </Routes>
  </div>
    
  );
};

export default App;

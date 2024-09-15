import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/admin/sidebar';
import Dashboard from './components/admin/dashboard';
import AdminLogin from './components/admin/admin_login';  // Capitalize component name as per convention
import Schedule from './components/admin/schedul';
import ManageStudents from './components/admin/manage_students';
import SettingsPage from './components/admin/Settings';
const App = () => {
  // State to manage user authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock login function
  const handleLogin = () => {
    // You can add actual login logic here, like verifying credentials
    setIsAuthenticated(true);
  };

  return (
    <>
    <div className='flex overflow-hidden'>
    <Sidebar/>
      <Routes>

        {/* If user is not authenticated, show the login page */}
        <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />

        <Route path="/" element={<Dashboard/>} />
        <Route path="/schedule" element={<Schedule/>} />
        <Route path="/manage-students" element={<ManageStudents/>} />
        <Route path="/settings" element={<SettingsPage/>} />
        {/* <Route index element={<Dashboard/>} /> */}
        {/* If authenticated, show dashboard with sidebar */}
        {/* {isAuthenticated ? (
          <Route
            path="/dashboard"
            element={
              <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 bg-gray-100">
                  <Dashboard />
                </div>
              </div>
            }
          />
        ) : (
          // Redirect to login if not authenticated
          <Route path="*" element={<Navigate to="/login" />} />
        )} */}
      </Routes>


    </div>
    
    </>
    
    
  );
};




export default App

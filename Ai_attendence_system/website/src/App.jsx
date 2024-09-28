import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/admin/sidebar';
import Dashboard from './components/admin/dashboard';
import AdminLogin from './components/admin/admin_login';  // Capitalize component name as per convention
import Schedule from './components/admin/schedul';
// import ParentComponent from './components/admin_settings/setttings_navbar';
import Settings from './components/admin_settings/Settings';
import StepForm from './components/admin_settings/department_section';
import ManageStudents from './components/admin_settings/manage_students';
import ContentRetriever from './components/admin/smart_search';
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
        <Route path="/search-content" element={<ContentRetriever/>} />
        <Route path="/settings" element={<Settings/>} >
        <Route index element={<StepForm/>} />
        <Route path='students' element={<ManageStudents/>} />
        {/* <Route path="teachers" element={<DepartmentSection/>} /> */}
        {/* <Route path="admin-settings" element={<DepartmentSection/>} /> */}
        
        
        </Route>
        {/* <Route path="department" element={<DepartmentSection/>} /> */}
        
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

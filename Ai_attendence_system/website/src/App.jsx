import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "react-hot-toast"
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
import AddProgramProtected from './components/Protected/addProgramProtected';
import UpdateAuthSettings from './pages/AdminSettingPage';
import AuthProtected from './components/Protected/authProtected';
// import AttendenceAnalytics from './components/pages/AttendenceAnalytics';
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
  
    <div className='flex overflow-hidden'>
    <Sidebar  />
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route path="/add-department" element={<AuthProtected Component={AddDepartmentPage} />} />
      <Route path="/add-degreeprograms" element={<AuthProtected Component={AddDegreeProgramPage} />} />
      {/* Main routes */}
      <Route path="/" element={<AddProgramProtected Component={AdminDashboardPage} />} />
      <Route path="/users-analytics" element={<AddProgramProtected Component={SmartSerch} />} />
      
      {/* Schedule route */}
      <Route path="/set-schedule" element={<AddProgramProtected Component={SchedulePage} />} />
      <Route path="/manage-students" element={<AddProgramProtected Component={ManageStudents} />} />
      {/* Settings with nested routes */}
      <Route path="/settings" element={<AddProgramProtected Component={UpdateAuthSettings} />}>
        {/* Add nested routes here if needed */}
      </Route>
      
    </Routes>
<Toaster  toastOptions={{
    className: 'rounded-full',
  }}/>
  </div>
    
  );
};

export default App;

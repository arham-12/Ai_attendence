import React, { useState } from 'react';
import { FiUserPlus, FiTrash2, FiEdit, FiSave } from 'react-icons/fi';
import { MdSettings, MdPerson, MdSchool,MdSupervisorAccount } from 'react-icons/md';

function SettingsComponent() {
  const [activeTab, setActiveTab] = useState('students');

  const [students, setStudents] = useState([{ name: '', email: '', id: '' }]);
  const [teachers, setTeachers] = useState([{ name: '', isPermanent: true, username: '', password: '' }]);
  const [adminSettings, setAdminSettings] = useState({ email: '', password: '' });

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...students];
    updatedStudents[index][field] = value;
    setStudents(updatedStudents);
  };

  const handleTeacherChange = (index, field, value) => {
    const updatedTeachers = [...teachers];
    updatedTeachers[index][field] = value;
    setTeachers(updatedTeachers);
  };

  const handleAdminChange = (field, value) => {
    setAdminSettings({ ...adminSettings, [field]: value });
  };

  const addStudent = () => setStudents([...students, { name: '', email: '', id: '' }]);
  const addTeacher = () => setTeachers([...teachers, { name: '', isPermanent: true, username: '', password: '' }]);

  return (
    <div className="min-h-screen ml-[20%] w-full bg-blue-100">
      {/* Navbar */}
      <nav className="bg-blue-300 text-white py-4 shadow-lg rounded-lg w-[50%] ml-[20%] mt-[5%] ">
        <div className="container mx-auto flex justify-center">
          <div className="flex space-x-4">
            <a onClick={() => handleTabClick('students')} className="cursor-pointer flex items-center space-x-2">
              < MdSupervisorAccount className= {`${activeTab === 'students' ? 'text-xl'  : 'text-gray-600'}`} />
              <span className={`${activeTab === 'students' ? 'font-bold '  : ' text-gray-600'}`}>Manage Students</span>
            </a>
            <a onClick={() => handleTabClick('teachers')} className="cursor-pointer flex items-center space-x-2">
              <MdSchool className={`${activeTab === 'teachers' ? 'text-xl'  : ' text-gray-600'}`} />
              <span className={`${activeTab === 'teachers' ? 'font-bold '  : ' text-gray-600'}`}>Manage Teachers</span>
            </a>
            <a onClick={() => handleTabClick('adminSettings')} className="cursor-pointer flex items-center space-x-2">
              <MdSettings className={`${activeTab === 'adminSettings' ? 'text-xl '  : ' text-gray-600'}`} />
              <span className={`${activeTab === 'adminSettings' ? 'font-bold '  : ' text-gray-600'}`}>Admin Settings</span>
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Student Management Section */}
          {activeTab === 'students' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Students</h2>
              {students.map((student, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    value={student.name}
                    onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
                    placeholder="Student Name"
                    className="p-2 border border-primary focus:outline-primary rounded-md shadow-sm"
                  />
                  <input
                    type="email"
                    value={student.email}
                    onChange={(e) => handleStudentChange(index, 'email', e.target.value)}
                    placeholder="Student Email"
                    className="p-2 border border-primary focus:outline-primary rounded-md shadow-sm"
                  />
                  <input
                    type="text"
                    value={student.id}
                    onChange={(e) => handleStudentChange(index, 'id', e.target.value)}
                    placeholder="Student ID"
                    className="p-2 border border-primary rounded-md focus:outline-primary shadow-sm"
                  />
                  <button
                    className="p-2 bg-red-600 text-gray-300 rounded-md hover:bg-red-700"
                    title="Delete Student"
                    onClick={() => setStudents(students.filter((_, i) => i !== index))}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                className="py-2 px-4 bg-primary text-gray-600 rounded-md hover:bg-blue-700 hover:text-white flex items-center"
                onClick={addStudent}
              >
                <FiUserPlus className="mr-2" /> Add New Student
              </button>
            </div>
          )}

          {/* Teacher Management Section */}
          {activeTab === 'teachers' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Teachers</h2>
              {teachers.map((teacher, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <input
                    type="text"
                    value={teacher.name}
                    onChange={(e) => handleTeacherChange(index, 'name', e.target.value)}
                    placeholder="Teacher Name"
                    className="p-2 border border-primary focus:outline-primary  rounded-md shadow-sm"
                  />
                  <select
                    value={teacher.isPermanent ? 'Permanent' : 'Visitor'}
                    onChange={(e) => handleTeacherChange(index, 'isPermanent', e.target.value === 'Permanent')}
                    className="p-2 border bg-blue-100 border-primary focus:outline-primary  rounded-md shadow-sm"
                  >
                    <option value="Permanent">Permanent</option>
                    <option value="Visitor">Visitor</option>
                  </select>
                  <input
                    type="email"
                    value={teacher.username}
                    onChange={(e) => handleTeacherChange(index, 'username', e.target.value)}
                    placeholder="email"
                    className="p-2 border border-primary focus:outline-primary  rounded-md shadow-sm"
                  />
                  <input
                    type="password"
                    value={teacher.password}
                    onChange={(e) => handleTeacherChange(index, 'password', e.target.value)}
                    placeholder="Password"
                    className="p-2 border border-primary focus:outline-primary rounded-md shadow-sm"
                  />
                  <button
                    className="p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    title="Delete Teacher"
                    onClick={() => setTeachers(teachers.filter((_, i) => i !== index))}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
              <button
                className="py-2 px-4 bg-primary text-gray-600 hover:text-white rounded-md hover:bg-blue-700 flex items-center"
                onClick={addTeacher}
              >
                <FiUserPlus className="mr-2" /> Add New Teacher
              </button>
            </div>
          )}

          {/* Admin Settings Section */}
          {activeTab === 'adminSettings' && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Admin Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="email"
                  value={adminSettings.email}
                  onChange={(e) => handleAdminChange('email', e.target.value)}
                  placeholder="Admin Email"
                  className="p-2 border border-primary focus:outline-primary  rounded-md shadow-sm"
                />
                <input
                  type="password"
                  value={adminSettings.password}
                  onChange={(e) => handleAdminChange('password', e.target.value)}
                  placeholder="Admin Password"
                  className="p-2 border border-primary focus:outline-primary rounded-md shadow-sm"
                />
              </div>
              <button
                className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                onClick={() => console.log(adminSettings)}
              >
                <FiSave className="mr-2" /> Save Admin Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SettingsComponent;

import React, { useState } from 'react';
import { FiSave, FiRefreshCw, FiUserPlus } from 'react-icons/fi';

function SettingsPage() {
  // State to manage teacher credentials
  const [teachers, setTeachers] = useState([{ id: '', password: '' }]);

  // Functions to handle form changes and actions
  const handleTeacherChange = (index, field, value) => {
    const updatedTeachers = [...teachers];
    updatedTeachers[index][field] = value;
    setTeachers(updatedTeachers);
  };

  const addTeacher = () => {
    setTeachers([...teachers, { id: '', password: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission for saving credentials
    console.log(teachers);
  };

  const handleReset = () => {
    // Reset the form inputs
    setTeachers([{ id: '', password: '' }]);
  };

  return (
    <div className="min-h-screen ml-[20%] w-full bg-gray-100 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white p-10 rounded-lg shadow-md space-y-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Administration Settings</h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {teachers.map((teacher, index) => (
              <div key={index} className="flex items-center space-x-4">
                <input
                  type="text"
                  value={teacher.id}
                  onChange={(e) => handleTeacherChange(index, 'id', e.target.value)}
                  placeholder="Teacher ID"
                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="password"
                  value={teacher.password}
                  onChange={(e) => handleTeacherChange(index, 'password', e.target.value)}
                  placeholder="Password"
                  className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm"
                />
                {index === teachers.length - 1 && (
                  <button
                    type="button"
                    onClick={addTeacher}
                    className="p-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
                    title="Add New Teacher"
                  >
                    <FiUserPlus className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiSave className="mr-2 h-5 w-5" />
                Save Credentials
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
              >
                <FiRefreshCw className="mr-2 h-5 w-5" />
                Reset Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsPage;

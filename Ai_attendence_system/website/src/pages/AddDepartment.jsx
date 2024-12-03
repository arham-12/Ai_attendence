import React, { useContext, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/auth';

const AddDepartmentPage = () => {

  const [departments, setDepartments] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const mainDepartments = [
    "Science and Technology",
    "Engineering",
    "Medical and Health Sciences",
    "Business and Economics",
    "Social Sciences and Humanities",
    "Arts and Humanities",
    "Law",
    "Education"
  ];

  const handleAdd = (department) => {
    if (department && !departments.includes(department)) {
      setDepartments([...departments, department]);
      setInputValue('');
      setSuggestions([]);
    }
  };

  const handleRemove = (valueToRemove) => {
    setDepartments(departments.filter(value => value !== valueToRemove));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (value) {
      const filteredSuggestions = mainDepartments.filter(department =>
        department.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/add-department', { names: departments });
      alert('Departments added successfully!');
      setDepartments([]);
    } catch (error) {
      console.error("Error submitting the departments!", error);
      toast.error('Error adding departments: ' + error.response?.data || 'Please try again.')
     
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen w-full bg-gray-100`}>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add Departments</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-600">Departments</label>
            <div className="flex flex-wrap border border-gray-300 rounded-lg p-2 mt-1">
              {departments.map((value) => (
                <span key={value} className="bg-blue-500 text-white rounded-full px-2 py-1 flex items-center mr-2 mb-2">
                  {value}
                  <button
                    type="button"
                    onClick={() => handleRemove(value)}
                    className="ml-1 text-sm"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="border-none focus:outline-none flex-grow p-2"
                placeholder="e.g. Science and Technology, Engineering"
              />
              <button
                type="button"
                onClick={() => handleAdd(inputValue)}
                className="bg-blue-500 text-white rounded-lg px-3 py-1 ml-2"
              >
                Add
              </button>
            </div>
            {suggestions.length > 0 && (
              <div className="border border-gray-300 rounded-lg p-2 mt-2 bg-white shadow-md">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion}
                    onClick={() => handleAdd(suggestion)}
                    className="cursor-pointer p-2 hover:bg-gray-200"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white rounded-lg px-4 py-2 mt-4 w-full"
          >
            Submit
          </button>
        </form>

        {/* Display main departments as selectable buttons */}
        <div className="mt-6">
          <h2 className="text-lg font-medium text-gray-700 mb-3">Main Departments</h2>
          <div className="flex flex-wrap gap-2 mt-2">
            {mainDepartments.map((department) => (
              <button
                key={department}
                onClick={() => handleAdd(department)}
                className="bg-gray-200 text-gray-700 rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-gray-300"
              >
                {department}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddDepartmentPage;

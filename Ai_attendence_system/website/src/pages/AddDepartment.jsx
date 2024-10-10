import React, { useState } from 'react';
import axios from 'axios';

const AddDepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    if (inputValue && !departments.includes(inputValue)) {
      setDepartments([...departments, inputValue]);
      setInputValue('');
    }
  };

  const handleRemove = (valueToRemove) => {
    setDepartments(departments.filter(value => value !== valueToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send departments as an object with a key 'names' to match the backend schema
      const response = await axios.post('http://localhost:8000/add-department', { names: departments });
      alert('Departments added successfully!');
      setDepartments([]); // Reset the department list after successful submission
    } catch (error) {
      console.error("There was an error submitting the departments!", error);
      alert('Error adding departments: ' + error.response.data || 'Please try again.');
    }
  };

  return (
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
              onChange={(e) => setInputValue(e.target.value)}
              className="border-none focus:outline-none flex-grow p-2"
              placeholder="e.g. Computer Science, Business"
            />
            <button
              type="button"
              onClick={handleAdd}
              className="bg-blue-500 text-white rounded-lg px-3 py-1 ml-2"
            >
              Add
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white rounded-lg px-4 py-2 mt-4 w-full"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddDepartmentPage;
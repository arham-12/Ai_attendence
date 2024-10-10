import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddDegreeProgramPage = () => {
  const [departments, setDepartments] = useState([]);
  const [degreeProgramsMap, setDegreeProgramsMap] = useState({});
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    // Fetch the departments from the backend
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get-departments'); // Adjust the endpoint as needed
        setDepartments(response.data);

        // Initialize degreeProgramsMap with empty arrays for each department
        const initialProgramsMap = {};
        response.data.forEach(department => {
          initialProgramsMap[department.name] = []; // Create an empty array for each department
        });
        setDegreeProgramsMap(initialProgramsMap);
      } catch (error) {
        console.error("There was an error fetching the departments!", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAdd = (department) => {
    if (inputValue && department) {
      // Add the degree program to the selected department in the map
      setDegreeProgramsMap((prev) => ({
        ...prev,
        [department]: [...(prev[department] || []), inputValue],
      }));
      setInputValue('');
    }
  };

  const handleRemove = (department, valueToRemove) => {
    setDegreeProgramsMap((prev) => ({
      ...prev,
      [department]: prev[department].filter(value => value !== valueToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Prepare data to send to the backend
      const degreeProgramsData = {
        departments: Object.keys(degreeProgramsMap).map(department => ({
          name: department,
          degreePrograms: degreeProgramsMap[department],
        })),
      };
  
      // Send the selected department and degree programs to the backend
      const response = await axios.post('http://localhost:8000/add-degree-program', degreeProgramsData);
      alert('Degree programs added successfully!');
      setDegreeProgramsMap({}); // Reset the degree program map after successful submission
    } catch (error) {
      console.error("There was an error submitting the degree programs!", error);
      alert('Error adding degree programs: ' + error.response.data.detail || 'Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Add Degree Programs</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col mb-4">
          <label className="block text-sm font-medium text-gray-600">Degree Programs for Each Department</label>
          {departments.map(department => (
            <div key={department.id} className="mb-4">
              <h2 className="font-semibold text-lg">{department.name}</h2>
              <div className="flex flex-wrap border border-gray-300 rounded-lg p-2 mt-1">
                {(degreeProgramsMap[department.name] || []).map((value) => (
                  <span key={value} className="bg-blue-500 text-white rounded-full px-2 py-1 flex items-center mr-2 mb-2">
                    {value}
                    <button
                      type="button"
                      onClick={() => handleRemove(department.name, value)}
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
                  placeholder="Add Degree Program"
                />
                <button
                  type="button"
                  onClick={() => handleAdd(department.name)}
                  className="bg-blue-500 text-white rounded-lg px-3 py-1 ml-2"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
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

export default AddDegreeProgramPage;

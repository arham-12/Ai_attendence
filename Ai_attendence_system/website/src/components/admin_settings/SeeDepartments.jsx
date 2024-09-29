import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit } from 'react-icons/fa';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [searchDepartment, setSearchDepartment] = useState('');
  const [searchDegreeProgram, setSearchDegreeProgram] = useState('');
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form, setForm] = useState({ name: '', degreeProgram: '', semester: '', course: '', creditHours: '' });
  const [isEditing, setIsEditing] = useState({ department: false, degreeProgram: false, semester: false, course: false });
  const [error, setError] = useState(null);
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editingDegreeProgramId, setEditingDegreeProgramId] = useState(null);

  // Fetch all departments initially
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8000/departments');
      console.log('Fetched departments:', response.data); // Log the response
      if (Array.isArray(response.data)) {
        setDepartments(response.data);
      } else {
        console.error('Expected an array, but received:', response.data);
        setError('Failed to fetch departments. Expected an array.');
      }
    } catch (error) {
      setError('Failed to fetch departments.');
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/departments/${searchDepartment}/${searchDegreeProgram}`);
      setFilteredDepartments([response.data]); // Wrap it in an array since it returns a single department.
    } catch (error) {
      setError('Error fetching relevant departments.');
      console.error('Error during search:', error);
    }
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setEditingDepartmentId(department.id);
    setForm({ name: department.name });
    setIsEditing({ ...isEditing, department: true });
  };

  const handleEditDegreeProgram = (degreeProgram) => {
    setSelectedDegreeProgram(degreeProgram);
    setEditingDegreeProgramId(degreeProgram.id);
    setForm({ name: degreeProgram.name });
    setIsEditing({ ...isEditing, degreeProgram: true });
  };
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setForm({ name: course.name, creditHours: course.credit_hours });
    setIsEditing({ ...isEditing, course: true });
  };
  const handleUpdate = async (e, type) => {
    e.preventDefault();
    try {
      let response;

      // Prepare the payload based on the type
      if (type === 'department' && selectedDepartment) {
        const departmentUpdate = {
          current_name: selectedDepartment.name, // The current name of the department
          new_name: form.name // The new name to be updated
        };
        response = await axios.put('http://localhost:8000/departments/update', departmentUpdate);
        
        // Check for successful response
        if (response.data.message === "Department updated successfully") {
          // Update the state with the new department name
          setDepartments((prevDepartments) => 
            prevDepartments.map((dept) =>
              dept.id === selectedDepartment.id ? { ...dept, name: form.name } : dept
            )
          );
          setFilteredDepartments((prevFiltered) => 
            prevFiltered.map((dept) =>
              dept.id === selectedDepartment.id ? { ...dept, name: form.name } : dept
            )
          );
        }

      } else if (type === 'degreeProgram' && selectedDegreeProgram) {
        const degreeProgramUpdate = {
          current_name: selectedDegreeProgram.name,
          new_name: form.name
        };
        response = await axios.put('http://localhost:8000/degree-programs/update', degreeProgramUpdate);

        // Check for successful response
        if (response.data.message === "Degree program updated successfully") {
          // Update the state with the new degree program name
          setDepartments((prevDepartments) => 
            prevDepartments.map((dept) => {
              return {
                ...dept,
                degree_programs: dept.degree_programs.map((program) =>
                  program.id === selectedDegreeProgram.id ? { ...program, name: form.name } : program
                )
              };
            })
          );
          setFilteredDepartments((prevFiltered) => 
            prevFiltered.map((dept) => {
              return {
                ...dept,
                degree_programs: dept.degree_programs.map((program) =>
                  program.id === selectedDegreeProgram.id ? { ...program, name: form.name } : program
                )
              };
            })
          );
        }

      } else if (type === 'course' && selectedCourse) {
        const courseUpdate = {
          current_name: selectedCourse.name,
          new_name: form.name,
          credit_hours: form.creditHours // Send credit hours along with the name
        };
        response = await axios.put('http://localhost:8000/courses/update', courseUpdate);

        // Check for successful response
        if (response.data.message === "Course updated successfully") {
          // Update the state with the new course details
          setDepartments((prevDepartments) =>
            prevDepartments.map((dept) => {
              return {
                ...dept,
                degree_programs: dept.degree_programs.map((program) => {
                  return {
                    ...program,
                    semesters: program.semesters.map((semester) => {
                      return {
                        ...semester,
                        courses: semester.courses.map((course) =>
                          course.id === selectedCourse.id ? { ...course, name: form.name, credit_hours: form.creditHours } : course
                        )
                      };
                    })
                  };
                })
              };
            })
          );
          setFilteredDepartments((prevFiltered) =>
            prevFiltered.map((dept) => {
              return {
                ...dept,
                degree_programs: dept.degree_programs.map((program) => {
                  return {
                    ...program,
                    semesters: program.semesters.map((semester) => {
                      return {
                        ...semester,
                        courses: semester.courses.map((course) =>
                          course.id === selectedCourse.id ? { ...course, name: form.name, credit_hours: form.creditHours } : course
                        )
                      };
                    })
                  };
                })
              };
            })
          );
        }
      }

      // Reset the form after a successful update
      resetForm();
    } catch (error) {
      setError(`Error updating ${type}.`);
      console.error(`Error updating ${type}:`, error);
    }
  };
  const resetForm = () => {
    setForm({ name: '', degreeProgram: '', semester: '', course: '', creditHours: '' });
    setSelectedDepartment(null);
    setSelectedDegreeProgram(null);
    setSelectedSemester(null);
    setSelectedCourse(null);
    setIsEditing({ department: false, degreeProgram: false, semester: false, course: false });
    setEditingDepartmentId(null);
    setEditingDegreeProgramId(null);
  };

  return (
    <div className="p-4 ml-[20%] mx-auto w-[80%]">
      <h1 className="text-2xl font-bold mb-4 text-center">Department Management</h1>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Input fields for searching departments */}
      <div className="mb-4 flex justify-center space-x-2">
        <input
          type="text"
          placeholder="Search Department Name"
          value={searchDepartment}
          onChange={(e) => setSearchDepartment(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Search Degree Program"
          value={searchDegreeProgram}
          onChange={(e) => setSearchDegreeProgram(e.target.value)}
          className="p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 text-white bg-blue-500 rounded-md"
        >
          Search
        </button>
      </div>

      {/* Form for updating selected items */}
     {/* Form for updating selected items */}
     {(isEditing.department || isEditing.degreeProgram || isEditing.course) && (
  <form
    onSubmit={(e) =>
      handleUpdate(e, isEditing.department ? 'department' : isEditing.degreeProgram ? 'degreeProgram' : 'course')
    }
    className="mb-6 bg-white shadow-md rounded px-8 pt-6 pb-8"
  >
    {/* Conditional fields for department or degree program */}
    {(isEditing.department || isEditing.degreeProgram) && (
      <div className="mb-4 text-center">
        <label className="block text-lg font-medium text-gray-700 mb-2">
          {isEditing.department ? 'Update Department Name' : 'Update Degree Program Name'}
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
          placeholder={isEditing.department ? 'Enter Department Name' : 'Enter Degree Program Name'}
        />
      </div>
    )}

    {/* Conditional fields for course */}
    {isEditing.course && (
      <>
        <div className="mb-4 text-center">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Course Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
            placeholder="Enter Course Name"
          />
        </div>
        <div className="mb-4 text-center">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            Credit Hours
          </label>
          <input
            type="number"
            name="creditHours"
            value={form.creditHours}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-yellow-500"
            placeholder="Enter Credit Hours"
          />
        </div>
      </>
    )}

    <div className="flex justify-center">
      <button
        type="submit"
        className="mt-4 px-6 py-2 text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring focus:ring-yellow-300"
      >
        Update
      </button>
      <button
        type="button"
        onClick={resetForm}
        className="mt-4 ml-4 px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring focus:ring-gray-300"
      >
        Cancel
      </button>
    </div>
  </form>
)}
      {/* Display the list of filtered departments and their degree programs, semesters, and courses */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((department) => (
            <div key={department.id} className="border border-gray-300 p-4 rounded-lg">
              <div className="flex justify-center  items-center">
                <h2 className="text-lg font-bold text-center mb-2">{department.name}</h2>
                <button onClick={() => handleEditDepartment(department)}>
                  <FaEdit className="mr-1 text-blue-600" />
                </button>
              </div>
              {department.degree_programs.map((dp) => (
                <div key={dp.id} className="border-t border-gray-200 pt-2 mt-2">
                  <h3 className="text-md font-semibold text-center mb-2">
                    Degree Program : {dp.name}
                    <button onClick={() => handleEditDegreeProgram(dp)} className="ml-2">
                      <FaEdit className="mr-1 text-blue-600" />
                    </button>
                  </h3>
                  <h4 className="text-sm font-medium text-center">Semesters : {dp.semesters.length}</h4>
                  <div className="mt-2">
                    <table className="w-full border border-gray-200 text-left">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-2 bg-gray-100">Course Name</th>
                          <th className="border border-gray-300 p-2 bg-gray-100">Credit Hours</th>
                          <th className="border border-gray-300 p-2 bg-gray-100">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dp.semesters.map((semester) => (
                          <React.Fragment key={semester.id}>
                            <tr>
                              <td colSpan="3" className="border border-gray-300 p-2 font-bold">{semester.name}</td>
                            </tr>
                            {semester.courses.map((course) => (
                              <tr key={course.id}>
                                <td className="border border-gray-300 p-2">{course.name}</td>
                                <td className="border border-gray-300 p-2">{course.credit_hours}</td>
                                <td className="border border-gray-300 p-2">
                                  <button onClick={() => handleEditCourse(course)}>
                                    <FaEdit className="mr-1 text-blue-600" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="text-center">No Departments Found</p>
        )}
      </div>
    </div>
  );
};

export default DepartmentManagement;

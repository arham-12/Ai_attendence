import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ScheduleManager = () => {
  const [schedules, setSchedules] = useState([]);
  const [degreeProgram, setDegreeProgram] = useState('');
  const [semester, setSemester] = useState('');
  const [instructor, setInstructor] = useState('');
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [newScheduleData, setNewScheduleData] = useState({});

  const fetchSchedules = async () => {
    try {
      const params = new URLSearchParams();
      if (degreeProgram) params.append("degree_program", degreeProgram);
      if (semester) params.append("semester", semester);
      if (instructor) params.append("instructor", instructor);

      const response = await axios.get(`http://localhost:8000/api/schedules?${params.toString()}`);
      console.log('API response:', response.data);
      setSchedules(response.data || []);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === 'degreeProgram') setDegreeProgram(value);
    if (name === 'semester') setSemester(value);
    if (name === 'instructor') setInstructor(value);
  };

  const handleEditClick = (schedule) => {
    setEditingSchedule(schedule);
    setNewScheduleData(schedule);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewScheduleData({ ...newScheduleData, [name]: value });
  };

  const handleSave = async (id) => {
    await axios.put(`/api/schedules/${id}`, newScheduleData);
    setSchedules((prev) => prev.map(schedule => (schedule.id === id ? newScheduleData : schedule)));
    setEditingSchedule(null);
  };

  const filteredSchedules = Array.isArray(schedules) ? schedules : [];

  return (
    <div className="container w-full mx-auto p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Schedule Manager</h1>
      
      <div className="mb-4">
        <label className="mr-2">Degree Program:</label>
        <input
          type="text"
          name="degreeProgram"
          value={degreeProgram}
          onChange={handleFilterChange}
          className="border rounded p-2 mr-4"
        />
        
        <label className="mr-2">Semester:</label>
        <input
          type="text"
          name="semester"
          value={semester}
          onChange={handleFilterChange}
          className="border rounded w-[80px] p-2 mr-4"
        />
        
        <label className="mr-2">Instructor:</label>
        <input
          type="text"
          name="instructor"
          value={instructor}
          onChange={handleFilterChange}
          className="border rounded p-2"
        />
        
        <button onClick={fetchSchedules} className="bg-blue-500 text-white p-2 rounded ml-4">Load Schedules</button>
      </div>
      
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Instructor Name</th>
            <th className="border border-gray-300 p-2">Degree Program</th>
            <th className="border border-gray-300 p-2">Semester</th>
            <th className="border border-gray-300 p-2">Course Name</th>
            <th className="border border-gray-300 p-2">Course Code</th>
            <th className="border border-gray-300 p-2">Class Type</th>
            <th className="border border-gray-300 p-2">Date</th>
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSchedules.map((schedule) => (
            <tr key={schedule.id}>
              <td className="border border-gray-300 p-2">{schedule.id}</td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <input
                    type="text"
                    name="instructor_name"
                    value={newScheduleData.instructor_name || ''}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  schedule.instructor_name
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <input
                    type="text"
                    name="degree_program"
                    value={newScheduleData.degree_program || ''}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  schedule.degree_program
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <input
                    type="text"
                    name="semester"
                    value={newScheduleData.semester || ''}
                    onChange={handleInputChange}
                    className="border rounded w-[50%] p-1"
                  />
                ) : (
                  schedule.semester
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <input
                    type="text"
                    name="course_name"
                    value={newScheduleData.course_name || ''}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  schedule.course_name
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <input
                    type="text"
                    name="course_code"
                    value={newScheduleData.course_code || ''}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  schedule.course_code
                )}
              </td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <input
                    type="text"
                    name="class_type"
                    value={newScheduleData.class_type}
                    onChange={handleInputChange}
                    className="border rounded p-1"
                  />
                ) : (
                  schedule.class_type
                )}
              </td>
              <td className="border border-gray-300 p-2">{schedule.lecture_date}</td>
              <td className="border border-gray-300 p-2">{schedule.day}</td>
              <td className="border border-gray-300 p-2">
                {editingSchedule?.id === schedule.id ? (
                  <button onClick={() => handleSave(schedule.id)} className="bg-blue-500 text-white p-1 rounded">Save</button>
                ) : (
                  <button onClick={() => handleEditClick(schedule)} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleManager;

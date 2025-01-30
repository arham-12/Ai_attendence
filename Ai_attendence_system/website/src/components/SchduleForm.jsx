// src/ScheduleForm.js
import React, { useState } from 'react';
import MultiInput from './MultiplyInput';
import axios from 'axios';

const ScheduleForm = () => {
  const APIURL = import.meta.env.VITE_API_URL;
  // State to hold form values
  const [formData, setFormData] = useState({
    instructor_name: '',
    instructor_id: '',
    degree_program: '',
    semester: '',
    course_name: '',
    course_code: '',
    class_type: 'Theory',
    start_date: '',
    end_date: '',
    starting_time: '',  // Ensure this matches with your time input field
    num_lectures: 1,
    preferred_weekdays: [],
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${APIURL}http://localhost:8000/generate-schedule`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        alert('Form submitted successfully');
      } else {
        alert('Failed to submit the form', response.data);
      }
    } catch (error) {
      alert('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-10 bg-blue-100 shadow-lg rounded-lg mt-10">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-blue-800 tracking-tight">Schedule Classes</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Instructor Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Instructor Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Instructor Name</label>
              <input
                type="text"
                name="instructor_name"
                value={formData.instructor_name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Instructor ID</label>
              <input
                type="text"
                name="instructor_id"
                value={formData.instructor_id}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                placeholder="Enter ID"
                required
              />
            </div>
          </div>
        </section>

        {/* Degree Program Information */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Degree Program Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Degree Program</label>
              <select
                name="degree_program"
                value={formData.degree_program}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                required
              >
                <option value="">Select Degree Program</option>
                <option value="BSc Computer Science">BSc Computer Science</option>
                <option value="MSc Physics">MSc Physics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Semester Number</label>
              <select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                required
              >
                <option value="">Select Semester Number</option>
                {Array.from({ length: 8 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Course Details */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Course Details</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Course Name</label>
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                  placeholder="Enter course name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Course Code</label>
                <input
                  type="text"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                  placeholder="Enter course code"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Class Type</label>
                <select
                  name="class_type"
                  value={formData.class_type}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                >
                  <option value="Lecture">Theory</option>
                  <option value="Lab">Lab</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600">Start Date</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">End Date</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Time</label>
                <input
                  type="time"
                  name="starting_time"
                  value={formData.starting_time}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
                  required
                />
              </div>
            </div>

            {/* Preferred Weekdays Input */}
            <MultiInput
              values={formData.preferred_weekdays}
              setValues={(values) => setFormData({ ...formData, preferred_weekdays: values })}
              label="Preferred Weekdays"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Number of Lectures</label>
            <input
              type="number"
              name="num_lectures"
              value={formData.num_lectures}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-50 p-3"
              min="1"
              max="50"
            />
          </div>
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;

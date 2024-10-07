import React, { useState } from 'react';
import axios from 'axios';

const ScheduleForm = () => {
  const [courses, setCourses] = useState([{ name: '', instructor: '' }]);
  const [instructors, setInstructors] = useState([{ name: '', availability: '' }]);
  const [rooms, setRooms] = useState([{ name: '', capacity: '' }]);
  const [constraints, setConstraints] = useState({ maxClassesPerDay: 0 });

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const handleInstructorChange = (index, field, value) => {
    const newInstructors = [...instructors];
    newInstructors[index][field] = value;
    setInstructors(newInstructors);
  };

  const handleRoomChange = (index, field, value) => {
    const newRooms = [...rooms];
    newRooms[index][field] = value;
    setRooms(newRooms);
  };

  const handleConstraintChange = (field, value) => {
    setConstraints({ ...constraints, [field]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const courseData = {
      courses,
      instructors,
      rooms,
      constraints,
    };

    try {
      const response = await axios.post('/api/generate-schedule', courseData);
      console.log('Generated Schedule:', response.data);
      // Handle the response as needed (e.g., display the schedule)
    } catch (error) {
      console.error('Error generating schedule:', error);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      <form onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold mb-4">Set Scheduling Constraints</h2>

        {/* Courses Input */}
        <h3 className="text-md font-semibold mb-2">Courses</h3>
        {courses.map((course, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              type="text"
              placeholder="Course Name"
              value={course.name}
              onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Instructor Name"
              value={course.instructor}
              onChange={(e) => handleCourseChange(index, 'instructor', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setCourses([...courses, { name: '', instructor: '' }])}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Course
        </button>

        {/* Instructors Input */}
        <h3 className="text-md font-semibold mt-4 mb-2">Instructors</h3>
        {instructors.map((instructor, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              type="text"
              placeholder="Instructor Name"
              value={instructor.name}
              onChange={(e) => handleInstructorChange(index, 'name', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="text"
              placeholder="Availability (e.g., Monday 9-11)"
              value={instructor.availability}
              onChange={(e) => handleInstructorChange(index, 'availability', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setInstructors([...instructors, { name: '', availability: '' }])}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Instructor
        </button>

        {/* Rooms Input */}
        <h3 className="text-md font-semibold mt-4 mb-2">Rooms</h3>
        {rooms.map((room, index) => (
          <div key={index} className="mb-2 flex gap-2">
            <input
              type="text"
              placeholder="Room Name"
              value={room.name}
              onChange={(e) => handleRoomChange(index, 'name', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="number"
              placeholder="Capacity"
              value={room.capacity}
              onChange={(e) => handleRoomChange(index, 'capacity', e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}
        <button
          type="button"
          onClick={() => setRooms([...rooms, { name: '', capacity: '' }])}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Room
        </button>

        {/* Constraints Input */}
        <h3 className="text-md font-semibold mt-4 mb-2">Constraints</h3>
        <label className="block mb-2">
          Max Classes Per Day:
          <input
            type="number"
            value={constraints.maxClassesPerDay}
            onChange={(e) => handleConstraintChange('maxClassesPerDay', e.target.value)}
            className="border p-2 rounded w-full"
            required
          />
        </label>

        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Generate Schedule
        </button>
      </form>

      {/* Preview Section */}
      <div className="mt-6 p-4 border rounded bg-gray-200">
        <h3 className="text-md font-semibold">Preview Input Values:</h3>
        <pre className="whitespace-pre-wrap">{JSON.stringify({ courses, instructors, rooms, constraints }, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ScheduleForm;

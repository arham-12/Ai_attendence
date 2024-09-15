import React from 'react'
import { useState } from 'react';

const Schedule = () => {
  // State to hold all the input data
  const [teacherAvailability, setTeacherAvailability] = useState([{ teacher: '', availability: '' }]);
  const [roomCapacity, setRoomCapacity] = useState([{ room: '', capacity: '' }]);
  const [studentAvailability, setStudentAvailability] = useState([{ batch: '', availability: '' }]);
  const [schoolCalendar, setSchoolCalendar] = useState({ startDate: '', endDate: '' });

  // Functions to handle adding more fields dynamically
  const addTeacherAvailability = () => setTeacherAvailability([...teacherAvailability, { teacher: '', availability: '' }]);
  const addRoomCapacity = () => setRoomCapacity([...roomCapacity, { room: '', capacity: '' }]);
  const addStudentAvailability = () => setStudentAvailability([...studentAvailability, { batch: '', availability: '' }]);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle data submission to the backend here
    console.log({
      teacherAvailability,
      roomCapacity,
      studentAvailability,
      schoolCalendar
    });
  };

  return (
    <div className="ml-[20%] min-h-screen overflow-auto bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-[80%]">
      <div className="max-w-4xl w-full space-y-8 bg-white p-10 rounded-lg shadow-md  mt-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Class Scheduling Constraints</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Teacher Availability */}
          <div>
            <h3 className="text-xl font-bold text-gray-700">Teacher Availability</h3>
            {teacherAvailability.map((_, idx) => (
              <div key={idx} className="flex space-x-4 mt-4">
                <input
                  type="text"
                  value={teacherAvailability[idx].teacher}
                  onChange={(e) => {
                    const newAvailability = [...teacherAvailability];
                    newAvailability[idx].teacher = e.target.value;
                    setTeacherAvailability(newAvailability);
                  }}
                  placeholder="Teacher Name"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="text"
                  value={teacherAvailability[idx].availability}
                  onChange={(e) => {
                    const newAvailability = [...teacherAvailability];
                    newAvailability[idx].availability = e.target.value;
                    setTeacherAvailability(newAvailability);
                  }}
                  placeholder="Available Slots (e.g., Monday 9-11am)"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTeacherAvailability}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add More Teacher Availability
            </button>
          </div>

          {/* Room Capacity */}
          <div>
            <h3 className="text-xl font-bold text-gray-700">Room Capacity</h3>
            {roomCapacity.map((_, idx) => (
              <div key={idx} className="flex space-x-4 mt-4">
                <input
                  type="text"
                  value={roomCapacity[idx].room}
                  onChange={(e) => {
                    const newRoomCapacity = [...roomCapacity];
                    newRoomCapacity[idx].room = e.target.value;
                    setRoomCapacity(newRoomCapacity);
                  }}
                  placeholder="Room Name/Number"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="number"
                  value={roomCapacity[idx].capacity}
                  onChange={(e) => {
                    const newRoomCapacity = [...roomCapacity];
                    newRoomCapacity[idx].capacity = e.target.value;
                    setRoomCapacity(newRoomCapacity);
                  }}
                  placeholder="Capacity"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addRoomCapacity}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add More Rooms
            </button>
          </div>

          {/* Student Availability */}
          <div>
            <h3 className="text-xl font-bold text-gray-700">Student Availability</h3>
            {studentAvailability.map((_, idx) => (
              <div key={idx} className="flex space-x-4 mt-4">
                <input
                  type="text"
                  value={studentAvailability[idx].batch}
                  onChange={(e) => {
                    const newStudentAvailability = [...studentAvailability];
                    newStudentAvailability[idx].batch = e.target.value;
                    setStudentAvailability(newStudentAvailability);
                  }}
                  placeholder="Batch/Group Name"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <input
                  type="text"
                  value={studentAvailability[idx].availability}
                  onChange={(e) => {
                    const newStudentAvailability = [...studentAvailability];
                    newStudentAvailability[idx].availability = e.target.value;
                    setStudentAvailability(newStudentAvailability);
                  }}
                  placeholder="Available Slots (e.g., Tuesday 10-12pm)"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addStudentAvailability}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              + Add More Student Availability
            </button>
          </div>

          {/* School Calendar */}
          <div>
            <h3 className="text-xl font-bold text-gray-700">School Calendar</h3>
            <div className="flex space-x-4 mt-4">
              <input
                type="date"
                value={schoolCalendar.startDate}
                onChange={(e) => setSchoolCalendar({ ...schoolCalendar, startDate: e.target.value })}
                placeholder="Start Date"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
              <input
                type="date"
                value={schoolCalendar.endDate}
                onChange={(e) => setSchoolCalendar({ ...schoolCalendar, endDate: e.target.value })}
                placeholder="End Date"
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
            >
              Schedule Classes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Schedule

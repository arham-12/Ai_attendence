import React from 'react';

// Utility function to get class status
const getClassStatus = (startTime, endTime) => {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  start.setHours(startHour, startMinute);
  end.setHours(endHour, endMinute);

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'conducted';
};

// Today's Classes component
const TodayClasses = () => {
  // Static data for today's classes
  const classes = [
    {
      id: 1,
      name: 'Mathematics',
      instructor: 'Dr. Alice Johnson',
      time: '09:00 AM - 10:30 AM',
      location: 'Room 101',
    },
    {
      id: 2,
      name: 'Physics',
      instructor: 'Prof. Bob Smith',
      time: '10:45 AM - 12:15 PM',
      location: 'Room 102',
    },
    {
      id: 3,
      name: 'Chemistry',
      instructor: 'Dr. Charlie Brown',
      time: '01:00 PM - 02:30 PM',
      location: 'Room 103',
    },
    {
      id: 4,
      name: 'Biology',
      instructor: 'Prof. Dana White',
      time: '03:00 PM - 04:30 PM',
      location: 'Room 104',
    },
  ];

  return (
    <div className="container mx-auto p-5 bg-gray-100">
      <h1 className="text-3xl text-center font-bold mb-5">Today's Classes</h1>

      <div className="bg-white shadow-lg rounded-lg p-5">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-600">
              <th className="py-2 px-4 border-b">Class Name</th>
              <th className="py-2 px-4 border-b">Instructor</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Status</th>
              {/* <th className="py-2 px-4 border-b">Action</th> */}
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => {
              const status = getClassStatus(classItem.time.split(' - ')[0], classItem.time.split(' - ')[1]);

              return (
                <tr key={classItem.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{classItem.name}</td>
                  <td className="py-2 px-4 border-b">{classItem.instructor}</td>
                  <td className="py-2 px-4 border-b">{classItem.time}</td>
                  <td className="py-2 px-4 border-b">{classItem.location}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block w-3 h-3 rounded-full ${status === 'upcoming' ? 'bg-green-500' : status === 'ongoing' ? 'bg-yellow-500' : 'bg-red-500'}`}></span>
                    <span className="ml-2">{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                  </td>
                  {/* <td className="py-2 px-4 border-b">
                    <button className="bg-primary text-white rounded-lg px-3 py-1">
                      Mark Attendance
                    </button>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TodayClasses;

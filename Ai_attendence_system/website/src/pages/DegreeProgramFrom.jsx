import React from 'react';

const DegreeProgramForm = ({ departments, onAddProgram, onPrev }) => (
  <div>
    <h2 className="text-xl font-semibold mb-2">Degree Programs</h2>
    {departments.map((dept, deptIndex) => (
      <div key={deptIndex} className="mb-6">
        <h3 className="font-medium mb-1">Department: {dept.name}</h3>
        {dept.programs.map((program, progIndex) => (
          <div key={progIndex} className="mb-2">
            <label className="block font-medium mb-1">Program Name</label>
            <input
              type="text"
              className="border border-gray-300 rounded px-3 py-2 w-full"
              value={program.name}
              onChange={(e) => {
                const updatedDepartments = [...departments];
                updatedDepartments[deptIndex].programs[progIndex].name = e.target.value;
                // Replace departments state update function
              }}
            />
          </div>
        ))}
        <button
          className="text-blue-500 font-semibold mb-2"
          onClick={() => onAddProgram(deptIndex)}
        >
          + Add Another Program
        </button>
      </div>
    ))}
    <button className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={onPrev}>
      Back
    </button>
    <button className="bg-green-500 text-white px-4 py-2 rounded">Submit</button>
  </div>
);

export default DegreeProgramForm;

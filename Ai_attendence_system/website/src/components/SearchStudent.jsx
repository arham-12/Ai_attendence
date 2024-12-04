import React, { useState } from "react";

const SearchStudent = () => {
  // State for the input fields
  const [student, setStudent] = useState({
    name: "",
    id: "",
    class: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div
        className="flex z-10 top-0 left-0 justify-evenly py-5 items-center w-full gap-8 px-3 shadow-md rounded-md"
      >
        <div className="list-none text-lg flex gap-2 items-center rounded-lg text-center">
          <h1>Name:</h1>
          <input
            name="name"
            placeholder="Enter Student Name"
            className="border border-primary p-2 text-sm outline-primary rounded-sm"
            type="text"
            value={student.name}
            onChange={handleChange}
          />
        </div>

        <div className="list-none text-lg flex gap-2 items-center rounded-lg text-center">
          <h1>Id:</h1>
          <input
            name="id"
            placeholder="Enter Student ID"
            className="border border-primary p-2 text-sm outline-primary rounded-sm"
            type="text"
            value={student.id}
            onChange={handleChange}
          />
        </div>

        <div className="list-none text-lg flex gap-2 items-center rounded-lg text-center">
          <h1>Class:</h1>
          <input
            name="class"
            placeholder="Enter Student Class"
            className="border border-primary p-2 text-sm outline-primary rounded-sm"
            type="text"
            value={student.class}
            onChange={handleChange}
          />
        </div>
      </div>
    </>
  );
};

export default SearchStudent;

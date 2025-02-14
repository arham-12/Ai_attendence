import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const AddCourse = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { authToken } = useContext(AuthContext);
  const [inputs, setInputs] = useState({
    course_name: "",
    course_code: "",
    degree_program: "",
    teacher: "",
  });
  const [degreePrograms, setDegreePrograms] = useState([]);

  useEffect(() => {
    const getPrograms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/degree-programs/",
          {
            headers: { Authorization: `Token ${authToken}` },
          }
        );
        console.log("Fetched degree programs:", response.data.degree_programs);
        setDegreePrograms(response.data.degree_programs); // State is updated here
      } catch (error) {
        console.error("Error fetching degree programs:", error);
        toast.error("Error fetching degree programs. Please try again.");
      }
    };

    getPrograms();
  }, [authToken]);

  const handleInputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const addCourse = async (e) => {
    e.preventDefault();
    console.log(inputs);

    try {
      const res = await axios.post(`${apiUrl}/api/courses/`, inputs, {
        headers: {
          Authorization: `Token ${authToken}`,
        },
      });

      if (res.status == '201') {
        toast.success("Added Successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form
      className="font-[sans-serif] h-screen max-w-2xl mx-auto"
    >
      <div className="py-2 text-center w-full">
        <h1 className="text-4xl font-medium">Add new course</h1>
        <p className="text-sm">You can add a new course</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative flex items-center">
          <input
            type="text"
            name="course_name"
            value={inputs.course_name}
            onChange={handleInputChange}
            placeholder="Course Name"
            className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
          />
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            name="course_code"
            value={inputs.course_code}
            onChange={handleInputChange}
            placeholder="Enter Course Code"
            className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
          />
        </div>
        <div className="relative flex items-center">
          <select
            name="degree_program"
            value={inputs.degree_program}
            onChange={handleInputChange}
            className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
          >
            <option value="">Select Degree Program</option>
            {degreePrograms.map((item) => (
              <option key={item.id} value={item.program_name}>
                {item.program_name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex items-center">
          <input
            type="text"
            name="teacher"
            value={inputs.teacher}
            onChange={handleInputChange}
            placeholder="Enter Teacher"
            className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
          />
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          onClick={addCourse}
          className="w-full bg-primary text-white py-2 rounded-md"
        >
          Add Course
        </button>
      </div>
    </form>
  );
};

export default AddCourse;

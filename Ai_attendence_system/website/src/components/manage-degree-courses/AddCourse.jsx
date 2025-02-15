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
  });
  const [degreeDropdown, setdegreeDropdown] = useState(false);
  const [selectedDegreeProgram, setselectedDegreeProgram] = useState("");
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [teacherDropdown, setteacherDropdown] = useState(false);
  const [releventTeachers, setreleventTeachers] = useState([]);
  const [selectedRelatedTeacher, setselectedRelatedTeacher] = useState("");

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
      const res = await axios.post(
        `${apiUrl}/api/courses/`,
        {
          course_name: inputs.course_name,
          course_code: inputs.course_code,
          degree_program: selectedDegreeProgram,
          teacher: selectedRelatedTeacher,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (res.status == "201") {
        toast.success("Added Successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getReleventTeachers = async (degree_program) => {
    console.log("func called");

    try {
      const res = await axios.get(
        `${apiUrl}/api/filter-teachers/${degree_program}/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log(res);
      setreleventTeachers(res.data.teacher_names);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="font-[sans-serif] h-screen max-w-2xl mx-auto">
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

        <div class="relative font-[sans-serif] w-full mx-auto">
          <button
            type="button"
            onClick={() => setdegreeDropdown(!degreeDropdown)}
            id="dropdownToggle"
            className="px-5 py-2.5 w-full rounded flex justify-between items-center  text-sm font-semibold border-2 outline-none border-primary"
          >
            {selectedDegreeProgram == ""
              ? "Select program"
              : selectedDegreeProgram}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 inline ml-3"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                clip-rule="evenodd"
                data-original="#000000"
              />
            </svg>
          </button>

          <ul
            id="dropdownMenu"
            class={`absolute ${
              degreeDropdown ? "block" : "hidden"
            } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto`}
          >
            {degreePrograms.map((item) => (
              <li
                onClick={() => {
                  setselectedDegreeProgram(item.program_name);
                  getReleventTeachers(item.program_name);
                  setdegreeDropdown(false);
                }}
                class="py-2.5 px-5 hover:bg-blue-50 text-black text-sm cursor-pointer"
              >
                {item.program_name}
              </li>
            ))}
          </ul>
        </div>

        <div class="relative font-[sans-serif] w-full mx-auto">
          <button
            type="button"
            id="dropdownToggle"
            onClick={() => {
              setteacherDropdown(!teacherDropdown);
            }}
            className="px-5 py-2.5 w-full flex items-center justify-between rounded text-sm font-semibold border-2 outline-none border-primary "
          >
            {selectedRelatedTeacher == ""
              ? "Select teacher"
              : selectedRelatedTeacher}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-3 inline ml-3"
              viewBox="0 0 24 24"
            >
              <path
                fill-rule="evenodd"
                d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                clip-rule="evenodd"
                data-original="#000000"
              />
            </svg>
          </button>

          <ul
            id="dropdownMenu"
            class={`absolute ${
              teacherDropdown ? "block" : "hidden"
            } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto`}
          >
            {releventTeachers.length != 0 ? (
              releventTeachers.map((item) => (
                <li
                  onClick={() => {
                    setselectedRelatedTeacher(item);
                    setteacherDropdown(false);
                  }}
                  class="py-2.5 px-5 hover:bg-blue-50 text-black text-sm cursor-pointer"
                >
                  {item}
                </li>
              ))
            ) : (
              <li class="py-2.5 px-5 hover:bg-blue-50 text-black text-sm cursor-pointer">
                No teacher found!
              </li>
            )}
          </ul>
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

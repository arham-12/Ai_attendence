import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import StudentDataCard from "./StudentDataCard";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/auth";

const SearchStudent = () => {
  // State for the input fields
  const { authToken } = useContext(AuthContext);
  const [studentId, setStudentId] = useState("");
  const [searchedStudent, setsearchedStudent] = useState(null);
  const [response, setresponse] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    setStudentId(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/students/", {
          headers: { Authorization: `Token ${authToken}` },
        });
        setresponse(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const searchStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:8000/api/students/${studentId}/`,{
          headers: { Authorization: `Token ${authToken}` },
        }
      );
      if (response.status === 200) {
        toast.success("Student exists!");
        setsearchedStudent(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Student not found!");
      setsearchedStudent(null); // Reset searched student if not found
    }
  };

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="flex z-10 top-0 left-0 justify-between py-3 items-center w-full gap-8 px-10 border border-black shadow-md rounded-md">
        <form
          onSubmit={searchStudent}
          className="list-none text-lg flex gap-2 items-center rounded-lg text-center"
        >
          <h1 className="font-semibold text-sm ">Student id:</h1>
          <input
            name="studentId"
            placeholder="Enter Student ID"
            className="px-2 py-1.5 text-sm border border-black outline-primary rounded"
            type="text"
            value={studentId}
            onChange={handleChange}
          />
        </form>

        <div className="list-none text-lg rounded-lg text-center">
          <button
            onClick={searchStudent}
            className="bg-primary px-6 py-1 rounded-md text-white flex items-center gap-2"
          >
            <IoSearchSharp /> Search
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        {response ? (
          <table className="w-full bg-white">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Student Id
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Email
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Semester
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Section
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {searchedStudent ? (
                <StudentDataCard
                  student={searchedStudent}
                  key={searchedStudent.id}
                  id={searchedStudent.student_id}
                  name={searchedStudent.student_name}
                  email={searchedStudent.student_email}
                  semester={searchedStudent.semester}
                  section={searchedStudent.section}
                />
              ) : (
                response.map((res) => (
                  <StudentDataCard
                    student={res}
                    key={res.id}
                    id={res.student_id}
                    name={res.student_name}
                    email={res.student_email}
                    semester={res.semester}
                    section={res.section}
                  />
                ))
              )}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-20 text-sm">No students found!</p>
        )}
      </div>
    </div>
  );
};

export default SearchStudent;

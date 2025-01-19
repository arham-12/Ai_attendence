import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/auth";
import StudentDataCard from "./StudentDataCard";

const SearchStudent = () => {
  // State for the input fields
  const { authToken } = useContext(AuthContext);
  const [studentId, setStudentId] = useState("");
  const [searchedStudent, setsearchedStudent] = useState(null);
  const [response, setresponse] = useState([]);

  const searchStudent = async (e) => {
   setStudentId(e.target.value);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/students/${e.target.value}/`,
        {
          headers: { Authorization: `Token ${authToken}` },
        }
      );
      console.log(response.data);
      
      if (response.status === 200) {
        setsearchedStudent(response.data);
      
      }
    } catch (error) {
      console.log(error);
   
      setsearchedStudent(null); // Reset searched student if not found
    }
  };

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



  return (
    <div className="flex flex-col justify-center items-center overflow-scroll">
      <div className="flex z-10 top-0 left-0 justify-between py-3 items-center w-full gap-8 px-4 shadow-md rounded-md">
        <form
          onSubmit={searchStudent}
          className="list-none text-lg flex gap-2 items-center rounded-lg text-center"
        >
          <h1 className="font-semibold text-sm max-lg:hidden">Student id:</h1>
          <input
            name="studentId"
            placeholder="Enter Student ID"
            className="px-2 py-1.5 text-sm border-b outline-none bg-transparent border-black"
            type="text"
            value={studentId}
            onChange={searchStudent}
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

      <div className="w-full overflow-auto">
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
                  Degree Program
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

            <tbody className="overflow-auto h-auto">
              {searchedStudent ? (
                searchedStudent.map((searchedStudent) => (
                <StudentDataCard
                  student={searchedStudent}
                  key={searchedStudent.id}
                  id={searchedStudent.student_id}
                  name={searchedStudent.student_name}
                  email={searchedStudent.student_email}
                  semester={searchedStudent.semester}
                  degreeprogram={searchedStudent.degree_program}
                  section={searchedStudent.section}
                />
              ))
              ) : (
                response.map((res) => (
                  <StudentDataCard
                    student={res}
                    key={res.id}
                    id={res.student_id}
                    name={res.student_name}
                    email={res.student_email}
                    degreeprogram={res.degree_program}
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

import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import TeacherDataCard from "./TeacherDataCard";
import { AuthContext } from "../../context/auth";

const ManageAllTeachers = () => {
  // State for the input fields
  const { authToken } = useContext(AuthContext);
  const [teacherId, setteacherId] = useState("")
  const [searchedStudent, setsearchedStudent] = useState(null);
  const [response, setresponse] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    setteacherId(e.target.value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/teachers/", {
          headers: { Authorization: `Token ${authToken}` },
        });
        setresponse(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const SearchTeachers = async (e) => {
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
      <div className="flex z-10 top-0 left-0 justify-between py-3 items-center w-full gap-8 px-4 shadow-md rounded-md">
        <form
          onSubmit={SearchTeachers}
          className="list-none text-lg flex gap-2 items-center rounded-lg text-center"
        >
          <h1 className="font-semibold text-sm ">Teacher id:</h1>
          <input
            name="studentId"
            placeholder="Enter teacher id"
            className="px-2 py-1.5 text-sm border-b border-black bg-transparent"
            type="text"
            value={teacherId}
            onChange={handleChange}
          />
        </form>

        <div className="list-none text-sm rounded-lg text-center">
          <button
            onClick={ManageAllTeachers}
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
                  Teacher id
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Email
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Degree program
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Actions
                </th>
              
              </tr>
            </thead>

            <tbody>
              {searchedStudent ? (
                <TeacherDataCard
                  teacher={searchedStudent}
                  key={searchedStudent.id}
                  id={searchedStudent.id}
                  name={searchedStudent.teacher_name}
                  email={searchedStudent.teacher_email}
             
                />
              ) : (
                response.map((res) => (
                  <TeacherDataCard
                    teacher={res}
                    key={res.id}
                    id={res.id}
                    name={res.teacher_name}
                    email={res.teacher_email}
                  
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

export default ManageAllTeachers;

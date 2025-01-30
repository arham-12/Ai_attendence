import React, { useContext, useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";
import TeacherDataCard from "./TeacherDataCard";
import { AuthContext } from "../../context/auth";

const ManageAllTeachers = () => {
  const { authToken } = useContext(AuthContext);
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change for teacher email
  const handleChange = (e) => {
    setTeacherEmail(e.target.value);
  };

  // Fetch all teachers initially
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:8000/api/teachers/", {
          headers: { Authorization: `Token ${authToken}` },
        });
        setTeachers(res.data);
      } catch (error) {
        console.log(error);
        setError("Error fetching teachers");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [authToken]);

  // Fetch teachers based on email (debounced API call)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (teacherEmail.trim() !== "") {
        try {
          setLoading(true);
          console.log("Searching teachers with email:", teacherEmail); // Log email to check
          
          const response = await axios.get(
            `http://localhost:8000/api/teachers/${teacherEmail}/`, // Change API endpoint to match URL format
            {
              headers: { Authorization: `Token ${authToken}` },
            }
          );
          console.log("Teacher(s) found:", response.data); // Log response data to check

          if (response.data) {
            setTeachers(response.data); // Set found teacher(s)
          } else {
            setTeachers([]);
            setError("No teacher found with that email.");
          }
        } catch (error) {
          console.log(error);
          setTeachers([]); // Empty list if not found
          setError("No teacher found");
        } finally {
          setLoading(false);
        }
      } else {
        // Reset to all teachers when input is cleared
        const res = await axios.get("http://localhost:8000/api/teachers/", {
          headers: { Authorization: `Token ${authToken}` },
        });
        setTeachers(res.data);
      }
    }, 500); // 500ms debounce delay

    return () => clearTimeout(delayDebounceFn); // Cleanup timeout on input change
  }, [teacherEmail, authToken]);

  console.log("Teachers array:", teachers); // Log the teachers array

  return (
    <div className="flex flex-col justify-center items-center ">
      <div className="flex z-10 top-0 left-0 justify-between py-3 items-center w-full gap-8 px-4 shadow-md rounded-md">
        <form className="list-none text-lg flex gap-2 items-center rounded-lg text-center">
          <h1 className="font-semibold text-sm">Teacher Email:</h1>
          <input
            name="teacherEmail"
            placeholder="Enter teacher email"
            className="px-2 py-1.5 text-sm border-b border-black bg-transparent"
            type="text"
            value={teacherEmail}
            onChange={handleChange}
          />
        </form>
        <div className="list-none text-lg rounded-lg text-center">
          <button
            onClick={() => {}}
            className="bg-primary px-6 py-1 rounded-md text-white flex items-center gap-2"
          >
            <IoSearchSharp /> Search
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto max-h-screen overflow-y-auto pb-24 scrollbar-hide ">
        {loading ? (
          <p className="text-center mt-20 text-sm">Loading...</p>
        ) : teachers.length > 0 ? (
          <table className="w-full bg-white ">
            <thead className="bg-gray-100 whitespace-nowrap">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Teacher ID
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
                  Teacher Type
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-800">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <TeacherDataCard
                  teacher={teacher}
                  key={teacher.id}
                  id={teacher.id}
                  teacher_type={teacher.teaching_type}
                  name={teacher.teacher_name}
                  email={teacher.teacher_email}
                  degree_program={teacher.degree_program}
                />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-20 text-sm text-red-500">
            {error || "No teachers found!"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManageAllTeachers;

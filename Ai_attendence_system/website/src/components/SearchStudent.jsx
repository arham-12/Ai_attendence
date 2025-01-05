import React, { useEffect, useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import StudentDataCard from "./StudentDataCard";
import axios from "axios"
import DeleteDialogBox from "./dialog-boxes/deleteDialogBox";

const SearchStudent = () => {
  // State for the input fields
  const [student, setStudent] = useState({
    name: "",
    id: "",
    class: "",
  });

  const [response, setresponse] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
    try {
        const res =  await axios.get("http://localhost:8000/api/students/");
        setresponse(res.data);
    } catch (error) {
      
      console.log(error);
    }

  
    }
    return ()=>{

      fetchData();
    }
  }, [])
  

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(student);

  };
  return (
    <div className="flex flex-col justify-center items-center ">
       
      <div className="flex z-10 top-0 left-0 justify-between  py-5 items-center w-full gap-8 px-10 shadow-md rounded-md">
        <div className="list-none text-lg flex gap-2 items-center rounded-lg text-center">
          <h1 className="font-semibold text-secondary">Id:</h1>
          <input
            name="id"
            placeholder="Enter Student ID"
            className="border border-primary p-2 text-sm outline-primary rounded-md"
            type="text"
            value={student.id}
            onChange={handleChange}
          />
        </div>

        <div className="list-none text-lg rounded-lg text-center">
          <button className="bg-primary px-6 py-1 rounded-md text-white flex items-center gap-2">
            <IoSearchSharp /> Search
          </button>
        </div>
      </div>
      <div class="w-full overflow-x-auto">
     {
      response ?( <table class="w-full bg-white">
        <thead class="bg-gray-100 whitespace-nowrap">
          <tr>
            <th class="p-4 text-left text-xs font-semibold text-gray-800">
             Student Id
            </th>
            <th class="p-4 text-left text-xs font-semibold text-gray-800">
              Name
            </th>
            <th class="p-4 text-left text-xs font-semibold text-gray-800">
              Email
            </th>
            <th class="p-4 text-left text-xs font-semibold text-gray-800">
              Semester
            </th>
            <th class="p-4 text-left text-xs font-semibold text-gray-800">
              Section
            </th>
            <th class="p-4 text-left text-xs font-semibold text-gray-800">
              Actions
            </th>
          </tr>
        </thead>

        <tbody class="">
          {response ?(
               response.map((res) => (
                <StudentDataCard key={res.id} id={res.student_id} name={res.student_name} email={res.student_email} semester={res.semester} section={res.section} />
              ))
          ):(<p className="text-center w-full">No Student Found</p>)
         
          }
         

         
        </tbody>
      </table>):(
        <p className="text-center mt-20 text-sm ">No students found!</p>
      )
     }
    </div>
    </div>
  );
};

export default SearchStudent;

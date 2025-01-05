import React, { useState } from "react";
import axios from 'axios'
import toast from 'react-hot-toast'
const EditStudentBox = ({ Show, SetShow, student }) => {
  const [inputs, setinputs] = useState({
    degree_program: student.degree_program,
    student_name: student.student_name,
    student_id: student.student_id,
    student_email: student.student_email,
    semester: student.semester,
    section: student.section,
  });
  const onChangeHandler = (e) => {
    e.preventDefault();
    setinputs({ ...inputs, [e.target.name]: e.target.value });
  };
  const onSubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8000/api/students/${student.student_id}/`,inputs);
      if(response.status === 200){
        window.location.reload();
        toast.success("Update successfully");
        SetShow(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error)
    }
    
  }
  return (
    <>
      <div
        class={`fixed inset-0 p-4 ${
          Show ? "flex" : "hidden"
        } flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]`}
      >
        <div class="w-full max-w-lg bg-white shadow-lg rounded-md p-8 relative">
          <svg
            onClick={() => SetShow(false)}
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 cursor-pointer shrink-0 fill-gray-800 hover:fill-red-500 float-right"
            viewBox="0 0 320.591 320.591"
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              data-original="#000000"
            ></path>
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              data-original="#000000"
            ></path>
          </svg>
          <div class="my-8 text-center">
            <h4 class="text-2xl text-gray-800 font-bold">Update Studen Data</h4>

            <div className="grid grid-cols-2 gap-2">
              <input
                name="student_name"
                value={inputs.student_name}
                onChange={onChangeHandler}
                type="name"
                placeholder={student.student_name}
                class="px-4 placeholder:text-black  py-2.5 mt-6 bg-[#f0f1f2] text-black w-full text-sm focus:bg-transparent outline-blue-600 rounded-md"
              />
              <input
                name="student_email"
                value={inputs.student_email}
                onChange={onChangeHandler}
                type="email"
                placeholder={student.student_email}
                class="px-4 placeholder:text-black  py-2.5 mt-6 bg-[#f0f1f2] text-black w-full text-sm focus:bg-transparent outline-blue-600 rounded-md"
              />
              <input
                name="degree_program"
                value={inputs.degree_program}
                onChange={onChangeHandler}
                type="text"
                placeholder={student.degree_program}
                class="px-4 placeholder:text-black  py-2.5 mt-6 bg-[#f0f1f2] text-black w-full text-sm focus:bg-transparent outline-blue-600 rounded-md"
              />
              <input
                name="semester"
                value={inputs.semester}
                onChange={onChangeHandler}
                type="text"
                placeholder={student.semester}
                class="px-4 placeholder:text-black  py-2.5 mt-6 bg-[#f0f1f2] text-black w-full text-sm focus:bg-transparent outline-blue-600 rounded-md"
              />
              <input
                name="section"
                value={inputs.section}
                onChange={onChangeHandler}
                type="text"
                placeholder={student.section}
                class="px-4 placeholder:text-black  py-2.5 mt-6 bg-[#f0f1f2] text-black w-full text-sm focus:bg-transparent outline-blue-600 rounded-md"
              />
            </div>
          </div>
          <button
          onClick={onSubmitHandler}
            type="button"
            class="px-5 py-2.5 w-full rounded-md text-white text-sm outline-none bg-primary hover:bg-secondary"
          >
            Update student
          </button>
        </div>
      </div>
    </>
  );
};

export default EditStudentBox;

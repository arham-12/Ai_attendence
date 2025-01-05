import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-hot-toast";
import DeleteDialogBox from "./dialog-boxes/deleteDialogBox";

const AddStudentIDs = () => {
  const [formData, setFormData] = useState({
    student_id: null,
    student_name: null,
    student_email: null,
    section: null,
    degree_program: null,
    semester: null,
    file: null, // Add file state
  });

  const [showUpload, setShowUpload] = useState(false);
  const [showColumnsData, setShowColumnsData] = useState(false);
  const [degreePrograms, setDegreePrograms] = useState(null);
  useEffect(() => {
    const getPrograms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/degree-programs/"
        );

        if (response.status === 200) {
          setDegreePrograms(response.data.degree_programs);
          console.log(degreePrograms.program_name);
        }
      } catch (error) {
        console.error("Error adding student:", error);
        toast.error("Error adding student. Please try again.");
      }
    };
    return () => {
      getPrograms();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, file: file });
  };

  // Convert file to base64 string
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        student_name: formData.student_name,
        student_email: formData.student_email,
        student_id: formData.student_id,
        degree_program: formData.degree_program,
        semester: formData.semester,
        section: formData.section,
      };

      const response = await axios.post(
        "http://localhost:8000/add-student/",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Student ID added successfully!");
        setFormData({
          fullName: "",
          email: "",
          studentId: "",
          degreeProgram: "",
          semester: "",
          department: "",
          section: "",
          file: null,
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Error adding student. Please try again.");
    }
  };
  const handleSubmitFile = async (e) => {
    e.preventDefault();
    try {
      let file = null;
      if (formData.file) {
        // Convert file to base64
        fileBase64 = await convertFileToBase64(formData.file);
      }

      const response = await axios.post(
        "http://localhost:8000/analyze-csv/",
        { file },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("File added successfully!");
        setFormData({
          fullName: "",
          email: "",
          studentId: "",
          degreeProgram: "",
          semester: "",
          department: "",
          section: "",
          file: null,
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Error adding student. Please try again.");
    }
  };

  return (
    <div>
 
      <div
        className={`${
          showColumnsData ? "grid" : "hidden"
        } absolute z-10 bg-[#0000004e] top-0 left-0 justify-center items-center h-screen w-full grid-cols-2 gap-8 px-3 shadow-md rounded-md`}
      >
        <IoClose
          onClick={() => {
            setShowColumnsData(!showColumnsData);
          }}
          className="absolute top-0 right-0 mx-6 my-4 text-4xl"
        />
        <ul className="list-none text-lg flex flex-col gap-7 py-7 rounded-lg text-center bg-white pl-4">
          <h1 className="font-bold text-2xl">Required Columns ❗</h1>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
        <ul className="list-none text-lg flex flex-col gap-5 py-6 rounded-lg text-center bg-white pl-4">
          <h1 className="font-bold text-2xl">Wrong Columns ❌</h1>
          <li>
            Item 1{" "}
            <input
              className="p-2 text-sm border border-black rounded-md"
              placeholder="Change Columns"
              type="text"
            />
          </li>
          <li>
            Item 1{" "}
            <input
              className="p-2 text-sm border border-black rounded-md"
              placeholder="Change Columns"
              type="text"
            />
          </li>
          <li>
            Item 1{" "}
            <input
              className="p-2 text-sm border border-black rounded-md"
              placeholder="Change Columns"
              type="text"
            />
          </li>
          <li>
            Item 1{" "}
            <input
              className="p-2 text-sm border border-black rounded-md"
              placeholder="Change Columns"
              type="text"
            />
          </li>
          <li>
            Item 1{" "}
            <input
              className="p-2 text-sm border border-black rounded-md"
              placeholder="Change Columns"
              type="text"
            />
          </li>
        </ul>
      </div>
      <form
        className="font-[sans-serif] w-full mx-auto"
        onSubmit={handleSubmitData}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative flex items-center">
            <input
              type="text"
              name="student_name"
              value={formData.student_name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <input
              type="email"
              name="student_email"
              value={formData.student_email}
              onChange={handleInputChange}
              placeholder="Email"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              name="student_id"
              value={formData.student_id}
              onChange={handleInputChange}
              placeholder="Student Id"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>
          <div className="relative flex items-center">
            <select
            className="w-full border-black border py-3 px-4"
              value={formData.degree_program}
              onChange={handleInputChange}
              name="degree_program"
              id=""
            >
              {Array.isArray(degreePrograms) ? (
                  degreePrograms.map((program, index) => (
                    <option className="" key={index} value={program.program_name}>
                      {program.program_name}
                    </option>
                  ))
              ):(<option >No degree programs found!</option>)
            }
            </select>
          </div>
          <div class="relative font-[sans-serif] w-full">
      <button type="button" id="dropdownToggle"
        class="px-5 py-2.5 w-full border text-left border-gray-300 text-gray-800 text-sm outline-none bg-white hover:bg-gray-50">
        Dropdown menu
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 fill-gray-500 inline ml-3" viewBox="0 0 24 24">
          <path fill-rule="evenodd"
            d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
            clip-rule="evenodd" data-original="#000000" />
        </svg>
      </button>

      <ul id="dropdownMenu" class='absolute hidden shadow-[0_8px_19px_-7px_rgba(6,81,237,0.2)] bg-white py-2 z-[1000] min-w-full w-max divide-y max-h-96 overflow-auto'>
        <li class='py-3 px-5 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer'>Dropdown option</li>
        <li class='py-3 px-5 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer'>Cloth set</li>
        <li class='py-3 px-5 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer'>Sales details</li>
        <li class='py-3 px-5 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer'>Marketing</li>
      </ul>
    </div>
          <div className="relative flex items-center">
            <input
              type="number"
              name="semester"
              value={formData.semester}
              onChange={handleInputChange}
              placeholder="Semester"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleInputChange}
              placeholder="Department"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>
        </div>

        <div
          className={`absolute w-full top-0 left-0 px-20 h-screen bg-[#0000004e] ${
            showUpload ? "flex" : "hidden"
          } justify-center items-center`}
        >
          <div
            onClick={() => {
              setShowUpload(!showUpload);
            }}
            className="absolute top-0 right-0 text-2xl m-4 p-3 border rounded-full cursor-pointer"
          >
            <IoClose />
          </div>
          <label
            htmlFor="uploadFile1"
            className="bg-white text-gray-500 font-semibold text-base rounded w-[60%] h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-11 mb-2 fill-gray-500"
              viewBox="0 0 32 32"
            >
              <path
                d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                data-original="#000000"
              />
              <path
                d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                data-original="#000000"
              />
            </svg>
            <input
              type="file"
              name="file"
              id="uploadFile1"
              className="hidden"
              onChange={handleFileChange}
            />
            <p class="text-xs font-medium text-gray-400 mt-2">
              PNG, JPG SVG, WEBP, and GIF are Allowed.
            </p>

            <button
              onClick={handleSubmitFile}
              className={`${
                formData.file ? "block" : "hidden"
              } bg-primary px-6 py-1 mt-2 text-white rounded-md`}
            >
              Upload
            </button>
          </label>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowUpload(!showUpload);
            }}
            className="w-full bg-primary text-white py-2 rounded-md"
          >
            Bulk Import
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentIDs;

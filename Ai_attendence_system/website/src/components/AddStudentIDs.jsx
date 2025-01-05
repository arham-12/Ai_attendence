import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { toast } from "react-hot-toast";
import DeleteDialogBox from "./dialog-boxes/deleteDialogBox";
import DropDown from "./DropDown";
import UploadFileBox from "./dialog-boxes/uploadFileBox";

const AddStudentIDs = () => {
  const [dropdownValue, setdropdownValue] = useState("");
  const [formData, setFormData] = useState({
    student_id: null,
    student_name: null,
    student_email: null,
    section: null,
    semester: null,
    file: null, // Add file state
  });

  const [showUpload, setShowUpload] = useState(false);
  const [showColumnsData, setShowColumnsData] = useState(false);
  const [degreePrograms, setDegreePrograms] = useState([]);

  useEffect(() => {
    const getPrograms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/degree-programs/"
        );
        console.log("Fetched degree programs:", response.data.degree_programs);
        setDegreePrograms(response.data.degree_programs); // State is updated here
        console.log(degreePrograms);
      } catch (error) {
        console.error("Error fetching degree programs:", error);
        toast.error("Error fetching degree programs. Please try again.");
      }
    };

    getPrograms();
  }, []); // Empty dependency array ensures it runs once on component mount

  const handleInputChange = (event) => {
    setFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
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
        degree_program: dropdownValue,
        semester: formData.semester,
        section: formData.section,
      };

      const response = await axios.post(
        "http://localhost:8000/api/students/",
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
  

  return (
    <div>
      <UploadFileBox Show={showUpload} setShow={setShowUpload} />
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
          <DropDown
            degreePrograms={degreePrograms}
            value={dropdownValue}
            setValue={setdropdownValue}
          />

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

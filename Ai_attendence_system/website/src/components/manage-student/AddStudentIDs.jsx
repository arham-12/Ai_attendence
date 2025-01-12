import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/auth";
import UploadFileBox from "../dialog-boxes/uploadFileBox";
import UpdateColumnsBox from "../dialog-boxes/UpdateColumnsBox";
import DropDown from "../DropDown";

const AddStudentIDs = () => {
  const [dropdownValue, setdropdownValue] = useState("");
  const [formData, setFormData] = useState({
    student_id: null,
    student_name: null,
    student_email: null,
    section: null,
    semester: null,
  });
  const { authToken } = useContext(AuthContext);
  const [showUpload, setShowUpload] = useState(false);
  const [showUpdateColBox, setshowUpdateColBox] = useState(false);
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
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Student ID added successfully!");
        setFormData({
          student_id: null,
          student_name: null,
          student_email: null,
          section: null,
          semester: null,
        });
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error("Error adding student. Please try again.");
    }
  };

  return (
    <div>
      <UploadFileBox
        Show={showUpload}
        setShow={setShowUpload}
        setifFalse={setshowUpdateColBox}
      />
      <UpdateColumnsBox Show={showUpdateColBox} setShow={setshowUpdateColBox} apiUrl={"http://localhost:8000/api/students_bulk_insertion/"} />
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

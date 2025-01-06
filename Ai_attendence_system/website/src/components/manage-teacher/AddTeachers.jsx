import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/auth";
import UploadFileBox from "../dialog-boxes/uploadFileBox";
import UpdateColumnsBox from "../dialog-boxes/UpdateColumnsBox";
import DropDown from "../DropDown";
import UploadTeachersFile from "../dialog-boxes/UploadTeachersFile";


const AddTeacherIDs = () => {
  const [dropdownValue, setdropdownValue] = useState("");
  const [formData, setFormData] = useState({
    teacher_name: null,
    teacher_email: null,
    degree_program:0
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
        teacher_name: formData.teacher_name,
        teacher_email: formData.teacher_email,
        degree_program: dropdownValue,
      };

      const response = await axios.post(
        "http://localhost:8000/api/teachers/",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${authToken}`,
          },
        }
      );

      if (response.status === 201) {
        toast.success("Teacher ID added successfully!");
        setFormData({
          Teacher_id: null,
          Teacher_name: null,
          Teacher_email: null,
          section: null,
          semester: null,
        });
      }
    } catch (error) {
      console.error("Error adding Teacher:", error);
      toast.error("Error adding Teacher. Please try again.");
    }
  };

  return (
    <div>
      <UploadTeachersFile
        Show={showUpload}
        setShow={setShowUpload}
        setifFalse={setshowUpdateColBox}
      />
      <UpdateColumnsBox Show={showUpdateColBox} setShow={setshowUpdateColBox} />
      <form
        className="font-[sans-serif] w-full mx-auto"
        onSubmit={handleSubmitData}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative flex items-center">
            <input
              type="text"
              name="teacher_name"
              value={formData.teacher_name}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>

          <div className="relative flex items-center">
            <input
              type="email"
              name="teacher_email"
              value={formData.teacher_email}
              onChange={handleInputChange}
              placeholder="Email"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div>
          <DropDown
            degreePrograms={degreePrograms}
            value={dropdownValue}
            setValue={setdropdownValue}
          />
{/* 
<div className="relative flex items-center">
            <input
              type="number"
              name="degree_program"
              value={formData.degree_program}
              onChange={handleInputChange}
              placeholder="Email"
              className="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
          </div> */}
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

export default AddTeacherIDs;

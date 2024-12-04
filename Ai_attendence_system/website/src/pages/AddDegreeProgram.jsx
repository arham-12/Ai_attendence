import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/auth";

const degreeProgramsByDepartment = {
  "Science and Technology": [
    "BSc in Computer Science",
    "BSc in Information Technology",
    "BSc in Biotechnology",
    "BSc in Environmental Science",
    "BSc in Physics",
    "BSc in Chemistry",
  ],
  Engineering: [
    "BEng in Civil Engineering",
    "BEng in Electrical Engineering",
    "BEng in Mechanical Engineering",
    "BEng in Software Engineering",
    "BEng in Chemical Engineering",
    "BEng in Industrial Engineering",
  ],
  "Medical and Health Sciences": [
    "MBBS (Bachelor of Medicine and Bachelor of Surgery)",
    "BDS (Bachelor of Dental Surgery)",
    "BS in Nursing",
    "Doctor of Pharmacy (Pharm.D)",
    "BS in Public Health",
    "DPT (Doctor of Physical Therapy)",
  ],
  "Business and Economics": [
    "BBA (Bachelor of Business Administration)",
    "MBA (Master of Business Administration)",
    "BS in Economics",
    "BS in Finance",
    "BS in Marketing",
    "BS in Accounting",
  ],
  "Social Sciences and Humanities": [
    "BA in Sociology",
    "BA in Psychology",
    "BA in Political Science",
    "BS in Anthropology",
    "BA in International Relations",
    "MA in Social Work",
  ],
  "Arts and Humanities": [
    "BA in English Literature",
    "BA in History",
    "BA in Fine Arts",
    "BA in Philosophy",
    "BA in Media Studies",
    "MA in Cultural Studies",
  ],
  Law: [
    "LLB (Bachelor of Laws)",
    "LLM (Master of Laws)",
    "BA LLB (Bachelor of Arts and Bachelor of Laws)",
    "PhD in Law",
  ],
  Education: [
    "BEd (Bachelor of Education)",
    "MEd (Master of Education)",
    "BA in Educational Leadership",
    "MA in Curriculum and Instruction",
    "BS in Early Childhood Education",
    "BS in Special Education",
  ],
};

const AddDegreeProgramPage = () => {
  const { setisAddProgram } = useContext(AuthContext);
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [degreeProgramsMap, setDegreeProgramsMap] = useState({});
  const [activeDepartment, setActiveDepartment] = useState(null);
  const [degreeName, setDegreeName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/get-departments"
        );
        setDepartments(response.data);
        const initialProgramsMap = {};
        response.data.forEach((department) => {
          initialProgramsMap[department.name] = [];
        });
        setDegreeProgramsMap(initialProgramsMap);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleAddPrograms = (program) => {
    if (program && activeDepartment) {
      if (!degreeProgramsMap[activeDepartment].includes(program)) {
        setDegreeProgramsMap((prev) => ({
          ...prev,
          [activeDepartment]: [...(prev[activeDepartment] || []), program],
        }));
      }
      setDegreeName("");
    }
  };

  const handleRemoveProgram = (department, valueToRemove) => {
    setDegreeProgramsMap((prev) => ({
      ...prev,
      [department]: prev[department].filter((value) => value !== valueToRemove),
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleAddPrograms(degreeName);
    }
  };

  const handlePreview = () => {
    const allDepartmentsFilled = departments.every(
      (department) => degreeProgramsMap[department.name]?.length > 0
    );
    if (!allDepartmentsFilled) {
      alert("Please add degree programs for all departments.");
    } else {
      setShowModal(true);
    }
  };

  const handleSubmit = async () => {
    try {
      const degreeProgramsData = {
        departments: Object.keys(degreeProgramsMap).map((department) => ({
          name: department,
          degreePrograms: degreeProgramsMap[department],
        })),
      };

      const response = await axios.post(
        "http://localhost:8000/add-degree-program",
        degreeProgramsData
      );

      // Check if the response status is 200 (OK)
      if (response.status === 200) {
        setisAddProgram(true);
        navigate("/");
        toast.success("Degree programs added successfully!", {
          position: "top-right",
        });

        // Clear state and close modal
        setShowModal(false);
        setDegreeProgramsMap({});
        setActiveDepartment(null);
      }
    } catch (error) {
      console.error("Error submitting degree programs:", error);

      // Show error toast with message from error response or fallback message
      toast.error(
        `Error adding degree programs: ${
          error.response?.data?.message || "Please try again."
        }`,
        { position: "top-right" }
      );
    }
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-gray-50 rounded-lg shadow-lg max-w-6xl">
      <h1 className="text-3xl font-bold text-secondary mb-6 text-center">
        Add Degree Programs
      </h1>

      <div className="flex overflow-x-auto space-x-2 mb-4">
        {departments.map((department) => (
          <button
            key={department.id}
            onClick={() => setActiveDepartment(department.name)}
            className={`px-4 py-2 rounded-full ${
              activeDepartment === department.name
                ? "bg-secondary text-white"
                : "bg-gray-200"
            }`}
          >
            {department.name}
          </button>
        ))}
      </div>

      {activeDepartment && (
        <span>
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Add Programs to {activeDepartment}
            </h2>
            <div className="border border-gray-300 rounded-lg p-2 mt-1">
              {/* Container for Input Field - Fixed at the Bottom */}

              {/* Container for Added Values - Row-first with Wrap */}
              <div className="flex flex-wrap gap-2">
                {(degreeProgramsMap[activeDepartment] || []).map((value) => (
                  <div
                    key={value}
                    className="flex items-center bg-secondary text-white rounded-full px-3 py-1 shadow-sm"
                  >
                    <span>{value}</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveProgram(activeDepartment, value)
                      }
                      className="ml-2 text-sm text-red-600"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={degreeName}
                onChange={(e) => setDegreeName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type degree name and press Enter"
                className="border-none focus:outline-none w-full p-2 mb-2 rounded-lg shadow-sm"
              />
            </div>

            <div className="flex flex-wrap space-x-2 space-y-2 mb-4 mt-3">
              {(degreeProgramsByDepartment[activeDepartment] || []).map(
                (program) => (
                  <div
                    key={program}
                    className="bg-[#b3f3f5] text-gray-700 rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-secondary hover:text-white "
                    onClick={() => handleAddPrograms(program)}
                  >
                    {program}
                  </div>
                )
              )}
            </div>
          </div>
        </span>
      )}

      <button
        onClick={handlePreview}
        className="mt-4 w-full bg-yellow-500 text-white rounded-lg px-4 py-2"
      >
        Preview Programs
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ease-out">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl w-full h-3/4 overflow-y-auto transform transition-transform duration-300 ease-out translate-y-0 scrollbar-hide">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
              Preview Degree Programs
            </h2>

            <table className="w-full mb-6 border-collapse border border-gray-300 text-sm rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="border p-3 text-left bg-gray-200 text-gray-800 font-medium">
                    Department
                  </th>
                  <th className="border p-3 text-left bg-gray-200 text-gray-800 font-medium">
                    Degree Programs
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(degreeProgramsMap).map((department) => (
                  <tr key={department} className="odd:bg-gray-50 even:bg-white">
                    <td className="border p-3 font-semibold text-gray-700">
                      {department}
                    </td>
                    <td className="border p-3">
                      <ul className="list-disc pl-5">
                        {degreeProgramsMap[department].map((program) => (
                          <li key={program} className="text-gray-600">
                            {program}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 text-white rounded-lg px-4 py-2 transition-transform duration-200 hover:bg-gray-500 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white rounded-lg px-4 py-2 transition-transform duration-200 hover:bg-green-600 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDegreeProgramPage;

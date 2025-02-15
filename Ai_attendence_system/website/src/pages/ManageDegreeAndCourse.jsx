import React, { useState } from "react";
import AddDegreeProgram from "../components/manage-degree-courses/AddDegreeProgram";
import AddCourse from "../components/manage-degree-courses/AddCourse";

const ManageDegreeAndCourse = () => {
  const [activeTab, setActiveTab] = useState("add degree");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="font-sans flex justify-end max-lg:justify-center w-full p-4">
      <div className="w-[80%]">
        <ul className="flex bg-gray-100 mx-10">
          <li
            onClick={() => handleTabClick("add degree")}
            className={`tab text-sm  font-bold tracking-wide w-full text-center py-3 px-6 cursor-pointer ${
              activeTab === "add degree"
                ? "bg-primary rounded text-white"
                : "text-gray-600"
            }`}
          >
            Add Degree Program
          </li>
          <li
            onClick={() => handleTabClick("add course")}
            className={`tab text-sm font-semibold tracking-wide w-full text-center py-3 px-6 cursor-pointer ${
              activeTab === "add course"
                ? "bg-primary rounded text-white"
                : "text-gray-600"
            }`}
          >
            Add Course
          </li>
        </ul>

        <div
          className={`tab-content max-w-full mt-8 ${
            activeTab === "add degree" ? "block" : "hidden"
          }`}
        >
          <AddDegreeProgram />
        </div>

        <div
          className={`tab-content max-w-full mx-auto mt-8 ${
            activeTab === "add course" ? "block" : "hidden"
          }`}
        >
          <AddCourse />
        </div>
      </div>
    </div>
  );
};

export default ManageDegreeAndCourse;

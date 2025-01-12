import React from "react";
import Navbar from "../components/Navbar";
import ManageAllTeachers from "../components/manage-teacher/ManageAllTeachers";
import AddTeacherIDs from "../components/manage-teacher/AddTeachers";

const ManageTeachers = () => {
  const tabs = [
    {
      id: "SearchStudent",
      label: "Search Teacher",
      component: <ManageAllTeachers />,
    },
    {
      id: "StudentIDsTab",
      label: "Add Teachers",
      component: <AddTeacherIDs />,
    },
  ];

  return (
    <div className="font-sans relative h-screen overflow-hidden w-full flex flex-col items-center lg:ml-[18%] bg-gray-100">
      <Navbar tabs={tabs} />
    </div>
  );
};

export default ManageTeachers;

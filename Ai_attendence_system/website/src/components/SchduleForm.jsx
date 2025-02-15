// src/ScheduleForm.js
import React, { useState } from "react";
import axios from "axios";

const ScheduleForm = () => {
  const apiURL = import.meta.env.VITE_API_URL;
  const [semesterDropdown, setsemesterDropdown] = useState(false);
  const [semesters, setsemesters] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedSemester, setselectedSemester] = useState(null);
  return (
    <div className="h-screen max-w-4xl mx-auto mt-10">
      <div>
        <h1 className="text-center text-3xl font-bold">Make Schedule</h1>
        <p className="text-sm text-gray-600 text-center">
          Lets make Schedule according to your choice
        </p>
      </div>
      <div className="mt-5 flex flex-col items-center">
        <div className="flex w-full justify-between gap-5">
          <div className="w-full grid grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Enter Degree Program"
              class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
            />
            <input
              type="text"
              placeholder="Enter Degree Program"
              class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
            />
          </div>
          <button
            type="button"
            onClick={() => AddDegree(query)}
            class="px-6 w-[20%] py-2.5 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
          >
            Add Program
          </button>
        </div>
      </div>
      <div className="mt-5 flex flex-col items-center">
        <div className="flex w-full justify-between gap-5">
          <div class="relative font-[sans-serif] w-full mx-auto">
            <button
              type="button"
              onClick={() => setsemesterDropdown(!semesterDropdown)}
              id="dropdownToggle"
              className="px-5 py-2.5 w-full rounded flex justify-between items-center text-sm font-semibold border outline-none border-primary"
            >
              {selectedSemester == null ? "Select semester" : selectedSemester}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 inline ml-3"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                  clip-rule="evenodd"
                  data-original="#000000"
                />
              </svg>
            </button>

            <ul
              id="dropdownMenu"
              class={`absolute ${
                semesterDropdown ? "block" : "hidden"
              } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto`}
            >
              {semesters.map((item) => (
                <li
                  onClick={() => {
                    setselectedSemester(item);
                    setsemesterDropdown(false);
                  }}
                  class="py-2.5 px-5 hover:bg-blue-50 text-black text-sm cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => AddDegree(query)}
            class="px-6 w-[20%] py-2.5 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
          >
            Add Program
          </button>
        </div>
      </div>
        <div className="mt-5 flex flex-col w-full justify-between gap-5">
          <div className="w-full grid grid-cols-2 gap-5">
            <input
              type="text"
              placeholder="Enter Degree Program"
              class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
            />
            <input
              type="text"
              placeholder="Enter Degree Program"
              class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
            />
               <input
              type="text"
              placeholder="Enter Degree Program"
              class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
            />
            <input
              type="text"
              placeholder="Enter Degree Program"
              class="px-4 py-2.5 bg-gray-200 w-full text-sm outline-none rounded transition-all"
            />
          </div>
          <div class="relative font-[sans-serif] w-full mx-auto">
            <button
              type="button"
              onClick={() => setsemesterDropdown(!semesterDropdown)}
              id="dropdownToggle"
              className="px-5 py-2.5 w-full rounded flex justify-between items-center text-sm font-semibold border outline-none border-primary"
            >
              {selectedSemester == null ? "Select semester" : selectedSemester}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-3 inline ml-3"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                  clip-rule="evenodd"
                  data-original="#000000"
                />
              </svg>
            </button>

            <ul
              id="dropdownMenu"
              class={`absolute ${
                semesterDropdown ? "block" : "hidden"
              } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto`}
            >
              {semesters.map((item) => (
                <li
                  onClick={() => {
                    setselectedSemester(item);
                    setsemesterDropdown(false);
                  }}
                  class="py-2.5 px-5 hover:bg-blue-50 text-black text-sm cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={() => AddDegree(query)}
            class="px-6 w-full py-2.5 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
          >
            Add Program
          </button>
        </div>
      </div>

  );
};

export default ScheduleForm;

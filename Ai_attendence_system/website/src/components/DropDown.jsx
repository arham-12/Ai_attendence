import React, { useState } from "react";

const DropDown = ({ value,setValue,degreePrograms }) => {
  const [programsDrop, setprogramsDrop] = useState(false);
  const [dropdownValue, setdropdownValue] = useState("Select Degree Program");
  return (
    <div class="relative font-[sans-serif] w-full">
      <button
        type="button"
        onClick={() => {
          setprogramsDrop(!programsDrop);
        }}
        id="dropdownToggle"
        class="px-5 py-2.5 w-full flex justify-between items-center border text-left border-black text-gray-800 text-sm outline-none bg-transparent hover:bg-gray-50"
      >
        {dropdownValue}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-3 fill-gray-500 inline ml-3"
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
          programsDrop ? "block" : "hidden"
        } shadow-[0_8px_19px_-7px_rgba(6,81,237,0.2)] bg-white py-2 z-[1000] min-w-full w-max divide-y max-h-96 overflow-auto`}
      >
        {Array.isArray(degreePrograms) ? (
          degreePrograms.map((program, index) => (
            <li
            
              key={index}
              onClick={() => {
             
                setValue(program.program_name);
                setdropdownValue(program.program_name);
                setprogramsDrop(!programsDrop);
              }}
              className="py-3 px-5 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer"
            >
              {" "}
              {program.program_name}
            </li>
          ))
        ) : (
          <li className="py-3 px-5 hover:bg-gray-50 text-gray-800 text-sm cursor-pointer">
            No degree programs found!
          </li>
        )}
      </ul>
    </div>
  );
};

export default DropDown;

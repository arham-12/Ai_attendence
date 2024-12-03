import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

const AddStudentIDs = () => {
  const [showUpload, setshowUpload] = useState(false);
  const [showColumnsData, setshowColumnsData] = useState(false)
  return (
    <div>
      <div class={`${showColumnsData?"grid":"hidden"} absolute z-10 bg-[#0000004e] top-0 left-0 justify-center items-center h-screen w-full  grid-cols-2 gap-8 px-3 shadow-md rounded-md`}>
       <IoClose onClick={()=>{setshowColumnsData(!showColumnsData)}} className="absolute top-0 right-0 mx-6 my-4 text-4xl" />
        <ul class="list-none text-lg flex flex-col gap-7 py-7 rounded-lg text-center bg-white pl-4">
          <h1 className="font-bold text-2xl">Required Columns ❗</h1>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>

        <ul class="list-none text-lg flex flex-col gap-5 py-6 rounded-lg text-center bg-white pl-4">
          <h1 className="font-bold text-2xl">Wrong Columns ❌</h1>
          <li>Item 1 <input className="p-2 text-sm border border-black rounded-md" placeholder="Change Columns" type="text" /></li>
          <li>Item 1 <input className="p-2 text-sm border border-black rounded-md" placeholder="Change Columns" type="text" /></li>
          <li>Item 1 <input className="p-2 text-sm border border-black rounded-md" placeholder="Change Columns" type="text" /></li>
          <li>Item 1 <input className="p-2 text-sm border border-black rounded-md" placeholder="Change Columns" type="text" /></li>
          <li>Item 1 <input className="p-2 text-sm border border-black rounded-md" placeholder="Change Columns" type="text" /></li>
        </ul>
      </div>
      <form class="font-[sans-serif] w-full mx-auto">
        <div class="grid sm:grid-cols-2 gap-4">
          <div class="relative flex items-center">
            <input
              type="text"
              placeholder="Full Name"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
        
          </div>

          <div class="relative flex items-center">
            <input
              type="email"
              placeholder="Email"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
      
          </div>

          <div class="relative flex items-center">
            <input
              type="text"
              placeholder="Student Id"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
        
          </div>
          <div class="relative flex items-center">
            <input
              type="text"
              placeholder="Degree Program"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
        
          </div>
          <div class="relative flex items-center">
            <input
              type="number"
              placeholder="Smester"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
         
          </div>
          <div class="relative flex items-center">
            <input
              type="text"
              placeholder="Department"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
       
          </div>
          <div class="relative flex items-center">
            <input
              type="text"
              placeholder="Section"
              class="px-4 py-3 bg-[#f0f1f2] focus:bg-transparent text-black w-full text-sm border border-black outline-[#007bff] rounded transition-all"
            />
        
          </div>
        </div>
        <div
          class={`absolute w-full top-0 left-0 px-20 h-screen w-[80%] bg-[#0000004e] ${
            showUpload ? "flex" : "hidden"
          } justify-center items-center`}
        >
          <div
            onClick={() => {
              setshowUpload(!showUpload);
            }}
            className="absolute top-0 right-0 text-2xl m-4 p-3 border rounded-full cursor-pointer"
          >
            <IoClose />
          </div>
          <label
            for="uploadFile1"
            class="bg-white text-gray-500 font-semibold text-base rounded w-[60%] h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif]"
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
            Upload file
            <input type="file" id="uploadFile1" class="hidden" />
            <p class="text-xs font-medium text-gray-400 mt-2">
              PNG, JPG SVG, WEBP, and GIF are Allowed.
            </p>
          </label>
        </div>
        <div className="btns flex gap-5">
          <button
            type="button"
            class="mt-8 px-6 py-2.5 text-sm w-full bg-[#007bff] hover:bg-[#006bff] text-white rounded transition-all"
          >
            Submit
          </button>
          <button
            onClick={() => {
              setshowUpload(!showUpload);
            }}
            type="button"
            class="mt-8 px-6 py-2.5 text-sm w-full bg-[#007bff] hover:bg-[#006bff] text-white rounded transition-all"
          >
            Bulk Import
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudentIDs;

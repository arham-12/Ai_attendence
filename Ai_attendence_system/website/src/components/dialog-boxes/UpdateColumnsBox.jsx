import React, { useContext, useState } from "react";
import { BulkImportContext } from "../../context/bulkImportContext";
import axios from 'axios'
import { AuthContext } from "../../context/auth";

const UpdateColumnsBox = ({ Show, setShow }) => {
    const [updatedColumns, setupdatedColumns] = useState({});
    const {authToken} = useContext(AuthContext)
  const { missing_columns, required_columns, wrong_columns,selectedFile } =
    useContext(BulkImportContext);
  console.log(missing_columns);
  console.log(selectedFile);
  
const UpdateColumns = (column,index)=>{
setupdatedColumns({...updatedColumns,[column]:required_columns[index]})
}
console.log(   { selectedFile, updatedColumns });

const onSubmitHandler = async()=>{
    const formData = new FormData();
    
    // Attach file to formData
    formData.append("file", selectedFile);
    
    // Convert updatedColumns object to JSON string and add it to formData
    formData.append("columns", JSON.stringify(updatedColumns));
    const response = await axios.post(
        "http://localhost:8000/api/students_bulk_insertion/",
      formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log(response);
      
}
console.log(updatedColumns);


  return (
    <>
      <div
        class={`fixed inset-0 p-4 ${
          Show ? "flex" : "hidden"
        } flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]`}
      >
        <div class="w-full max-w-[1000px] bg-white shadow-lg rounded-lg p-6 relative">
          <svg
            onClick={() => setShow(false)}
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 cursor-pointer shrink-0 fill-gray-400 hover:fill-red-500 float-right"
            viewBox="0 0 320.591 320.591"
          >
            <path
              d="M30.391 318.583a30.37 30.37 0 0 1-21.56-7.288c-11.774-11.844-11.774-30.973 0-42.817L266.643 10.665c12.246-11.459 31.462-10.822 42.921 1.424 10.362 11.074 10.966 28.095 1.414 39.875L51.647 311.295a30.366 30.366 0 0 1-21.256 7.288z"
              data-original="#000000"
            ></path>
            <path
              d="M287.9 318.583a30.37 30.37 0 0 1-21.257-8.806L8.83 51.963C-2.078 39.225-.595 20.055 12.143 9.146c11.369-9.736 28.136-9.736 39.504 0l259.331 257.813c12.243 11.462 12.876 30.679 1.414 42.922-.456.487-.927.958-1.414 1.414a30.368 30.368 0 0 1-23.078 7.288z"
              data-original="#000000"
            ></path>
          </svg>
          <div className="font-[sans-serif] overflow-x-auto">
  <div className="w-full grid grid-cols-2 gap-10">
    {/* Your Columns */}
    <ul className="flex flex-col">
      <h1 className="text-lg font-semibold border-b border-primary text-start mb-2">
        Your Columns
      </h1>
      {missing_columns.map((item, index) => (
        <li key={index} className="flex justify-between mb-1">
          {wrong_columns.includes(item) ? (
            <>
             <li>{item}</li>
              <button value={item} onClick={()=>UpdateColumns(item,index)} className="bg-primary px-2 py-[2px] text-[12px] text-white rounded">
                Update
              </button>
            </>
          ) : (
            <span className="text-gray-700">{item}</span>
          )}
        </li>
      ))}
    </ul>

    {/* Required Columns */}
    <ul className="flex flex-col">
      <h1 className="text-lg font-semibold border-b border-primary text-start mb-2">
        Required Columns
      </h1>
      {required_columns.map((item, index) => (
        <li key={index} className="text-gray-700">{item}</li>
      ))}
    </ul>
  </div>
  <button onClick={onSubmitHandler}>Update Final</button>
</div>

        </div>
      </div>
    </>
  );
};

export default UpdateColumnsBox;

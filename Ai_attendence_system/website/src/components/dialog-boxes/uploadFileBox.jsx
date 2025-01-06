import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/auth";
import { BulkImportContext } from "../../context/bulkImportContext";

const UploadFileBox = ({ Show, setifFalse, setShow }) => {
  const { authToken } = useContext(AuthContext);
  const {
    setmissing_columns,
    setrequired_columns,
    setwrong_columns,
    setselectedFile,
  } = useContext(BulkImportContext);
  const [file, setfile] = useState(null);
  

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/api/students_bulk_insertion/",
        { file },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Token ${authToken}`,
          },
        }
      );


      if (response.status === 200) {
        toast.success("File added successfully!");
        setShow(false);
      } else {
      }
    } catch (error) {
      console.error("Error adding student:", error);
      toast.error(error.response.data.detail);

      if (error.response.data.existing_columns) {
        setmissing_columns(error.response.data.existing_columns);
        setrequired_columns(error.response.data.required_columns);
        setwrong_columns(error.response.data.wrong_columns);
        setifFalse(true);
      }
      setShow(false);
    }
  };
  return (
    <>
      <div
        class={`fixed inset-0 p-4 ${
          Show ? "flex" : "hidden"
        } flex-wrap justify-center items-center w-full h-full z-[1000] before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)] overflow-auto font-[sans-serif]`}
      >
        <div class="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 relative">
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

          <div class="my-4 text-center flex items-center justify-center flex-col">
            <label
              htmlFor="uploadFile1"
              className="bg-white text-gray-500 font-semibold text-base rounded w-[60%] h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed font-[sans-serif]"
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
              <input
                type="file"
                name="file"
                id="uploadFile1"
                className="hidden"
                accept=".xls, .xlsx, .csv"
                onChange={(e) => {setfile(e.target.files[0]);setselectedFile(e.target.files[0]);}}
              />
              <p class="text-xs font-medium text-gray-400 mt-2">
                Csv, Excelsheet are Allowed.
              </p>

              <button
                onClick={handleSubmitFile}
                className={`${
                  file ? "block" : "hidden"
                } bg-primary text-sm px-6 py-1 mt-2 text-white rounded-md`}
              >
                Upload
              </button>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFileBox;

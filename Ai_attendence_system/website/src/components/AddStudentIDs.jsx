import React from 'react';

const AddStudentIDs = () => {
  return (
    <div>
      <div className="font-[sans-serif]">
        <div className="bg-gradient-to-r from-primary via-secondary to-primary text-white min-h-[220px] flex flex-col items-center justify-center text-center">
          <h4 className="text-3xl font-semibold -mt-8">Upload Student Data</h4>
          
        </div>

        <div className="max-w-lg mx-auto relative bg-white border-2 border-primary border-dashed rounded-lg -top-24">
          <div className="p-4 min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer">
      <h2 className="text-gray-600">The Excel file should contain the the student IDs or Roll Nos of the students</h2>
          <div className='container mx-auto my-8 p-4 rounded-lg shadow-lg bg-white border border-gray-300'>
      <div className="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-12 h-12 mb-3 text-gray-600 transition-transform transform hover:scale-125"
          viewBox="0 0 32 32"
        >
          <path
            d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
            fill="currentColor"
          />
          <path
            d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
            fill="currentColor"
          />
        </svg>

        <h4 className="text-lg font-semibold text-gray-700 mb-1">Upload Your Student Data</h4>
        <p className="text-sm text-gray-500 mb-3">Drag & drop file here or</p>
        
        <label
          htmlFor="chooseFile"
          className="inline-block px-3 py-1 bg-primary text-white font-semibold rounded-md shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
        >
          Choose File
        </label>
        <input type="file" id="chooseFile" className="hidden" />

        <p className="text-xs text-gray-400 mt-2">Supported formats: .xlsx, .xls</p>
      </div>
    </div>
            {/* New Section for Column Guidance in Table Format */}
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddStudentIDs;

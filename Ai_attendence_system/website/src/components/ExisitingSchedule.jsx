import React from 'react'

const ExisitingSchedule = () => {
  return (
    <div>
      <div class="font-[sans-serif]">
      <div class="bg-gradient-to-r from-primary via-primary to-primary text-white min-h-[220px] flex items-center justify-center text-center">
        <h4 class="text-3xl font-semibold -mt-8">Upload Existing Schedule</h4>
      </div>

      <div class="max-w-lg mx-auto relative bg-white border-2 border-gray-300 border-dashed rounded-md -top-24">
        <div class="p-4 min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-10 mb-4 fill-gray-600 inline-block" viewBox="0 0 32 32">
            <path
              d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
              data-original="#000000" />
            <path
              d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
              data-original="#000000" />
          </svg>

          <h4 class="text-base font-semibold text-gray-600">Drag & Drop file here <br /> or</h4>
          <label for="chooseFile" class="text-primary text-base font-semibold cursor-pointer underline">Choose file</label>
          <input type="file" id="chooseFile" class="hidden" />
        </div>
      </div>
    </div>
    </div>
  )
}

export default ExisitingSchedule

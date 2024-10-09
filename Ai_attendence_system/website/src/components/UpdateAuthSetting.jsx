// Import React
import React, { useState } from "react";
import { FaEnvelope } from 'react-icons/fa';



const UpdateAuthSettings = () => {
  // State for handling form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Email:", email);
    console.log("Updated Password:", password);
    // Add your form submission logic here
  };

  return (
    <>
    <div class="bg-gray-100 ml-[100px] w-[82%] font-[sans-serif]">
      <div class=" flex flex-col items-center justify-center py-6 px-4">
        <div class="max-w-md w-full">
          <div class="text-center mb-12">
            <h1 class="text-3xl font-bold text-gray-800 mb-4">Settings</h1>
            <p class="text-gray-600">Update your account settings</p>
          </div>

          <div class="p-8 rounded-2xl bg-white shadow">
            <h2 class="text-gray-800 text-center text-2xl font-bold">Sign in</h2>
            <form class="mt-8 space-y-4">
              <div>
                <label class="text-gray-800 text-sm mb-2 block">New Email</label>
                <div class="relative flex items-center">
                  <input name="username" type="email" required class="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter New Email" />
                  <FaEnvelope  className="absolute right-3 text-gray-300" />
                </div>
              </div>

              <div>
                <label class="text-gray-800 text-sm mb-2 block">New Password</label>
                <div class="relative flex items-center">
                  <input name="password" type="password" required class="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter password" />
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#bbb" stroke="#bbb" class="w-4 h-4 absolute right-4 cursor-pointer" viewBox="0 0 128 128">
                    <path d="M64 104C22.127 104 1.367 67.496.504 65.943a4 4 0 0 1 0-3.887C1.367 60.504 22.127 24 64 24s62.633 36.504 63.496 38.057a4 4 0 0 1 0 3.887C126.633 67.496 105.873 104 64 104zM8.707 63.994C13.465 71.205 32.146 96 64 96c31.955 0 50.553-24.775 55.293-31.994C114.535 56.795 95.854 32 64 32 32.045 32 13.447 56.775 8.707 63.994zM64 88c-13.234 0-24-10.766-24-24s10.766-24 24-24 24 10.766 24 24-10.766 24-24 24zm0-40c-8.822 0-16 7.178-16 16s7.178 16 16 16 16-7.178 16-16-7.178-16-16-16z" data-original="#000000"></path>
                  </svg>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-between gap-4">
              
                
              </div>

              <div class="!mt-8">
                <button type="button" class="w-[50%] ml-[26%] py-3 px-4 text-sm tracking-wide rounded-lg text-gray-500 bg-primary hover:bg-cyan-300 hover:text-white focus:outline-none">
                  Update Settings
                </button>
              </div>
             
            </form>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UpdateAuthSettings;

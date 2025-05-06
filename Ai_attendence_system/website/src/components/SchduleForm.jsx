// src/ScheduleForm.js
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { TimePicker, ConfigProvider, DatePicker } from "antd";
import "antd/dist/reset.css";
import dayjs from "dayjs";
import { AuthContext } from "../context/auth";
import toast from "react-hot-toast";
import moment from "moment";

const ScheduleForm = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { authToken } = useContext(AuthContext);
  const [startingDate, setstartingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endingDate, setendingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startingTime, setstartingTime] = useState(moment().format("HH:mm:ss"));
  const [endingTime, setendingTime] = useState(moment().format("HH:mm:ss"));
  console.log(endingTime);

  const [semesterDropdown, setsemesterDropdown] = useState(false);
  const [semesters, setsemesters] = useState([1, 2, 3, 4, 5, 6, 7, 8]);
  const [selectedSemester, setselectedSemester] = useState(null);
  const [degreeDropdown, setdegreeDropdown] = useState(false);
  const [selectedDegreeProgram, setselectedDegreeProgram] = useState("");
  const [degreePrograms, setDegreePrograms] = useState([]);
  const [courseDropdown, setcourseDropdown] = useState(false);
  const [relatedCourses, setrelatedCourses] = useState([]);
  const [selectedCourse, setselectedCourse] = useState("");
  const [relatedTeachers, setrelatedTeachers] = useState({});
  const [selectedTeacher, setselectedTeacher] = useState("");
  const [no_of_semester, setno_of_semester] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const [values, setValues] = useState([]);

  
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const [weekdayDropdown, setweekdayDropdown] = useState(false);

  const handleAdd = () => {
    if (selectedValue && !values.includes(selectedValue)) {
      setValues([...values, selectedValue]);
      setSelectedValue("");
    }
  };

  const handleRemove = (valueToRemove) => {
    setValues(values.filter((value) => value !== valueToRemove));
  };

  useEffect(() => {
    const getPrograms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/degree-programs/`, {
          headers: { Authorization: `Token ${authToken}` },
        });
        setDegreePrograms(response.data.degree_programs); // State is updated here
      } catch (error) {
        console.error("Error fetching degree programs:", error);
        toast.error("Error fetching degree programs. Please try again.");
      }
    };

    getPrograms();
  }, [authToken]);

  const getRelatedCourses = async (degree_program, semester) => {
    try {
      const res = await axios.get(
        `${apiUrl}/api/course-by-degree-program/${degree_program}/${semester}/`,
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      console.log("Course API Response:", res);

      const courseNames = res?.data?.course_names || [];
      const courseDetails = res?.data?.cource_details || {}; // typo might be in your backend: "cource_details" vs "course_details"

      if (courseNames.length === 0 || Object.keys(courseDetails).length === 0) {
        toast.error(
          "There are no courses for the selected degree and semester."
        );
      } else {
        setrelatedCourses(courseNames);
        setrelatedTeachers(courseDetails);
      }
    } catch (error) {
      console.error("Error fetching related courses:", error);
      toast.error("Failed to fetch related courses.");
    }
  };

  const setschedule = async () => {
    try {
      const res = await axios.post(
        `${apiUrl}/api/generate-schedule/`,
        {
          degree_program: selectedDegreeProgram,
          course: selectedCourse,
          teacher_name: selectedTeacher,
          semester: selectedSemester,
          semester_starting_date: startingDate,
          semester_ending_date: endingDate,
          no_of_lectures_per_semester: selectedSemester,
          lecture_starting_time: startingTime,
          lecture_ending_time: endingTime,
          preferred_weekdays: values,
        },
        {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        }
      );
      if (res.status == 201) toast.success("Schedule Created");
      console.log(res);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  return (
    <div className="h-auto min-h-screen max-w-4xl mx-auto mt-10">
      <div>
        <h1 className="text-center text-3xl font-bold">Make Schedule</h1>
        <p className="text-sm text-gray-600 text-center">
          Lets make Schedule according to your choice
        </p>
      </div>
      <div className="mt-5 flex w-full justify-between gap-5">
        <div className="w-full grid grid-cols-2 gap-5">
          <div class="relative font-[sans-serif] w-full mx-auto">
            <button
              type="button"
              onClick={() => setdegreeDropdown(!degreeDropdown)}
              id="dropdownToggle"
              className="px-3 py-2 w-full rounded flex justify-between items-center text-sm border outline-none border-primary"
            >
              {selectedDegreeProgram == ""
                ? "Select Degree Program"
                : selectedDegreeProgram}
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
                degreeDropdown ? "block" : "hidden"
              } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto`}
            >
              {degreePrograms.map((item) => (
                <li
                  onClick={() => {
                    setselectedDegreeProgram(item.program_name);
                    setdegreeDropdown(false);
                  }}
                  class="py-2.5 px-5 hover:bg-primary hover:text-white text-black text-sm cursor-pointer"
                >
                  {item.program_name}
                </li>
              ))}
            </ul>
          </div>
          <div class="relative font-[sans-serif] w-full mx-auto">
            <button
              type="button"
              onClick={() => setsemesterDropdown(!semesterDropdown)}
              id="dropdownToggle"
              className="px-3 py-2 w-full rounded flex justify-between items-center text-sm border outline-none border-primary"
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
                  class="py-2.5 px-5 hover:bg-primary hover:text-white text-black text-sm cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          type="button"
          onClick={() =>
            getRelatedCourses(selectedDegreeProgram, selectedSemester)
          }
          class="px-6 w-[20%] py-2 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
        >
          Add Program
        </button>
      </div>

      {Array.isArray(relatedCourses) && relatedCourses.length !== 0 && (
        <div className="mt-5 grid grid-cols-2 w-full justify-between gap-5">
          {/* Course Selection */}
          <div className="relative font-[sans-serif] w-full mx-auto">
            <label className="block text-xs font-medium">Select Course</label>
            <button
              type="button"
              onClick={() => setcourseDropdown(!courseDropdown)}
              id="dropdownToggle"
              className="px-3 py-2 w-full rounded flex justify-between items-center text-sm border outline-none border-primary"
            >
              {selectedCourse === "" ? "Select Course" : selectedCourse}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3 inline ml-3"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M11.99997 18.1669a2.38 2.38 0 0 1-1.68266-.69733l-9.52-9.52a2.38 2.38 0 1 1 3.36532-3.36532l7.83734 7.83734 7.83734-7.83734a2.38 2.38 0 1 1 3.36532 3.36532l-9.52 9.52a2.38 2.38 0 0 1-1.68266.69734z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <ul
              id="dropdownMenu"
              className={`absolute ${
                courseDropdown ? "block" : "hidden"
              } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto`}
            >
              {relatedCourses.map((item) => (
                <li
                  key={item}
                  onClick={() => {
                    setselectedCourse(item);
                    setselectedTeacher(relatedTeachers[item]);
                    setcourseDropdown(false);
                  }}
                  className="py-2 text-sm px-5 hover:bg-primary hover:text-white text-black cursor-pointer"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Course Teacher */}
          <div className="w-full">
            <label className="block text-xs font-medium">Course Teacher</label>
            <input
              className="px-3 py-2 w-full rounded text-sm bg-transparent border outline-none border-primary"
              type="text"
              value={selectedTeacher}
              readOnly
            />
          </div>
        </div>
      )}

      {Array.isArray(relatedCourses) && relatedCourses.length != 0 && (
        <div className="mt-5 flex flex-col w-full justify-between gap-5">
          <div className="w-full grid grid-cols-2 gap-5">
          
              {/* Semester Starting Date */}
              <div>
                <label className="block text-xs font-medium">
                  Semester Starting Date
                </label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#02c5cc",
                    },
                  }}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={startingDate ? dayjs(startingDate) : null}
                    onChange={(date, dateString) => setstartingDate(dateString)}
                    className="w-full py-2"
                  />
                </ConfigProvider>
              </div>

              {/* Semester Ending Date */}
              <div>
                <label className="block text-xs font-medium">
                  Semester Ending Date
                </label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#02c5cc",
                    },
                  }}
                >
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={endingDate ? dayjs(endingDate) : null}
                    onChange={(date, dateString) => setendingDate(dateString)}
                    className="w-full py-2"
                  />
                </ConfigProvider>
              </div>

              {/* Lecture Starting Time */}
              <div>
                <label className="block text-xs font-medium">
                  Lecture Starting Time
                </label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#02c5cc",
                    },
                  }}
                >
                  <TimePicker
                    use12Hours={false}
                    format="HH:mm"
                    value={startingTime ? dayjs(startingTime, "HH:mm") : null}
                    onChange={(time, timeString) => setstartingTime(timeString)}
                    className="w-full py-2"
                  />
                </ConfigProvider>
              </div>

              {/* Lecture Ending Time */}
              <div>
                <label className="block text-xs font-medium">
                  Lecture Ending Time
                </label>
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#02c5cc",
                    },
                  }}
                >
                  <TimePicker
                    use12Hours={false}
                    format="HH:mm"
                    value={endingTime ? dayjs(endingTime, "HH:mm") : null}
                    onChange={(time, timeString) => setendingTime(timeString)}
                    className="w-full py-2"
                  />
                </ConfigProvider>
              </div>
      
            <div>
              <p>Enter number of lectures per semester</p>
              <input
                type="number"
                value={no_of_semester}
                onChange={(e) => setno_of_semester(e.target.value)}
                placeholder="Enter No of lectures per semester"
                className="px-5 py-2.5 w-full rounded flex justify-between items-center text-sm font-semibold border outline-none border-primary"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-wrap border border-gray-300 rounded-lg p-2 mt-1">
              {values.map((value) => (
                <span
                  key={value}
                  className="bg-primary text-white rounded-full px-2 py-1 flex items-center mr-2 mb-2"
                >
                  {value}
                  <button
                    type="button"
                    onClick={() => handleRemove(value)}
                    className="ml-1 text-sm"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <div class="relative font-[sans-serif] flex-grow mx-auto">
                <button
                  type="button"
                  onClick={() => setweekdayDropdown(!weekdayDropdown)}
                  id="dropdownToggle"
                  className="px-5 py-2.5 w-full rounded flex justify-between items-center text-sm border outline-none border-primary"
                >
                  {selectedValue == "" ? "Select Course" : selectedValue}
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
                    weekdayDropdown ? "block" : "hidden"
                  } shadow-lg bg-white py-2 z-[1000] min-w-full w-max rounded max-h-96 overflow-auto -top-[300px]`}
                >
                  {weekdays.map((item) => (
                    <li
                      onClick={() => {
                        setSelectedValue(item);
                        setweekdayDropdown(false);
                      }}
                      class="py-2.5 px-5 hover:bg-primary hover:text-white text-black text-sm cursor-pointer"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="bg-primary text-white rounded-lg px-3 py-1 ml-2"
              >
                Add
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={setschedule}
            class="px-6 w-full py-2.5 text-sm font-medium bg-primary hover:bg-[#222] text-white rounded"
          >
            Add Program
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleForm;

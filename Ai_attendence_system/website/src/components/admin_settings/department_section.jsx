// StepForm.jsx
import React from 'react';
import { Formik, Field, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import StepWizard from 'react-step-wizard';
import { ErrorMessage } from 'formik';
import { FaTrash } from 'react-icons/fa';
import axios from 'axios';
// Validation schema using Yup
const validationSchema = Yup.object().shape({
    departmentName: Yup.string().required('Department name is required'),
    degreePrograms: Yup.array().of(
      Yup.object().shape({
        programName: Yup.string().required('Degree program name is required'),
        semesters: Yup.array().of(
          Yup.object().shape({
            semesterName: Yup.number().required('Semester name is required'),
            courses: Yup.array().of(
              Yup.object().shape({
                courseName: Yup.string().required('Course name is required'),
              })
            ),
          })
        ),
      })
    ).min(1, 'At least one degree program is required'), // Ensure at least one degree program is present
  });
// Main Form Component
// Main Form Component
const StepForm = () => {
  const handleSubmit = async (values) => {
    try {
      console.log(values);
      const response = await axios.post('http://localhost:8000/departments', values);
      console.log('Department created:', response.data);
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };
    return (
      <Formik
        initialValues={{
          departmentName: '',
          degreePrograms: [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, handleSubmit, setTouched, validateForm }) => (
          <Form className="mx-auto p-6 bg-white w-[80%] ml-[20%] shadow-lg rounded-lg">
            <StepWizard>
              <StepOne setFieldValue={setFieldValue} values={values}/>
              <StepTwo setFieldValue={setFieldValue} values={values} />
              <StepThree setFieldValue={setFieldValue} values={values} />
              <FinalStep values={values} />
            </StepWizard>
          </Form>
        )}
      </Formik>
    );
  };
// Step One: Adding Department Name
// Step One: Adding Department Name
const StepOne = ({ nextStep ,values }) => {
  // const handleNextStep = async () => {
  //   // const errors = await validationSchema.validate(values, { abortEarly: false });
  //   // console.log('Validation Errors:', errors); // Log errors
  //   if (validationSchema.departmentName != '') {
  //     console.log('Form Submitted:');
  //     nextStep(); // Proceed to next step if no errors
  //   } 
  // };

  return (
    <div className="bg-white p-6 w-[80%] rounded-lg shadow-md mt-3">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Department</h3>
      <Field
        name="departmentName"
        type="text"
        placeholder="Enter Department Name"
        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ErrorMessage name="departmentName" component="div" className="text-red-600 mb-4" />
      
      <button
        type="button"
        onClick={() => {
          if (values.departmentName === '') {
            // Show error if no degree programs are added
            alert("the department name cannot be empty");
          } else {
            nextStep();
          }
        }}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
      >
        Next
      </button>
    </div>
  );
};
// Step Two: Adding Degree Programs
const StepTwo = ({ nextStep, previousStep, setFieldValue, values }) => (
    <FieldArray name="degreePrograms">
      {({ remove, push }) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Degree Programs</h3>
          {values.degreePrograms.map((_, index) => (
            <div key={index} className="mb-4">
              <Field
                name={`degreePrograms.${index}.programName`}
                placeholder="Enter Degree Program Name"
                className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => remove(index)}
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200 mb-2"
              >
                Remove Program
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => push({ programName: '', semesters: [] })}
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          >
            Add Degree Program
          </button>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={previousStep}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => {
                if (values.degreePrograms.length === 0) {
                  // Show error if no degree programs are added
                  alert("Please add at least one degree program.");
                } else {
                  nextStep();
                }
              }}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </FieldArray>
  );
  const StepThree = ({ nextStep, previousStep, setFieldValue, values }) => (
    <FieldArray name="degreePrograms">
      {({ remove, push }) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Semesters and Courses</h3>
    
        {values.degreePrograms.map((program, programIndex) => (
            <div key={programIndex} className="mb-6">
              <h4 className="text-lg font-semibold text-gray-700">
              Selected Degree Programs : {program.programName}
              </h4>
              <FieldArray name={`degreePrograms.${programIndex}.semesters`}>
                {({ remove, push }) => (
                  <div>
                    {program.semesters.map((_, semesterIndex) => (
                      <div key={semesterIndex} className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Semester No
                        </label>
                        <Field
                          name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.semesterName`}
                          placeholder="Enter Semester No"
                          type="number"
                          className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FieldArray
                          name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses`}
                        >
                          {({ remove, push }) => (
                            <div>
                        
                              {values.degreePrograms[programIndex].semesters[
                                semesterIndex
                              ].courses.map((course, courseIndex) => (
                                <div key={courseIndex} className="mt-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Course Name
                                  </label>
                                  <Field
                                    name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses.${courseIndex}.courseName`}
                                    placeholder="Enter Course Name"
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Credit Hours
                                  </label>
                                  <Field
                                    name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses.${courseIndex}.creditHours`}
                                    placeholder="Enter Credit Hours"
                                    type="number"
                                    className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => remove(courseIndex)}
                                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition duration-200 mb-2"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push({ courseName: '', creditHours: '' })}
                                className="bg-green-500 text-white mt-[10px] py-2 px-4 rounded hover:bg-green-600 transition duration-200"
                              >
                                Add Course
                              </button>
                            </div>
                          )}
                        </FieldArray>
                        <button
                          type="button"
                          onClick={() => remove(semesterIndex)}
                          className="bg-red-500 text-white py-1 mt-5 px-3 rounded hover:bg-red-600 transition duration-200 mb-2"
                        >
                          Remove Semester
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => push({ semesterName: '', courses: [] })}
                      className="bg-green-500 text-white py-2 mt-5 px-4 rounded hover:bg-green-600 transition duration-200"
                    >
                      Add Semester
                    </button>
                  </div>
                )}
              </FieldArray>
            </div>
          ))}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={previousStep}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </FieldArray>
  );
// Final Step: Review and Submit
const FinalStep = ({ previousStep, values }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Review & Submit</h3>

      {/* Display department name */}
      <div className="mb-4">
        <h4 className="text-lg text-center font-semibold text-gray-700">{values.departmentName}</h4>
        
      </div>

      {/* Display degree programs, semesters, and courses */}
      {values.degreePrograms.map((program, programIndex) => (
        <div key={programIndex} className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700">Degree Program: {program.programName}</h4>

          
          
    {program.semesters.map((semester, semesterIndex) => (
  <React.Fragment key={semesterIndex}>
    {/* Display the semester heading only once for each semester */}
    <h4 className="text-lg text-center font-semibold text-gray-700 mb-2">
      Semester {semester.semesterName}
    </h4>

    {/* Table for each semester */}
    <table className="w-full mb-4 border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-300 p-2 bg-gray-100 text-left">Course Name</th>
          <th className="border border-gray-300 p-2 bg-gray-100 text-left">Credit Hours</th>
        </tr>
      </thead>
      <tbody>
        {semester.courses.map((course, courseIndex) => (
          <tr key={courseIndex}>
            <td className="border border-gray-200 p-2">{course.courseName}</td>
            <td className="border border-gray-200 p-2">{course.creditHours}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </React.Fragment>
))}
            
          
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={previousStep}
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition duration-200"
        >
          Previous
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
          // onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};
export default StepForm;

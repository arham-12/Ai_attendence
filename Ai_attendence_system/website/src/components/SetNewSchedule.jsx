// StepForm.jsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { AiOutlinePlus } from 'react-icons/ai'
import { FaPlus, } from 'react-icons/fa';
import { MdRemoveCircle } from 'react-icons/md'
import { MdAdd } from 'react-icons/md';
import { AiOutlineEdit } from 'react-icons/ai';
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
        <div >
            <Formik
                initialValues={{
                    departmentName: '',
                    degreePrograms: [],
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, handleSubmit, setTouched, validateForm }) => (
                    <Form className="mx-auto p-6 bg-white w-[80%] shadow-lg rounded-lg">
                        <StepWizard>
                            <StepOne setFieldValue={setFieldValue} values={values} />
                            <StepTwo setFieldValue={setFieldValue} values={values} />
                            <StepThree setFieldValue={setFieldValue} values={values} />
                            <FinalStep values={values} />
                        </StepWizard>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
// Step One: Adding Department Name
// Step One: Adding Department Name
const StepOne = ({ nextStep, values }) => {
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
                className="mt-4 bg-primary text-gray-500 py-2 px-4 rounded hover:bg-secondary hover:text-white transition duration-200"
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
                    <div key={index} className="mb-4 flex items-center gap-2">
                        <Field
                            name={`degreePrograms.${index}.programName`}
                            placeholder="Enter Degree Program Name"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="bg-red-400 text-white py-2 px-3 rounded-full hover:bg-red-600 transition duration-200 flex items-center"
                        >
                            <AiOutlineClose className="text-white" />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={() => push({ programName: '', semesters: [] })}
                    className="bg-primary text-gray-500 py-2 px-4 rounded hover:bg-secondary  hover:text-white transition duration-200"
                >
                    <MdAdd className='text-gray-700 font-bold' />

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
                        className="bg-primary text-gray-500 py-2 px-4 rounded hover:bg-secondary  hover:text-white transition duration-200"
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
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Set Lecture Schedule</h3>

                {values.degreePrograms.map((program, programIndex) => (
                    <div key={programIndex} className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-700">
                            Selected Degree Program: {program.programName}
                        </h4>
                        <FieldArray name={`degreePrograms.${programIndex}.semesters`}>
                            {({ remove, push }) => (
                                <div>
                                    {program.semesters.map((_, semesterIndex) => (
                                        <div key={semesterIndex} className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Semester No
                                            </label>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Field
                                                    name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.semesterNumber`}
                                                    placeholder="Enter Semester No"
                                                    type="number"
                                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                {/* Remove button positioned beside the Semester No field */}
                                                <button
                                                    type="button"
                                                    onClick={() => remove(semesterIndex)}
                                                    className="bg-red-400 text-white py-2 px-3 rounded-full hover:bg-red-600 transition duration-200 flex items-center"
                                                >
                                                    <AiOutlineClose />
                                                </button>
                                            </div>
                                            <FieldArray name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses`}>
                                                {({ remove, push }) => (
                                                    <div>
                                                        {values.degreePrograms[programIndex].semesters[semesterIndex].courses.map((course, courseIndex) => (
                                                            <div key={courseIndex} className="mt-2 flex items-center gap-2 ">
                                                                <div className='container shadow-md p-4 rounded-lg'>
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
                                                                        Day of Lecture
                                                                    </label>
                                                                    <Field
                                                                        name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses.${courseIndex}.lectureDay`}
                                                                        placeholder="Enter Day"
                                                                        type="text"
                                                                        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />

                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Instructor Name
                                                                    </label>
                                                                    <Field
                                                                        name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses.${courseIndex}.instructorName`}
                                                                        placeholder="Enter Instructor Name"
                                                                        type="text"
                                                                        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />

                                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                        Time Span
                                                                    </label>
                                                                    <Field
                                                                        name={`degreePrograms.${programIndex}.semesters.${semesterIndex}.courses.${courseIndex}.timeSpan`}
                                                                        placeholder="Enter Time Span (e.g., 9 AM - 10 AM)"
                                                                        type="text"
                                                                        className="w-full p-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                    />

                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => remove(courseIndex)}
                                                                    className="bg-red-400 text-white py-2 px-3 rounded-full hover:bg-red-600 transition duration-200  flex items-center"
                                                                >
                                                                    <AiOutlineClose />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        <button
                                                            type="button"
                                                            onClick={() => push({ courseName: '', lectureDay: '', instructorName: '', timeSpan: '' })}
                                                            className="bg-primary  text-gray-500 py-2 px-4  ml-[50%] rounded hover:bg-secondary mt-2 hover:text-white  transition duration-200"
                                                        >
                                                           < MdAdd/>
                                                        </button>
                                                    </div>
                                                )}
                                            </FieldArray>


                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => push({ semesterNumber: '', courses: [] })}
                                        className="bg-primary text-gray-500 mt-2 py-2 px-4 rounded hover:bg-secondary  hover:text-white transition duration-200"
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
                        className="bg-primary text-gray-500 py-2 px-4 rounded hover:bg-secondary  hover:text-white transition duration-200"
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
            <div className='mb-4'>
  <pre className="bg-gray-100 p-4 rounded border border-gray-300">
    {JSON.stringify(values, null, 2)}
  </pre>
</div>
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
                                Semester {semester.semesterNumber}
                            </h4>

                            {/* Table for each semester */}
                            <table className="w-full mb-4 border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 p-2 bg-gray-100 text-left">Course Name</th>

                                        <th className="border border-gray-300 p-2 bg-gray-100 text-left">Lecture Day</th>
                                        <th className="border border-gray-300 p-2 bg-gray-100 text-left">Instructor Name</th>
                                        <th className="border border-gray-300 p-2 bg-gray-100 text-left">Time Span</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {semester.courses.map((course, courseIndex) => (
                                        <tr key={courseIndex}>
                                            <td className="border border-gray-200 p-2">{course.courseName}</td>

                                            <td className="border border-gray-200 p-2">{course.lectureDay}</td>
                                            <td className="border border-gray-200 p-2">{course.instructorName}</td>
                                            <td className="border border-gray-200 p-2">{course.timeSpan}</td>
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
                    className="bg-primary text-gray-500 py-2 px-4 rounded hover:bg-secondary hover:text-white transition duration-200"
                // onClick={handleSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    );
};
export default StepForm;
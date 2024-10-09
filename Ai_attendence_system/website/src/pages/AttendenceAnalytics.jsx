import React, { useState } from 'react';
import axios from 'axios';

const AttendenceAnalytics = () => {
  // State to manage the search term and results
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  // Function to handle form submission
  const handleSearch = async () => {
    if (searchTerm) {
      try {
        // Assuming your backend API endpoint is '/api/search-students'
        const response = await axios.get('/api/search-students', {
          params: { query: searchTerm },
        });
        
        // Update results with the data from the API
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  };

  return (
    <div className='min-h-screen p-6'>
      <div className="bg-white flex px-1 py-1 rounded-full border border-primary overflow-hidden max-w-md mx-auto font-[sans-serif]">
        <input 
          type='text' 
          placeholder="Query Related To Student's Attendence...." 
          className="w-full outline-none bg-white pl-4 text-sm" 
          vaManageStudents
          ManageStudentslue={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
        />
        <button 
          type='button'
          onClick={handleSearch}
          className="bg-primary hover:bg-secondary transition-all text-gray-500 hover:text-white text-sm rounded-full px-5 py-2.5"
        >
          Search
        </button>
      </div>

      {/* Results Table */}
      <div className="max-w-4xl mx-auto mt-8">
        {results.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead>
              <tr className="bg-primary text-gray-500">
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">ID</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Name</th>
                <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Email</th>
              </tr>
            </thead>
            <tbody>
              {results.map((student) => (
                <tr key={student.id} className="hover:bg-gray-100">
                  <td className="text-left py-3 px-4">{student.id}</td>
                  <td className="text-left py-3 px-4">{student.name}</td>
                  <td className="text-left py-3 px-4">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center mt-4">No results found.</p>
        )}
      </div>
    </div>
  );
}

export default AttendenceAnalytics;
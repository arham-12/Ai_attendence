import React, { useState } from 'react';

// Mock data for demonstration
const mockData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Student' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Teacher' },
  // Add more rows as needed
];

const ContentRetriever = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState(mockData);

  // Function to filter data based on query
  const filterData = (query) => {
    // Simple filter for demonstration
    return mockData.filter((item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Update the displayed data based on query
  const handleInputChange = (event) => {
    const { value } = event.target;
    setQuery(value);
    setData(filterData(value));
  };

  return (
    <div className="container mx-auto p-4 ml-[20%] h-screen">

        
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h1 className="text-2xl font-semibold mb-4">Smart Content Retriever</h1>
        <input
          type="text"
          placeholder="Search for content..."
          value={query}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Content section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        {data.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
};

export default ContentRetriever;

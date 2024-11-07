import React, { useState, useEffect } from "react";
import axios from "axios";
import ConnectionForm from "../components/ConnectionForm";
import TableSelection from "../components/TableSelection";
import ColumnSelection from "../components/ColumnSelection";
import DataTable from "../components/DataTable";

function DatabaseConnectionPage() {
  const [connection, setConnection] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(""); // Ensure it starts empty
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility

  // Handle the database connection
  const handleConnection = async (formData) => {
    try {
      const response = await axios.post("http://localhost:8000/connect-db", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setConnection(formData);
      setTables(response.data.table_names); // Fetch table names
      setIsModalOpen(true); // Open modal after successful connection
    } catch (error) {
      console.error("Connection error:", error);
    }
  };

  // Fetch columns when a table is selected
  const fetchColumns = async (tableName) => {
    if (!tableName) return; // Don't fetch columns if no table is selected
    try {
      const response = await axios.post("http://localhost:8000/fetch-columns", {
        ...connection,
        table_name: tableName,
      });
      setColumns(response.data.columns);
    } catch (error) {
      console.error("Error fetching columns:", error);
    }
  };

  // Fetch data based on selected columns
  const fetchData = async (selectedColumns) => {
    try {
      const requestBody = {
        ...connection,
        table_name: selectedTable, // Ensure the selected table is passed correctly
        columns: selectedColumns,
      };
      console.log("Request Payload:", requestBody); // Log the request payload for debugging
      const response = await axios.post("http://localhost:8000/fetch-table-data", requestBody);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Set selected table and fetch columns
  const handleTableSelection = (tableName) => {
    console.log("Selected table:", tableName); // Log the table selected
    setSelectedTable(tableName); // Update the selected table
  };

  // Whenever selectedTable changes, fetch columns
  useEffect(() => {
    if (selectedTable) {
      fetchColumns(selectedTable);
    }
  }, [selectedTable]); // Trigger this effect whenever selectedTable changes

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Database Inspector</h1>
      <ConnectionForm onConnect={handleConnection} />
      {connection && (
        <>
          {/* Modal for Table and Column Selection */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500 opacity-100 visible">
              <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-full overflow-auto max-h-[80vh] scrollbar-hide">
                <h2 className="text-2xl font-semibold mb-4">Select Table and Columns</h2>
                <TableSelection tables={tables} onSelect={handleTableSelection} />
                {columns.length > 0 && (
                  <ColumnSelection columns={columns} onSubmit={fetchData} />
                )}
                <button
                  onClick={() => setIsModalOpen(false)} // Close the modal
                  className="mt-4 text-red-500 hover:text-red-700"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {data.length > 0 && <DataTable data={data} />}
        </>
      )}
    </div>
  );
}

export default DatabaseConnectionPage;

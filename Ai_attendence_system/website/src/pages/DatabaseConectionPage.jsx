import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ConnectionForm from "../components/ConnectionForm";
import TableSelection from "../components/TableSelection";
import ColumnSelection from "../components/ColumnSelection";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";

function DatabaseConnectionPage() {
  const [connection, setConnection] = useState(null);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnectionSuccessful, setIsConnectionSuccessful] = useState(false);
  const [showSelection, setShowSelection] = useState(false);

  const handleConnection = async (formData) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/connect-db", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setConnection(formData);
      setTables(response.data.table_names);
      setIsConnectionSuccessful(true);
      setShowSelection(true);
    } catch (error) {
      console.error("Connection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchColumns = async (tableName) => {
    if (!tableName) return;
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/fetch-columns", {
        ...connection,
        table_name: tableName,
      });
      setColumns(response.data.columns);
    } catch (error) {
      console.error("Error fetching columns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (selectedColumns) => {
    setIsLoading(true);
    try {
      const requestBody = {
        ...connection,
        table_name: selectedTable,
        columns: selectedColumns,
      };
      const response = await axios.post("http://localhost:8000/fetch-table-data", requestBody);
      setData(response.data.data);
      setShowSelection(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableSelection = (tableName) => {
    setSelectedTable(tableName);
  };

  const resetSelection = () => {
    setShowSelection(false);
    setSelectedTable("");
    setColumns([]);
    setData([]);
  };

  useEffect(() => {
    if (selectedTable) {
      fetchColumns(selectedTable);
    }
  }, [selectedTable]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start bg-gray-100 relative">
      
      {/* Fixed Header */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8 tracking-wide text-center absolute top-4 w-full">
        Database Inspector
      </h1>

      {/* Main container */}
      <div className="flex justify-center items-center w-full max-w-3xl flex-col mt-32">

        {/* Connection Form with fade-in animation */}
        <AnimatePresence>
          {!isConnectionSuccessful && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
              <ConnectionForm onConnect={handleConnection} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loader */}
        {isLoading && <Loader />}

        {/* Table and Column Selection */}
        <AnimatePresence>
          {isConnectionSuccessful && showSelection && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg overflow-auto max-h-[70vh] scrollbar-hide flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Table and Columns</h2>
              <TableSelection tables={tables} onSelect={handleTableSelection} />

              {/* Show spinner while fetching columns */}
              {isLoading && (
                <div className="flex justify-center items-center mt-4 w-full h-16">
                  <Loader /> {/* Spinner inside the container */}
                </div>
              )}

              {columns.length > 0 && !isLoading && (
                <ColumnSelection columns={columns} onSubmit={fetchData} />
              )}

              <button
                onClick={resetSelection}
                className="mt-6 px-5 py-2 font-medium text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out"
              >
                Reset Selection
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Table */}
        <AnimatePresence>
          {data.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full max-w-2xl mt-6 bg-white p-6 rounded-lg shadow-md"
            >
              <DataTable data={data} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default DatabaseConnectionPage;

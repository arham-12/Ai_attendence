// src/components/ColumnSelection.js
import React, { useState } from "react";

function ColumnSelection({ columns, onSubmit }) {
  const [selectedColumns, setSelectedColumns] = useState([]);

  const toggleColumn = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(selectedColumns);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Select Columns</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {columns.map((column) => (
          <label key={column} className="flex items-center">
            <input
              type="checkbox"
              checked={selectedColumns.includes(column)}
              onChange={() => toggleColumn(column)}
              className="mr-2"
            />
            {column}
          </label>
        ))}
      </div>
      <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
        Import Data
      </button>
    </form>
  );
}

export default ColumnSelection;

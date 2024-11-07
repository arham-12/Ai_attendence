// src/components/DataTable.js
import React from "react";

function DataTable({ data }) {
  if (data.length === 0) return null;

  return (
    <div className="mt-6 overflow-x-auto bg-white p-4 rounded-lg shadow-lg max-w-full mx-auto">
      <table className="min-w-full text-left border">
        <thead>
          <tr>
            {Object.keys(data[0]).map((header) => (
              <th key={header} className="px-4 py-2 border">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-100">
              {Object.values(row).map((value, idx) => (
                <td key={idx} className="px-4 py-2 border">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

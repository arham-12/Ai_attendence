// src/MultiInput.js
import React, { useState } from 'react';

const MultiInput = ({ values, setValues, label }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const weekdays = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  const handleAdd = () => {
    if (selectedValue && !values.includes(selectedValue)) {
      setValues([...values, selectedValue]);
      setSelectedValue('');
    }
  };

  const handleRemove = (valueToRemove) => {
    setValues(values.filter(value => value !== valueToRemove));
  };

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <div className="flex flex-wrap border border-gray-300 rounded-lg p-2 mt-1">
        {values.map((value) => (
          <span key={value} className="bg-blue-500 text-white rounded-full px-2 py-1 flex items-center mr-2 mb-2">
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
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="border-none focus:outline-none flex-grow p-2"
        >
          <option value="">Select a weekday</option>
          {weekdays.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleAdd}
          className="bg-blue-500 text-white rounded-lg px-3 py-1 ml-2"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default MultiInput;
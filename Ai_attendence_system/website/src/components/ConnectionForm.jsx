// src/components/ConnectionForm.js
import React, { useState } from "react";

// Correctly capitalize InputField
const InputField = ({ name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block font-medium capitalize">{name}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>
);

function ConnectionForm({ onConnect }) {
  const [formData, setFormData] = useState({
    db_type: "postgresql",
    username: "",
    password: "",
    host: "",
    port: "",
    db_name: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConnect(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Connect to Database</h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium">Database Type</label>
          <select
            name="db_type"
            value={formData.db_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>
        <InputField
          name="username"
          value={formData.username}
          placeholder="Username"
          onChange={handleInputChange}
        />
        <InputField
          name="password"
          value={formData.password}
          placeholder="Password"
          onChange={handleInputChange}
          type="password"
        />
        <InputField
          name="host"
          value={formData.host}
          placeholder="Host"
          onChange={handleInputChange}
        />
        <InputField
          type="number"
          name="port"
          value={formData.port}
          placeholder="Port"
          onChange={handleInputChange}
        />
        <InputField
          name="db_name"
          value={formData.db_name}
          placeholder="Database Name"
          onChange={handleInputChange}
        />
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg"
      >
        Connect
      </button>
    </form>
  );
}

export default ConnectionForm;

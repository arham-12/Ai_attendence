import React, { useState } from 'react';

const DbCredential = () => {
  const [dbType, setDbType] = useState('');

  const handleDbTypeChange = (event) => {
    setDbType(event.target.value);
  };

  return (
    <div className="bg-gray-100 ml-[100px] w-[82%] font-[sans-serif]">
      <div className=" flex flex-col items-center justify-center py-6 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Database Credentials</h1>
            <p className="text-gray-600">If You Have Existing Database, Provide Credentials</p>
          </div>

          <div className="p-8 rounded-2xl bg-white shadow">
            <h2 className="text-gray-800 text-center text-2xl font-bold">Credentials</h2>
            <form className="mt-8 space-y-4">
              {/* Database Type Dropdown */}
              <div>
                <label className="text-gray-800 text-sm mb-2 block">Database Type</label>
                <select
                  name="dbType"
                  required
                  className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary"
                  onChange={handleDbTypeChange}
                >
                  <option value="" disabled selected>Select Database Type</option>
                  <option value="mysql">MySQL</option>
                  <option value="postgresql">PostgreSQL</option>
                  <option value="sqlite">SQLite</option>
                </select>
              </div>

              {/* MySQL Credentials */}
              {dbType === 'mysql' && (
                <>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Database Username</label>
                    <input name="username" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter DB Username" />
                  </div>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Database Password</label>
                    <input name="password" type="password" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter DB Password" />
                  </div>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Host IP</label>
                    <input name="host" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter Host IP" />
                  </div>
                  <div>
                  <label className="text-gray-800 text-sm mb-2 block">Db Port</label>
                  <input name="port" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter Db Port" />
                </div>
                  <div>
                    <label className="text-gray-800 text-sm mb-2 block">Database Name</label>
                    <input name="database" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter Database Name" />
                  </div>
                </>
              )}

              {/* PostgreSQL URL */}
              {dbType === 'postgresql' && (
                <>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Database Username</label>
                  <input name="username" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter DB Username" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Database Password</label>
                  <input name="password" type="password" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter DB Password" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Host IP</label>
                  <input name="host" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter Host IP" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Db Port</label>
                  <input name="port" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter Db Port" />
                </div>
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">Database Name</label>
                  <input name="database" type="text" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" placeholder="Enter Database Name" />
                </div>
              </>
              )}

              {/* SQLite File Upload */}
              {dbType === 'sqlite' && (
                <div>
                  <label className="text-gray-800 text-sm mb-2 block">SQLite File</label>
                  <input name="sqliteFile" type="file" required className="w-full text-gray-800 text-sm border border-gray-300 px-4 py-3 rounded-md outline-primary" />
                </div>
              )}

              <div className="!mt-8">
                <button type="button" className="w-full py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-primary hover:bg-cyan-300 hover:text-gray-800 focus:outline-none">
                  Make Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DbCredential;

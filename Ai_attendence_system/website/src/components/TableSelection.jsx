function TableSelection({ tables = [], onSelect }) {
    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Select a Table</h3>
        <select
          onChange={(e) => {
            console.log("Selected table:", e.target.value); // Log the selected table
            onSelect(e.target.value); // Call onSelect with the selected table
          }}
          className="w-full px-3 py-2 border rounded-lg"
        >
          <option value="">-- Select Table --</option>
          {tables.map((table, index) => (
            <option key={index} value={table}>
              {table}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export default TableSelection;
  
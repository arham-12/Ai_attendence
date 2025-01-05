import { createContext, useState, useEffect } from "react";

const BulkImportContext = createContext();

const BulkImportProvider = ({ children }) => {
  const [missing_columns, setmissing_columns] = useState([]);
  const [required_columns, setrequired_columns] = useState([]);
  const [wrong_columns, setwrong_columns] = useState([]);

  return (
    <BulkImportContext.Provider
      value={{
        missing_columns,
        setmissing_columns,
        required_columns,
        setrequired_columns,
        wrong_columns,
        setwrong_columns,
      }}
    >
      {children}
    </BulkImportContext.Provider>
  );
};

export { BulkImportContext, BulkImportProvider };

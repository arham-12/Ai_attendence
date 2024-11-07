import { createContext, useState } from "react";

const DashBoardContext = createContext();

const DashBoardContextProvider = ({ children }) => {

    const [isDashBoard, setIsDashBoard] = useState(true);
    return (
        <DashBoardContext.Provider value={{ isDashBoard, setIsDashBoard }}>
            {children}
        </DashBoardContext.Provider>
    );
};

export { DashBoardContext, DashBoardContextProvider }
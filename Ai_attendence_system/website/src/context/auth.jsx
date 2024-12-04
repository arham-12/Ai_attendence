import { createContext, useState } from "react";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
const [isLogin, setisLogin] = useState(false);
const [isAddProgram, setisAddProgram] = useState(false);
const [skipPage, setskipPage] = useState(false);
    return (
        <AuthContext.Provider value={{ isLogin, setisLogin,isAddProgram,setisAddProgram }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider }
import { createContext, useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["authToken"]);

  // Initialize states based on cookies
  const [isLogin, setisLogin] = useState(() => cookies.authToken != null);
  const [authToken, setauthToken] = useState(() => cookies.authToken || null);
  const [isAddProgram, setisAddProgram] = useState(false);

  // Sync authToken and isLogin with cookies
  useEffect(() => {
    setisLogin(cookies.authToken != null);
    setauthToken(cookies.authToken || null);
  }, [cookies.authToken]);

  // Helper function to set auth token
  const login = (token) => {
    setCookie("authToken", token, { path: "/", maxAge: 3600 }); // Set cookie for 1 hour
    setisLogin(true);
    setauthToken(token);
  };

  // Helper function to remove auth token
  const logout = () => {
    removeCookie("authToken", { path: "/" });
    setisLogin(false);
    setauthToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isLogin,
        setisLogin,
        authToken,
        setauthToken,
        isAddProgram,
        setisAddProgram,
        login, // Helper function to log in
        logout, // Helper function to log out
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };

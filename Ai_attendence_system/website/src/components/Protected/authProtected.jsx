import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import LoginPage from "../../pages/LoginPage";
import AddDegreeProgramPage from "../../pages/AddDegreeProgram";

const AuthProtected = (props) => {
  const {isLogin} = useContext(AuthContext);
  const { Component } = props
  return isLogin ? <Component/> : <LoginPage/>
};

export default AuthProtected;

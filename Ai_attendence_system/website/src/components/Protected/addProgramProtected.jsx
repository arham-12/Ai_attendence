import React, { useContext } from "react";
import { AuthContext } from "../../context/auth";
import LoginPage from "../../pages/LoginPage";

const AddProgramProtected = (props) => {
  const { Component } = props;
  const {isAddProgram} = useContext(AuthContext);
  return isAddProgram ? <Component/> : <LoginPage/>
};

export default AddProgramProtected;

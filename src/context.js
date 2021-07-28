import axios from "axios";
import React, { useState, useContext, useEffect } from "react";

const table = {
  sports: 21,
  history: 23,
  politics: 24,
};

const API_ENDPOINT = "https://opentdb.com/api.php?";

const url = "";
const tempURL =
  "https://opentdb.com/api.php?amount=10&category=23&difficulty=medium&type=multiple";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  return <AppContext.Provider value="hello">{children}</AppContext.Provider>;
};
// make sure use
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };

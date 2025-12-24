import { createContext, useEffect, useState } from "react";

export const CollegeContext = createContext()

export const CollegeProvider = ({ children }) => {
  const [college, setCollege] = useState(
    JSON.parse(localStorage.getItem("college"))
  );
  return (
    <CollegeContext.Provider value={{ college, setCollege }}>
      {children}
    </CollegeContext.Provider>
  );
};

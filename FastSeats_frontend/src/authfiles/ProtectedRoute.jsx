import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { CollegeContext } from "../Context/CollegeProvider";

const AuthProtectedRoute = ({ children }) => {
  const { college } = useContext(CollegeContext);

  if (!college || !college.isActive) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthProtectedRoute;

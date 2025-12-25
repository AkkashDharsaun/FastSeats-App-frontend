import { Navigate } from "react-router-dom";

const PaymentProtectedRoute = ({ children }) => {
  const paymentDone = sessionStorage.getItem("paymentDone");

  if (paymentDone !== "true") {
    return <Navigate to="/payment" replace />;
  }

  return children;
};

export default PaymentProtectedRoute;

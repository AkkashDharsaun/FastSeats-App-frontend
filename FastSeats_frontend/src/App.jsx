import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLogin from "./Components/Loginpage";
import Register from "./pages/RegisterPage";
import Forgetpassword from "./pages/Forgetpassword";
import Dashboard from "./pages/Dashboard";
import PaymentPage from "./Paymentpage/payment";
import ProtectedRoute from "./authfiles/ProtectedRoute";
import Layout from "./Layouts/Layout";
import Logout from "./Components/Logout";

const App = () => {
  return (
    <BrowserRouter>
  <Routes>
    {/* Public */}
    <Route path="/" element={<DashboardLogin />} />
    <Route path="/payment" element={<PaymentPage />} />
    <Route path="/forgetpassword" element={<Forgetpassword />} />

    {/* Protected register */}
    <Route
      path="/register"
      element={
        <ProtectedRoute>
          <Register />
        </ProtectedRoute>
      }
    />

    {/* Dashboard */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Dashboard />} />
    </Route>

    {/* Logout */}
    <Route path="/logout" element={<Logout />} />
  </Routes>
</BrowserRouter>

  );
};

export default App;

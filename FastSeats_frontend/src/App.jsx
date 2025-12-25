import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Pages */
import DashboardLogin from "./Components/Loginpage";
import Register from "./pages/RegisterPage";
import Forgetpassword from "./pages/Forgetpassword";
import Dashboard from "./pages/Dashboard";
import PaymentPage from "./Paymentpage/payment";
import Logout from "./Components/Logout";

/* Layout */
import Layout from "./Layouts/Layout";

/* Protected Routes */
import AuthProtectedRoute from "./authfiles/ProtectedRoute";
import PaymentProtectedRoute from "./authfiles/PaymentProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<DashboardLogin />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/forgetpassword" element={<Forgetpassword />} />

        {/* ================= PAYMENT PROTECTED ================= */}
        {/* Only payment success users can access register */}
        <Route
          path="/register"
          element={
            <PaymentProtectedRoute>
              <Register />
            </PaymentProtectedRoute>
          }
        />

        {/* ================= AUTH PROTECTED ================= */}
        {/* Only logged-in & active colleges */}
        <Route
          path="/dashboard"
          element={
            <AuthProtectedRoute>
              <Layout />
            </AuthProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        {/* ================= LOGOUT ================= */}
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLogin from "../Components/Loginpage";
import Register from "../pages/RegisterPage";
const AllRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLogin />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AllRoutes;

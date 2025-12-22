import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import DashboardLogin from "./Components/Loginpage"
import Register from "./pages/RegisterPage";
import Forgetpassword from "./pages/Forgetpassword";
import Dashboard from "./pages/Dashboard";
const App = () => {
  return (
    <div>
         <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgetpassword" element={<Forgetpassword/>}/>
          <Route path = "/dashboard" element = {<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

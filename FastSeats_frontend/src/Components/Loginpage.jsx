import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { CollegeContext } from "../Context/CollegeProvider";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


const Loginpage = () => {
  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ NEW
  const { setCollege } = useContext(CollegeContext); //
  const navigate = useNavigate();
  useEffect(() => {
    const storedCollege = localStorage.getItem("college");

    if (storedCollege) {
      const college = JSON.parse(storedCollege);
      if (college.isRegistered && college.isActive) {
        navigate("/dashboard"); // ✅ direct dashboard
      } else if (college.isActive) {
        sessionStorage.setItem("paymentDone", "true");
        navigate("/register");
      }
    }
  }, []);
  const handleLogin = (e) => {
    e.preventDefault();

    setLoading(true);
    setErr(null);

    axios
      .post(`${BACKEND_URL}/DashboardLogin`, {
        collegeEmail,
        password,
      })
      .then((res) => {
        setLoading(false);

        // ✅ SET CONTEXT FIRST
        setCollege(res.data);

        // ✅ STORE FOR REFRESH
        localStorage.setItem("college", JSON.stringify(res.data));

        // ✅ REDIRECT
        navigate("/dashboard", { replace: true });
      })
      .catch((error) => {
        setLoading(false);
        setErr(error.response?.data?.detail || "Something went wrong");
      });
  };


  return (
    <>
      {/* 🔵 TOP LINEAR PROGRESS */}
      {loading && (
        <Box
          sx={{ width: "100%", position: "fixed", top: 0, left: 0, zIndex: 50 }}
        >
          <LinearProgress />
        </Box>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-gray-100 to-blue-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-4">
            College Dashboard Login
          </h2>

          {/* ❌ Error */}
          {err && (
            <div className="mb-4 text-center">
              <p className="text-sm text-red-600 font-medium">{err}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              placeholder="College Email"
              className="input"
              value={collegeEmail}
              onChange={(e) => {
                setCollegeEmail(e.target.value);
                setErr(null);
              }}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input pr-12"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErr(null);
                }}
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgetpassword"
                className="text-sm text-blue-600 hover:underline hover:text-blue-700"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              Login
            </button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <Link to="/payment" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Loginpage;

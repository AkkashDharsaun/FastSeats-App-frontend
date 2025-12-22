import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const Forgetpassword = () => {
  const navigate = useNavigate();

  const [collegeEmail, setCollegeEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  // 🔹 Progress animation ONLY
  useEffect(() => {
    if (!loading) return;

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 100));
    }, 200);

    return () => clearInterval(timer);
  }, [loading]);

  // 🔹 Navigation in separate effect ✅
  useEffect(() => {
    if (progress === 100) {
      navigate("/");
    }
  }, [progress, navigate]);

  const handleReset = (e) => {
    e.preventDefault();

    if (!collegeEmail || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    axios
      .post(`${BACKEND_URL}/forget-password`, {
        collegeEmail,
        newPassword: password, // ✅ backend schema match
      })
      .then((res) => {
        setError(null);
        setSuccess(res.data.message);
        setLoading(true); // start progress
      })
      .catch((err) => {
        setSuccess(null);
        setError(err.response?.data?.detail || "Server error");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-bold text-center mb-4">
          Reset Password
        </h2>

        {error && (
          <p className="text-center text-sm text-red-600 mb-3">
            {error}
          </p>
        )}

        {success && (
          <p className="text-center text-sm text-green-600 mb-3">
            {success}
          </p>
        )}

        {loading && (
          <Box sx={{ width: "100%", mb: 2 }}>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <input
            placeholder="Registered College Email"
            className="input"
            value={collegeEmail}
            onChange={(e) => setCollegeEmail(e.target.value)}
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="input pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="input pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            Reset Password
          </button>

          <p className="text-center text-sm">
            Back to{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Forgetpassword;

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react";
import axios from "axios";

/* MUI */
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const TOAST_DURATION = 4000; // 4 seconds

const Registerpage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Toast state */
  const [alert, setAlert] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [toastProgress, setToastProgress] = useState(100);

  const [data, setData] = useState({
    collegeId: "",
    collegeName: "",
    collegeType: "",
    country: "",
    stateOrProvince: "",
    city: "",
    counsellingcode: "",
    collegeEmail: "",
    countryCode: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [countryCodes, setCountryCodes] = useState([]);

  const paymentInfo = JSON.parse(sessionStorage.getItem("paymentInfo"));

  useEffect(() => {
    if (!sessionStorage.getItem("paymentDone") || !paymentInfo) {
      navigate("/payment");
    }
  }, []);

  useEffect(() => {
    setData((p) => ({ ...p, collegeId: crypto.randomUUID() }));
  }, []);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((r) => r.json())
      .then((json) => {
        const list = json
          .filter((c) => c.idd?.root && c.idd?.suffixes)
          .map((c) => ({
            name: c.name.common,
            code: `${c.idd.root}${c.idd.suffixes[0]}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountryCodes(list);
      });
  }, []);

  /* 🔥 Auto-close toast + progress bar */
  useEffect(() => {
    if (!alert.show) return;

    setToastProgress(100);
    const interval = setInterval(() => {
      setToastProgress((p) => p - 100 / (TOAST_DURATION / 100));
    }, 100);

    const timeout = setTimeout(() => {
      setAlert({ show: false, type: "", message: "" });
    }, TOAST_DURATION);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [alert.show]);

  const handleChange = (f, v) => {
    setData((p) => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: "" }));
  };

  const validate = () => {
    let e = {};
    if (!data.collegeName) e.collegeName = "College name required";
    if (!data.collegeType) e.collegeType = "College type required";
    if (!data.country) e.country = "Country required";
    if (!data.stateOrProvince) e.stateOrProvince = "State required";
    if (!data.city) e.city = "City required";
    if (!data.counsellingcode) e.counsellingcode = "Code required";
    if (!data.collegeEmail) e.collegeEmail = "Email required";
    if (!data.countryCode) e.countryCode = "Code required";
    if (!/^\d{10}$/.test(data.contactNumber))
      e.contactNumber = "10 digits required";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        data.password
      )
    )
      e.password = "Weak password";

    if (data.password !== data.confirmPassword)
      e.confirmPassword = "Password mismatch";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    axios
      .post(`${BACKEND_URL}/registerCollege`, {
        ...data,
        contactNumber: data.countryCode + data.contactNumber,
        paymentId: paymentInfo.paymentId,
        isActive: paymentInfo.isActive,
        planType: paymentInfo.planType,
        planExpiry: paymentInfo.planExpiry,
      })
      .then(() => {
        setLoading(false);
        setAlert({
          show: true,
          type: "success",
          message: "🎉 Registration successful! Redirecting…",
        });
        setTimeout(() => navigate("/"), 2000);
      })
      .catch((err) => {
        setLoading(false);
        setAlert({
          show: true,
          type: "error",
          message:
            err.response?.data?.detail ||
            "Registration failed",
        });
      });
  };

  const base =
    "w-full px-4 py-3 border rounded-xl transition focus:outline-none";
  const inputClass = (f) =>
    `${base} ${
      errors[f]
        ? "border-red-500 focus:ring-2 focus:ring-red-300"
        : "border-gray-300 focus:ring-2 focus:ring-blue-500"
    }`;

  return (
    <>
      {loading && (
        <Box sx={{ width: "100%", position: "fixed", top: 0, zIndex: 50 }}>
          <LinearProgress />
        </Box>
      )}

      {/* 🔔 AUTO-DISMISS TOAST */}
      {alert.show && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div
            className={`rounded-xl border shadow-lg overflow-hidden
            ${
              alert.type === "success"
                ? "bg-green-50 border-green-300 text-green-700"
                : "bg-red-50 border-red-300 text-red-700"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3">
              {alert.type === "success" ? (
                <CheckCircle />
              ) : (
                <AlertTriangle />
              )}
              <span className="text-sm font-medium">{alert.message}</span>
            </div>

            {/* ⏳ Progress bar */}
            <div
              className={`h-1 transition-all duration-100
              ${
                alert.type === "success"
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
              style={{ width: `${toastProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
        <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-center mb-8">
            College Registration
          </h2>

          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {[
              ["collegeName", "College Name"],
              ["country", "Country"],
              ["stateOrProvince", "State"],
              ["city", "City"],
              ["counsellingcode", "Counselling Code"],
              ["collegeEmail", "Official Email"],
            ].map(([k, l]) => (
              <div key={k}>
                <input
                  placeholder={l}
                  className={inputClass(k)}
                  onChange={(e) => handleChange(k, e.target.value)}
                />
                {errors[k] && (
                  <p className="text-xs text-red-500 mt-1">{errors[k]}</p>
                )}
              </div>
            ))}

            <select
              className={inputClass("collegeType")}
              onChange={(e) => handleChange("collegeType", e.target.value)}
            >
              <option value="">College Type</option>
              <option value="Public">Public</option>
              <option value="Autonomous">Autonomous</option>
            </select>

            <div>
              <div className="flex gap-2">
                <select
                  className={inputClass("countryCode")}
                  onChange={(e) =>
                    handleChange("countryCode", e.target.value)
                  }
                >
                  <option value="">Code</option>
                  {countryCodes.map((c, i) => (
                    <option key={i} value={c.code}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
                <input
                  placeholder="10-digit number"
                  className={inputClass("contactNumber")}
                  onChange={(e) =>
                    handleChange("contactNumber", e.target.value)
                  }
                />
              </div>
              {(errors.countryCode || errors.contactNumber) && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.countryCode || errors.contactNumber}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`${inputClass("password")} pr-10`}
                onChange={(e) =>
                  handleChange("password", e.target.value)
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm */}
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm Password"
                className={`${inputClass("confirmPassword")} pr-10`}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button className="md:col-span-2 w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition shadow-md">
              Register
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Registerpage;

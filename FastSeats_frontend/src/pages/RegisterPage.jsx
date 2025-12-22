import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


/* 🔹 Material UI */
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";

const Registerpage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    collegeId: "",
    collegeName: "",
    collegeType: "",
    country: "",
    stateOrProvince: "",
    city: "",
    postalCode: "",
    collegeEmail: "",
    countryCode: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [countryCodes, setCountryCodes] = useState([]);

  /* Generate UUID */
  useEffect(() => {
    setData((prev) => ({ ...prev, collegeId: crypto.randomUUID() }));
  }, []);

  /* Fetch country codes */
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd")
      .then((res) => res.json())
      .then((json) => {
        const formatted = json
          .filter((c) => c.idd?.root && c.idd?.suffixes)
          .map((c) => ({
            name: c.name.common,
            code: `${c.idd.root}${c.idd.suffixes[0]}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountryCodes(formatted);
      });
  }, []);

  const handleChange = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  /* Validation */
  const validate = () => {
    let e = {};

    if (!data.collegeName.trim()) e.collegeName = "College name required";
    if (!data.collegeType) e.collegeType = "College type required";
    if (!data.country) e.country = "Country required";
    if (!data.stateOrProvince) e.stateOrProvince = "State required";
    if (!data.city) e.city = "City required";
    if (!data.postalCode) e.postalCode = "Postal code required";

    if (!data.collegeEmail) e.collegeEmail = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.collegeEmail))
      e.collegeEmail = "Invalid email";

    if (!data.countryCode) e.countryCode = "Select country code";

    if (!/^\d{10}$/.test(data.contactNumber))
      e.contactNumber = "Must be 10 digits";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        data.password
      )
    )
      e.password =
        "Min 8 chars, uppercase, lowercase, number & symbol required";

    if (data.password !== data.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* 🔥 PAY → THEN REGISTER */
  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const options = {
      key: razorpayKey, // 🔑 replace with real key
      amount: 1,
      currency: "INR",
      name: "College Registration",
      description: "1 Year Dashboard Access",

      handler: function (response) {
        registerCollege(response.razorpay_payment_id);
      },

      prefill: {
        email: data.collegeEmail,
        contact: data.contactNumber,
      },

      theme: { color: "#2563eb" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  /* Register API after payment success */
  const registerCollege = async (paymentId) => {
    setLoading(true);

    const payload = {
      collegeId: data.collegeId,
      collegeName: data.collegeName,
      collegeType: data.collegeType,
      country: data.country,
      stateOrProvince: data.stateOrProvince,
      city: data.city,
      postalCode: data.postalCode,
      collegeEmail: data.collegeEmail,
      contactNumber: data.countryCode + data.contactNumber,
      password: data.password,
      paymentId: paymentId,
    };

    try {
      const res = await axios.post(
        `${BACKEND_URL}/registerCollege`,
        payload
      );

      alert(res.data.message);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const baseInput =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2";
  const inputClass = (f) =>
    `${baseInput} ${
      errors[f]
        ? "border-red-500 focus:ring-red-300"
        : "border-gray-300 focus:ring-blue-500"
    }`;

  return (
    <>
      {loading && (
        <Box sx={{ width: "100%", position: "fixed", top: 0, zIndex: 50 }}>
          <LinearProgress />
        </Box>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow">
          <h2 className="text-xl font-bold text-center mb-6">
            College Registration
          </h2>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* FORM SAME AS YOURS – no UI removed */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* College Name */}
              <div>
                <input
                  placeholder="College Name"
                  className={inputClass("collegeName")}
                  onChange={(e) => handleChange("collegeName", e.target.value)}
                />
                {errors.collegeName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.collegeName}
                  </p>
                )}
              </div>

              {/* College Type */}
              <div>
                <select
                  className={inputClass("collegeType")}
                  onChange={(e) => handleChange("collegeType", e.target.value)}
                >
                  <option value="">Select College Type</option>
                  <option value="Public">Public</option>
                  <option value="Autonomous">Autonomous</option>
                </select>
                {errors.collegeType && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.collegeType}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <input
                  placeholder="Country"
                  className={inputClass("country")}
                  onChange={(e) => handleChange("country", e.target.value)}
                />
                {errors.country && (
                  <p className="text-xs text-red-500 mt-1">{errors.country}</p>
                )}
              </div>

              {/* State */}
              <div>
                <input
                  placeholder="State / Province"
                  className={inputClass("stateOrProvince")}
                  onChange={(e) =>
                    handleChange("stateOrProvince", e.target.value)
                  }
                />
                {errors.stateOrProvince && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.stateOrProvince}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <input
                  placeholder="City"
                  className={inputClass("city")}
                  onChange={(e) => handleChange("city", e.target.value)}
                />
                {errors.city && (
                  <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                )}
              </div>

              {/* Postal Code */}
              <div>
                <input
                  placeholder="Postal Code"
                  className={inputClass("postalCode")}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                />
                {errors.postalCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.postalCode}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  placeholder="Official Email"
                  className={inputClass("collegeEmail")}
                  onChange={(e) => handleChange("collegeEmail", e.target.value)}
                />
                {errors.collegeEmail && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.collegeEmail}
                  </p>
                )}
              </div>

              {/* Contact */}
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
                {errors.contactNumber && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.contactNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={`${inputClass("password")} pr-10`}
                    onChange={(e) => handleChange("password", e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Pay & Register (₹1 / Year)
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Registerpage;


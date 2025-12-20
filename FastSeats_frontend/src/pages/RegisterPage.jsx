import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Registerpage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

  /* Fetch country calling codes */
  useEffect(() => {
    const fetchCodes = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd"
        );
        const json = await res.json();

        const formatted = json
          .filter((c) => c.idd?.root && c.idd?.suffixes)
          .map((c) => ({
            name: c.name.common,
            code: `${c.idd.root}${c.idd.suffixes[0]}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountryCodes(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCodes();
  }, []);

  /* Input change handler */
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

    if (!data.contactNumber)
      e.contactNumber = "Contact number required";
    else if (!/^\d{10}$/.test(data.contactNumber))
      e.contactNumber = "Must be 10 digits";

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
        data.password
      )
    )
      e.password =
        "Min 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 symbol";

    if (data.password !== data.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...data,
      contactNumber: data.countryCode + data.contactNumber,
    };

    console.log("REGISTER DATA:", payload);
  };

  /* Tailwind helpers */
  const baseInput =
    "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2";
  const errorInput = "border-red-500 focus:ring-red-300";
  const normalInput = "border-gray-300 focus:ring-blue-500";

  const inputClass = (field) =>
    `${baseInput} ${errors[field] ? errorInput : normalInput}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow">
        <h2 className="text-xl font-bold text-center mb-6">
          College Registration
        </h2>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* College Name */}
            <div>
              <input
                placeholder="College Name"
                className={inputClass("collegeName")}
                onChange={(e) =>
                  handleChange("collegeName", e.target.value)
                }
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
                onChange={(e) =>
                  handleChange("collegeType", e.target.value)
                }
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
                onChange={(e) =>
                  handleChange("country", e.target.value)
                }
              />
              {errors.country && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.country}
                </p>
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
                onChange={(e) =>
                  handleChange("city", e.target.value)
                }
              />
              {errors.city && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.city}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <input
                placeholder="Postal Code"
                className={inputClass("postalCode")}
                onChange={(e) =>
                  handleChange("postalCode", e.target.value)
                }
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
                onChange={(e) =>
                  handleChange("collegeEmail", e.target.value)
                }
              />
              {errors.collegeEmail && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.collegeEmail}
                </p>
              )}
            </div>

            {/* Contact */}
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

            {/* Password */}
            <div>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password}
                </p>
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

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Register
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
  );
};

export default Registerpage;

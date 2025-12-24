import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { CheckCircle, CreditCard } from "lucide-react";

const AMOUNT = 100;

// ✅ Vite env variable (MUST start with VITE_)

const PaymentPage = () => {
  
  const KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const startPayment = () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please refresh.");
      return;
    }

    setLoading(true);

    const options = {
      key: KEY_ID,
      amount: AMOUNT * 100,
      currency: "INR",
      name: "SEATS-TRACKING",
      description: "College Registration Fee",

      handler: function (response) {
        // ✅ Payment success – create secure payment object
        const paymentInfo = {
          paymentId: response.razorpay_payment_id,
          isActive: true,
          planType: "1YEAR",
          planExpiry: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000
          ).toISOString(),
        };

        // 🔐 Store securely (not in URL)
        sessionStorage.setItem("paymentDone", "true");
        sessionStorage.setItem("paymentInfo", JSON.stringify(paymentInfo));

        setLoading(false);

        // ✅ Redirect WITHOUT exposing data in URL
        navigate("/register");
      },

      modal: {
        ondismiss: function () {
          setLoading(false);
        },
      },

      theme: {
        color: "#2563eb",
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <>
      {loading && (
        <Box sx={{ width: "100%", position: "fixed", top: 0, zIndex: 50 }}>
          <LinearProgress />
        </Box>
      )}

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <CreditCard className="text-blue-600" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>

          <p className="text-gray-500 mb-6">
            Pay once to activate your college account
          </p>

          {/* Amount Card */}
          <div className="border rounded-xl p-4 mb-6 bg-gray-50">
            <p className="text-sm text-gray-500">Registration Fee</p>
            <p className="text-3xl font-bold text-blue-600">₹{AMOUNT}</p>
          </div>

          {/* Benefits */}
          <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
            <li className="flex gap-2">
              <CheckCircle className="text-green-500" size={18} />
              One-year premium access
            </li>
            <li className="flex gap-2">
              <CheckCircle className="text-green-500" size={18} />
              Seat & admission management
            </li>
            <li className="flex gap-2">
              <CheckCircle className="text-green-500" size={18} />
              Secure Razorpay payment
            </li>
          </ul>

          {/* Pay Button */}
          <button
            onClick={startPayment}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            Pay ₹{AMOUNT} Securely
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Powered by Razorpay • 100% secure payments
          </p>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;

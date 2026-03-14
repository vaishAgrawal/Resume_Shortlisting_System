import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  // State for Credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [showOtp, setShowOtp] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [loading, setLoading] = useState(false); // NEW: Loading state
  
  // Data States
  const [tempAuthData, setTempAuthData] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const navigate = useNavigate();

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: "", type: "info" }), 2500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // DEBUG: Check what is actually being sent
    console.log("Attempting login with:", { email, password, role: role.toUpperCase() });

    try {
      // Step 1: Login to get token and role
      const response = await api.post("/auth/login", { email, password , role: role.toUpperCase()});
      console.log("Login success response:", response.data);
      setTempAuthData(response.data); 

      // Step 2: Trigger OTP sending on backend
      await api.post("/auth/send-otp", { email }); 
      
      setShowOtp(true);
      showToast("OTP sent to your email", "success");
    } catch (err) {
      console.error("Login Error Details:", err.response);
      showToast(err.response?.data || "Invalid credentials", "error");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await api.post("/auth/verify-otp", { email, otp: otpInput });
      
      // Persist Session
      localStorage.setItem("jwtToken", tempAuthData.token);
      localStorage.setItem("role", tempAuthData.role);
      localStorage.setItem("userId", tempAuthData.userId);
      localStorage.setItem("userName", tempAuthData.name);

      setOtpSuccess(true);
      showToast("Verification successful!", "success");
      
      setTimeout(() => {
        // Navigate based on BACKEND role
        navigate(tempAuthData.role === "RECRUITER" ? "/recruiter" : "/user-dashboard");
      }, 1000);
    } catch (err) {
      showToast("Invalid or expired OTP", "error");
    }
  };

  const handleResendOtp = async () => {
    try {
      await api.post("/auth/send-otp", { email });
      setOtpInput("");
      setOtpSuccess(false);
      showToast("OTP re-sent to your email", "success");
    } catch (err) {
      showToast("Failed to resend OTP", "error");
    }
  };

  return (
    <>
    <div className="min-h-screen flex bg-[#f7f5fb]">
      {/* Toast Notification System */}
      {toast.message ? (
        <div className="fixed top-6 right-6 z-[999]">
          <div
            className={`rounded-2xl px-5 py-3 shadow-2xl text-sm font-semibold border ${
              toast.type === "error"
                ? "bg-red-600 text-white border-red-500"
                : "bg-emerald-600 text-white border-emerald-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      {/* LEFT SIDE: Branding and Visuals */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-[#2c1b4d] via-[#3a2363] to-[#23143c] text-white px-12">
        <div className="max-w-md space-y-4 text-left">
          <div className="flex items-center gap-3">
            <img
              src="/images/graphuralogo.webp"
              alt="Graphura logo"
              className="h-20 w-auto brightness-0 invert"
            />
          </div>
          <h2 className="text-3xl font-bold leading-snug">
            Smarter Hiring Starts Here
          </h2>
          <p className="text-white/80 text-sm">
            Upload resumes, match them to job descriptions and discover the
            most relevant candidates in minutes using AI powered ranking.
          </p>
          <img
            src="/images/Aiimage.webp"
            alt="AI Resume"
            className="w-full max-w-sm rounded-xl shadow-xl animate-[float_6s_ease-in-out_infinite]"
          />
        </div>
      </div>

      {/* RIGHT SIDE: Authentication Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <a href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back
          </a>

          <div className="text-center mt-4 mb-8">
            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>
            <p className="text-gray-500 mt-2">
              Don't have an account?
              <a href="/signup" className="text-[#8b5cf6] ml-1 font-semibold">
                Sign Up
              </a>
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* ROLE TOGGLE */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setRole("user")}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  role === "user"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`flex-1 py-3 rounded-lg font-semibold transition ${
                  role === "recruiter"
                    ? "bg-[#8b5cf6] text-white shadow-md"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Recruiter
              </button>
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
              />
            </div>

            {/* PASSWORD FIELD */}
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-[#8b5cf6]">
                Forgot password?
              </a>
            </div>

            {/* LOGIN BUTTON WITH LOADING SPINNER */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Login & Continue"
              )}
            </button>
          </form>
        </div>
      </div>

      {/* OTP OVERLAY MODAL */}
      {showOtp ? (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center">
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition flex items-center justify-center"
            >
              <i className="fas fa-times"></i>
            </button>
            
            <div className="mx-auto w-28 h-28 rounded-full bg-[#f1ebff] flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#e7ddff] flex items-center justify-center">
                <i className={`fas ${otpSuccess ? "fa-check" : "fa-envelope"} text-2xl text-[#8b5cf6] transition`}></i>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-6">
              {otpSuccess ? "Verified" : "Enter OTP"}
            </h3>
            <p className="text-sm text-gray-500 mt-2">
              {otpSuccess
                ? "OTP verified successfully. Redirecting..."
                : "We have sent your OTP to your e-mail address for verification."}
            </p>
            
            <div className="mt-4">
              <input
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                className="mt-4 w-full text-center tracking-[0.6em] text-lg font-semibold border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                disabled={otpSuccess}
              />
            </div>

            <button
              type="button"
              onClick={handleVerifyOtp}
              className={`mt-6 w-full py-3 rounded-2xl text-white font-semibold text-sm tracking-widest transition ${
                otpSuccess ? "bg-emerald-500" : "bg-[#7c3aed]"
              }`}
              disabled={otpSuccess}
            >
              {otpSuccess ? "SUCCESS" : "NEXT"}
            </button>

            <div className="mt-4 text-sm text-gray-500">
              Didn't receive the OTP?{" "}
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-[#22c55e] font-semibold"
                disabled={otpSuccess}
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    <style jsx>{`
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-16px); }
      }
    `}</style>
    </>
  );
}

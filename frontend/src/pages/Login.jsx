import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [showOtp, setShowOtp] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "info" });

  const navigate = useNavigate();

  const OTP_DEMO = "123456";

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: "", type: "info" }), 2500);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem("role", role);

    if (!localStorage.getItem("userId")) {
      localStorage.setItem("userId", role === "recruiter" ? "2" : "1");
    }

    setShowOtp(true);
    setOtpInput("");
    setOtpSuccess(false);
    showToast("OTP sent to your email", "success");
  };

  const handleVerifyOtp = () => {
    if (otpSuccess) return;
    if (otpInput.trim() !== OTP_DEMO) {
      showToast("Invalid OTP. Please try again.", "error");
      return;
    }
    showToast("OTP verified. Logging in...", "success");
    setOtpSuccess(true);
    window.setTimeout(() => {
      setShowOtp(false);
      navigate(role === "recruiter" ? "/recruiter" : "/user-dashboard");
    }, 900);
  };

  const handleResendOtp = () => {
    setOtpInput("");
    setOtpSuccess(false);
    showToast("OTP re-sent to your email", "success");
  };

  return (

    <div className="min-h-screen flex bg-[#f7f5fb]">
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

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-[#2c1b4d] via-[#3a2363] to-[#23143c] text-white px-12">

        <div className="max-w-md space-y-6 text-left">

          <div className="flex items-center gap-3">
            <div className="bg-white/20 px-4 py-2 rounded-lg text-2xl font-semibold">
              AI CV
            </div>

            <div>
              <p className="text-xl font-semibold tracking-wide">RANKER</p>
              <p className="text-xs text-white/70 tracking-widest">
                SMART - FAST - PRECISE
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold leading-snug">
            Smarter Hiring Starts Here
          </h2>

          <p className="text-white/80 text-sm">
            Upload resumes, match them to job descriptions and discover the
            most relevant candidates in minutes using AI powered ranking.
          </p>

          <img
            src="/images/Aiimage.png"
            alt="AI Resume"
            className="w-full max-w-sm rounded-xl shadow-xl"
          />

        </div>

      </div>


      {/* RIGHT SIDE LOGIN */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">

        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          <a href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back
          </a>

          {/* HEADING */}
          <div className="text-center mt-4 mb-8">

            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] bg-clip-text text-transparent">
                Welcome Back
              </span>
            </h1>

            <p className="text-gray-500 mt-2">
              Don’t have an account?
              <a href="/signup" className="text-[#8b5cf6] ml-1 font-semibold">
                Sign Up
              </a>
            </p>

          </div>


          <form onSubmit={handleLogin} className="space-y-5">


            {/* ROLE */}
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


            {/* EMAIL */}
            <div>

              <label className="text-sm font-medium text-gray-700">
                Email
              </label>

              <input
                type="email"
                required
                placeholder="Enter your email"
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
              />

            </div>


            {/* PASSWORD */}
            <div>

              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <div className="relative mt-1">

                <input
                  type={showPassword ? "text" : "password"}
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



            {/* FORGOT PASSWORD */}
            <div className="text-right">

              <a href="#" className="text-sm text-[#8b5cf6]">
                Forgot password?
              </a>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-lg font-semibold transition"
            >
              Login & Continue
            </button>


           

          </form>

        </div>

      </div>

      {showOtp ? (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50 px-4">
          <div className="relative bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center">
            <button
              type="button"
              onClick={() => setShowOtp(false)}
              className="absolute top-4 right-4 h-9 w-9 rounded-full border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition flex items-center justify-center"
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="mx-auto w-28 h-28 rounded-full bg-[#f1ebff] flex items-center justify-center relative">
              <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-[#e7ddff] flex items-center justify-center">
                <i className={`fas ${otpSuccess ? "fa-check" : "fa-envelope"} text-2xl text-[#8b5cf6] transition`}></i>
              </div>
              <span className="absolute -top-1 right-3 w-7 h-7 rounded-full bg-[#8b5cf6] text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <span className="absolute top-6 -left-2 w-6 h-6 rounded-full bg-[#22c55e] text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <span className="absolute bottom-2 right-1 w-6 h-6 rounded-full bg-[#f59e0b] text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
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
                pattern="[0-9]*"
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
              Didn&apos;t receive the OTP?{" "}
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

  );
}

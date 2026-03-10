import { useState } from "react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-white text-gray-900 overflow-hidden">
      <section className="relative hidden lg:flex flex-col justify-center px-12 py-14 bg-gradient-to-br from-[#2c1b4d] via-[#3a2363] to-[#23143c] text-white overflow-hidden animate-slide-in-right lg:order-2">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.0)_45%,rgba(255,255,255,0.08)_100%)]"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/20 px-4 py-2 rounded-lg text-2xl font-semibold tracking-wide">
              AI CV
            </div>
            <div>
              <p className="text-xl font-semibold tracking-wider">RANKER</p>
              <p className="text-xs text-white/70 tracking-[0.3em]">SMART • FAST • PRECISE</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-3">Smarter Hiring Starts Here</h2>
          <p className="text-white/80 max-w-md text-sm">
            Upload resumes, match them to job descriptions, and find your best
            candidates in minutes.
          </p>
          <img
            src="/images/Aiimage.png"
            alt="AI Resume Preview"
            className="mt-8 w-full max-w-sm rounded-2xl border border-white/20 shadow-xl object-contain max-h-[300px]"
          />
        </div>
      </section>

      <section className="flex items-center justify-center px-6 py-10 bg-[#f7f5fb] animate-slide-in-right lg:order-1">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-gray-600 mt-2">
              Don&apos;t have an account?
              <a href="/signup" className="ml-2 text-brand-primary font-semibold hover:underline">
                Sign Up
              </a>
            </p>
          </div>

          <form className="space-y-5">
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg bg-white border border-gray-200 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="w-full rounded-lg bg-white border border-gray-200 px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </button>
            </div>

            <div className="text-right">
              <a href="#" className="text-sm text-brand-primary hover:underline">
                Forgot Password
              </a>
            </div>

            <button
              type="button"
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-semibold py-3 rounded-lg shadow-md transition"
            >
              Login
            </button>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="h-px bg-gray-200 flex-1"></span>
              or Continue with
              <span className="h-px bg-gray-200 flex-1"></span>
            </div>

            <button
              type="button"
              className="w-full border border-[#8b5cf6] text-[#6d28d9] py-3 rounded-lg hover:bg-[#ede9fe] transition flex items-center justify-center gap-3"
            >
              <i className="fab fa-google"></i>
              Login With Google
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

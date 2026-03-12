import { useMemo, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [username, setUsername] = useState("");

  const matchState = useMemo(() => {
    if (!password && !confirm) return "idle";
    if (!password || !confirm) return "idle";
    return password === confirm ? "match" : "mismatch";
  }, [password, confirm]);

  return (

    <div className="min-h-screen flex bg-[#f7f5fb]">

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


      {/* RIGHT SIDE */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6">

        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8">

          <a href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back
          </a>

          {/* HEADING */}
          <div className="text-center mt-4 mb-8">

            <h1 className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] bg-clip-text text-transparent">
                Create Account
              </span>
            </h1>

            <p className="text-gray-500 mt-2">
              Already have an account?
              <a href="/login" className="text-[#8b5cf6] ml-1 font-semibold">
                Login
              </a>
            </p>

          </div>


          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              if (password !== confirm) {
                alert("Passwords do not match.");
                return;
              }
              const nameParts = fullName.trim().split(" ");
              const firstName = nameParts[0] || "";
              const lastName = nameParts.slice(1).join(" ") || "";
              const profileData = {
                firstName,
                lastName,
                fullName,
                email,
                phone,
                location,
                college,
                degree,
                gradYear,
                role: role === "recruiter" ? "Recruiter" : "User"
              };
              localStorage.setItem("profileData", JSON.stringify(profileData));
              localStorage.setItem("role", role);
              alert("Registration successful! Please login.");
              window.location.href = "/login";
            }}
          >

            {/* ROLE */}
            <div className="grid grid-cols-2 gap-3">

              <button
                type="button"
                onClick={() => setRole("user")}
                className={`py-3 rounded-lg font-semibold transition ${
                  role === "user"
                    ? "bg-[#8b5cf6] text-white"
                    : "bg-[#f3f0ff] text-[#6d28d9]"
                }`}
              >
                User
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`py-3 rounded-lg font-semibold transition ${
                  role === "recruiter"
                    ? "bg-[#8b5cf6] text-white"
                    : "bg-[#f3f0ff] text-[#6d28d9]"
                }`}
              >
                Recruiter
              </button>

            </div>


            {/* USER FIELDS */}
            {role === "user" && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Username
                  </label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                    />
                  </div>

                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    College Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter college name"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Degree
                    </label>
                    <input
                      type="text"
                      placeholder="Enter degree"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Year of Graduation
                    </label>
                    <input
                      type="number"
                      placeholder="2026"
                      value={gradYear}
                      onChange={(e) => setGradYear(e.target.value)}
                      className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                    />
                  </div>

                </div>
              </>
            )}

           <div>
              <label className="text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </div>
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
              />
            </div>



            {/* PASSWORD */}
            <div className="grid md:grid-cols-2 gap-4">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-5 text-gray-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

              </div>


              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 pr-12 text-gray-800"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-5 text-gray-300"
                  >
                    {showConfirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

              </div>

            </div>


            {/* SECRET KEY */}
            {role === "recruiter" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Recruiter Secret Key
                </label>

                <input
                  type="password"
                  placeholder="Enter secret key"
                  className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-3 text-gray-800"
                />
              </div>
            )}


            <button
              type="submit"
              className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white py-3 rounded-lg font-semibold"
            >
              Create Account
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

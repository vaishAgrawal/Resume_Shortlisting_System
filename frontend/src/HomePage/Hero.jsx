export default function Hero() {
  const isAuthed = Boolean(
    localStorage.getItem("jwtToken") ||
      localStorage.getItem("role") ||
      localStorage.getItem("userId")
  );
  const dashboardHref = isAuthed
    ? localStorage.getItem("role") === "recruiter"
      ? "/recruiter"
      : "/user-dashboard"
    : "/login";

  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden bg-gradient-to-br from-[#2a1f4d] via-[#3b2a63] to-[#1f1635] text-gray-200"
    >

      {/* Background Glow */}
      <div className="absolute -top-24 -left-12 w-96 h-96 bg-[#a78bfa]/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-[#818cf8]/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="absolute inset-0 opacity-15 bg-[linear-gradient(135deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.0)_45%,rgba(255,255,255,0.06)_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 relative z-10 w-full">

        {/* LEFT CONTENT */}
        <div
          className="lg:w-1/2 text-center lg:text-left animate-slide-in-left"
          data-aos="fade-right"
          data-aos-duration="1000"
        >

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 border border-[#a78bfa]/40 rounded-full bg-white/10 backdrop-blur-sm text-[#ddd6fe] text-xs font-semibold tracking-wide uppercase">
            <span className="w-3 h-3 rounded-full bg-[#8b5cf6]"></span>
            New Generation AI
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight tracking-tight text-white">
            AI Resume <br />Checker <br />
            <span className="text-purple-300">Instant Scoring.</span>
          </h1>

          <p className="text-base lg:text-lg text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Streamline your hiring process with our advanced AI technology that
            analyzes, ranks, and shortlists resumes in seconds with human-like
            precision.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

            <a
              href="#features"
              className="group relative px-8 py-4 rounded-xl bg-[#8b5cf6] text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="relative z-10">Explore Features</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/10"></div>
            </a>

            <a
              href={dashboardHref}
              className="px-8 py-4 rounded-xl border border-[#a78bfa]/40 text-purple-200 font-semibold hover:border-[#8b5cf6] hover:bg-[#3b2a63] transition-all duration-300"
            >
               Dashboard
            </a>

          </div>
        </div>


        {/* RIGHT IMAGE */}
        <div
          className="lg:w-1/2 flex justify-center lg:justify-end animate-slide-in-right"
          data-aos="fade-left"
          data-aos-duration="1200"
        >

          <div className="relative w-full max-w-md lg:max-w-full">

            <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#818cf8] rounded-2xl blur opacity-40"></div>

            <img
              src="/images/Aiimage1.png"
              alt="AI Analysis"
              className="relative rounded-2xl shadow-2xl border border-white/20 transition duration-500 max-h-[50vh] lg:max-h-[470px] w-auto object-contain mx-auto"
            />

          </div>

        </div>

      </div>
    </section>
  );
}

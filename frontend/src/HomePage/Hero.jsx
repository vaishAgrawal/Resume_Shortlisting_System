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
      {/* Background Glows */}
      <div className="absolute -top-24 -left-12 w-96 h-96 bg-[#a78bfa]/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-[#818cf8]/40 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 relative z-10 w-full">

        {/* LEFT CONTENT */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 border border-[#a78bfa]/40 rounded-full bg-white/10 backdrop-blur-sm text-[#ddd6fe] text-xs font-semibold tracking-wide uppercase">
            <span className="w-3 h-3 rounded-full bg-[#8b5cf6] animate-pulse"></span>
            New Generation AI
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 lg:mb-6 leading-tight tracking-tight text-white">
            AI Resume <br />Checker <br />
            <span className="text-purple-300">Instant Scoring.</span>
          </h1>

          <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
            Streamline your hiring process with our advanced AI technology that
            analyzes, ranks, and shortlists resumes in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a href="#features" className="px-8 py-4 rounded-xl bg-[#8b5cf6] text-white font-bold shadow-lg hover:bg-[#7c4dff] transition-all">
              Explore Features
            </a>
            <a href={dashboardHref} className="px-8 py-4 rounded-xl border border-[#a78bfa]/40 text-purple-200 font-semibold hover:bg-white/5 transition-all">
              Dashboard
            </a>
          </div>
        </div>

        {/* RIGHT IMAGE (FLOATING) */}
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-md lg:max-w-full">
            
            {/* The Animated Glow behind the image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#818cf8] rounded-2xl blur opacity-30 animate-pulse"></div>

            {/* The Floating Image */}
            <img
              src="/images/Aiimage1.webp"
              alt="AI Analysis"
              className="relative rounded-2xl shadow-2xl border border-white/20 max-h-[50vh] lg:max-h-[470px] w-auto object-contain mx-auto animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      {/* Inline Animation Style */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#ece7ff] text-gray-900"
    >
      <div className="absolute -top-24 -left-12 w-96 h-96 bg-[#c4b5fd]/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-[#a5b4fc]/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.0)_45%,rgba(255,255,255,0.08)_100%)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-16 relative z-10 w-full">
        <div
          className="lg:w-1/2 text-center lg:text-left animate-slide-in-left"
          data-aos="fade-right"
          data-aos-duration="1000"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 border border-[#c4b5fd]/40 rounded-full bg-white/70 backdrop-blur-sm text-[#5b21b6] text-xs font-semibold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
            New Generation AI
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 lg:mb-6 leading-tight text-gray-900 tracking-tight">
            AI Resume Checker <br />
            <span className="text-gradient">Instant Scoring.</span>
          </h1>
          <p className="text-base lg:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Streamline your hiring process with our advanced AI technology that
            analyzes, ranks, and shortlists resumes in seconds with human-like
            precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              href="#features"
              className="group relative px-8 py-4 rounded-xl bg-[#8b5cf6] text-white font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="relative z-10">Explore Features</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
            </a>
            <a
              href="/recruiter"
              className="px-8 py-4 rounded-xl border border-[#8b5cf6]/40 text-[#5b21b6] font-semibold hover:border-[#8b5cf6] hover:bg-[#ede9fe] transition-all duration-300"
            >
              Recruiter Dashboard
            </a>
          </div>
        </div>
        <div
          className="lg:w-1/2 flex justify-center lg:justify-end animate-slide-in-right"
          data-aos="fade-left"
          data-aos-duration="1200"
        >
          <div className="relative w-full max-w-md lg:max-w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#93c5fd] rounded-2xl blur opacity-40"></div>
            <img
              src="/images/Aiimage1.png"
              alt="AI Analysis"
              className="relative rounded-2xl shadow-2xl border border-white/60 transition duration-500 max-h-[50vh] lg:max-h-[470px] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

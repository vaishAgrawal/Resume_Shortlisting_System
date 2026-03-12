export default function Footer() {
  return (
    // Gradient ko thoda "richer" banaya hai (f0ebff -> e6dfff)
    <footer className="bg-gradient-to-br from-[#e6dfff] via-[#dcd5ff] to-[#d4cbfb] border-t border-purple-300/50 pt-12 pb-6 relative">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
        
        {/* LOGO */}
        <div data-aos="fade-up">
          <img
            src="/images/graphuralogo.png"
            alt="Graphura"
            className="h-14 mb-4 rounded"
          />
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            Helping you shortlist top talent using AI — fast, fair and focused.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-gray-950 font-bold mb-4 border-b border-purple-400/50 inline-block pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 font-medium">
            <li><a href="/" className="hover:text-purple-700 transition-all">Home</a></li>
            <li><a href="/recruiter" className="hover:text-purple-700 transition-all">Recruiter Dashboard</a></li>
            <li><a href="/dashboard" className="hover:text-purple-700 transition-all">Analytics</a></li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div data-aos="fade-up" data-aos-delay="200">
          <h3 className="text-gray-950 font-bold mb-4 border-b border-purple-400/50 inline-block pb-1">
            Resources
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 font-medium">
            <li><a href="/documentation" className="hover:text-purple-700 transition-all">Documentation</a></li>
            <li><a href="/support" className="hover:text-purple-700 transition-all">Support</a></li>
            <li><a href="/privacy" className="hover:text-purple-700 transition-all">Privacy Policy</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div data-aos="fade-up" data-aos-delay="300">
          <h3 className="text-gray-950 font-bold mb-4 border-b border-purple-400/50 inline-block pb-1">
            Contact
          </h3>
          <p className="text-gray-700 text-sm mb-3 font-medium">
            support@graphura.in <br /> +91 73780 21327
          </p>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            Graphura India Private Limited, near RSF, Pataudi, Gurugram, Haryana 122001
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex space-x-3 mt-5">
            <a className="w-9 h-9 rounded-full bg-white/50 shadow-sm flex items-center justify-center text-purple-700 hover:bg-purple-600 hover:text-white transition-all">
              <i className="fab fa-twitter"></i>
            </a>
            <a className="w-9 h-9 rounded-full bg-white/50 shadow-sm flex items-center justify-center text-purple-700 hover:bg-purple-600 hover:text-white transition-all">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a className="w-9 h-9 rounded-full bg-white/50 shadow-sm flex items-center justify-center text-purple-700 hover:bg-purple-600 hover:text-white transition-all">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 border-t border-purple-300/50 text-center text-gray-700 text-sm font-semibold">
        © 2025-26 Graphura India Private Limited — All rights reserved.
      </div>
    </footer>
  );
}
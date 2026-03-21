export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1f1635] via-[#2a1f4d] to-[#1f1635] border-t border-white/10 pt-12 pb-6 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute -bottom-24 -left-12 w-64 h-64 bg-[#a78bfa]/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10 relative z-10">
        
        {/* LOGO SECTION */}
        <div data-aos="fade-up">
          <img
            src="/images/graphuralogo.webp"
            alt="Graphura"
            /* 'brightness-0 invert' turns any dark logo into pure white.
               'opacity-90' makes it look a bit more premium/integrated.
            */
            className="h-14 mb-4 rounded brightness-0 invert opacity-90"
          />
          <p className="text-gray-400 text-base leading-relaxed font-medium">
            Helping you shortlist top talent using AI — fast, fair and focused.
          </p>
          {/* SOCIAL ICONS */}
          <div className="flex space-x-3 mt-5">
            <a className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-[#8b5cf6] hover:text-white transition-all cursor-pointer">
              <i className="fab fa-twitter"></i>
            </a>
            <a className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-[#8b5cf6] hover:text-white transition-all cursor-pointer">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a className="w-9 h-9 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-purple-300 hover:bg-[#8b5cf6] hover:text-white transition-all cursor-pointer">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>
        </div>

        {/* QUICK LINKS */}
        <div data-aos="fade-up" data-aos-delay="100" className="lg:ml-10">
          <h3 className="text-white text-lg font-bold mb-4 border-b border-[#a78bfa]/30 inline-block pb-1">
            Quick Links
          </h3>
          <ul className="space-y-2 text-base text-gray-400 font-medium">
            <li><a href="/" className="hover:text-purple-400 transition-all">Home</a></li>
            <li><a href="/recruiter" className="hover:text-purple-400 transition-all">Dashboard</a></li>
            <li><a href="/dashboard" className="hover:text-purple-400 transition-all">Analytics</a></li>
          </ul>
        </div>

        {/* RESOURCES */}
        <div data-aos="fade-up" data-aos-delay="200" className="lg:ml-10">
          <h3 className="text-white text-lg font-bold mb-4 border-b border-[#a78bfa]/30 inline-block pb-1">
            Resources
          </h3>
          <ul className="space-y-2 text-base text-gray-400 font-medium">
            <li><a href="/documentation" className="hover:text-purple-400 transition-all">Documentation</a></li>
            <li><a href="/support" className="hover:text-purple-400 transition-all">Support</a></li>
            <li><a href="/privacy" className="hover:text-purple-400 transition-all">Privacy Policy</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div data-aos="fade-up" data-aos-delay="300" className="lg:ml-10">
          <h3 className="text-white text-lg font-bold mb-4 border-b border-[#a78bfa]/30 inline-block pb-1">
            Contact
          </h3>
          <p className="text-gray-400 text-base mb-3 font-medium">
            support@graphura.in <br /> +91 73780 21327
          </p>
          <p className="text-gray-400 text-base leading-relaxed font-medium">
            Graphura India Private Limited, near RSF, Pataudi, Gurugram, Haryana 122001
          </p>


        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-4 border-t border-white/10 text-center text-gray-500 text-base font-semibold relative z-10">
        © 2025-26 Graphura India Private Limited — All rights reserved.
      </div>
    </footer>
  );
}
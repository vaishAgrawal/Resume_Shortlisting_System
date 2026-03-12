export default function Feature() {
  return (
    <section
      id="features"
      className="py-24 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#ece7ff] relative overflow-hidden text-gray-900"
    >
      <div className="absolute -top-10 -left-20 w-72 h-72 bg-[#c4b5fd]/35 rounded-full blur-[110px]"></div>
      <div className="absolute -bottom-16 -right-10 w-72 h-72 bg-[#a5b4fc]/35 rounded-full blur-[120px]"></div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <span className="text-[#8b5cf6] font-bold tracking-wider uppercase text-sm font-body">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-2 mb-4 font-display">
            Powerful Features
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto font-body">
            Tools designed to make your hiring life easier, faster, and smarter.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: "Fast Processing",
              desc: "Process hundreds of resumes in seconds with our optimized engine.",
              icon: "fa-bolt",
              tone: "bg-yellow-100 text-yellow-500"
            },
            {
              title: "Smart Ranking",
              desc: "Automatically rank candidates based on JD relevance and keyword matching.",
              icon: "fa-trophy",
              tone: "bg-green-100 text-green-500"
            },
            {
              title: "Secure & Private",
              desc: "Enterprise-grade encryption ensures your data stays safe and confidential.",
              icon: "fa-shield-alt",
              tone: "bg-blue-100 text-blue-500"
            },
            {
              title: "Advanced Search",
              desc: "Filter candidates by skills, experience, and education instantly.",
              icon: "fa-search",
              tone: "bg-purple-100 text-purple-500"
            },
            {
              title: "Real-time Alerts",
              desc: "Get notified immediately when a top candidate applies to your role.",
              icon: "fa-bell",
              tone: "bg-red-100 text-red-500"
            },
            {
              title: "Analytics Dashboard",
              desc: "Visual insights into your hiring funnel, candidate demographics, and more.",
              icon: "fa-chart-pie",
              tone: "bg-orange-100 text-orange-500"
            }
          ].map((item, index) => (
            <div
              key={item.title}
              className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-white/60 hover:border-[#8b5cf6]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className={`w-14 h-14 ${item.tone} rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                <i className={`fas ${item.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-[#6d28d9] transition-colors font-display">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed font-body">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

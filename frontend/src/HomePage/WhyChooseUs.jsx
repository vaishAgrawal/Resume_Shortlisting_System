export default function WhyChooseUs() {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#ece7ff] relative overflow-hidden text-gray-900"
    >
      <div className="absolute -top-16 -right-16 w-72 h-72 bg-[#c4b5fd]/35 rounded-full blur-[110px]"></div>
      <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-[#a5b4fc]/35 rounded-full blur-[120px]"></div>
      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <div className="mb-20" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <div className="w-24 h-1 bg-[#8b5cf6] mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Revolutionizing the recruitment process with cutting-edge AI
            technology.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div
            className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 hover:border-[#8b5cf6]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-purple-500/20"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="w-20 h-20 mx-auto bg-[#ede9fe] border border-[#ddd6fe] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8b5cf6] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <i className="fas fa-bullseye text-3xl text-[#8b5cf6] group-hover:text-white transition-colors"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#6d28d9] transition-colors">
              Our Mission
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To provide innovative AI solutions that transform the recruitment
              process and help companies find the best talent.
            </p>
          </div>
          <div
            className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 hover:border-[#8b5cf6]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-purple-500/20"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="w-20 h-20 mx-auto bg-[#ede9fe] border border-[#ddd6fe] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8b5cf6] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <i className="fas fa-eye text-3xl text-[#8b5cf6] group-hover:text-white transition-colors"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#6d28d9] transition-colors">
              Our Vision
            </h3>
            <p className="text-gray-600 leading-relaxed">
              To become the global leader in AI-powered recruitment solutions,
              making hiring faster, fairer, and more effective.
            </p>
          </div>
          <div
            className="group bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 hover:border-[#8b5cf6]/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-purple-500/20"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="w-20 h-20 mx-auto bg-[#ede9fe] border border-[#ddd6fe] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#8b5cf6] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <i className="fas fa-chart-line text-3xl text-[#8b5cf6] group-hover:text-white transition-colors"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#6d28d9] transition-colors">
              Our Approach
            </h3>
            <p className="text-gray-600 leading-relaxed">
              We combine cutting-edge AI technology with deep industry expertise
              to deliver exceptional recruitment solutions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

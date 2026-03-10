export default function Process() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#ece7ff] relative overflow-hidden text-gray-900">
      <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#c4b5fd]/35 rounded-full blur-[110px]"></div>
      <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#a5b4fc]/35 rounded-full blur-[110px]"></div>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            How It Works
          </h2>
          <p className="text-gray-600 mt-3">
            Get from resumes to shortlisted candidates in 5 simple steps
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              step: 1,
              title: "Sign Up / SSO",
              desc: "Quick registration with Email, Google, or Microsoft authentication.",
              icon: "fa-user-plus"
            },
            {
              step: 2,
              title: "Upload Resumes",
              desc: "Bulk or folder upload with support for PDF, DOC, and DOCX formats.",
              icon: "fa-cloud-upload-alt"
            },
            {
              step: 3,
              title: "Enter Job Description",
              desc: "Upload a text file, paste or type job description for AI evaluation.",
              icon: "fa-file-alt"
            },
            {
              step: 4,
              title: "Run AI Evaluation",
              desc: "Get instant fit percentages with key matches and gaps.",
              icon: "fa-brain"
            },
            {
              step: 5,
              title: "Filter, Export & Save",
              desc: "Apply filters, export selected rows and columns, and access saved history.",
              icon: "fa-filter"
            }
          ].map((item, index) => (
            <div
              key={item.step}
              className={`relative bg-white/70 backdrop-blur-xl rounded-3xl border border-white/60 shadow-2xl p-8 text-center hover:shadow-purple-500/20 transition-all duration-300 ${
                index >= 3 ? "lg:col-start-" + (index - 2) : ""
              }`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#8b5cf6] text-white text-sm font-bold flex items-center justify-center shadow-md">
                {item.step}
              </div>
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#ede9fe] flex items-center justify-center mb-5">
                <i className={`fas ${item.icon} text-[#8b5cf6] text-xl`}></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

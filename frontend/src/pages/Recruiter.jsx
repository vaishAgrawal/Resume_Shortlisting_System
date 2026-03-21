import { useMemo, useState } from "react";

const DOMAIN_OPTIONS = [
  "Sales & Marketing",
  "Data Science & Analytics",
  "Human Resources",
  "Social Media Management",
  "Graphic Design",
  "Digital Marketing",
  "Video Editing",
  "Full Stack Developer",
  "MERN Stack Developer",
  "E-Mail & Outreaching",
  "Content Writing",
  "Content Creator",
  "UI/UX Designing",
  "Front-End Developer",
  "Back-End Developer",
];

const SKILLS_BY_DOMAIN = {
  "Sales & Marketing": ["Lead Gen", "CRM", "Cold Email", "Ads", "SEO"],
  "Data Science & Analytics": ["Python", "SQL", "Pandas", "ML", "Power BI"],
  "Human Resources": ["Recruitment", "Onboarding", "Payroll", "Compliance"],
  "Social Media Management": ["Content", "Scheduling", "Analytics"],
  "Graphic Design": ["Figma", "Adobe PS", "Branding"],
  "Digital Marketing": ["SEO", "SEM", "GA4", "Copywriting"],
  "Video Editing": ["Premiere", "After Effects", "Motion"],
  "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL"],
  "MERN Stack Developer": ["MongoDB", "Express", "React", "Node.js"],
  "E-Mail & Outreaching": ["Outreach", "Deliverability", "Copywriting"],
  "Content Writing": ["Blogs", "SEO", "Editing"],
  "Content Creator": ["Scripting", "Editing", "Publishing"],
  "UI/UX Designing": ["Figma", "Wireframes", "Prototyping"],
  "Front-End Developer": ["HTML", "CSS", "React"],
  "Back-End Developer": ["Node.js", "Python", "Java", "APIs"],
};

export default function Recruiter() {
  const [resumeFiles, setResumeFiles] = useState([]);
  const [domain, setDomain] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const maxLimit = 20;
  const remainingResumes = Math.max(0, maxLimit - resumeFiles.length);

  const availableSkills = useMemo(() => {
    if (!domain) return [];
    return SKILLS_BY_DOMAIN[domain] || [];
  }, [domain]);

  const onResumeChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > maxLimit) {
      alert("You can only upload 20 resumes.");
      event.target.value = "";
      setResumeFiles([]);
      return;
    }
    setResumeFiles(files);
  };

  const addSkill = () => {
    if (!selectedSkill) return;
    if (!skills.includes(selectedSkill)) {
      setSkills((prev) => [...prev, selectedSkill]);
    }
    setSelectedSkill("");
  };

  const removeSkill = (skill) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const clearAll = () => {
    setResumeFiles([]);
    setDomain("");
    setSkills([]);
    setSelectedSkill("");
  };

  return (
    <main className="min-h-screen font-sans text-slate-900 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#eef2ff]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-violet-200/45 blur-[120px]"></div>
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-300/40 blur-[140px]"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="text-xs font-bold tracking-[0.25em] text-violet-500 uppercase opacity-80">
                  Graphura Recruiter Suite
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                  Recruiter <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                    Dashboard
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                  Efficiently manage candidate shortlisting and job matching through a unified, AI-driven interface.
                </p>
              </div>

              {/* Upload Resumes */}
              <section className="max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Upload Resumes</h2>
                    {resumeFiles.length > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Uploaded
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    Select up to{" "}
                    <span className="font-semibold text-violet-600">
                      {remainingResumes}
                    </span>{" "}
                    resumes (PDF, DOC, DOCX) for a single account.
                  </p>

                  <label className="group block border-2 border-dashed border-violet-200 rounded-[2rem] p-10 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/40 transition-all duration-300">
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                      <i className="fas fa-cloud-upload-alt text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Drop resumes here or choose files.</h3>
                    <p className="text-sm text-slate-500 mb-6">PDF & DOCX only. Max 20 files.</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={onResumeChange}
                    />
                    <div className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-8 py-3 text-sm font-bold text-white shadow-xl shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all active:scale-95">
                      Upload Resumes
                    </div>
                  </label>

                  {resumeFiles.length > 0 && (
                    <div className="max-h-40 overflow-y-auto space-y-2 text-sm text-slate-600">
                      {resumeFiles.map((file) => (
                        <div key={file.name} className="flex justify-between bg-violet-50/60 p-2 rounded-lg">
                          <span className="truncate">{file.name}</span>
                          <span className="text-slate-400 text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Matching Criteria */}
              <section className="max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Find Your Perfect Match</h2>
                    <p className="text-sm text-slate-500 mt-2">
                      Select a Job Domain and Required Skills to find the best candidates.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Job Domain
                    </label>
                    <div className="relative">
                      <select
                        value={domain}
                        onChange={(e) => {
                          setDomain(e.target.value);
                          setSkills([]);
                        }}
                        className="w-full rounded-xl border border-violet-200 bg-white/90 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                      >
                        <option value="" disabled>
                          Select Domain
                        </option>
                        {DOMAIN_OPTIONS.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Required Skills
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={selectedSkill}
                          onChange={(e) => setSelectedSkill(e.target.value)}
                          className="w-full rounded-xl border border-violet-200 bg-white/90 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                        >
                          <option value="" disabled>
                            Select a Skill
                          </option>
                          {availableSkills.map((skill) => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={addSkill}
                        type="button"
                        className="px-5 py-3 rounded-xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition"
                      >
                        Add
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => removeSkill(skill)}
                          className="px-3 py-1.5 rounded-full bg-violet-50 text-xs font-semibold text-violet-600 border border-violet-200 hover:border-violet-400 transition"
                          type="button"
                        >
                          {skill} <span className="ml-1 text-violet-400">x</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-end gap-3">
                    <button
                      id="clearAllBtn"
                      type="button"
                      aria-label="Clear all inputs"
                      onClick={clearAll}
                      className="px-5 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50 transition"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => alert("Requirements saved (frontend only).")}
                      className="px-5 py-3 rounded-xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition"
                      type="button"
                    >
                      Save Requirements
                    </button>
                    <button
                      id="analyzeFinalBtn"
                      onClick={() => alert("Analyze candidates (frontend only).")}
                      className="px-6 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition shadow-lg shadow-violet-200"
                      type="button"
                    >
                      Analyze Candidates
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="hidden lg:block">
              <div className="relative group">
                <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-violet-400/30 via-fuchsia-300/30 to-indigo-300/30 blur-3xl group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative rounded-[2.5rem] bg-white/40 p-3 shadow-2xl backdrop-blur-2xl border border-white/50 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                  <img
                    src="/images/resume.webp"
                    alt="Recruiter dashboard preview"
                    className="w-full h-auto rounded-[2rem] shadow-sm transform group-hover:translate-y-[-5px] transition-transform duration-700"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop";
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

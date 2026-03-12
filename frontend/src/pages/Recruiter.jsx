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
  const [jdFiles, setJdFiles] = useState([]);
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

  const onJdChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > maxLimit) {
      alert("You can only upload 20 job descriptions.");
      event.target.value = "";
      setJdFiles([]);
      return;
    }
    setJdFiles(files);
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
    setJdFiles([]);
    setDomain("");
    setSkills([]);
    setSelectedSkill("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f5f3ff] via-[#faf9ff] to-[#ede9fe]">
      <div className="max-w-6xl mx-auto px-4 pt-24 md:pt-28 pb-12">
      <header className="mb-16 text-center">
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-violet-500 mb-3 block">
        Graphura Recruiter Suite
      </span>
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
        Recruiter <span className="text-violet-600">Dashboard</span>
      </h1>
      <p className="text-slate-500 mt-4 max-w-lg mx-auto">
        Efficiently manage candidate shortlisting and job matching through a unified, AI-driven interface.
      </p>
    </header>

        {/* Section 1: Upload Resumes */}
        <section className="bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-[0_25px_60px_-45px_rgba(109,40,217,0.3)] border border-violet-100 hover:border-violet-300 transition duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg md:text-xl font-semibold text-violet-950">
              1. Upload Resumes
            </h2>
            {resumeFiles.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-violet-100 text-violet-600">
                Uploaded
              </span>
            )}
          </div>
          <p className="text-violet-600/80 text-sm mb-6">
            Select up to{" "}
            <span className="font-semibold text-violet-600">
              {remainingResumes}
            </span>{" "}
            resumes (PDF, DOC, DOCX) for a single account.
          </p>
          <label className="border-2 border-dashed border-violet-200 rounded-xl p-6 md:p-10 text-center hover:bg-violet-50 hover:border-violet-400 transition cursor-pointer group block">
            <i className="fas fa-cloud-upload-alt text-3xl md:text-4xl text-violet-400 mb-4 group-hover:scale-110 transition duration-300"></i>
            <h3 className="text-base md:text-lg font-medium text-violet-900">
              Drag & Drop Resumes
            </h3>
            <p className="text-violet-400 text-xs md:text-sm mt-1">
              or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onResumeChange}
            />
          </label>
          <div className="mt-4 max-h-40 overflow-y-auto space-y-2 text-sm text-violet-700">
            {resumeFiles.map((file) => (
              <div key={file.name} className="flex justify-between bg-violet-50/50 p-2 rounded-lg">
                <span>{file.name}</span>
                <span className="text-violet-400 text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-4">
            <button
              onClick={() => alert("Upload resumes (frontend only).")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold shadow-lg shadow-violet-200 hover:shadow-violet-300 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
              type="button"
            >
              <i className="fas fa-upload"></i> Upload Resumes
            </button>
            <button
              onClick={() => alert("Extract action (frontend only).")}
              className="px-6 py-3 rounded-xl border border-violet-500 text-violet-600 hover:bg-violet-500 hover:text-white font-bold shadow-md hover:shadow-violet-200 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
              type="button"
            >
              <i className="fas fa-chart-line"></i> Extract
            </button>
          </div>
        </section>

        {/* Section 2: Upload JD */}
        <section className="bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-[0_25px_60px_-45px_rgba(109,40,217,0.3)] border border-violet-100 hover:border-violet-300 transition duration-300 animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg md:text-xl font-semibold text-violet-950">
              2. Upload Job Description
            </h2>
            {jdFiles.length > 0 && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-violet-100 text-violet-600">
                Uploaded
              </span>
            )}
          </div>
          <p className="text-violet-600/80 text-sm mb-6">
            Select up to 20 PDF/DOCX files.
          </p>
          <label className="border-2 border-dashed border-violet-200 rounded-xl p-6 md:p-10 text-center hover:bg-violet-50 hover:border-violet-400 transition cursor-pointer group block">
            <i className="fas fa-cloud-upload-alt text-3xl md:text-4xl text-violet-400 mb-4 group-hover:scale-110 transition duration-300"></i>
            <h3 className="text-base md:text-lg font-medium text-violet-900">
              Drag & Drop Job Descriptions
            </h3>
            <p className="text-violet-400 text-xs md:text-sm mt-1">
              or click to browse
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onJdChange}
            />
          </label>
          <div className="mt-4 max-h-40 overflow-y-auto space-y-2 text-sm text-violet-700">
            {jdFiles.map((file) => (
              <div key={file.name} className="flex justify-between bg-violet-50/50 p-2 rounded-lg">
                <span>{file.name}</span>
                <span className="text-violet-400 text-xs">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-4">
            <button
              onClick={() => alert("Upload JD (frontend only).")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-bold shadow-lg shadow-violet-200 hover:shadow-violet-300 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
              type="button"
            >
              <i className="fas fa-upload"></i> Upload & Auto-Extract
            </button>
          </div>
        </section>

        {/* Section 3: Matching */}
        <section className="bg-white rounded-3xl p-6 md:p-8 mb-8 shadow-[0_25px_60px_-45px_rgba(109,40,217,0.3)] border border-violet-100 animate-fade-in">
          <h2 className="text-lg md:text-xl font-semibold text-violet-950 mb-2">
            3. Find Your Perfect Match
          </h2>
          <p className="text-violet-600/80 text-sm mb-6">
            Select a Job Domain and Required Skills to Find the Best Candidates.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-violet-700 text-sm font-medium mb-2">
                Job Domain
              </label>
              <div className="relative">
                <select
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    setSkills([]);
                  }}
                  className="w-full appearance-none bg-white border border-violet-200 text-violet-900 py-3 px-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                >
                  <option value="" disabled>
                    Select Domain
                  </option>
                  {DOMAIN_OPTIONS.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-violet-400">
                  <i className="fas fa-chevron-down text-sm"></i>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-violet-700 text-sm font-medium mb-2">
                Required Skills
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full bg-white border border-violet-200 text-violet-900 py-3 px-4 rounded-xl focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
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
                  className="px-6 py-3 rounded-xl bg-violet-200 text-violet-800 font-bold hover:bg-violet-300 transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <button
                    key={skill}
                    onClick={() => removeSkill(skill)}
                    className="px-3 py-1 rounded-full bg-violet-50 text-sm text-violet-600 border border-violet-200 hover:border-violet-400 transition"
                    type="button"
                  >
                    {skill} <span className="ml-1 text-violet-400">x</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => alert("Requirements saved (frontend only).")}
              className="px-6 py-3 rounded-xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition text-center flex items-center gap-2"
              type="button"
            >
              <i className="fas fa-save"></i> Save Requirements
            </button>
          </div>
        </section>

        {/* Final Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end animate-fade-in">
          <button
            id="clearAllBtn"
            type="button"
            aria-label="Clear all inputs"
            onClick={clearAll}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-violet-300 text-violet-600 hover:bg-violet-50 transition font-medium text-center"
          >
            Clear All
          </button>
          <button
            id="analyzeFinalBtn"
            onClick={() => alert("Analyze candidates (frontend only).")}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-xl shadow-violet-200 hover:shadow-violet-400 transform hover:-translate-y-1 transition text-center"
            type="button"
          >
            Analyze Candidates
          </button>
        </div>
      </div>
    </main>
  );
}
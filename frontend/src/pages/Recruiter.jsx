import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        "Sales & Marketing": ["Market Research", "SEO", "Content Strategy", "CRM (Salesforce)", "Email Marketing", "Social Media Advertising", "Lead Generation", "Public Relations", "Brand Management"],
        "Data Science & Analytics": ["Python", "R", "SQL", "Machine Learning", "Data Visualization", "Big Data", "Statistical Analysis", "Deep Learning", "Pandas", "NumPy"],
        "Human Resources": ["Recruitment", "Onboarding", "Employee Relations", "HRIS", "Compensation & Benefits", "Labor Law", "Performance Management", "Talent Acquisition"],
        "Social Media Management": ["Instagram Marketing", "Facebook Ads", "Community Management", "TikTok Strategy", "Content Scheduling", "Analytics", "Crisis Communication", "Influencer Marketing"],
        "Digital Marketing": ["Google Ads", "SEO", "PPC", "Google Analytics", "Content Marketing", "CRO", "Email Marketing", "Marketing Automation", "HubSpot"],
        "Graphic Design": ["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Branding", "Typography", "UI/UX Design", "Print Design", "Vector Graphics", "Figma"],
        "Video Editing": ["Adobe Premiere Pro", "Final Cut Pro", "Motion Graphics", "Color Correction", "Sound Design", "After Effects", "Davinci Resolve"],
        "Full Stack Developer": ["JavaScript", "Node.js", "React", "Python", "SQL", "NoSQL", "AWS", "REST APIs", "Git"],
        "MERN Stack Developer": ["MongoDB", "Express.js", "React", "Node.js", "Redux", "REST APIs", "Mongoose", "JWT"],
        "E-Mail & Outreaching": ["Cold Emailing", "Outreach Tools", "A/B Testing", "Sequencing", "Lead Generation", "HubSpot", "Mailchimp"],
        "Content Writing": ["Blogging", "Copywriting", "SEO Content", "Technical Writing", "Editing", "Research", "Content Strategy"],
        "Content Creator": ["Videography", "Scripting", "Social Media Strategy", "Community Management", "Live Streaming", "Storytelling", "Adobe Creative Suite"],
        "UI/UX Designing": ["Figma", "Sketch", "Prototyping", "User Research", "Wireframing", "Usability Testing", "Design Systems", "Adobe XD"],
        "Front-End Developer": ["HTML/CSS", "JavaScript", "React", "Angular", "Vue", "Tailwind CSS", "Responsive Design", "Webpack", "Accessibility"],
        "Back-End Developer": ["Node.js", "Python", "Java", "Database Design", "API Development", "Security", "Microservices", "Docker"],
};

export default function Recruiter() {
  const navigate = useNavigate();
  const [resumeFiles, setResumeFiles] = useState([]);
  const [domain, setDomain] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [skills, setSkills] = useState([]);
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [isDragging, setIsDragging] = useState(false);
  const maxLimit = 20;
  const remainingResumes = Math.max(0, maxLimit - resumeFiles.length);

  const availableSkills = useMemo(() => {
    if (!domain) return [];
    return SKILLS_BY_DOMAIN[domain] || [];
  }, [domain]);

  const mergeFiles = (currentFiles, incomingFiles) => {
    const map = new Map();
    currentFiles.forEach((file) => {
      map.set(`${file.name}-${file.size}-${file.lastModified}`, file);
    });
    incomingFiles.forEach((file) => {
      map.set(`${file.name}-${file.size}-${file.lastModified}`, file);
    });
    return Array.from(map.values());
  };

  const onResumeChange = (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
    const merged = mergeFiles(resumeFiles, files);
    if (merged.length > maxLimit) {
      showToast(`You can only upload ${maxLimit} resumes.`, "error");
      event.target.value = "";
      return;
    }
    setResumeFiles(merged);
    event.target.value = "";
  };

  const onDropResumes = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length === 0) return;
    const merged = mergeFiles(resumeFiles, files);
    if (merged.length > maxLimit) {
      showToast(`You can only upload ${maxLimit} resumes.`, "error");
      return;
    }
    setResumeFiles(merged);
  };

  const removeResumeFile = (fileToRemove) => {
    setResumeFiles((prev) =>
      prev.filter(
        (file) =>
          !(
            file.name === fileToRemove.name &&
            file.size === fileToRemove.size &&
            file.lastModified === fileToRemove.lastModified
          )
      )
    );
  };

  const addSkill = () => {
    if (!selectedSkill || selectedSkill === "__all__") return;
    if (!skills.includes(selectedSkill)) {
      setSkills((prev) => [...prev, selectedSkill]);
    }
    setSelectedSkill("");
  };

  const selectAllSkills = () => {
    if (!domain) {
      showToast("Please select a job domain first.", "error");
      return;
    }
    setSkills(availableSkills);
    setSelectedSkill("__all__");
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

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    window.setTimeout(() => setToast({ message: "", type: "info" }), 2500);
  };

  const handleAnalyzeCandidates = () => {
    if (resumeFiles.length === 0 && !domain) {
      showToast("Please upload at least one resume and select a job domain first.", "error");
      return;
    }
    if (resumeFiles.length === 0) {
      showToast("Please upload at least one resume first.", "error");
      return;
    }
    if (!domain) {
      showToast("Please select a job domain first.", "error");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <main className="min-h-screen font-sans text-slate-900 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#eef2ff]">
      {toast.message ? (
        <div className="fixed top-28 right-6 z-40">
          <div
            className={`rounded-2xl px-5 py-4 text-sm font-semibold border shadow-[0_20px_50px_-20px_rgba(124,58,237,0.6)] backdrop-blur-md flex items-start gap-3 animate-[fadeInUp_0.3s_ease-out] ${
              toast.type === "error"
                ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400/70"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/70"
            }`}
          >
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold">
              {toast.type === "error" ? "!" : "✓"}
            </span>
            <div>{toast.message}</div>
          </div>
        </div>
      ) : null}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-violet-200/45 blur-[120px]"></div>
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-300/40 blur-[140px]"></div>
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-12 lg:pt-32 lg:pb-20">
          <div className="space-y-10">
            <div className="space-y-4 text-center">
              <div className="text-xs font-bold tracking-[0.25em] text-violet-500 uppercase opacity-80">
                Graphura Recruiter Suite
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                Recruiter{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                  Dashboard
                </span>
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Efficiently manage candidate shortlisting and job matching through a unified, AI-driven interface.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-start lg:items-stretch">
              <div className="space-y-8 flex flex-col items-center lg:items-stretch">
              {/* Upload Resumes */}
              <section className="w-full max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8 lg:h-full">
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

                  <label
                    onDragOver={(event) => {
                      event.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDropResumes}
                    className={`group block border-2 border-dashed rounded-[2rem] p-10 text-center cursor-pointer transition-all duration-300 ${
                      isDragging
                        ? "border-violet-500 bg-violet-100/60"
                        : "border-violet-200 hover:border-violet-400 hover:bg-violet-50/40"
                    }`}
                  >
                    <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                      <i className="fas fa-cloud-upload-alt text-2xl"></i>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Drop resumes here or choose files.</h3>
                    <p className="text-sm text-slate-500 mb-6">PDF & DOCX only. Max 20 files.</p>
                    <p className="text-xs text-slate-400 mb-4">You can select multiple files or drag and drop them here.</p>
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
                        <div
                          key={`${file.name}-${file.size}-${file.lastModified}`}
                          className="flex items-center justify-between gap-3 bg-violet-50/60 p-2 rounded-lg"
                        >
                          <span className="truncate">{file.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 text-xs">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                            <button
                              type="button"
                              onClick={() => removeResumeFile(file)}
                              aria-label={`Remove ${file.name}`}
                              className="h-7 w-7 rounded-full border border-violet-200 bg-white text-violet-500 hover:bg-violet-100 hover:text-violet-700 transition"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

            </div>

              <div className="hidden lg:flex self-start w-full justify-center items-stretch">
                <section className="w-full max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8 lg:h-full lg:min-h-[520px]">
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
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-semibold text-slate-700">
                          Required Skills
                        </label>
                        {domain &&
                        availableSkills.length > 0 &&
                        skills.length === availableSkills.length ? (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            All Selected
                          </span>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <select
                            value={selectedSkill}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "__all__") {
                                selectAllSkills();
                                return;
                              }
                              setSelectedSkill(value);
                            }}
                            className={`w-full rounded-xl border border-violet-200 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 ${
                              selectedSkill === "__all__" ? "bg-violet-100/70" : "bg-white/90"
                            }`}
                          >
                            <option value="" disabled>
                              Select a Skill
                            </option>
                            <option value="__all__">Select All </option>
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
                        onClick={handleAnalyzeCandidates}
                        className="px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-violet-200 bg-violet-600 text-white hover:bg-violet-700"
                        type="button"
                      >
                        Analyze Candidates
                      </button>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="mt-12 px-2 sm:px-6 py-16 relative overflow-hidden">
            <div className="text-center">
              <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-violet-300">
                Process
              </div>
              <h3 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#4c1d95]">
                How the Recruiter Dashboard Works<span className="text-violet-500">.</span>
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                A simple 4-step flow to upload, filter, and shortlist candidates.
              </p>
            </div>

              <div className="relative mt-24">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-violet-200/80 z-0"></div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="relative flex flex-col items-center md:h-[240px]">
                      <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:bottom-[calc(50%+100px)] md:left-1/2 md:-translate-x-1/2">
                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                          1.
                        </span>
                        <i className="fas fa-cloud-upload-alt text-lg"></i>
                      </div>
                      <div className="hidden md:block absolute left-1/2 top-[calc(50%-100px)] bottom-1/2 w-0.5 bg-violet-300 z-20"></div>
                      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                      <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:-translate-y-24 md:translate-x-6 relative z-30">
                        <div className="text-sm font-bold text-violet-900">Upload Resumes</div>
                        <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                          Upload up to 20 resumes at once to start shortlisting.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-col items-center md:h-[240px]">
                      <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:top-[calc(50%+100px)] md:left-1/2 md:-translate-x-1/2">
                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                          2.
                        </span>
                        <i className="fas fa-briefcase text-lg"></i>
                      </div>
                      <div className="hidden md:block absolute left-1/2 top-1/2 bottom-[calc(50%-100px)] w-0.5 bg-violet-300 z-20"></div>
                      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                      <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:translate-y-2 md:translate-x-6 relative z-30">
                        <div className="text-sm font-bold text-violet-900">Select Domain</div>
                        <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                          Choose the job domain to filter candidates.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-col items-center md:h-[240px]">
                      <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:bottom-[calc(50%+100px)] md:left-1/2 md:-translate-x-1/2">
                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                          3.
                        </span>
                        <i className="fas fa-check text-lg"></i>
                      </div>
                      <div className="hidden md:block absolute left-1/2 top-[calc(50%-100px)] bottom-1/2 w-0.5 bg-violet-300 z-20"></div>
                      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                      <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:-translate-y-24 md:translate-x-6 relative z-30">
                        <div className="text-sm font-bold text-violet-900">Add Skills</div>
                        <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                          Pick required skills to refine the shortlist.
                        </p>
                      </div>
                    </div>

                    <div className="relative flex flex-col items-center md:h-[240px]">
                      <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:top-[calc(50%+120px)] md:left-1/2 md:-translate-x-1/2">
                        <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                          4.
                        </span>
                        <i className="fas fa-chart-line text-lg"></i>
                      </div>
                      <div className="hidden md:block absolute left-1/2 top-1/2 bottom-[calc(50%-120px)] w-0.5 bg-violet-300 z-20"></div>
                      <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                      <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:translate-y-2 md:translate-x-6 relative z-30">
                        <div className="text-sm font-bold text-violet-900">Analyze Candidates</div>
                        <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                          Run analysis to shortlist the best matches.
                        </p>
                      </div>
                    </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}

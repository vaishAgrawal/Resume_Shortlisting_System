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
    <main className="max-w-5xl mx-auto px-4 pt-24 md:pt-28 pb-12">
      
      <header className="mb-8 md:mb-10 text-center">
        
        <h1 className="text-2xl md:text-4xl font-bold text-brand-accent mb-2">
          
          Recruiter Dashboard
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          
          Streamline your hiring with AI analysis
        </p>
      </header>
      <section className="bg-brand-card rounded-2xl p-5 md:p-8 mb-8 shadow-xl border border-gray-200/50 hover:border-brand-primary/30 transition duration-300">
        
        <div className="flex justify-between items-center mb-2">
          
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            
            1. Upload Resumes
          </h2>
          {resumeFiles.length > 0 && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400">
              
              Uploaded
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-6">
          
          Select up to
          <span className="font-semibold text-brand-accent">
            
            {remainingResumes}
          </span>
          resumes (PDF, DOC, DOCX) for a single account.
        </p>
        <label className="border-2 border-dashed border-brand-accent/40 rounded-xl p-6 md:p-10 text-center hover:bg-brand-dark/50 hover:border-brand-accent transition cursor-pointer group block">
          
          <i className="fas fa-cloud-upload-alt text-3xl md:text-4xl text-brand-accent mb-4 group-hover:scale-110 transition duration-300"></i>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            
            Drag & Drop Resumes
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            
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
        <div className="mt-4 max-h-40 overflow-y-auto space-y-2 text-sm text-gray-600">
          
          {resumeFiles.map((file) => (
            <div key={file.name} className="flex justify-between">
              
              <span>{file.name}</span>
              <span className="text-gray-500 text-xs">
                
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          
          <button
            onClick={() => alert("Upload resumes (frontend only).")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-gray-900 font-bold shadow-lg hover:shadow-brand-primary/50 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
            type="button"
          >
            
            <i className="fas fa-upload"></i> Upload Resumes
          </button>
          <button
            onClick={() => alert("Extract action (frontend only).")}
            className="px-6 py-3 rounded-lg border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-gray-900 font-bold shadow-lg hover:shadow-brand-primary/50 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
            type="button"
          >
            
            <i className="fas fa-chart-line"></i> Extract
          </button>
        </div>
      </section>
      <section className="bg-brand-card rounded-2xl p-5 md:p-8 mb-8 shadow-xl border border-gray-200/50 hover:border-brand-primary/30 transition duration-300">
        
        <div className="flex justify-between items-center mb-2">
          
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            
            2. Upload Job Description
          </h2>
          {jdFiles.length > 0 && (
            <span className="text-xs font-semibold px-2 py-1 rounded bg-green-500/20 text-green-400">
              
              Uploaded
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-6">
          
          Select up to 20 PDF/DOCX files.
        </p>
        <label className="border-2 border-dashed border-brand-accent/40 rounded-xl p-6 md:p-10 text-center hover:bg-brand-dark/50 hover:border-brand-accent transition cursor-pointer group block">
          
          <i className="fas fa-cloud-upload-alt text-3xl md:text-4xl text-brand-accent mb-4 group-hover:scale-110 transition duration-300"></i>
          <h3 className="text-base md:text-lg font-medium text-gray-900">
            
            Drag & Drop Job Descriptions
          </h3>
          <p className="text-gray-500 text-xs md:text-sm mt-1">
            
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
        <div className="mt-4 max-h-40 overflow-y-auto space-y-2 text-sm text-gray-600">
          
          {jdFiles.map((file) => (
            <div key={file.name} className="flex justify-between">
              
              <span>{file.name}</span>
              <span className="text-gray-500 text-xs">
                
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end gap-4">
          
          <button
            onClick={() => alert("Upload JD (frontend only).")}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-gray-900 font-bold shadow-lg hover:shadow-brand-primary/50 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
            type="button"
          >
            
            <i className="fas fa-upload"></i> Upload & Auto-Extract
          </button>
        </div>
      </section>
      <section className="bg-brand-card rounded-2xl p-5 md:p-8 mb-8 shadow-xl border border-gray-200/50">
        
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          
          3. Find Your Perfect Match
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          
          Select a Job Domain and Required Skills to Find the Best
          Candidates.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            
            <label className="block text-gray-600 text-sm font-medium mb-2">
              
              Job Domain
            </label>
            <div className="relative">
              
              <select
                value={domain}
                onChange={(e) => {
                  setDomain(e.target.value);
                  setSkills([]);
                }}
                className="w-full appearance-none bg-brand-dark border border-brand-accent/30 text-gray-900 py-3 px-4 rounded-lg focus:outline-none focus:border-brand-accent"
              >
                
                <option value="" disabled>
                  
                  Select Domain
                </option>
                {DOMAIN_OPTIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brand-accent">
                
                <i className="fas fa-chevron-down text-sm"></i>
              </div>
            </div>
          </div>
          <div>
            
            <label className="block text-gray-600 text-sm font-medium mb-2">
              
              Required Skills
            </label>
            <div className="flex gap-2 mb-3">
              
              <div className="relative flex-1">
                
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-accent/30 text-gray-900 py-3 px-4 rounded-lg focus:outline-none focus:border-brand-accent"
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
                className="px-4 py-3 rounded-lg bg-brand-accent text-brand-dark font-bold"
              >
                
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              
              {skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => removeSkill(skill)}
                  className="px-3 py-1 rounded-full bg-brand-dark text-sm text-brand-accent border border-brand-accent/40"
                  type="button"
                >
                  
                  {skill} <span className="ml-1">x</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          
          <button
            onClick={() => alert("Requirements saved (frontend only).")}
            className="px-6 py-3 rounded-lg bg-brand-accent text-brand-dark font-bold shadow-lg hover:shadow-brand-accent/50 transform hover:-translate-y-1 transition text-center flex items-center gap-2"
            type="button"
          >
            
            <i className="fas fa-save"></i> Save Requirements
          </button>
        </div>
      </section>
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        
        <button
          id="clearAllBtn"
          type="button"
          aria-label="Clear all inputs"
          onClick={clearAll}
          className="w-full sm:w-auto px-6 py-3 rounded-lg border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-dark transition font-medium text-center"
        >
          
          Clear All
        </button>
        <button
          id="analyzeFinalBtn"
          onClick={() => alert("Analyze candidates (frontend only).")}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-gradient-to-r from-brand-primary to-brand-accent text-gray-900 font-bold shadow-lg hover:shadow-brand-primary/50 transform hover:-translate-y-1 transition text-center"
          type="button"
        >
          
          Analyze Candidates
        </button>
      </div>
    </main>
  );
}


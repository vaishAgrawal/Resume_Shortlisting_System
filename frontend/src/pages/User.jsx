import { useEffect, useState } from "react";
import {
  Upload,
  FileText,
  LayoutGrid,
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  Briefcase,
  GraduationCap,
  Award,
  Link,
  Github,
  Mail,
  Phone,
  User as UserIcon
} from "lucide-react";
import api from "../api/axios";

export default function ResumeAnalyzerDashboard() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [jobDomain, setJobDomain] = useState("");
  const [availableDomains, setAvailableDomains] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [openContentRow, setOpenContentRow] = useState(null);
  const [error, setError] = useState(null);
  const [showFullReport, setShowFullReport] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(null);
  
  const score = analysisResult?.overallScore || 0;
  const radius = 50;
  const halfCircumference = Math.PI * radius;
  const gaugeOffset = halfCircumference - halfCircumference * (score / 100);

  const analysisSteps = [
    "Parsing your resume",
    "Analyzing your experience",
    "Extracting your skills",
    "Generating recommendations"
  ];
  const reportRows = analysisResult?.breakdown || [];
  const contentChecks = analysisResult?.breakdown?.map(item => ({
    label: item.category,
    status: item.score >= (item.total * 0.8) ? "good" : item.score >= (item.total * 0.5) ? "warn" : "bad",
    detail: item.feedback
  })) || [];

  const scoreBuckets = reportRows.map(item => ({
    label: item.category,
    score: Math.round((item.score / item.total) * 100)
  }));
  const actionVerbs = [
    { label: "Led", status: "good" },
    { label: "Responsible for", status: "good" },
    { label: "Implemented", status: "bad" },
    { label: "Worked on", status: "bad" }
  ];
  const highlightSections = [
    {
      label: "Experience",
      status: analysisResult?.experience?.length > 0 ? "Verified" : "Missing",
      verified: analysisResult?.experience?.length > 0,
      detail: `${analysisResult?.experience?.length || 0} roles found`,
      suggestions: analysisResult?.experience?.length === 0 ? ["No work experience extracted."] : []
    },
    {
      label: "Education",
      status: analysisResult?.education?.length > 0 ? "Verified" : "Missing",
      verified: analysisResult?.education?.length > 0,
      detail: `${analysisResult?.education?.length || 0} degrees found`,
      suggestions: analysisResult?.education?.length === 0 ? ["No education details extracted."] : []
    },
    {
      label: "Skills",
      status: analysisResult?.extractedSkills?.length > 0 ? "Verified" : "Missing",
      verified: analysisResult?.extractedSkills?.length > 0,
      detail: `${analysisResult?.extractedSkills?.length || 0} skills found`,
      suggestions: analysisResult?.extractedSkills?.length === 0 ? ["No skills extracted."] : []
    }
  ];
  const highlightSuggestions = highlightSections.filter((section) => section.suggestions.length > 0);


  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 1. Fetch available domains
        const domainRes = await api.get("/dashboard/domains");
        setAvailableDomains(domainRes.data);

        // 2. Fetch latest analysis result
        console.log("DEBUG: Checking for previous analysis...");
        const latestRes = await api.get("/dashboard/latest");
        console.log("DEBUG: Latest Analysis Response Status:", latestRes.status);
        if (latestRes.status === 200 && latestRes.data && latestRes.data.overallScore !== undefined) {
          console.log("DEBUG: Restoring previous analysis result.");
          setAnalysisResult(latestRes.data);
          setRemainingCredits(latestRes.data.remainingCredits);
          setAnalyzed(true);
        } else if (latestRes.status === 200 && latestRes.data) {
          // If no analysis but we have other data (like credits)
          setRemainingCredits(latestRes.data.remainingCredits);
        } else {
          console.log("DEBUG: No previous analysis found or response was empty.");
        }
      } catch (err) {
        console.error("Failed to fetch initial dashboard data:", err);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) return;
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= analysisSteps.length) return prev;
        return prev + 1;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [loading, analysisSteps.length]);

  const analyzeResume = async () => {
    console.log("Analyze button clicked. File:", file?.name, "Domain:", jobDomain);
    if (!file || !jobDomain) {
      console.warn("Analysis cancelled: missing file or domain.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setActiveStep(0);
    
    try {
      // 1. Upload Resume
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("jwtToken");
      console.log("DEBUG: Analysis Start. UserID:", userId, "Token Present:", !!token);
      if (token) console.log("DEBUG: Token starts with:", token.substring(0, 20) + "...");
      if (!userId) throw new Error("User ID not found in session. Please log in again.");
      
      const formData = new FormData();
      formData.append("files", file); // Backend expects "files" (plural)
      
      console.log(`Sending upload request to: /resumes/upload/${userId}`);
      const uploadRes = await api.post(`/resumes/upload/${userId}`, formData);
      
      console.log("Upload response:", uploadRes.data);
      if (!uploadRes.data || uploadRes.data.length === 0) {
        throw new Error("Backend saved no resumes. Is the file too large or corrupted?");
      }
      
      const resumeId = uploadRes.data[0].id;
      console.log("Extracted Resume ID:", resumeId);
      
      // 2. Start Analysis
      const analysisRes = await api.post("/dashboard/analyze", {
        resumeId,
        domain: jobDomain
      });
      
      console.log("Analysis results received:", analysisRes.data);
      setAnalysisResult(analysisRes.data);
      setRemainingCredits(analysisRes.data.remainingCredits);
      setAnalyzed(true);
    } catch (err) {
      console.error("DEBUG: FULL ERROR OBJECT:", err);
      if (err.response) {
        console.error("DEBUG: BACKEND RESPONSE DATA:", JSON.stringify(err.response.data, null, 2));
        console.error("DEBUG: STATUS:", err.response.status);
      }
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleContentRow = (index) => {
    setOpenContentRow((prev) => (prev === index ? null : index));
  };

  return (
    <main className="min-h-screen font-sans text-slate-900 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#eef2ff]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-violet-200/45 blur-[120px]"></div>
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-300/40 blur-[140px]"></div>
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
        
          {!analyzed && !loading && (
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center animate-in fade-in duration-500">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-[0.2em] text-violet-600 uppercase">
                    Resume Checker
                  </div>
                  {remainingCredits !== null && (
                    <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border shadow-sm transition-all ${
                      remainingCredits > 0 
                        ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                        : "bg-rose-50 border-rose-100 text-rose-700 animate-pulse"
                    }`}>
                      <Award className={`h-4 w-4 ${remainingCredits > 0 ? "text-emerald-500" : "text-rose-500"}`} />
                      <span className="text-xs font-bold">
                        {remainingCredits} Free Credits Left
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Is your resume good enough?
                </h1>
                <p className="text-lg text-slate-600 max-w-xl">
                  A free and fast AI resume checker doing 16 crucial checks to ensure your resume
                  is ready to perform and get you interview callbacks.
                </p>

                <section className="max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8">
                  <div className="space-y-6">
                    {!file ? (
                      <label className="block border-2 border-dashed border-violet-300 rounded-2xl p-8 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50/60 transition-all">
                        <Upload className="mx-auto w-10 h-10 text-violet-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900">Drop your resume here or choose a file.</h3>
                        <p className="text-sm text-slate-500 mt-2">PDF & DOCX only. Max 2MB file size.</p>
                        <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                        <div className="mt-6 inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-violet-700 transition">
                          Upload Your Resume
                        </div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                            <CheckCircle2 className="h-4 w-4" />
                          </span>
                          Privacy guaranteed
                        </div>
                      </label>
                    ) : (
                      <div className="flex items-center gap-4 rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-3">
                        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <FileText className="h-5 w-5 text-violet-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-800">Resume Uploaded</p>
                          <p className="text-xs text-slate-500 truncate">{file.name}</p>
                        </div>
                        <button onClick={() => setFile(null)} className="text-xs text-rose-500 font-semibold underline">Change</button>
                      </div>
                    )}

                    {file ? (
                      <>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Choose Job Domain</label>
                          <select
                            value={jobDomain}
                            onChange={(e) => setJobDomain(e.target.value)}
                            className="w-full rounded-xl border border-violet-200 bg-white/90 px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400"
                          >
                            <option value="" disabled>Select a domain</option>
                            {availableDomains.length > 0 ? (
                              availableDomains.map((domain) => (
                                <option key={domain} value={domain}>
                                  {domain}
                                </option>
                              ))
                            ) : (
                              <option disabled>Loading domains...</option>
                            )}
                          </select>
                        </div>

                        {remainingCredits === 0 ? (
                          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                            <p className="text-sm font-bold text-rose-700">You've used all your free credits!</p>
                            <p className="text-xs text-rose-600 mt-1">Upgrade to Premium to continue analyzing resumes.</p>
                            <button className="mt-4 w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition shadow-lg">
                              View Pricing
                            </button>
                          </div>
                        ) : jobDomain ? (
                          <button onClick={analyzeResume} className="w-full px-10 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition">
                            Analyze Now
                          </button>
                        ) : (
                          <div className="text-center text-sm text-slate-500 font-semibold">
                            Select a job domain to continue.
                          </div>
                        )}
                      </>
                    ) : null}
                  </div>
                </section>
              </div>

              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-xl">
                  <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-emerald-300/40 via-violet-300/40 to-sky-200/40 blur-2xl"></div>
                  <div className="relative rounded-[28px] bg-white/70 p-5 shadow-[0_35px_80px_-45px_rgba(30,41,59,0.45)] backdrop-blur-xl border border-white/70">
                    <img
                      src="/images/resume.webp"
                      alt="Resume analysis preview"
                      className="w-full rounded-2xl shadow-xl animate-[float_7s_ease-in-out_infinite]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-8 p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6" />
                <h3 className="font-bold">Analysis Error</h3>
              </div>
              <p className="mt-2 text-sm">{error}</p>
              <button onClick={() => setLoading(false)} className="mt-4 text-sm font-bold underline">Try Again</button>
            </div>
          )}

        {loading && (
          <div className="py-12 lg:py-6">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-stretch animate-in fade-in duration-500">
              <div className="rounded-[28px] bg-white/80 border border-slate-200 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.35)] p-8 backdrop-blur">
                <div className="text-center space-y-5">
                  <p className="text-lg font-semibold text-slate-700">Your Score</p>
                  <div className="relative mx-auto h-32 w-32">
                    <div className="absolute inset-0 rounded-full border-[14px] border-slate-200"></div>
                    <div className="absolute inset-0 rounded-full border-[14px] border-emerald-400 [clip-path:inset(0_0_50%_0)]"></div>
                    <div className="absolute left-1/2 top-1/2 h-1 w-10 -translate-y-1/2 origin-left rotate-[-20deg] rounded-full bg-slate-400"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="mx-auto h-3 w-28 rounded-full bg-slate-200 shimmer"></div>
                    <div className="mx-auto h-3 w-24 rounded-full bg-slate-200 shimmer"></div>
                  </div>
                </div>
                <div className="my-8 h-px bg-slate-200"></div>
                <div className="space-y-5 text-sm text-slate-500">
                  {["Content", "Section", "ATS Essentials", "Tailoring"].map((label) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="uppercase tracking-[0.12em] font-semibold text-xs">{label}</span>
                      <span className="h-3 w-12 rounded-full bg-slate-200 shimmer"></span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 h-10 w-full rounded-xl bg-slate-200 shimmer"></div>
              </div>

              <div className="rounded-[28px] bg-[#e8edf7] border border-white/70 shadow-[0_35px_70px_-55px_rgba(15,23,42,0.35)] p-8">
                <div className="space-y-7 text-slate-700">
                  {analysisSteps.map((text, index) => (
                    <div key={text} className="flex items-start gap-4">
                      <div
                        className={`mt-1 h-8 w-8 rounded-full border-2 flex items-center justify-center ${
                          index < activeStep
                            ? "bg-violet-500 border-violet-500 text-white"
                            : index === activeStep
                              ? "border-violet-400 text-violet-500 analysis-dot"
                              : "border-slate-300 text-slate-400"
                        }`}
                      >
                        {index < activeStep ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-bold">o</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-lg font-semibold ${
                            index === activeStep ? "analysis-step text-slate-900" : "text-slate-600"
                          }`}
                        >
                          {text}
                        </p>
                        {index === 1 && <div className="mt-6 h-px bg-white/70"></div>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 h-2 w-full rounded-full bg-white/70 overflow-hidden">
                  <div className="h-full w-1/3 rounded-full bg-violet-400/70 progress-bar"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {analyzed && !loading && (
          <div className="animate-in fade-in duration-700">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.7fr]">
              <div className="rounded-[28px] bg-white/90 backdrop-blur border border-white/70 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.4)] p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-slate-600">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">R</div>
                    <span className="text-lg font-semibold">ResumeIQ</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {remainingCredits !== null && (
                      <div className="px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 font-bold text-[10px] uppercase tracking-wider shadow-sm">
                        {remainingCredits} Credits Left
                      </div>
                    )}
                    <button 
                      onClick={() => {
                        setAnalyzed(false);
                        setAnalysisResult(null);
                        setFile(null);
                        setJobDomain("");
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 transition-all font-bold text-xs border border-violet-100 shadow-sm"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      New Analysis
                    </button>
                  </div>
                </div>

                <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="text-center">
                    <p className="text-base font-semibold text-slate-700">Optimization Report</p>
                    <div className="relative mx-auto mt-6 h-28 w-56">
                      <svg viewBox="0 0 120 60" className="h-full w-full">
                        <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                        <path
                          d="M10 60 A50 50 0 0 1 110 60"
                          fill="none"
                          stroke="#22c55e"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${halfCircumference} ${halfCircumference}`}
                          strokeDashoffset={gaugeOffset}
                        />
                      </svg>
                      <div className="absolute left-1/2 top-[52%] h-1 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500"></div>
                    </div>
                    <div className="mt-2 text-2xl font-extrabold text-emerald-600">{score}/100</div>
                    <p className="text-sm text-slate-500">{reportRows.filter((r) => r.tone !== "good").length} Issues</p>
                    <p className="text-xs text-slate-500 mt-1">15 Areas for Review</p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      <span>Content</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">90%</span>
                    </div>
                    <div className="mt-4 space-y-3">
                      {contentChecks.map((item, index) => {
                        const isOpen = openContentRow === index;
                        return (
                          <div key={item.label} className="rounded-2xl border border-transparent bg-white/60 px-3 py-2">
                            <button
                              type="button"
                              onClick={() => toggleContentRow(index)}
                              className="flex w-full items-center justify-between text-sm text-slate-600"
                            >
                              <div className="flex items-center gap-2">
                                {item.status === "good" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                {item.status === "noraml" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                                {item.status === "bad" && <XCircle className="h-4 w-4 text-rose-500" />}
                                <span>{item.label}</span>
                              </div>
                              <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isOpen && <p className="mt-2 text-xs text-slate-500">{item.detail}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {scoreBuckets.map((bucket) => (
                    <div key={bucket.label} className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                      <span>{bucket.label}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 ${
                          bucket.score >= 85
                            ? "bg-emerald-50 text-emerald-600"
                            : bucket.score >= 70
                              ? "bg-amber-50 text-amber-600"
                              : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {bucket.score}%
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setShowFullReport(!showFullReport)}
                  className="mt-8 w-full rounded-2xl bg-slate-900 text-white font-semibold py-3 hover:bg-slate-800 transition"
                >
                  {showFullReport ? "Hide Detailed Report" : "View Detailed Report"}
                </button>

                <button 
                  onClick={() => {
                    setAnalyzed(false);
                    setAnalysisResult(null);
                    setFile(null);
                    setJobDomain("");
                  }}
                  className="mt-4 w-full rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-bold py-3 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Analyze Another Resume
                </button>
              </div>

              <div className="space-y-6">
                {/* Dynamic Professional Summary */}
                {analysisResult?.professionalSummary && (
                  <div className="rounded-[28px] bg-white/90 backdrop-blur border border-white/70 shadow-sm p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">Professional Summary</p>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{analysisResult.professionalSummary}"
                    </p>
                  </div>
                )}
                <div className="rounded-[28px] bg-[#e8edf7] border border-white/70 shadow-[0_35px_80px_-55px_rgba(15,23,42,0.35)] p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <LayoutGrid className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">Content Breakdown</p>
                        <p className="text-sm text-slate-600">Keyword Density</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">9 Issues Found</span>
                  </div>

                  <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>Keyword Density</span>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="mt-4 h-3 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"></div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                      <span>Missing: SEO Strategist Terms</span>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600 font-semibold">Optimal</span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 text-xs font-semibold">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">Missing: SEO Strategist Terms</span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Analyze Data</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] bg-[#e8edf7] border border-white/70 shadow-[0_35px_80px_-55px_rgba(15,23,42,0.35)] p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">Readability Score</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">9 Issues Found</span>
                  </div>

                  <div className="mt-6 grid gap-5 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-2xl bg-white p-6 shadow-sm text-center">
                      <div className="relative mx-auto h-24 w-24">
                        <svg viewBox="0 0 120 120" className="h-full w-full">
                          <circle cx="60" cy="60" r="46" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                          <circle
                            cx="60"
                            cy="60"
                            r="46"
                            fill="none"
                            stroke="#f87171"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray="289"
                            strokeDashoffset="110"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-slate-600">
                          Good
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700">Project</p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                      <p className="text-sm font-semibold text-slate-700">Action Verbs</p>
                      <div className="mt-4 space-y-3">
                        {actionVerbs.map((verb) => (
                          <div key={verb.label} className="flex items-center justify-between text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              {verb.status === "good" ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-rose-500" />
                              )}
                              <span>{verb.label}</span>
                            </div>
                            <div className={`h-5 w-5 rounded-full ${verb.status === "good" ? "bg-emerald-100" : "bg-rose-100"} flex items-center justify-center`}>
                              {verb.status === "good" ? (
                                <CheckCircle2 className={`h-3 w-3 ${verb.status === "good" ? "text-emerald-600" : "text-rose-600"}`} />
                              ) : (
                                <XCircle className="h-3 w-3 text-rose-600" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] bg-white/90 backdrop-blur border border-white/70 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.35)] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">Extracted Details</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Experience Section */}
                    {analysisResult?.experience?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <Briefcase className="h-4 w-4 text-violet-500" /> Work Experience
                        </h4>
                        <div className="grid gap-4">
                          {analysisResult.experience.map((exp, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100">
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900">{exp.jobTitle}</h5>
                                <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-full text-slate-500 shadow-sm border border-slate-50">
                                  {exp.startDate} - {exp.isCurrent ? "Present" : exp.endDate}
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-violet-600 mt-0.5">{exp.company}</p>
                              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{exp.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education Section */}
                    {analysisResult?.education?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <GraduationCap className="h-4 w-4 text-indigo-500" /> Education
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {analysisResult.education.map((edu, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                              <h5 className="font-bold text-slate-900 text-sm">{edu.degree}</h5>
                              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{edu.institution}</p>
                              <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] text-slate-500">{edu.fieldOfStudy}</span>
                                {edu.gpa && <span className="text-[10px] font-bold text-emerald-600">GPA: {edu.gpa}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Projects Section */}
                    {analysisResult?.projects?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <Award className="h-4 w-4 text-emerald-500" /> Projects
                        </h4>
                        <div className="grid gap-4">
                          {analysisResult.projects.map((proj, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-emerald-50/30 border border-emerald-100/50">
                              <div className="flex justify-between items-start">
                                <h5 className="font-bold text-slate-900">{proj.title}</h5>
                                {proj.url && (
                                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-700 transition">
                                    <Link className="h-3.5 w-3.5" />
                                  </a>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-emerald-700/70 mt-1 uppercase tracking-wider">{proj.tools}</p>
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{proj.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills Section */}
                    {analysisResult?.extractedSkills?.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <CheckCircle2 className="h-4 w-4 text-amber-500" /> Extracted Skills
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.extractedSkills.map((skill, i) => (
                            <span key={i} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-600 shadow-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: 200px 0; }
        }
        @keyframes pulseFade {
          0%, 100% { opacity: 0.4; transform: translateY(4px); }
          50% { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(320%); }
        }
        .shimmer {
          background-image: linear-gradient(90deg, rgba(226,232,240,0.6) 0%, rgba(255,255,255,0.9) 50%, rgba(226,232,240,0.6) 100%);
          background-size: 200px 100%;
          animation: shimmer 1.6s ease-in-out infinite;
        }
        .analysis-step {
          animation: pulseFade 2.4s ease-in-out infinite;
        }
        .analysis-dot {
          animation: pulseFade 2.4s ease-in-out infinite;
        }
        .progress-bar {
          animation: progress 2.6s ease-in-out infinite;
        }

        @keyframes reportRow {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .report-card {
          animation: reportRow 0.5s ease forwards;
        }
        @keyframes fillBar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .score-bar {
          transform-origin: left;
          background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
          animation: fillBar 0.8s ease forwards;
        }

        @keyframes contentItem {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .content-item {
          animation: contentItem 0.45s ease forwards;
        }
        @keyframes fillBar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .score-bar {
          transform-origin: left;
          animation: fillBar 0.9s ease forwards;
        }

        @keyframes contentItem {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .content-item {
          animation: contentItem 0.45s ease forwards;
        }
        @keyframes detailCard {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .detail-card {
          animation: detailCard 0.5s ease forwards;
        }
        @keyframes fillBar {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .detail-bar {
          transform-origin: left;
          background: linear-gradient(90deg, #8b5cf6 0%, #a78bfa 100%);
          animation: fillBar 0.9s ease forwards;
        }
      `}</style>
    </main>
  );
}

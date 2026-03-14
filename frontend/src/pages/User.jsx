import { useEffect, useState } from "react";
import { Upload, FileText } from "lucide-react";

export default function ResumeAnalyzerDashboard() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score] = useState(75);
  const [jobDomain, setJobDomain] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  const analysisSteps = [
    "Parsing your resume",
    "Analyzing your experience",
    "Extracting your skills",
    "Generating recommendations"
  ];
  const reportRows = [
    { category: "Format", feedback: "Excellent.", score: 15, total: 15, tone: "good" },
    { category: "Contact", feedback: "Complete.", score: 5, total: 5, tone: "good" },
    { category: "Summary", feedback: "Profile overview check.", score: 10, total: 10, tone: "good" },
    { category: "Skills", feedback: "No skills extracted.", score: 0, total: 15, tone: "bad" },
    { category: "Experience", feedback: "Add quantified achievements (numbers/%) to boost score.", score: 10, total: 20, tone: "warn" },
    { category: "Projects", feedback: "Good projects.", score: 15, total: 15, tone: "good" },
    { category: "Education", feedback: "Verified.", score: 10, total: 10, tone: "good" },
    { category: "Certifications", feedback: "Verified.", score: 5, total: 5, tone: "good" },
    { category: "Tone/Grammar", feedback: "Professional tone check.", score: 5, total: 5, tone: "good" }
  ];

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

  const analyzeResume = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2500);
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
                <div className="text-xs font-semibold tracking-[0.2em] text-violet-600 uppercase">
                  Resume Checker
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
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-600">✓</span>
                          Privacy guaranteed
                        </div>
                      </label>
                    ) : (
                      <div className="text-center space-y-4">
                        <FileText className="mx-auto w-12 h-12 text-violet-600" />
                        <p className="font-bold text-lg">{file.name}</p>
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
                            <option value="software">Software Engineering</option>
                            <option value="data">Data & Analytics</option>
                            <option value="product">Product Management</option>
                            <option value="design">UI/UX Design</option>
                            <option value="marketing">Marketing</option>
                            <option value="sales">Sales</option>
                            <option value="finance">Finance</option>
                            <option value="hr">HR & Recruiting</option>
                          </select>
                        </div>

                        {jobDomain ? (
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
                      src="/images/resume.png"
                      alt="Resume analysis preview"
                      className="w-full rounded-2xl shadow-xl animate-[float_7s_ease-in-out_infinite]"
                    />
                  </div>
                </div>
              </div>
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
                        <span className="text-sm font-bold">✓</span>
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
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.6fr]">
              <div className="bg-white/90 backdrop-blur rounded-3xl border border-violet-100 shadow-sm p-6 sm:p-8">
                <div className="text-center">
                  <p className="text-lg font-semibold text-slate-700">Your Score</p>
                  <div className="mt-3 text-3xl sm:text-4xl font-extrabold text-violet-700">{score}/100</div>
                  <p className="text-sm text-slate-500 mt-1">{reportRows.filter((r) => r.tone !== "good").length} Issues</p>
                </div>

                <div className="my-6 h-px bg-violet-100"></div>

                <div className="space-y-4">
                  {reportRows.map((row, index) => {
                    const pct = Math.round((row.score / row.total) * 100);
                    return (
                      <div key={row.category} className="flex items-center justify-between gap-3 content-item" style={{ animationDelay: `${index * 0.06}s` }}>
                        <div className="flex items-center gap-2">
                          <span className={`text-lg ${row.tone === "good" ? "text-emerald-500" : row.tone === "warn" ? "text-amber-500" : "text-rose-500"}`}>
                            {row.tone === "good" ? "?" : "?"}
                          </span>
                          <span className="text-sm text-slate-700">{row.category}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${row.tone === "good" ? "bg-emerald-50 text-emerald-600" : row.tone === "warn" ? "bg-amber-50 text-amber-600" : "bg-rose-50 text-rose-600"}`}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button className="mt-8 w-full rounded-2xl bg-violet-600 text-white font-semibold py-3 hover:bg-violet-700 transition">
                  Unlock Full Report
                </button>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-3xl border border-violet-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center font-bold">C</div>
                    <h2 className="text-lg font-semibold text-slate-800">Content Checks</h2>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-sm font-semibold">{reportRows.length} checks</span>
                </div>

                <div className="mt-6 space-y-4">
                  {reportRows.map((row, index) => {
                    const pct = Math.round((row.score / row.total) * 100);
                    return (
                      <div key={row.category} className="bg-white rounded-2xl border border-violet-100 p-5 detail-card" style={{ animationDelay: `${index * 0.07}s` }}>
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-semibold text-slate-800">{row.category}</h3>
                          <span className={`text-xs font-semibold ${row.tone === "good" ? "text-emerald-600" : row.tone === "warn" ? "text-amber-600" : "text-rose-600"}`}>{row.score}/{row.total}</span>
                        </div>
                        <p className={`mt-2 text-sm ${row.tone === "good" ? "text-emerald-600" : row.tone === "warn" ? "text-amber-600" : "text-rose-600"}`}>{row.feedback}</p>
                        <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full detail-bar" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
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

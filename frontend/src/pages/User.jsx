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
  Award,
  Link,
  Github,
  Mail,
  Phone,
  User as UserIcon,
  Target,
  Lock,
  Unlock,
  Lightbulb,
  History,
  Download,
  X
} from "lucide-react";
import api from "../api/axios";

export default function ResumeAnalyzerDashboard() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // User Inputs
  const [jobDomain, setJobDomain] = useState("");
  const [jdText, setJdText] = useState(""); 
  const [availableDomains, setAvailableDomains] = useState([]);
  
  const [activeStep, setActiveStep] = useState(0);
  const [openContentRow, setOpenContentRow] = useState(null);
  const [error, setError] = useState(null);
  const [showFullReport, setShowFullReport] = useState(false);
  
  // Subscription States
  const [remainingCredits, setRemainingCredits] = useState(null);
  const [userPlan, setUserPlan] = useState("FREE");
  
  // Feature States
  const [showPricing, setShowPricing] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const score = analysisResult?.totalScore || 0;
  const radius = 50;
  const halfCircumference = Math.PI * radius;
  const gaugeOffset = halfCircumference - halfCircumference * (score / 100);

  const analysisSteps = [
    "Parsing your resume and JD",
    "Semantic keyword matching",
    "Calculating ATS score",
    "Generating AI recommendations"
  ];

  const reportRows = analysisResult?.sectionScores || [];
  const contentChecks = reportRows.map(item => ({
    label: item.category,
    status: item.score >= (item.maxScore * 0.8) ? "good" : item.score >= (item.maxScore * 0.5) ? "warn" : "bad",
    detail: `You scored ${item.score} out of ${item.maxScore} in this section.`
  }));

  const scoreBuckets = reportRows.map(item => ({
    label: item.category,
    score: Math.round((item.score / item.maxScore) * 100)
  }));

  const actionVerbs = [
    { label: "Led", status: "good" },
    { label: "Responsible for", status: "good" },
    { label: "Implemented", status: "bad" },
    { label: "Worked on", status: "bad" }
  ];

  // Auth Email (Fallback for testing if localStorage is empty)
  const userEmail = localStorage.getItem("userEmail") || "candidate@test.com";

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setAvailableDomains([
          "Software Engineer", "Backend Developer", "Frontend Developer", 
          "Data Analyst", "Product Manager", "UI/UX Designer"
        ]);

        const creditRes = await api.get("/user-cv/credits");
        if (creditRes.status === 200) {
          setRemainingCredits(creditRes.data.atsCreditsRemaining);
          setUserPlan(creditRes.data.plan);
        }
      } catch (err) {
        console.error("Failed to fetch initial dashboard data:", err);
      }
    };

    // Load Razorpay Script Dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchInitialData();
  }, [userEmail]);

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
    if (!file || !jobDomain) {
      setError("Please upload a resume and select a domain.");
      return;
    }
    
    setLoading(true);
    setError(null);
    setActiveStep(0);
    
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);
      formData.append("targetDomain", jobDomain);
      formData.append("jdText", jdText.trim());

      const analysisRes = await api.post("/user-cv/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      
      setAnalysisResult(analysisRes.data);
      
      const creditRes = await api.get("/user-cv/credits");
      setRemainingCredits(creditRes.data.atsCreditsRemaining);
      
      setAnalyzed(true);
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.response?.data || err.message || "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleContentRow = (index) => {
    setOpenContentRow((prev) => (prev === index ? null : index));
  };

  // --- RAZORPAY PAYMENT LOGIC ---
  const handlePayment = async (planType, amount) => {
    try {
      const orderRes = await api.post("/user-cv/create-order", { amount, planType });
      const orderData = JSON.parse(orderRes.data);

      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your actual Test Key ID
        amount: orderData.amount,
        currency: "INR",
        name: "Graphura ATS",
        description: `Upgrade to ${planType} Plan`,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            await api.post("/user-cv/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType: planType
            });
            alert("Payment Successful! Plan Upgraded.");
            setShowPricing(false);
            
            const creditRes = await api.get("/user-cv/credits");
            setUserPlan(creditRes.data.plan);
            setRemainingCredits(creditRes.data.atsCreditsRemaining);
          } catch (e) {
            alert("Payment Verification Failed!");
          }
        },
        theme: { color: "#7c3aed" } 
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      alert("Failed to initiate payment. Try again.");
    }
  };

  // --- HISTORY LOGIC ---
  const fetchHistory = async () => {
    if (userPlan === "FREE") {
      setShowPricing(true);
      return;
    }
    try {
      const res = await api.get("/user-cv/history");
      setHistoryData(res.data);
      setShowHistory(true);
    } catch (err) {
      alert("Failed to load history.");
    }
  };

  // --- PDF DOWNLOAD LOGIC ---
  const handleDownloadPdf = async () => {
    if (userPlan !== "PRO") {
      setShowPricing(true);
      return;
    }
    try {
      const historyRes = await api.get("/user-cv/history");
      if (historyRes.data.length === 0) {
        alert("No analysis found to download.");
        return;
      }
      
      const latestAnalysisId = historyRes.data[0].id;
      const response = await api.get(`/user-cv/download-report/${latestAnalysisId}`, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Graphura_Optimized_Resume_Report.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to download report.");
    }
  };

  return (
    <main className="min-h-screen font-sans text-slate-900 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#eef2ff]">
      
      {/* PRICING MODAL OVERLAY */}
      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-8 relative animate-in zoom-in duration-300 shadow-2xl">
            <button onClick={() => setShowPricing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900">Upgrade Your Career Toolkit</h2>
              <p className="text-slate-500 mt-2">Unlock advanced AI analysis, missing keywords, and PDF reports.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* STARTER PLAN */}
              <div className="border-2 border-slate-100 rounded-3xl p-6 hover:border-violet-300 transition-all bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Starter Plan</h3>
                <div className="text-4xl font-extrabold mt-2 mb-6 text-slate-900">₹49 <span className="text-sm font-medium text-slate-400">one-time</span></div>
                <ul className="space-y-3 text-sm text-slate-600 mb-8">
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> 10 ATS Credits</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Unlock Missing Skills</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Basic AI Suggestions</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Score History Dashboard</li>
                  <li className="flex gap-2 opacity-50"><XCircle className="h-5 w-5 text-rose-400" /> No PDF Export</li>
                </ul>
                <button onClick={() => handlePayment("STARTER", 49)} className="w-full py-3 rounded-xl bg-violet-100 text-violet-700 font-bold hover:bg-violet-200 transition">
                  Buy Starter
                </button>
              </div>

              {/* PRO PLAN */}
              <div className="border-2 border-violet-500 bg-violet-50/30 rounded-3xl p-6 relative transform md:-translate-y-4 shadow-2xl shadow-violet-200">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                  Most Popular
                </div>
                <h3 className="text-xl font-bold text-violet-900">Pro Plan</h3>
                <div className="text-4xl font-extrabold mt-2 mb-6 text-violet-900">₹199 <span className="text-sm font-medium text-slate-500">/month</span></div>
                <ul className="space-y-3 text-sm text-slate-700 mb-8 font-medium">
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-violet-600" /> Unlimited ATS Scans</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-violet-600" /> Full Semantic Analysis</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-violet-600" /> Score Tracking & History</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-violet-600" /> Download Optimized PDF Report</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-5 w-5 text-violet-600" /> 5 AI Resume Rewrites/mo</li>
                </ul>
                <button onClick={() => handlePayment("PRO", 199)} className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition shadow-lg shadow-violet-200">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL OVERLAY */}
      {showHistory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative max-h-[80vh] overflow-y-auto animate-in fade-in duration-300 shadow-2xl">
             <button onClick={() => setShowHistory(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2 text-slate-800">
              <History className="text-violet-500 h-6 w-6"/> Scan History
            </h2>
            <div className="space-y-4">
              {historyData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl bg-slate-50 hover:bg-slate-100 transition">
                  <div>
                    <div className="font-bold text-slate-800 text-lg">Score: {item.totalScore}/100</div>
                    <div className="text-xs font-semibold text-slate-500 mt-1">
                      Scanned on: {new Date(item.analyzedAt).toLocaleDateString()} at {new Date(item.analyzedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <button onClick={() => alert("Detailed view functionality coming soon...")} className="text-sm font-semibold text-violet-600 bg-violet-100 px-4 py-2 rounded-xl hover:bg-violet-200 transition">
                    View Details
                  </button>
                </div>
              ))}
              {historyData.length === 0 && (
                <div className="text-center p-8 border border-dashed border-slate-200 rounded-2xl bg-slate-50">
                  <p className="text-slate-500 font-medium">No past scans found.</p>
                </div>
              )}
            </div>
          </div>
         </div>
      )}

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-0 h-96 w-96 rounded-full bg-violet-200/45 blur-[120px]"></div>
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-300/40 blur-[140px]"></div>
        
        <div className="max-w-7xl mx-auto px-6 pt-28 pb-12 lg:pt-32 lg:pb-20">
        
          {!analyzed && !loading && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="space-y-10">
                <div className="space-y-4 text-center">
                  <div className="text-xs font-bold tracking-[0.25em] text-violet-500 uppercase opacity-80">
                    USER CV ANALYZER
                  </div>
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                    Beat the ATS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                      get hired faster.
                    </span>
                  </h1>
                  <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                    A free and fast AI resume checker doing crucial checks to ensure your resume
                    is ready to perform and get you interview callbacks.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 items-start">
                  <div className="space-y-8 flex flex-col items-center">
                  <section className="w-full max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8">
                    <div className="space-y-6">
                      {!file ? (
                        <label className="group block border-2 border-dashed border-violet-200 rounded-[2rem] p-12 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/40 transition-all duration-300">
                          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your resume here or choose a file.</h3>
                          <p className="text-sm text-slate-500 mb-8">PDF & DOCX only. Max 2MB file size.</p>
                          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                          <div className="flex flex-col items-center gap-4">
                            <div className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-200 hover:bg-violet-700 hover:-translate-y-0.5 transition-all active:scale-95">
                              Upload Your Resume
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                               <CheckCircle2 className="h-4 w-4 text-violet-400" />
                               Privacy guaranteed
                            </div>
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

                      {file && (
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

                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Paste Job Description (Optional)</label>
                            <textarea
                              value={jdText}
                              onChange={(e) => setJdText(e.target.value)}
                              placeholder="Paste the job description here for higher accuracy..."
                              className="w-full h-32 rounded-xl border border-violet-200 bg-white/90 px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-400 resize-none placeholder:text-slate-400"
                            />
                          </div>

                          {remainingCredits === 0 && userPlan !== "PRO" ? (
                            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-center">
                              <p className="text-sm font-bold text-rose-700">You've used all your free credits!</p>
                              <p className="text-xs text-rose-600 mt-1">Upgrade to Premium to continue analyzing resumes.</p>
                              <button onClick={() => setShowPricing(true)} className="mt-4 w-full py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition shadow-lg">
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
                      )}
                    </div>
                  </section>

                  {remainingCredits !== null && (
                    <div className="flex justify-center lg:justify-start">
                      <div className={`px-5 py-2 rounded-full flex items-center gap-2 border shadow-sm backdrop-blur-md transition-all ${
                        remainingCredits > 0 || userPlan === "PRO"
                          ? "bg-emerald-50/80 border-emerald-100 text-emerald-700"
                          : "bg-rose-50/80 border-rose-100 text-rose-700 animate-pulse"
                      }`}>
                        {userPlan === "PRO" ? <Unlock className="h-4 w-4 text-emerald-500" /> : <Award className={`h-4 w-4 ${remainingCredits > 0 ? "text-emerald-500" : "text-rose-500"}`} />}
                        <span className="text-xs font-bold uppercase tracking-wider">
                          {userPlan === "PRO" ? "PRO PLAN: Unlimited Scans" : `${remainingCredits} ATS Credits Left`}
                        </span>
                      </div>
                    </div>
                  )}

                </div>

                <div className="hidden lg:block self-start">
                  <div className="relative group">
                    <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-tr from-violet-400/30 via-fuchsia-300/30 to-indigo-300/30 blur-3xl group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative rounded-[2.5rem] bg-white/40 p-3 shadow-2xl backdrop-blur-2xl border border-white/50 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                      <img
                        src="/images/resume.webp"
                        alt="Resume analysis preview"
                        className="w-full h-auto rounded-[2rem] shadow-sm transform group-hover:translate-y-[-5px] transition-transform duration-700"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=2070&auto=format&fit=crop";
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3"></div>
                </div>
                </div>
              </div>

              <div className="mt-12 px-2 sm:px-6 py-16 relative overflow-hidden">
                <div className="text-center">
                  <div className="text-[11px] font-bold uppercase tracking-[0.35em] text-violet-300">
                    Process
                  </div>
                  <h3 className="mt-2 text-3xl sm:text-4xl font-extrabold text-[#4c1d95]">
                    How the User Dashboard Works<span className="text-violet-500">.</span>
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    A simple 4-step flow to upload, analyze, and improve your resume.
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
                            <Upload className="h-7 w-7" />
                          </div>
                          <div className="hidden md:block absolute left-1/2 top-[calc(50%-100px)] bottom-1/2 w-0.5 bg-violet-300 z-20"></div>
                          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                          <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:-translate-y-24 md:translate-x-6 relative z-30">
                            <div className="text-sm font-bold text-violet-900">Upload Resume</div>
                            <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                              Upload your resume to start the ATS analysis.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col items-center md:h-[240px]">
                          <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:top-[calc(50%+100px)] md:left-1/2 md:-translate-x-1/2">
                            <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                              2.
                            </span>
                            <FileText className="h-7 w-7" />
                          </div>
                          <div className="hidden md:block absolute left-1/2 top-1/2 bottom-[calc(50%-100px)] w-0.5 bg-violet-300 z-20"></div>
                          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                          <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:translate-y-2 md:translate-x-6 relative z-30">
                            <div className="text-sm font-bold text-violet-900">Add Job Description</div>
                            <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                              Paste the JD to improve keyword matching accuracy.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col items-center md:h-[240px]">
                          <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:bottom-[calc(50%+100px)] md:left-1/2 md:-translate-x-1/2">
                            <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                              3.
                            </span>
                            <BarChart3 className="h-7 w-7" />
                          </div>
                          <div className="hidden md:block absolute left-1/2 top-[calc(50%-100px)] bottom-1/2 w-0.5 bg-violet-300 z-20"></div>
                          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                          <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:-translate-y-24 md:translate-x-6 relative z-30">
                            <div className="text-sm font-bold text-violet-900">Analyze & Score</div>
                            <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                              Get ATS score, readability, and keyword insights.
                            </p>
                          </div>
                        </div>

                        <div className="relative flex flex-col items-center md:h-[240px]">
                          <div className="mt-2 h-16 w-16 rounded-full bg-[#f4efff] shadow-md border border-violet-200 flex items-center justify-center text-violet-700 relative z-10 md:mt-0 md:absolute md:top-[calc(50%+120px)] md:left-1/2 md:-translate-x-1/2">
                            <span className="absolute -left-7 top-1/2 -translate-y-1/2 text-sm font-extrabold text-violet-900">
                              4.
                            </span>
                            <Award className="h-7 w-7" />
                          </div>
                          <div className="hidden md:block absolute left-1/2 top-1/2 bottom-[calc(50%-120px)] w-0.5 bg-violet-300 z-20"></div>
                          <div className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-violet-500 z-30"></div>
                          <div className="mt-3 text-center md:text-left md:absolute md:left-1/2 md:top-1/2 md:translate-y-2 md:translate-x-6 relative z-30">
                            <div className="text-sm font-bold text-violet-900">Improve & Export</div>
                            <p className="mt-1 text-xs text-violet-500 max-w-[180px]">
                              Apply AI tips and download your optimized report.
                            </p>
                          </div>
                        </div>
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
              <button onClick={() => {setError(null); setLoading(false)}} className="mt-4 text-sm font-bold underline">Try Again</button>
            </div>
          )}

          {loading && (
            <div className="py-12 lg:py-6">
              <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] items-stretch animate-in fade-in duration-500">
                <div className="rounded-[28px] bg-white/80 border border-slate-200 shadow-[0_25px_60px_-45px_rgba(15,23,42,0.35)] p-8 backdrop-blur">
                  <div className="text-center space-y-5">
                    <p className="text-lg font-semibold text-slate-700">Calculating Score</p>
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

          {analyzed && !loading && analysisResult && (
            <div className="animate-in fade-in duration-700">
              {/* Premium Warning Banner */}
              {analysisResult.subscriptionWarning && (
                <div className="mb-8 flex items-center justify-between p-5 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Lock className="h-5 w-5 text-amber-500" />
                    <p className="text-sm font-bold text-amber-800">{analysisResult.subscriptionWarning}</p>
                  </div>
                  <button onClick={() => setShowPricing(true)} className="px-5 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold hover:bg-amber-600 transition shadow-sm">
                    Unlock Pro Features
                  </button>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.7fr] items-stretch">
                {/* LEFT COLUMN: GAUGE & OVERVIEW */}
                <div className="rounded-[28px] bg-white/90 backdrop-blur border border-white/70 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.4)] p-6 sm:p-8 h-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">R</div>
                      <span className="text-lg font-semibold">ResumeIQ</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={fetchHistory} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-700 shadow-sm hover:bg-white transition-all">
                        <History className="h-4 w-4 text-violet-500" />
                        View History
                        {userPlan === "FREE" && <Lock className="h-3.5 w-3.5 text-slate-400 ml-1" />}
                      </button>
                    </div>
                  </div>

                  <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-center">
                      <p className="text-base font-semibold text-slate-700">Overall ATS Score</p>
                      <div className="relative mx-auto mt-6 h-28 w-56">
                        <svg viewBox="0 0 120 60" className="h-full w-full">
                          <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" />
                          <path
                            d="M10 60 A50 50 0 0 1 110 60"
                            fill="none"
                            stroke={score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444"}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={`${halfCircumference} ${halfCircumference}`}
                            strokeDashoffset={gaugeOffset}
                          />
                        </svg>
                        <div className="absolute left-1/2 top-[52%] h-1 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-500"></div>
                      </div>
                      <div className={`mt-2 text-3xl font-extrabold ${score >= 80 ? "text-emerald-600" : score >= 50 ? "text-amber-600" : "text-rose-600"}`}>
                        {score}<span className="text-lg opacity-50">/100</span>
                      </div>
                      <p className="text-sm text-slate-500 mt-2">Overall Match Score</p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                        <span>Content</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600">Breakdown</span>
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
                                  {item.status === "warn" && <AlertCircle className="h-4 w-4 text-amber-500" />}
                                  {item.status === "bad" && <XCircle className="h-4 w-4 text-rose-500" />}
                                  <span>{item.label}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                              </button>
                              {isOpen && <p className="mt-2 text-xs text-slate-500 font-medium">{item.detail}</p>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* DYNAMIC DOWNLOAD + NEW ANALYSIS */}
                  <div className="mt-8 grid gap-3 sm:grid-cols-[1.2fr_0.8fr] items-stretch">
                    <button 
                      onClick={handleDownloadPdf}
                      className={`w-full h-12 rounded-2xl text-sm font-semibold px-3 flex items-center justify-center gap-2 transition-all shadow-sm whitespace-nowrap ${
                        userPlan === "PRO" 
                          ? "bg-slate-900 text-white hover:bg-slate-800" 
                          : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {userPlan === "PRO" ? (
                        <><Download className="h-5 w-5" /> Download Optimized Resume</>
                      ) : (
                        <><Lock className="h-4 w-4" /> Download Report (Pro Only)</>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setAnalyzed(false);
                        setAnalysisResult(null);
                        setFile(null);
                        setJobDomain("");
                        setJdText("");
                      }}
                      className="w-full h-12 rounded-2xl text-sm font-semibold px-3 flex items-center justify-center gap-2 transition-all shadow-sm bg-white/80 text-violet-700 border border-violet-200 hover:bg-white whitespace-nowrap"
                    >
                      <Upload className="h-4 w-4" />
                      New Analysis
                    </button>
                  </div>
                </div>

                {/* RIGHT COLUMN: AI INSIGHTS & KEYWORDS */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-end gap-3"></div>
                  
                  <div className="rounded-[28px] bg-white/90 backdrop-blur border border-white/70 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.35)] p-6 sm:p-8 h-full">
                    <div className="flex items-center justify-between mb-6 min-h-[40px]">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 tracking-[0.2em] uppercase">ATS Keyword Analysis</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      {/* Matched Keywords */}
                      <div className="space-y-4">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <Target className="h-4 w-4 text-emerald-500" /> Matched JD Keywords
                        </h4>
                        {analysisResult.matchedKeywords?.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.matchedKeywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs border border-emerald-100 shadow-sm">
                                ✓ {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500">No matching keywords found. Tailor your resume heavily.</p>
                        )}
                      </div>

                      {/* Missing Keywords (Gated Feature) */}
                      <div className="space-y-4">
                        <h4 className="flex items-center justify-between text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-rose-500" /> Missing Keywords
                          </div>
                          {!analysisResult.missingKeywords && <Lock className="h-4 w-4 text-slate-400" />}
                        </h4>
                        
                        {analysisResult.missingKeywords ? (
                          <div className="flex flex-wrap gap-2">
                            {analysisResult.missingKeywords.length > 0 ? analysisResult.missingKeywords.map((kw, i) => (
                              <span key={i} className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 font-semibold text-xs border border-rose-100 shadow-sm">
                                ✕ {kw}
                              </span>
                            )) : <span className="text-sm text-emerald-600 font-bold">Great job! No major keywords missing.</span>}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            <Lock className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-sm font-semibold text-slate-600">Missing Keyword Analysis is locked</p>
                            <p className="text-xs text-slate-400 mt-1">Available on Starter & Pro plans</p>
                          </div>
                        )}
                      </div>

                      {/* AI Suggestions (Gated Feature) */}
                      <div className="space-y-4">
                        <h4 className="flex items-center justify-between text-sm font-bold text-indigo-900 border-b border-indigo-100 pb-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-indigo-500" /> AI Suggestions
                          </div>
                          {!analysisResult.suggestions && <Lock className="h-4 w-4 text-indigo-300" />}
                        </h4>
                        
                        {analysisResult.suggestions ? (
                          <ul className="space-y-3">
                            {analysisResult.suggestions.map((suggestion, i) => (
                              <li key={i} className="flex gap-3 text-sm text-indigo-800 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm">
                                <span className="font-bold text-indigo-500 mt-0.5">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        ) : (
                           <div className="text-center py-6 bg-white/50 rounded-xl">
                            <p className="text-sm font-semibold text-indigo-600">Actionable AI Suggestions are locked</p>
                            <button onClick={() => setShowPricing(true)} className="mt-3 px-5 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition">
                              Upgrade to Unlock
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
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
      `}</style>
    </main>
  );
}

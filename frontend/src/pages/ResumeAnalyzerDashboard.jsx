import { useEffect, useState } from "react";
import {
  Upload, FileText, LayoutGrid, ChevronDown, CheckCircle2, XCircle, AlertCircle, BarChart3,
  Award, Lock, Unlock, Lightbulb, Target, History, Download, CreditCard, X
} from "lucide-react";
import api from "../api/axios";

export default function ResumeAnalyzerDashboard() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const [jobDomain, setJobDomain] = useState("");
  const [jdText, setJdText] = useState(""); 
  const [availableDomains, setAvailableDomains] = useState([]);
  
  const [activeStep, setActiveStep] = useState(0);
  const [openContentRow, setOpenContentRow] = useState(null);
  const [error, setError] = useState(null);
  
  // New States for Features
  const [remainingCredits, setRemainingCredits] = useState(null);
  const [userPlan, setUserPlan] = useState("FREE");
  const [showPricing, setShowPricing] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const score = analysisResult?.totalScore || 0;
  const radius = 50;
  const halfCircumference = Math.PI * radius;
  const gaugeOffset = halfCircumference - halfCircumference * (score / 100);

  const analysisSteps = [
    "Parsing your resume and JD", "Semantic keyword matching",
    "Calculating ATS score", "Generating AI recommendations"
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

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setAvailableDomains(["Software Engineer", "Backend Developer", "Frontend Developer", "Data Analyst", "Product Manager", "UI/UX Designer"]);
        const creditRes = await api.get("/user-cv/credits");
        if (creditRes.status === 200) {
          setRemainingCredits(creditRes.data.atsCreditsRemaining);
          setUserPlan(creditRes.data.plan);
        }
      } catch (err) {
        console.error("Failed to fetch initial dashboard data:", err);
      }
    };
    
    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!loading) return;
    setActiveStep(0);
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= analysisSteps.length ? prev : prev + 1));
    }, 900);
    return () => clearInterval(interval);
  }, [loading, analysisSteps.length]);

  const analyzeResume = async () => {
    if (!file || !jobDomain) { setError("Please upload a resume and select a domain."); return; }
    
    setLoading(true); setError(null); setActiveStep(0);
    
    try {
      const formData = new FormData();
      formData.append("resumeFile", file);
      formData.append("targetDomain", jobDomain);
      formData.append("jdText", jdText.trim());

      const analysisRes = await api.post("/user-cv/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setAnalysisResult(analysisRes.data);
      const creditRes = await api.get("/user-cv/credits");
      setRemainingCredits(creditRes.data.atsCreditsRemaining);
      setAnalyzed(true);
    } catch (err) {
      setError(err.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // --- RAZORPAY PAYMENT LOGIC ---
  const handlePayment = async (planType, amount) => {
    try {
      // 1. Create Order on Backend
      const orderRes = await api.post("/user-cv/create-order", { amount, planType });
      const orderData = JSON.parse(orderRes.data);

      // 2. Open Razorpay Checkout
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Test Key ID
        amount: orderData.amount,
        currency: "INR",
        name: "Graphura ATS",
        description: `Upgrade to ${planType} Plan`,
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment on Backend
          try {
            await api.post("/user-cv/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType: planType
            });
            alert("Payment Successful! Plan Upgraded.");
            setShowPricing(false);
            
            // Refresh User Data
            const creditRes = await api.get("/user-cv/credits");
            setUserPlan(creditRes.data.plan);
            setRemainingCredits(creditRes.data.atsCreditsRemaining);
          } catch (e) {
            alert("Payment Verification Failed!");
          }
        },
        theme: { color: "#7c3aed" } // Violet
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

  // --- DOWNLOAD PDF LOGIC ---
  const handleDownloadPdf = async () => {
    if (userPlan !== "PRO") {
      setShowPricing(true);
      return;
    }
    try {
      // Assuming you have the current analysis ID stored in your DB/State. 
      // For this demo, we assume the backend returns the newly created Analysis ID in the DTO, 
      // or we fetch the latest from history. 
      // Replace '1' with your dynamic ID: `analysisResult.id` if you added it to the DTO.
      const response = await api.get(`/user-cv/download-report/1`, { responseType: 'blob' });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Optimized_Resume.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert("Failed to download report.");
    }
  };

  return (
    <main className="min-h-screen font-sans text-slate-900 bg-gradient-to-br from-[#f7f3ff] via-[#f1edff] to-[#eef2ff]">
      
      {/* PRICING MODAL */}
      {showPricing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl p-8 relative animate-in zoom-in duration-300">
            <button onClick={() => setShowPricing(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900">Upgrade Your Career Toolkit</h2>
              <p className="text-slate-500 mt-2">Unlock advanced AI analysis, missing keywords, and PDF reports.</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* STARTER PLAN */}
              <div className="border-2 border-slate-100 rounded-3xl p-6 hover:border-violet-300 transition-all">
                <h3 className="text-xl font-bold text-slate-800">Starter Plan</h3>
                <div className="text-4xl font-extrabold mt-2 mb-6">₹49 <span className="text-sm font-medium text-slate-400">one-time</span></div>
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
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
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

      {/* HISTORY MODAL */}
      {showHistory && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-8 relative max-h-[80vh] overflow-y-auto">
             <button onClick={() => setShowHistory(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600">
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-extrabold mb-6 flex items-center gap-2"><History className="text-violet-500"/> Scan History</h2>
            <div className="space-y-4">
              {historyData.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 rounded-2xl bg-slate-50">
                  <div>
                    <div className="font-bold text-slate-800">Score: {item.totalScore}/100</div>
                    <div className="text-xs text-slate-500 mt-1">{new Date(item.analyzedAt).toLocaleDateString()}</div>
                  </div>
                  <button className="text-sm font-semibold text-violet-600 bg-violet-100 px-4 py-2 rounded-xl">View</button>
                </div>
              ))}
              {historyData.length === 0 && <p className="text-slate-500">No past scans found.</p>}
            </div>
          </div>
         </div>
      )}

      <div className="relative overflow-hidden">
        {/* TOP NAVBAR AREA WITH HISTORY BUTTON */}
        <div className="max-w-7xl mx-auto px-6 pt-8 flex justify-end">
           <button onClick={fetchHistory} className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur border border-slate-200 rounded-full text-sm font-bold text-slate-700 shadow-sm hover:bg-white transition">
             <History className="h-4 w-4 text-violet-500" />
             View History
             {userPlan === "FREE" && <Lock className="h-3 w-3 text-slate-400 ml-1" />}
           </button>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
          {!analyzed && !loading && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
              {/* Badge */}
              {remainingCredits !== null && (
                <div className="flex justify-center mb-4">
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

              {/* ... (Keep your existing Upload UI block here, unmodified, to save space in this response. It is exactly the same as the previous iteration.) ... */}
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                 {/* ... Upload Input, Domain Select, JD Textarea ... */}
                 <div className="space-y-8">
                  {/* ... Headers ... */}
                  <section className="max-w-xl rounded-3xl border border-violet-200/60 bg-white/70 backdrop-blur-xl shadow-[0_25px_80px_-55px_rgba(124,58,237,0.45)] p-8">
                    <div className="space-y-6">
                      {!file ? (
                        <label className="group block border-2 border-dashed border-violet-200 rounded-[2rem] p-12 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50/40 transition-all duration-300">
                          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Drop your resume here</h3>
                          <p className="text-sm text-slate-500 mb-8">PDF & DOCX only. Max 2MB file size.</p>
                          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                          <div className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-8 py-4 text-base font-bold text-white shadow-xl">
                            Upload Your Resume
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
                            <select value={jobDomain} onChange={(e) => setJobDomain(e.target.value)} className="w-full rounded-xl border border-violet-200 bg-white/90 px-4 py-3 text-slate-700">
                              <option value="" disabled>Select a domain</option>
                              {availableDomains.map((domain) => <option key={domain} value={domain}>{domain}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Paste Job Description</label>
                            <textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder="Paste the JD here..." className="w-full h-32 rounded-xl border border-violet-200 bg-white/90 px-4 py-3 text-sm text-slate-700 resize-none"/>
                          </div>

                          {remainingCredits === 0 && userPlan !== "PRO" ? (
                            <button onClick={() => setShowPricing(true)} className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition shadow-lg">
                              Unlock Scans (Premium)
                            </button>
                          ) : jobDomain ? (
                            <button onClick={analyzeResume} className="w-full px-10 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition">
                              Analyze Now
                            </button>
                          ) : null}
                        </>
                      )}
                    </div>
                  </section>
                 </div>
                 {/* ... Image ... */}
              </div>
            </div>
          )}

          {/* ... (Keep Error and Loading states exactly as before) ... */}

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

              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.7fr]">
                {/* LEFT COLUMN: GAUGE & OVERVIEW */}
                <div className="rounded-[28px] bg-white/90 backdrop-blur border border-white/70 shadow-[0_25px_70px_-45px_rgba(15,23,42,0.4)] p-6 sm:p-8">
                  
                  {/* ... (Keep Gauge UI exact same as before) ... */}

                  {/* DYNAMIC DOWNLOAD BUTTON */}
                  <button 
                    onClick={handleDownloadPdf}
                    className={`mt-8 w-full rounded-2xl font-semibold py-4 flex items-center justify-center gap-2 transition-all shadow-sm ${
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
                </div>

                {/* RIGHT COLUMN: AI INSIGHTS & KEYWORDS */}
                <div className="space-y-6">
                   {/* ... (Keep the rest of your insights UI exactly the same as the previous response) ... */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
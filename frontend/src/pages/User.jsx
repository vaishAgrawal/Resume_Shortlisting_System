import { useState } from "react";
import { Upload, FileText, CheckCircle2, Target, Sparkles, Layout, Loader2, AlertCircle } from "lucide-react";

export default function ResumeAnalyzerDashboard() {
  const [file, setFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score] = useState(75);

  const analyzeResume = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-24 px-6 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {!analyzed && !loading && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <header className="text-center space-y-2">
              <h1 className="text-5xl font-extrabold tracking-tight text-violet-950">Resume Analyzer</h1>
              <p className="text-xl text-slate-500">Upload your resume to get AI-powered insights.</p>
            </header>
            
            <section className="bg-white p-12 rounded-3xl border border-violet-100 shadow-sm max-w-2xl mx-auto">
              {!file ? (
                <label className="block border-2 border-dashed border-violet-200 rounded-2xl p-10 text-center cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-all">
                  <Upload className="mx-auto w-12 h-12 text-violet-600 mb-4" />
                  <h3 className="text-lg font-bold text-violet-950">Upload your Resume</h3>
                  <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                </label>
              ) : (
                <div className="text-center space-y-6">
                  <FileText className="mx-auto w-12 h-12 text-violet-600" />
                  <p className="font-bold text-lg">{file.name}</p>
                  <button onClick={analyzeResume} className="px-10 py-4 bg-violet-600 text-white rounded-2xl font-bold hover:bg-violet-700 transition">Analyze Now</button>
                </div>
              )}
            </section>
          </div>
        )}

        {loading && (
          <div className="text-center py-32">
            <Loader2 className="mx-auto w-16 h-16 text-violet-600 animate-spin mb-6" />
            <h2 className="text-3xl font-bold text-violet-950">Analyzing your resume...</h2>
          </div>
        )}

        {analyzed && !loading && (
          <div className="animate-in fade-in duration-700 space-y-8">
            <header className="flex justify-between items-center border-b border-violet-100 pb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-violet-950">Analysis Report</h1>
                <p className="text-slate-500">Professional resume audit</p>
              </div>
              <button onClick={() => window.location.reload()} className="px-6 py-3 bg-violet-100 text-violet-800 rounded-xl font-bold hover:bg-violet-200">New Analysis</button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3 bg-white p-8 rounded-3xl border border-violet-100 shadow-sm flex items-center gap-8">
                <div className="text-center text-violet-950">
                  <div className="text-6xl font-black">{score}%</div>
                  <div className="text-violet-400 font-bold uppercase text-xs tracking-widest mt-1">Score</div>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500" style={{ width: `${score}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-violet-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-violet-950">
                    <AlertCircle className="text-orange-500"/> Required Corrections
                  </h3>
                  <ul className="space-y-4">
                    {["Add quantifiable metrics", "Fix bullet consistency", "Remove redundant experience"].map(c => (
                      <li key={c} className="flex gap-3 p-4 bg-orange-50 rounded-xl text-orange-900 font-medium">{c}</li>
                    ))}
                  </ul>
                </div>
                
                {/*  */}
                <div className="bg-white p-8 rounded-3xl border border-violet-100 shadow-sm">
                  <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-violet-950">
                    <Layout className="text-violet-500"/> Recommended Template
                  </h3>
                  <div className="p-8 border border-violet-200 rounded-2xl bg-violet-50 text-center hover:border-violet-500 cursor-pointer max-w-sm">
                    <div className="font-bold text-violet-950">Modern Pro</div>
                    <div className="text-xs text-violet-600 mt-1">Single Column</div>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-3xl border border-violet-100 shadow-sm">
                  <h3 className="font-bold mb-4 text-violet-950">Skills Found</h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Node.js", "Python"].map(s => <span key={s} className="px-3 py-1 bg-violet-100 text-violet-800 rounded-lg text-sm font-bold">{s}</span>)}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-violet-100 shadow-sm">
                  <h3 className="font-bold mb-4 flex items-center gap-2 text-violet-950"><Target className="text-violet-500"/> Recommended Skills</h3>
                  <ul className="space-y-3 text-sm font-semibold text-slate-700">
                    {["System Design", "AWS Cloud", "Docker"].map(s => <li key={s} className="flex items-center gap-2">• {s}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

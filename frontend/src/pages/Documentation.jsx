import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function Documentation() {
  useEffect(() => {
    AOS.init();
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();
  }, []);

  return (
    <div className="bg-gradient-to-br from-[#f7f1ff] via-[#efe7ff] to-[#e9f0ff] text-slate-900 font-sans selection:bg-violet-500 selection:text-white">

      <div id="nav-placeholder"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 pt-28 lg:pt-32 flex flex-col lg:flex-row gap-8">

        {/* SIDEBAR */}
        <aside className="lg:w-1/4 hidden lg:block lg:sticky lg:top-28 h-fit">
          <div className="bg-brand-card p-6 rounded-2xl border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
            <h3 className="text-slate-900 font-bold mb-4 uppercase text-sm tracking-wider">
              Contents
            </h3>

            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <a href="#overview" className="hover:text-violet-600 transition block">
                  System Overview
                </a>
              </li>
              <li>
                <a href="#workflow" className="hover:text-violet-600 transition block">
                  System Flow
                </a>
              </li>

              <li>
                <a href="#scoring" className="hover:text-violet-600 transition block font-bold text-violet-900">
                  Scoring Algorithm
                </a>
              </li>

              <li className="pl-4 border-l border-gray-200">
                <a href="#format" className="hover:text-violet-600 transition block">
                  1. Format (15pts)
                </a>
              </li>

              <li className="pl-4 border-l border-gray-200">
                <a href="#skills" className="hover:text-violet-600 transition block">
                  2. Skills (15pts)
                </a>
              </li>

              <li className="pl-4 border-l border-gray-200">
                <a href="#experience" className="hover:text-violet-600 transition block">
                  3. Experience (20pts)
                </a>
              </li>

              <li>
                <a href="#export" className="hover:text-violet-600 transition block">
                  Export Options
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="lg:w-3/4 lg:ml-auto pb-24">

          <section id="overview" className="mb-16" data-aos="fade-up">
            <h1 className="text-4xl font-bold mb-6">
              System <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Documentation</span>
            </h1>

            <p className="text-slate-600 mb-4 leading-relaxed">
              The AI-Powered Resume Shortlisting System is designed to automatically read,
              analyze, and rank resumes according to a company's specific job requirements.
              It extracts details from resumes (PDF/DOCX) and compares them against job
              descriptions to produce a ranked shortlist.
            </p>

            <div className="bg-brand-card p-6 rounded-xl border-l-4 border-violet-400 transition-shadow duration-300 hover:shadow-lg">
              <h4 className="text-slate-900 font-bold mb-2">Primary Goal</h4>
              <p className="text-sm text-slate-600">
                To save recruiters time, increase accuracy, and make data-driven hiring
                decisions by removing manual bias.
              </p>
            </div>
          </section>
         
          <section id="workflow" className="mb-16" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-violet-900 mb-6 border-b border-violet-200 pb-2">
              System Flow
            </h2>
            <div className="relative">
              <div className="absolute left-4 top-0 h-full w-0.5 bg-violet-300/60"></div>
              <div className="space-y-8 pl-12">
                <div className="relative">
                  <div className="absolute -left-[42px] bg-violet-500 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white">1</div>
                  <h4 className="text-slate-900 font-bold">Job Creation</h4>
                  <p className="text-sm text-slate-600">
                    Recruiter creates a job posting with specific requirements.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[42px] bg-brand-card border border-violet-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-violet-600">2</div>
                  <h4 className="text-slate-900 font-bold">Resume Upload</h4>
                  <p className="text-sm text-slate-600">
                    Resumes are uploaded in bulk (PDF/DOCX).
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[42px] bg-brand-card border border-violet-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-violet-600">3</div>
                  <h4 className="text-slate-900 font-bold">Analysis & Scoring</h4>
                  <p className="text-sm text-slate-600">
                    Backend extracts text and runs the matching algorithm.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[42px] bg-brand-card border border-violet-400 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-violet-600">4</div>
                  <h4 className="text-slate-900 font-bold">Dashboard Ranking</h4>
                  <p className="text-sm text-slate-600">
                    Candidates are displayed on the dashboard ranked by score.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}


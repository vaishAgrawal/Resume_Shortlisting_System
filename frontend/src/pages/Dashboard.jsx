
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  TrendingUp, 
  Search, 
  Download, 
  Trash2, 
  Filter, 
  ChevronRight,
  Frown,
  Star,
  XCircle,
  BarChart2
} from 'lucide-react';

const CandidateAnalytics = () => {
  // State for Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  
  // Mock Data (Based on your dashboard.html structure)
  const [candidates, setCandidates] = useState([
    { id: 1, name: "Amit Sharma", position: "Full Stack Developer", score: 92, status: "shortlisted" },
    { id: 2, name: "Sneha Patil", position: "UI/UX Designer", score: 85, status: "pending" },
    { id: 3, name: "Rahul Verma", position: "Data Scientist", score: 78, status: "pending" },
    { id: 4, name: "Priya Singh", position: "MERN Stack Developer", score: 65, status: "rejected" },
    { id: 5, name: "Vikram Raj", position: "Backend Developer", score: 89, status: "shortlisted" },
  ]);

  // Handle Checkbox Filter
  const handleStatusChange = (status) => {
    setStatusFilter(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  // Filter Logic
  const filteredCandidates = candidates.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(c.status);
    return matchesSearch && matchesStatus;
  });

  const breakdownTemplate = [
    { category: "Format", feedback: "Excellent.", score: 15, outOf: 15, tone: "good" },
    { category: "Contact", feedback: "Complete.", score: 5, outOf: 5, tone: "good" },
    { category: "Summary", feedback: "Profile overview check.", score: 10, outOf: 10, tone: "good" },
    { category: "Skills", feedback: "Add skills to improve matching.", score: 0, outOf: 15, tone: "warn" },
    { category: "Experience", feedback: "Add quantified achievements (numbers/%).", score: 10, outOf: 20, tone: "warn" },
    { category: "Projects", feedback: "Good projects.", score: 15, outOf: 15, tone: "good" },
    { category: "Education", feedback: "Verified.", score: 10, outOf: 10, tone: "good" },
    { category: "Certifications", feedback: "Verified.", score: 5, outOf: 5, tone: "good" },
    { category: "Tone/Grammar", feedback: "Professional tone check.", score: 5, outOf: 5, tone: "good" }
  ];

  return (
    <div className="min-h-screen bg-[#f7f5fb] text-gray-800 font-sans p-4 md:p-8 pt-28 md:pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#8b5cf6] to-[#6d28d9] bg-clip-text text-transparent tracking-tight">
            AI Candidate Analytics
          </h1>
          <p className="text-gray-500 mt-3 text-lg font-light">
            Efficiently shortlist top talent based on precise AI matching and criteria.
          </p>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white rounded-2xl shadow-xl border border-[#e7ddff] mb-10 divide-y md:divide-y-0 md:divide-x divide-[#efe7ff]">
          <div className="p-6 text-center hover:bg-[#f1ebff] transition">
            <p className="text-sm font-medium text-gray-500">Total Candidates</p>
            <p className="text-3xl font-extrabold text-[#6d28d9] mt-1">{candidates.length}</p>
          </div>
          <div className="p-6 text-center hover:bg-[#f1ebff] transition">
            <p className="text-sm font-medium text-gray-500">Shortlisted</p>
            <p className="text-3xl font-extrabold text-green-400 mt-1">
              {candidates.filter(c => c.status === 'shortlisted').length}
            </p>
          </div>
          <div className="p-6 text-center hover:bg-[#f1ebff] transition">
            <p className="text-sm font-medium text-gray-500">Avg. Match Score</p>
            <p className="text-3xl font-extrabold text-amber-500 mt-1">75.5</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Filter */}
          <aside className="lg:col-span-3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#e7ddff] sticky top-24 space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-[#efe7ff] pb-2 flex items-center gap-2">
                <Filter size={18} /> Filter Candidates
              </h3>
              
              <div className="space-y-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search name/summary..." 
                    className="w-full bg-[#f7f5fb] text-gray-900 p-3 pl-10 rounded-lg border border-[#e7ddff] text-sm focus:ring-2 focus:ring-[#8b5cf6] outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-600">Status</h4>
                  {['shortlisted', 'pending', 'rejected'].map(status => (
                    <label key={status} className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer capitalize">
                      <input 
                        type="checkbox" 
                        className="rounded border-[#d7c8ff] bg-white text-[#8b5cf6] focus:ring-[#8b5cf6]"
                        onChange={() => handleStatusChange(status)}
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition">
                  <Trash2 size={16} /> Clear All
                </button>
                <button className="w-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-bold py-2 px-3 rounded-xl shadow-lg flex items-center justify-center gap-2 transition">
                  <Download size={16} /> Export Data
                </button>
              </div>
              
              
            </div>
          </aside>

          {/* Candidate List Grid */}
          <div className="lg:col-span-9">
            {filteredCandidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => (
                  <div 
                    key={candidate.id} 
                    className={`bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full border-2 transition duration-300 cursor-pointer hover:-translate-y-0.5 ${
                      candidate.status === 'shortlisted' ? 'border-[#a78bfa] shadow-[#8b5cf6]/10' : 'border-transparent hover:border-[#8b5cf6]/40'
                    }`}
                    onClick={() => setSelectedCandidate(candidate)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedCandidate(candidate);
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{candidate.name}</h4>
                        <div className="text-sm text-gray-500 font-medium">{candidate.position}</div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className={`px-3 py-1 rounded-full text-sm font-bold shadow-md ${
                          candidate.score >= 80 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {candidate.score}%
                        </div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase mt-1">Match</div>
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-[#efe7ff] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Status:</span>
                        <span className={`text-sm font-semibold capitalize ${
                          candidate.status === 'shortlisted' ? 'text-green-400' : 
                          candidate.status === 'rejected' ? 'text-red-500' : 'text-[#8b5cf6]'
                        }`}>
                          {candidate.status}
                        </span>
                      </div>
                      <button className="text-[#8b5cf6] hover:text-[#6d28d9] transition">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16 bg-white rounded-2xl border border-dashed border-[#e7ddff]">
                <Frown className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-xl font-medium">No candidates match the criteria.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>

      {selectedCandidate ? (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#e7ddff] overflow-hidden">
            <div className="flex items-start justify-between p-6 md:p-8 bg-gradient-to-r from-[#f3e8ff] to-[#ede9fe] border-b border-[#efe7ff]">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {selectedCandidate.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1">{selectedCandidate.position}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-extrabold text-[#7c3aed]">
                  {selectedCandidate.score}
                </div>
                <div className="text-xs uppercase tracking-widest text-gray-500">Total Score</div>
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-12 gap-3 px-6 md:px-8 py-3 text-xs uppercase tracking-widest text-gray-500 border-b border-[#efe7ff]">
                <div className="col-span-4">Category</div>
                <div className="col-span-6">Feedback & Improvements</div>
                <div className="col-span-2 text-right">Score</div>
              </div>

              {breakdownTemplate.map((row) => (
                <div
                  key={row.category}
                  className="grid grid-cols-12 gap-3 px-6 md:px-8 py-4 border-b border-[#f1ebff] last:border-b-0"
                >
                  <div className="col-span-4 font-semibold text-gray-800">{row.category}</div>
                  <div className="col-span-6 text-sm">
                    <span
                      className={
                        row.tone === "good"
                          ? "text-emerald-600 font-medium"
                          : "text-amber-600 font-medium"
                      }
                    >
                      {row.feedback}
                    </span>
                  </div>
                  <div className="col-span-2 text-right font-semibold text-gray-800">
                    <span className={row.score === 0 ? "text-red-500" : ""}>{row.score}</span>
                    <span className="text-gray-400"> / {row.outOf}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end p-6 md:p-8 bg-[#faf7ff] border-t border-[#efe7ff]">
              <button
                type="button"
                className="px-6 py-2.5 rounded-full bg-[#8b5cf6] text-white font-semibold shadow-lg hover:bg-[#7c3aed] transition"
                onClick={() => setSelectedCandidate(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CandidateAnalytics;

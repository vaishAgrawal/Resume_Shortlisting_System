import { useMemo, useState } from "react";
const initialCandidates = [
  {
    id: 1,
    name: "Aarav Mehta",
    position: "Full Stack Developer",
    score: 92,
    status: "shortlisted",
  },
  {
    id: 2,
    name: "Diya Sharma",
    position: "Data Analyst",
    score: 86,
    status: "pending",
  },
  {
    id: 3,
    name: "Kunal Rao",
    position: "Front-End Developer",
    score: 78,
    status: "rejected",
  },
  {
    id: 4,
    name: "Isha Kapoor",
    position: "UI/UX Designer",
    score: 88,
    status: "shortlisted",
  },
  {
    id: 5,
    name: "Rohit Verma",
    position: "Back-End Developer",
    score: 81,
    status: "pending",
  },
];
const statusClasses = {
  shortlisted: "text-green-400",
  pending: "text-yellow-400",
  rejected: "text-red-400",
};
export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    shortlisted: false,
    pending: false,
    rejected: false,
  });
  const [candidates, setCandidates] = useState(initialCandidates);
  const [activeCandidate, setActiveCandidate] = useState(null);
  const filteredCandidates = useMemo(() => {
    const term = search.toLowerCase();
    const activeStatuses = Object.entries(statusFilters)
      .filter(([, value]) => value)
      .map(([key]) => key);
    return candidates.filter((candidate) => {
      const matchesSearch =
        candidate.name.toLowerCase().includes(term) ||
        candidate.position.toLowerCase().includes(term);
      const matchesStatus =
        activeStatuses.length === 0 ||
        activeStatuses.includes(candidate.status);
      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, statusFilters]);
  const totalCount = candidates.length;
  const shortlistedCount = candidates.filter(
    (c) => c.status === "shortlisted",
  ).length;
  const avgScore =
    candidates.reduce((sum, c) => sum + c.score, 0) /
    Math.max(1, candidates.length);
  const toggleStatus = (status) => {
    setStatusFilters((prev) => ({ ...prev, [status]: !prev[status] }));
  };
  const clearAllData = () => {
    if (window.confirm("Clear all candidate data?")) {
      setCandidates([]);
      setActiveCandidate(null);
    }
  };
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-32">
      
      <div className="text-center mb-12">
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-gradient tracking-tight">
          
          AI Candidate Analytics
        </h1>
        <p className="text-gray-600 mt-3 text-lg font-light">
          
          Efficiently shortlist top talent based on precise AI matching and
          criteria.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 bg-brand-card rounded-xl shadow-2xl border border-gray-200/50 mb-10 divide-x divide-gray-700/50">
        
        <div className="p-6 text-center hover:bg-brand-dark transition">
          
          <p className="text-sm font-medium text-gray-600">
            
            Total Candidates
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">
            
            {totalCount}
          </p>
        </div>
        <div className="p-6 text-center hover:bg-brand-dark transition">
          
          <p className="text-sm font-medium text-gray-600">Shortlisted</p>
          <p className="text-3xl font-extrabold text-green-400 mt-1">
            
            {shortlistedCount}
          </p>
        </div>
        <div className="p-6 text-center hover:bg-brand-dark transition">
          
          <p className="text-sm font-medium text-gray-600">
            
            Avg. Match Score
          </p>
          <p className="text-3xl font-extrabold text-yellow-400 mt-1">
            
            {avgScore.toFixed(1)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <aside className="lg:col-span-3">
          
          <div className="bg-brand-card p-6 rounded-xl shadow-lg border border-gray-200/50 sticky top-24 space-y-6">
            
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200/50 pb-2">
              
              Filter Candidates
            </h3>
            <div className="flex flex-col gap-4">
              
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name/summary..."
                className="bg-brand-dark text-gray-900 p-3 rounded-lg border border-gray-200 text-sm w-full focus:ring-brand-primary focus:border-brand-primary"
              />
              <div className="space-y-2">
                
                <h4 className="text-sm font-semibold text-gray-600">
                  
                  Status
                </h4>
                {Object.keys(statusFilters).map((status) => (
                  <label
                    key={status}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 cursor-pointer transition"
                  >
                    
                    <input
                      type="checkbox"
                      checked={statusFilters[status]}
                      onChange={() => toggleStatus(status)}
                      className="form-checkbox"
                    />
                    <span className="capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <section className="lg:col-span-9">
          
          <div className="flex justify-between items-center mb-6">
            
            <button
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-brand-accent font-medium"
              type="button"
              onClick={() => alert("Export data (frontend only).")}
            >
              
              <i className="fas fa-download"></i> Export Data
            </button>
            <button
              onClick={clearAllData}
              className="ml-auto bg-red-600 hover:bg-red-700 text-gray-900 font-bold py-2 px-6 rounded shadow-lg"
              type="button"
            >
              
              <i className="fas fa-trash-alt"></i> Clear All Data
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            
            {filteredCandidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setActiveCandidate(candidate)}
                className="text-left bg-brand-card rounded-xl shadow-2xl p-6 flex flex-col h-full border-2 border-transparent hover:border-brand-primary/50 transition duration-300"
                type="button"
              >
                
                <div className="flex items-start justify-between">
                  
                  <div>
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-0.5">
                      
                      {candidate.name}
                    </h4>
                    <div className="text-sm text-gray-600 font-medium">
                      
                      {candidate.position}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    
                    <div className="score-pill bg-brand-dark text-gray-900">
                      
                      {candidate.score}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      
                      Match Score
                    </div>
                  </div>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 flex items-center justify-between">
                  
                  <div className="flex items-center gap-2">
                    
                    <span className="text-sm font-medium text-gray-600">
                      
                      Status:
                    </span>
                    <span
                      className={`text-sm font-semibold ${statusClasses[candidate.status]}`}
                    >
                      
                      {candidate.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {filteredCandidates.length === 0 && (
            <div className="text-center text-gray-500 py-16">
              
              <i className="fas fa-frown text-5xl mb-4"></i>
              <p className="text-xl font-medium">
                
                No candidates match the applied criteria.
              </p>
              <p className="text-sm mt-1">
                
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </section>
      </div>
      {activeCandidate && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          
          <div className="bg-brand-card rounded-xl shadow-2xl max-w-3xl w-full p-8 relative border border-gray-200/50">
            
            <button
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition"
              onClick={() => setActiveCandidate(null)}
              type="button"
            >
              
              <i className="fas fa-times"></i>
            </button>
            <h2 className="text-3xl font-bold text-gray-900 mb-0">
              
              {activeCandidate.name}
            </h2>
            <p className="text-brand-accent mb-6 font-medium">
              
              {activeCandidate.position}
            </p>
            <div className="grid grid-cols-2 gap-6 mb-6 border-b border-gray-200 pb-4">
              
              <div className="bg-brand-dark p-4 rounded-lg border border-gray-200">
                
                <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                  
                  Match Score
                </p>
                <p className="text-3xl font-extrabold text-green-400 mt-1">
                  
                  {activeCandidate.score}
                </p>
              </div>
              <div className="bg-brand-dark p-4 rounded-lg border border-gray-200">
                
                <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                  
                  Status
                </p>
                <p
                  className={`text-3xl font-extrabold mt-1 ${statusClasses[activeCandidate.status]}`}
                >
                  
                  {activeCandidate.status}
                </p>
              </div>
            </div>
            <div className="bg-brand-dark p-4 rounded-lg border border-gray-200 mb-6">
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                
                <i className="fas fa-chart-bar mr-2 text-brand-primary"></i> ATS
                Score Breakdown
              </h3>
              <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
                
                Chart placeholder
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              
              <button
                className="bg-red-600 hover:bg-red-700 text-gray-900 py-2.5 px-6 rounded-lg font-semibold transition shadow-md"
                type="button"
                onClick={() => {
                  setCandidates((prev) =>
                    prev.map((c) =>
                      c.id === activeCandidate.id
                        ? { ...c, status: "rejected" }
                        : c,
                    ),
                  );
                  setActiveCandidate(null);
                }}
              >
                
                <i className="fas fa-thumbs-down mr-2"></i> Reject
                Candidate
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-gray-900 py-2.5 px-6 rounded-lg font-semibold transition shadow-md"
                type="button"
                onClick={() => {
                  setCandidates((prev) =>
                    prev.map((c) =>
                      c.id === activeCandidate.id
                        ? { ...c, status: "shortlisted" }
                        : c,
                    ),
                  );
                  setActiveCandidate(null);
                }}
              >
                
                <i className="fas fa-star mr-2"></i> Shortlist
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


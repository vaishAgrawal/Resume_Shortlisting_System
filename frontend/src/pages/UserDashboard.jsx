import { useEffect, useMemo, useState } from "react";
const emptyProfile = {
  name: "User",
  title: "Candidate",
  location: "",
  about: "",
};
export default function UserDashboard() {
  const [profile, setProfile] = useState(emptyProfile);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [showEdu, setShowEdu] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  const [editDraft, setEditDraft] = useState(emptyProfile);
  const [expDraft, setExpDraft] = useState({
    title: "",
    company: "",
    start: "",
    end: "",
    description: "",
  });
  const [eduDraft, setEduDraft] = useState({
    degree: "",
    school: "",
    startYear: "",
    endYear: "",
  });
  const [skillDraft, setSkillDraft] = useState({ name: "", verified: false });
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setProfile((prev) => ({ ...prev, name: storedName }));
    }
  }, []);
  const overlayVisible = showEdit || showExp || showEdu || showSkill;
  const openEdit = () => {
    setEditDraft(profile);
    setShowEdit(true);
  };
  const saveProfile = (event) => {
    event.preventDefault();
    setProfile(editDraft);
    setShowEdit(false);
  };
  const addExperience = (event) => {
    event.preventDefault();
    setExperiences((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...expDraft },
    ]);
    setExpDraft({
      title: "",
      company: "",
      start: "",
      end: "",
      description: "",
    });
    setShowExp(false);
  };
  const addEducation = (event) => {
    event.preventDefault();
    setEducations((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ...eduDraft },
    ]);
    setEduDraft({ degree: "", school: "", startYear: "", endYear: "" });
    setShowEdu(false);
  };
  const addSkill = (event) => {
    event.preventDefault();
    if (!skillDraft.name.trim()) return;
    setSkills((prev) => [...prev, { id: crypto.randomUUID(), ...skillDraft }]);
    setSkillDraft({ name: "", verified: false });
    setShowSkill(false);
  };
  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };
  const joinedProfileLine = useMemo(() => {
    const parts = [profile.title, profile.location].filter(Boolean);
    return parts.join(" � ");
  }, [profile.title, profile.location]);
  return (
    <main className="pt-32 pb-16 bg-brand-dark">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <section className="lg:col-span-1 bg-brand-card p-6 rounded-2xl border border-gray-200 shadow-xl">
            
            <div className="flex flex-col items-center text-center">
              
              <div className="w-24 h-24 rounded-full bg-brand-dark border border-gray-200 flex items-center justify-center text-3xl text-brand-accent">
                
                <i className="fas fa-user"></i>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mt-4">
                
                {profile.name}
              </h1>
              {joinedProfileLine && (
                <p className="text-gray-600 text-sm mt-2">
                  
                  {joinedProfileLine}
                </p>
              )}
              <button
                onClick={openEdit}
                className="mt-4 px-6 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary transition-colors text-sm"
                type="button"
              >
                
                Edit Profile
              </button>
              <button
                onClick={logout}
                className="mt-4 flex items-center justify-center text-red-400 hover:text-red-500 transition-colors"
                type="button"
              >
                
                <i className="fas fa-sign-out-alt mr-2"></i> Logout
              </button>
            </div>
          </section>
          <section className="lg:col-span-2 space-y-8">
            
            <div className="bg-brand-card p-6 rounded-2xl border border-gray-200 shadow-xl">
              
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                
                About
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                
                {profile.about ||
                  "Add a short summary about your experience and goals."}
              </p>
            </div>
            <div className="bg-brand-card p-6 rounded-2xl border border-gray-200 shadow-xl">
              
              <div className="flex items-center justify-between mb-4">
                
                <h2 className="text-xl font-semibold text-gray-900">
                  
                  Experience
                </h2>
                <button
                  onClick={() => setShowExp(true)}
                  className="px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-semibold"
                  type="button"
                >
                  
                  Add Experience
                </button>
              </div>
              <div className="space-y-4">
                
                {experiences.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    
                    No experience added yet.
                  </p>
                )}
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="border border-gray-200 rounded-xl p-4 bg-brand-dark"
                  >
                    
                    <div className="flex justify-between">
                      
                      <div>
                        
                        <h3 className="text-gray-900 font-semibold">
                          
                          {exp.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-gray-500 text-xs">
                        
                        {exp.start} - {exp.end}
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-2">
                        
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-card p-6 rounded-2xl border border-gray-200 shadow-xl">
              
              <div className="flex items-center justify-between mb-4">
                
                <h2 className="text-xl font-semibold text-gray-900">
                  
                  Education
                </h2>
                <button
                  onClick={() => setShowEdu(true)}
                  className="px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-semibold"
                  type="button"
                >
                  
                  Add Education
                </button>
              </div>
              <div className="space-y-4">
                
                {educations.length === 0 && (
                  <p className="text-gray-500 text-sm">
                    
                    No education added yet.
                  </p>
                )}
                {educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="border border-gray-200 rounded-xl p-4 bg-brand-dark"
                  >
                    
                    <h3 className="text-gray-900 font-semibold">
                      
                      {edu.degree}
                    </h3>
                    <p className="text-gray-600 text-sm">{edu.school}</p>
                    <p className="text-gray-500 text-xs mt-2">
                      
                      {edu.startYear} - {edu.endYear}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-card p-6 rounded-2xl border border-gray-200 shadow-xl">
              
              <div className="flex items-center justify-between mb-4">
                
                <h2 className="text-xl font-semibold text-gray-900">
                  
                  Skills
                </h2>
                <button
                  onClick={() => setShowSkill(true)}
                  className="px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-semibold"
                  type="button"
                >
                  
                  Add Skill
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                
                {skills.length === 0 && (
                  <p className="text-gray-500 text-sm">No skills added yet.</p>
                )}
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className={`px-3 py-1 rounded-full text-xs border ${skill.verified ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-brand-dark text-brand-accent border-brand-accent/30"}`}
                  >
                    
                    {skill.name} {skill.verified && " � Verified"}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300 ${overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => {
          setShowEdit(false);
          setShowExp(false);
          setShowEdu(false);
          setShowSkill(false);
        }}
      ></div>
      {showEdit && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          
          <div className="bg-brand-dark p-8 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
              
              Edit Profile
            </h2>
            <form onSubmit={saveProfile}>
              
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Full Name
                </label>
                <input
                  value={editDraft.name}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Headline/Title
                </label>
                <input
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Location
                </label>
                <input
                  value={editDraft.location}
                  onChange={(e) =>
                    setEditDraft((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                />
              </div>
              <div className="mb-6">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  About
                </label>
                <textarea
                  value={editDraft.about}
                  onChange={(e) =>
                    setEditDraft((prev) => ({ ...prev, about: e.target.value }))
                  }
                  rows={4}
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-6 py-2 rounded-full bg-gray-600 text-gray-900 font-semibold hover:bg-gray-500 transition-colors"
                >
                  
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary transition-colors"
                >
                  
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showExp && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          
          <div className="bg-brand-dark p-8 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
              
              Add Experience
            </h2>
            <form onSubmit={addExperience}>
              
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Title
                </label>
                <input
                  value={expDraft.title}
                  onChange={(e) =>
                    setExpDraft((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Company Name
                </label>
                <input
                  value={expDraft.company}
                  onChange={(e) =>
                    setExpDraft((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                
                <div>
                  
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    
                    Start Date
                  </label>
                  <input
                    value={expDraft.start}
                    onChange={(e) =>
                      setExpDraft((prev) => ({
                        ...prev,
                        start: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    
                    End Date
                  </label>
                  <input
                    value={expDraft.end}
                    onChange={(e) =>
                      setExpDraft((prev) => ({ ...prev, end: e.target.value }))
                    }
                    className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Description
                </label>
                <textarea
                  value={expDraft.description}
                  onChange={(e) =>
                    setExpDraft((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                
                <button
                  type="button"
                  onClick={() => setShowExp(false)}
                  className="px-6 py-2 rounded-full bg-gray-600 text-gray-900 font-semibold hover:bg-gray-500 transition-colors"
                >
                  
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary transition-colors"
                >
                  
                  Add Experience
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showEdu && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          
          <div className="bg-brand-dark p-8 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
              
              Add Education
            </h2>
            <form onSubmit={addEducation}>
              
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Degree/Certificate Name
                </label>
                <input
                  value={eduDraft.degree}
                  onChange={(e) =>
                    setEduDraft((prev) => ({ ...prev, degree: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  School/University Name
                </label>
                <input
                  value={eduDraft.school}
                  onChange={(e) =>
                    setEduDraft((prev) => ({ ...prev, school: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                
                <div>
                  
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    
                    Start Year
                  </label>
                  <input
                    value={eduDraft.startYear}
                    onChange={(e) =>
                      setEduDraft((prev) => ({
                        ...prev,
                        startYear: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
                <div>
                  
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    
                    End Year
                  </label>
                  <input
                    value={eduDraft.endYear}
                    onChange={(e) =>
                      setEduDraft((prev) => ({
                        ...prev,
                        endYear: e.target.value,
                      }))
                    }
                    className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                
                <button
                  type="button"
                  onClick={() => setShowEdu(false)}
                  className="px-6 py-2 rounded-full bg-gray-600 text-gray-900 font-semibold hover:bg-gray-500 transition-colors"
                >
                  
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary transition-colors"
                >
                  
                  Add Education
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showSkill && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          
          <div className="bg-brand-dark p-8 rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg">
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">
              
              Add Skill
            </h2>
            <form onSubmit={addSkill}>
              
              <div className="mb-4">
                
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  
                  Skill Name
                </label>
                <input
                  value={skillDraft.name}
                  onChange={(e) =>
                    setSkillDraft((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full p-3 rounded-lg bg-brand-card border border-gray-200 text-gray-900 focus:ring-brand-primary focus:border-brand-primary transition-colors"
                  required
                />
              </div>
              <div className="mb-6 flex items-center">
                
                <input
                  type="checkbox"
                  checked={skillDraft.verified}
                  onChange={(e) =>
                    setSkillDraft((prev) => ({
                      ...prev,
                      verified: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 text-brand-primary border-gray-200 rounded bg-brand-card focus:ring-brand-primary"
                />
                <label className="ml-2 block text-sm text-gray-600">
                  
                  Mark as verified/endorsed?
                </label>
              </div>
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                
                <button
                  type="button"
                  onClick={() => setShowSkill(false)}
                  className="px-6 py-2 rounded-full bg-gray-600 text-gray-900 font-semibold hover:bg-gray-500 transition-colors"
                >
                  
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-brand-primary text-white font-semibold hover:bg-brand-primary transition-colors"
                >
                  
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}


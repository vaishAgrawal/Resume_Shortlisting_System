import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";
import { Toaster, toast } from 'react-hot-toast';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [profile, setProfile] = useState({
    firstName: "", lastName: "", email: "", phone: "", 
    college: "", degree: "", passingYear: "", location: "", imageUrl: ""
  });

  useEffect(() => {
    const saved = localStorage.getItem("profileData");
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem("profileData", JSON.stringify(profile));
    toast.success("Profile Updated Successfully!");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfile(prev => ({ ...prev, imageUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const toggleVisibility = (field) => setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));

  return (
    <main className="min-h-screen bg-[#f5f3ff] p-6 md:p-10 font-sans">
      <Toaster position="top-right" />
      
      <div className="max-w-5xl mx-auto bg-white rounded-[40px] p-8 shadow-sm border border-indigo-100">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12 items-start">
          
          <aside className="space-y-6 self-start">
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full bg-[#ede9fe] flex items-center justify-center overflow-hidden mb-2 border-4 border-white shadow-md">
                {profile.imageUrl ? <img src={profile.imageUrl} className="w-full h-full object-cover" alt="Profile" /> : <span className="text-indigo-300">No Img</span>}
              </div>
              
              <label className="flex items-center gap-2 bg-[#8b5cf6] px-4 py-2 rounded-full cursor-pointer text-white text-sm font-semibold hover:bg-[#7c3aed] transition shadow-sm">
                <FaCamera size={14} />
                Change Photo
                <input type="file" className="hidden" onChange={handleAvatarChange} />
              </label>

              <h2 className="text-xl font-bold text-indigo-950 mt-4 font-display">
                {profile.firstName || "User"}
              </h2>
            </div>
            
            <nav className="space-y-2">
              {["info", "security"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full p-4 rounded-2xl font-medium transition cursor-pointer ${
                    activeTab === tab
                      ? "bg-[#ede9fe] text-[#6d28d9]"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {tab === "info" ? "Personal Information" : "Login & Password"}
                </button>
              ))}
              <button
                onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                className="w-full text-red-400 p-4 rounded-2xl font-medium hover:bg-red-50 cursor-pointer"
              >
                Log Out
              </button>
            </nav>
          </aside>

          <section className="self-start">
            {activeTab === "info" ? (
              <>
                <h2 className="text-3xl font-bold text-[#6d28d9] mb-8 tracking-tight font-sans border-l-4 border-[#8b5cf6] pl-4">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Fields */}
                  <div>
                    <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">First Name</label>
                    <input placeholder=" First Name" value={profile.firstName} onChange={e => setProfile({...profile, firstName: e.target.value})} className="w-full bg-[#fafaff] border border-indigo-50 p-4 rounded-2xl mt-1 text-indigo-900 focus:ring-2 focus:ring-[#8b5cf6] outline-none"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">Last Name</label>
                    <input placeholder=" Last Name" value={profile.lastName} onChange={e => setProfile({...profile, lastName: e.target.value})} className="w-full bg-[#fafaff] border border-indigo-50 p-4 rounded-2xl mt-1 text-indigo-900 focus:ring-2 focus:ring-[#8b5cf6] outline-none"/>
                  </div>
                  {/* Email Field */}
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">Email</label>
                    <input disabled value={profile.email} className="w-full bg-gray-50 border border-indigo-50 p-4 rounded-2xl mt-1 text-gray-500 cursor-not-allowed"/>
                  </div>
                  {/* Remaining Fields */}
                  {['phone', 'college', 'degree', 'passingYear'].map((key) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">{key.replace(/([A-Z])/g, ' $1')}</label>
                      <input placeholder={` ${key.replace(/([A-Z])/g, ' $1')}`} value={profile[key]} onChange={e => setProfile({...profile, [key]: e.target.value})} className="w-full bg-[#fafaff] border border-indigo-50 p-4 rounded-2xl mt-1 text-indigo-900 focus:ring-2 focus:ring-[#8b5cf6] outline-none"/>
                    </div>
                  ))}
                </div>
                <button onClick={handleSave} className="mt-10 w-full py-4 bg-[#8b5cf6] text-white rounded-2xl font-bold hover:bg-[#7c3aed] transition cursor-pointer">
                  Save Changes
                </button>
              </>
            ) : (
              <>
                <h2 className="text-3xl font-bold text-[#6d28d9] mb-8 tracking-tight font-sans border-l-4 border-[#8b5cf6] pl-4">
                  Security Settings
                </h2>
                {["current", "new", "confirm"].map((field) => (
                  <div key={field} className="mb-6 relative">
                    <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">{field} Password</label>
                    <input placeholder={` ${field} password`} type={showPassword[field] ? "text" : "password"} value={passwords[field]} onChange={e => setPasswords({...passwords, [field]: e.target.value})} className="w-full bg-[#fafaff] border border-indigo-50 p-4 rounded-2xl mt-1 text-indigo-900 focus:ring-2 focus:ring-[#8b5cf6] outline-none" />
                    <button type="button" onClick={() => toggleVisibility(field)} className="absolute right-4 top-12 text-indigo-300 cursor-pointer">
                      {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                ))}
                <button onClick={() => toast.success("Password Updated!")} className="w-full py-4 bg-[#8b5cf6] text-white rounded-2xl font-bold hover:bg-[#7c3aed] transition cursor-pointer">
                  Update Password
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
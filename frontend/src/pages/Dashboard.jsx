import { useState } from "react";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    role: "Recruiter"
  });

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-slate-500">Manage your profile and security preferences.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT: AVATAR & NAVIGATION */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center text-blue-600 font-bold text-2xl">JD</div>
              <button className="text-sm font-semibold text-blue-600 hover:underline">Change Photo</button>
            </div>
            <nav className="space-y-2">
              {["General", "Security", "Notifications"].map((item) => (
                <button key={item} className="w-full text-left px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-white hover:shadow-sm transition">
                  {item}
                </button>
              ))}
            </nav>
          </div>

          {/* RIGHT: EDIT FORM */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Full Name</label>
                <input value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                <input value={profile.email} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3" disabled />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Security</h2>
              <button className="text-blue-600 font-semibold text-sm hover:underline">Change Password</button>
            </div>

            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition">Save Changes</button>
          </div>
        </div>
      </div>
    </main>
  );
}
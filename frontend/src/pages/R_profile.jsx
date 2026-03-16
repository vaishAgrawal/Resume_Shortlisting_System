import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiAward,
  FiCalendar,
  FiHome,
  FiLock,
  FiLogOut,
  FiSettings,
  FiUsers,
  FiFileText,
  FiGrid
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const role = "recruiter";
  const isRecruiter = role === "recruiter";

  const [profile, setProfile] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    college: "",
    degree: "",
    passingYear: "",
    location: "",
    imageUrl: ""
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const data = response.data;
        
        // Split backend full name into first and last name for the UI
        const fullName = data.name || "";
        const nameParts = fullName.split(" ");
        setProfile({
          fullName,
          firstName: isRecruiter ? "" : nameParts[0] || "",
          lastName: isRecruiter ? "" : nameParts.slice(1).join(" ") || "",
          email: data.email || "",
          phone: data.phone || "",
          college: data.college || "",
          degree: data.degree || "",
          passingYear: data.passingYear || "",
          location: data.location || "",
          imageUrl: data.imageUrl || "" // Handle image separately if needed
        });
      } catch (err) {
        toast.error("Failed to load profile data");
      }
    };
    fetchProfile();
  }, []);

  // 1. Updated handleAvatarChange
const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    // Basic validation: max 2MB
    if (file.size > 2000000) {
      toast.error("Image too large! Please choose a file under 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfile((prev) => {
        const updated = { ...prev, imageUrl: reader.result };
        const storedName = (updated.fullName || `${updated.firstName} ${updated.lastName}`.trim()).trim();
        localStorage.setItem(
          "profileData",
          JSON.stringify({ fullName: storedName, imageUrl: updated.imageUrl })
        );
        window.dispatchEvent(new Event("profileUpdated"));
        return updated;
      });
      toast.success("Preview updated! Click 'Save' to persist.");
    };
    reader.readAsDataURL(file);
  }
};

// 2. Updated handleSave
const handleSave = async () => {
  setLoading(true);
  try {
    const updatePayload = isRecruiter
      ? {
          name: `${profile.firstName} ${profile.lastName}`.trim(),
          email: profile.email,
          phone: profile.phone,
          imageUrl: profile.imageUrl
        }
      : {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phone: profile.phone,
          college: profile.college,
          degree: profile.degree,
          passingYear: profile.passingYear ? parseInt(profile.passingYear) : "",
          location: profile.location,
          imageUrl: profile.imageUrl
        };

    await api.put("/auth/profile", updatePayload);
    const storedName = `${profile.firstName} ${profile.lastName}`.trim();
    localStorage.setItem(
      "profileData",
      JSON.stringify({ fullName: storedName, imageUrl: profile.imageUrl })
    );
    window.dispatchEvent(new Event("profileUpdated"));
    toast.success("Profile and Photo Updated!");
    setIsEditing(false);
  } catch (err) {
    toast.error("Update failed. Check file size.");
  } finally {
    setLoading(false);
  }
};

  // 3. CHANGE PASSWORD
  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      await api.put("/auth/profile/password", {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      toast.success("Password Updated!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Password update failed");
    }
  };

  const toggleVisibility = (field) =>
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <main className="h-screen bg-[#f5f3ff] font-sans overflow-hidden">
      <Toaster position="top-right" />

      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[260px] flex-col bg-[#3b2a63] px-6 py-8 text-white">
        <div className="flex flex-col items-center text-center">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white bg-white/15 shadow-sm">
            {profile.imageUrl ? (
              <img src={profile.imageUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white font-bold">
                {isRecruiter ? "R" : "U"}
              </div>
            )}
          </div>
          <button
            onClick={() => document.getElementById("sidebar-photo-input")?.click()}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-white/25 transition"
          >
            <FaCamera size={12} />
            Change Photo
          </button>
          <input
            id="sidebar-photo-input"
            type="file"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="mt-10 space-y-5">
          {!isRecruiter ? (
            <>
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full text-left text-base font-bold tracking-wide transition flex items-center gap-3 ${
                  activeTab === "info"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <FiUser className="text-lg" />
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`w-full text-left text-base font-bold tracking-wide transition flex items-center gap-3 ${
                  activeTab === "security"
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <FiLock className="text-lg" />
                Login & Password
              </button>
              <button
                onClick={() => {
                  window.location.href = "/user-dashboard";
                }}
                className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3"
              >
                <FiHome className="text-lg" />
                Home
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  window.location.href = "/recruiter-dashboard";
                }}
                className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3"
              >
                <FiGrid className="text-lg" />
                Dashboard
              </button>
              <button className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3">
                <FiUsers className="text-lg" />
                Candidates
              </button>
              <button className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3">
                <FiFileText className="text-lg" />
                Shortlisted Resumes
              </button>
              <button className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3">
                <FiSettings className="text-lg" />
                Settings
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="w-full text-left text-base font-bold tracking-wide text-white/80 hover:text-white transition flex items-center gap-3"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </>
          )}
        </div>

        <div className="mt-auto pt-6">
          <img
            src="/images/graphuralogo.webp"
            alt="Graphura logo"
            className="w-full h-auto object-contain opacity-90 brightness-0 invert"
          />
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <div className="h-screen overflow-y-auto md:ml-[260px] px-6 md:px-10 py-8">
        <div className="mx-auto max-w-6xl space-y-8">

          <div className="rounded-2xl bg-gradient-to-r from-[#2a1f4d] via-[#3b2a63] to-[#1f1635] px-6 py-5 shadow-md">
            <h2 className="text-4xl font-bold tracking-tight text-white text-center">
              {isRecruiter ? "Recruiter Dashboard" : "User Dashboard"}
            </h2>
          </div>

          {/* DETAILS */}
          <section className="p-0">

            {activeTab === "info" ? (
              <>
                <div className="border-t border-indigo-100 pt-6 mb-10 flex items-center justify-between">
                  <h2 className="text-3xl font-bold tracking-wide text-[#4c1d95] flex items-center gap-3">
                    <FiUser className="text-[#8b5cf6]" />
                    Personal Information
                  </h2>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="rounded-full bg-[#ede9fe] px-4 py-1.5 text-sm font-semibold text-[#4c1d95] shadow-sm hover:bg-[#dcd3ff] transition"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isRecruiter ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        First Name
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiUser className="text-indigo-300" />
                        <input
                          placeholder={isEditing ? "First Name" : ""}
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                          }
                          readOnly={!isEditing}
                          className="w-full bg-transparent px-0 py-1 text-indigo-900 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Last Name
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiUser className="text-indigo-300" />
                        <input
                          placeholder={isEditing ? "Last Name" : ""}
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                          readOnly={!isEditing}
                          className="w-full bg-transparent px-0 py-1 text-indigo-900 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Email Address
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiMail className="text-indigo-300" />
                        <input
                          disabled
                          placeholder={isEditing ? "Email" : ""}
                          value={profile.email}
                          className="w-full bg-transparent px-0 py-1 text-gray-500 cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Phone Number
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiPhone className="text-indigo-300" />
                        <input
                          placeholder={isEditing ? "Phone" : ""}
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          readOnly={!isEditing}
                          type="tel"
                          className="w-full bg-transparent px-0 py-1 text-indigo-900 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        First Name
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiUser className="text-indigo-300" />
                        <input
                          placeholder={isEditing ? "First Name" : ""}
                          value={profile.firstName}
                          onChange={(e) =>
                            setProfile({ ...profile, firstName: e.target.value })
                          }
                          readOnly={!isEditing}
                          className="w-full bg-transparent px-0 py-1 text-indigo-900 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Last Name
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiUser className="text-indigo-300" />
                        <input
                          placeholder={isEditing ? "Last Name" : ""}
                          value={profile.lastName}
                          onChange={(e) =>
                            setProfile({ ...profile, lastName: e.target.value })
                          }
                          readOnly={!isEditing}
                          className="w-full bg-transparent px-0 py-1 text-indigo-900 outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                        Email Address
                      </p>
                      <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                        <FiMail className="text-indigo-300" />
                        <input
                          disabled
                          placeholder={isEditing ? "Email" : ""}
                          value={profile.email}
                          className="w-full bg-transparent px-0 py-1 text-gray-500 cursor-not-allowed outline-none"
                        />
                      </div>
                    </div>

                    {["phone", "college", "degree", "passingYear", "location"].map(
                      (key) => (
                        <div key={key} className="space-y-2">
                          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                            {key.replace(/([A-Z])/g, " $1")}
                          </p>
                          <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                            {key === "phone" && <FiPhone className="text-indigo-300" />}
                            {key === "college" && <FiBookOpen className="text-indigo-300" />}
                            {key === "degree" && <FiAward className="text-indigo-300" />}
                            {key === "passingYear" && <FiCalendar className="text-indigo-300" />}
                            {key === "location" && <FiMapPin className="text-indigo-300" />}

                            <input
                              placeholder={isEditing ? key.replace(/([A-Z])/g, " $1") : ""}
                              value={profile[key]}
                              onChange={(e) =>
                                setProfile({
                                  ...profile,
                                  [key]: e.target.value
                                })
                              }
                              readOnly={!isEditing}
                              type={
                                key === "phone"
                                  ? "tel"
                                  : key === "passingYear"
                                  ? "number"
                                  : "text"
                              }
                              min={key === "passingYear" ? "1900" : undefined}
                              className="w-full bg-transparent px-0 py-1 text-indigo-900 outline-none"
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="mt-8 w-full py-4 bg-[#8b5cf6] text-white rounded-2xl font-bold hover:bg-[#7c3aed] transition"
                  >
                    Save Changes
                  </button>
                )}
              </>
            ) : (
              <>
                <div className="border-t border-indigo-100 pt-6 mb-10">
                  <h2 className="text-3xl font-bold tracking-wide text-[#4c1d95] flex items-center gap-3">
                    <FiLock className="text-[#8b5cf6]" />
                    Security Settings
                  </h2>
                </div>

                {["current", "new", "confirm"].map((field) => (
                  <div key={field} className="mb-6 relative">

                    <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">
                      {field} Password
                    </label>

                    <input
                      type={showPassword[field] ? "text" : "password"}
                      value={passwords[field]}
                      onChange={(e) =>
                        setPasswords({
                          ...passwords,
                          [field]: e.target.value
                        })
                      }
                      className="w-full bg-transparent border-b border-indigo-100 px-0 py-2 mt-1 text-indigo-900 outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => toggleVisibility(field)}
                      className="absolute right-4 top-12 text-indigo-300 cursor-pointer"
                    >
                      {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
                    </button>

                  </div>
                ))}

                <button
                  onClick={handlePasswordUpdate}
                  className="w-full py-4 bg-[#8b5cf6] text-white rounded-2xl font-bold hover:bg-[#7c3aed] transition"
                >
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

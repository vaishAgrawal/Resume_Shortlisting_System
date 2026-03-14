import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBookOpen,
  FiAward,
  FiCalendar
} from "react-icons/fi";
import { Toaster, toast } from "react-hot-toast";
import api from "../api/axios";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info");
  const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
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
        const nameParts = data.name.split(" ");
        setProfile({
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: data.email,
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
      setProfile((prev) => ({ ...prev, imageUrl: reader.result }));
      toast.success("Preview updated! Click 'Save' to persist.");
    };
    reader.readAsDataURL(file);
  }
};

// 2. Updated handleSave
const handleSave = async () => {
  setLoading(true);
  try {
    const updatePayload = {
      ...profile, // This now includes imageUrl (the base64 string)
      passingYear: parseInt(profile.passingYear)
    };

    await api.put("/auth/profile", updatePayload);
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
    <main className="h-screen overflow-hidden bg-[#f5f3ff] p-6 md:p-10 font-sans">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 h-full">

        {/* SIDEBAR */}
        <aside className="bg-white rounded-2xl border border-indigo-100 shadow-sm p-6 flex flex-col sticky top-6">

          {/* DASHBOARD HEADER */}
          <div className="rounded-xl bg-gradient-to-r from-[#ede9fe] to-[#f5f3ff] px-5 py-5 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 rounded-full bg-[#6d28d9]"></div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-indigo-800 tracking-wide">
                    Dashboard
                  </h2>
                </div>
                <p className="text-xs text-indigo-500 mt-1">
                  Account overview
                </p>
              </div>
            </div>
          </div>
          <br />
          <hr />

          {/* MENU */}
          <div className="space-y-4 mt-6">
            {["info", "security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-5 py-3 rounded-2xl text-sm font-semibold transition ${
                  activeTab === tab
                    ? "bg-[#ede9fe] text-[#6d28d9]"
                    : "bg-white text-slate-500 hover:bg-slate-50"
                }`}
              >
                {tab === "info"
                  ? "Personal Information"
                  : "Login & Password"}
              </button>
            ))}

            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/login";
              }}
              className="w-full text-left px-5 py-3 rounded-2xl text-sm font-semibold text-red-500 bg-white hover:bg-red-50 transition"
            >
              Log Out
            </button>
          </div>

          {/* LOGO BOTTOM */}
          <div className="mt-auto pt-6 border-t border-indigo-50 flex justify-center">
            <img
              src="/images/graphuralogo.webp"
              alt="Graphura logo"
              className="w-full h-auto object-contain opacity-80"
            />
          </div>
        </aside>

        {/* RIGHT SIDE CONTENT */}
        <div className="space-y-8 overflow-y-auto pr-2">

          {/* PROFILE HEADER */}
          <div className="bg-white rounded-[32px] border border-indigo-100 shadow-sm overflow-hidden">
            <div className="h-28 bg-gradient-to-r from-[#c7d2fe] via-[#ddd6fe] to-[#c4b5fd]"></div>

            <div className="px-8 pb-8 -mt-14 flex flex-col gap-6">

              <div className="flex flex-col items-start">

                <div className="relative w-40 h-40 rounded-full bg-white border-4 border-white shadow-md overflow-hidden">
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      className="w-full h-full object-cover"
                      alt="Profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#ede9fe] flex items-center justify-center text-indigo-300 font-semibold">
                      No Img
                    </div>
                  )}
                  
                </div>

                {/* CHANGE PHOTO BUTTON */}
                <label className="mt-4 flex items-center gap-2 bg-[#8b5cf6] px-4 py-2 rounded-full cursor-pointer text-white text-sm font-semibold hover:bg-[#7c3aed] transition shadow-sm">
                  <FaCamera size={14} />
                  Change Photo
                  <input type="file" className="hidden" onChange={handleAvatarChange} />
                </label>

                <h2 className="text-2xl font-bold text-indigo-950 mt-4">
                  {profile.firstName || "User"} {profile.lastName}
                </h2>

              </div>
            </div>
          </div>

          {/* DETAILS */}
          <section className="bg-white rounded-[28px] border border-indigo-100 shadow-sm p-8">

            {activeTab === "info" ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-indigo-950">
                    Profile Details
                  </h2>

                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition"
                    >
                      Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                  {/* FIRST NAME */}
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

                  {/* LAST NAME */}
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

                  {/* EMAIL */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                      Email
                    </p>

                    <div className="flex items-center gap-2 border-b border-indigo-100 pb-2">
                      <FiMail className="text-indigo-300" />

                      <input
                        disabled
                        value={profile.email}
                        className="w-full bg-transparent px-0 py-1 text-gray-500 cursor-not-allowed"
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
                            placeholder={
                              isEditing
                                ? key.replace(/([A-Z])/g, " $1")
                                : ""
                            }
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
                <h2 className="text-xl font-bold text-indigo-950 mb-6">
                  Security Settings
                </h2>

                {["current", "new", "confirm"].map((field) => (
                  <div key={field} className="mb-6 relative">

                    <label className="text-xs font-semibold text-indigo-400 uppercase tracking-wider ml-1">
                      {field} Password
                    </label>

                    <input
                      placeholder={`${field} password`}
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

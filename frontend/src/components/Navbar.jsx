import { useEffect, useRef, useState } from "react";
const ADMIN_EMAIL = "admin@graphura.com";
const ADMIN_PASS = "Admin2025!";
const HR_SECRET_KEY = "SECRET123";
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [profile, setProfile] = useState({ initials: "U", imageUrl: "" });
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const profileRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    setIsAuthed(Boolean(token || role || userId));

    const storedProfile = localStorage.getItem("profileData");
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        const name = (parsed.fullName || "").trim();
        const initials = name
          ? name
              .split(" ")
              .filter(Boolean)
              .slice(0, 2)
              .map((part) => part[0].toUpperCase())
              .join("")
          : "U";
        setProfile({
          initials,
          imageUrl: parsed.imageUrl || ""
        });
      } catch {
        setProfile({ initials: "U", imageUrl: "" });
      }
    }
  }, []);
  useEffect(() => {
    if (!mobileOpen) return;
    const onClick = (event) => {
      const menu = menuRef.current;
      const button = menuButtonRef.current;
      if (!menu || !button) return;
      if (!menu.contains(event.target) && !button.contains(event.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [mobileOpen]);
  useEffect(() => {
    if (!profileOpen) return;
    const onClick = (event) => {
      const menu = profileRef.current;
      if (!menu) return;
      if (!menu.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [profileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setIsAuthed(false);
    setProfileOpen(false);
    window.location.href = "/login";
  };
  const handleRecruiterClick = () => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      window.location.href = "/recruiter";
    } else {
      alert("Access Denied: Please login first.");
    }
  };
  return (
    <>
      
      <nav
        className="fixed w-full z-50 transition-all duration-300 glass-nav shadow-lg bg-white/90 backdrop-blur-md"
        id="navbar"
      >
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex justify-between items-center h-20">
            
            <a href="/" className="flex-shrink-0 flex items-center gap-2 group">
              
              <img
                src="/images/graphuralogo.png"
                alt="Graphura Logo"
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
              />
            </a>
            <div className="hidden md:flex space-x-8 items-center">
              
              <a
                href="/"
                className="text-gray-800 hover:text-brand-primary font-medium transition hover-underline-animation"
              >
                
                Home
              </a>
              <button
                onClick={handleRecruiterClick}
                className="text-gray-800 hover:text-brand-primary font-medium transition hover-underline-animation"
                type="button"
              >
                
                Recruiter
              </button>
              {!isAuthed ? (
                <div className="flex items-center space-x-6">
                  
                  <a
                    href="/login"
                    className="text-gray-800 hover:text-brand-primary font-medium transition hover-underline-animation"
                  >
                    
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold shadow-lg hover:bg-brand-primary transition-all duration-300 w-full z-50 relative"
                  >
                    
                    Sign Up
                  </a>
                </div>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center group"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    aria-label="Account menu"
                  >
                    {profile.imageUrl ? (
                      <img
                        src={profile.imageUrl}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border border-brand-primary/30 shadow-sm"
                      />
                    ) : (
                      <span className="h-10 w-10 rounded-full bg-gradient-to-br from-[#7c5ce5] to-[#a78bfa] text-white flex items-center justify-center shadow-sm">
                        <i className="fas fa-user text-sm"></i>
                      </span>
                    )}
                  </button>

                  {profileOpen ? (
                    <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-gray-200 bg-white shadow-xl p-2">
                      <a
                        href="/profile"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-user"></i>
                        View Profile
                      </a>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
            <div className="md:hidden flex items-center">
              
              <button
                ref={menuButtonRef}
                onClick={() => setMobileOpen((v) => !v)}
                className="focus:outline-none p-3 relative z-50"
                type="button"
                aria-label="Toggle mobile menu"
              >
                
                <i className="fas fa-bars text-gray-800 text-3xl"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <div
        ref={menuRef}
        className={`md:hidden ${mobileOpen ? "block" : "hidden"} bg-white shadow-lg w-full fixed top-20 left-0 z-50`}
      >
        
        <div className="flex flex-col items-center space-y-4 p-6">
          
          <a
            href="/"
            onClick={() => setMobileOpen(false)}
            className="text-gray-800 hover:text-brand-primary font-medium text-lg"
          >
            
            Home
          </a>
          <button
            onClick={() => {
              setMobileOpen(false);
              handleRecruiterClick();
            }}
            className="text-gray-800 hover:text-brand-primary font-medium text-lg"
            type="button"
          >
            
            Recruiter
          </button>
          {!isAuthed ? (
            <div className="flex flex-col items-center space-y-2 w-full">
              
              <a
                href="/login"
                onClick={() => {
                  setMobileOpen(false);
                }}
                className="text-gray-800 hover:text-brand-primary font-medium w-full"
              >
                
                Login
              </a>
              <a
                href="/signup"
                onClick={() => {
                  setMobileOpen(false);
                }}
                className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold shadow-lg hover:bg-brand-primary transition-all duration-300 w-full"
              >
                
                Sign Up
              </a>
            </div>
          ) : (
            <div className="w-full">
              <a
                href="/profile"
                className="flex items-center justify-center gap-3 rounded-full bg-brand-primary text-white font-semibold shadow-lg hover:bg-brand-primary transition-all duration-300 w-full py-2.5"
              >
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full object-cover border border-white/40"
                  />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-semibold">
                    {profile.initials}
                  </span>
                )}
                My Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export { ADMIN_EMAIL, ADMIN_PASS, HR_SECRET_KEY };


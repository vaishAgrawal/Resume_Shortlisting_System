import { useEffect, useRef, useState } from "react";
const ADMIN_EMAIL = "admin@graphura.com";
const ADMIN_PASS = "Admin2025!";
const HR_SECRET_KEY = "SECRET123";
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuthed(Boolean(token));
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
                <div>
                  
                  <a
                    href="/user-dashboard"
                    className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold shadow-lg shadow-brand-primary/30 hover:shadow-brand-primary/50 hover:bg-brand-primary transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    
                    <i className="fas fa-user-circle"></i> My Account
                  </a>
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
                href="/user-dashboard"
                className="px-6 py-2.5 rounded-full bg-brand-primary text-white font-semibold shadow-lg flex items-center justify-center gap-2 hover:bg-brand-primary transition-all duration-300 w-full"
              >
                
                <i className="fas fa-user-circle"></i> My Account
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export { ADMIN_EMAIL, ADMIN_PASS, HR_SECRET_KEY };


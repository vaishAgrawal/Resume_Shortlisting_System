import { useEffect, useState } from "react";
import { ADMIN_EMAIL, ADMIN_PASS, HR_SECRET_KEY } from "./Navbar.jsx";
export default function AuthModals({
  showLogin,
  showSignup,
  onCloseLogin,
  onCloseSignup,
  onOpenLogin,
  onOpenSignup,
}) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginRole, setLoginRole] = useState("User");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("User");
  const [signupSecret, setSignupSecret] = useState("");
  useEffect(() => {
    if (!showLogin && !showSignup) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        onCloseLogin();
        onCloseSignup();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showLogin, showSignup, onCloseLogin, onCloseSignup]);
  const handleLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      alert("Please enter both email and password.");
      return;
    }
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASS) {
      localStorage.setItem("jwtToken", "admin-session-active");
      localStorage.setItem("role", "Admin");
      localStorage.setItem("userName", "System Admin");
      onCloseLogin();
      window.location.href = "/admin";
      return;
    }
    localStorage.setItem("jwtToken", "demo-session-active");
    localStorage.setItem("role", loginRole);
    localStorage.setItem("userName", loginEmail.split("@")[0]);
    onCloseLogin();
  };
  const handleSignup = () => {
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      alert("Please complete all fields to sign up.");
      return;
    }
    if (signupRole === "HR" && signupSecret.trim() !== HR_SECRET_KEY) {
      alert("Invalid HR Secret Key. Access Denied.");
      return;
    }
    alert("Registration successful! Please login.");
    onCloseSignup();
  };
  const overlayVisible = showLogin || showSignup;
  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${overlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => {
          onCloseLogin();
          onCloseSignup();
        }}
      ></div>
      <div
        id="loginPopup"
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 w-full max-w-sm p-8 rounded-2xl shadow-2xl shadow-brand-primary/20 z-[70] transition-all duration-300 border border-brand-primary/30 backdrop-blur-xl relative overflow-hidden ${showLogin ? "opacity-100 scale-100 animate-fade-in" : "opacity-0 scale-90 pointer-events-none"}`}
      >
        
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <button
          onClick={onCloseLogin}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl transition-colors"
          type="button"
        >
          
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
          
          Welcome <span className="text-gradient">Back</span>
        </h2>
        <p className="text-gray-600 text-center text-sm mb-4">
          
          Login to access your recruiter dashboard
        </p>
        <div className="space-y-3">
          
          <div>
            
            <input
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              type="email"
              placeholder="Email Address"
              className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-900 text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            
            <input
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-900 text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
            />
          </div>
          <div className="pt-2">
            
            <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1 ml-1">
              
              Login As
            </label>
            <select
              value={loginRole}
              onChange={(e) => setLoginRole(e.target.value)}
              className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-600 text-sm focus:border-brand-primary focus:outline-none appearance-none cursor-pointer"
            >
              
              <option value="User">User</option>
              <option value="HR">Admin / HR</option>
            </select>
          </div>
        </div>
        <button
          className="w-full mt-6 bg-brand-primary hover:bg-brand-primary text-white font-bold py-3 text-sm rounded-xl transition-all shadow-lg shadow-brand-primary/20 hover:shadow-brand-primary/40 transform hover:-translate-y-1"
          onClick={handleLogin}
          type="button"
        >
          
          Sign In
        </button>
        <p className="text-center text-gray-500 text-sm mt-4">
          
          Don't have an account?
          <button
            onClick={() => {
              onCloseLogin();
              onOpenSignup();
            }}
            className="text-brand-primary font-medium hover:text-brand-accent transition-colors ml-1"
            type="button"
          >
            
            Create one
          </button>
        </p>
      </div>
      <div
        id="signupPopup"
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-white to-brand-accent/10 w-full max-w-sm p-6 rounded-2xl shadow-2xl shadow-brand-accent/20 z-[70] transition-all duration-300 border border-brand-accent/30 backdrop-blur-xl relative overflow-hidden ${showSignup ? "opacity-100 scale-100 animate-fade-in" : "opacity-0 scale-90 pointer-events-none"}`}
      >
        
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-brand-accent/20 rounded-full blur-2xl animate-pulse-slow"></div>
        <button
          onClick={onCloseSignup}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-xl transition-colors"
          type="button"
        >
          
          <i className="fas fa-times"></i>
        </button>
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2 tracking-tight">
          
          Create <span className="text-gradient">Account</span>
        </h2>
        <p className="text-gray-600 text-center text-sm mb-4">
          
          Join Graphura's AI network
        </p>
        <div className="space-y-3">
          
          <input
            value={signupName}
            onChange={(e) => setSignupName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-900 text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
          />
          <input
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-900 text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
          />
          <input
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-900 text-sm placeholder-gray-500 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
          />
          <div className="pt-2">
            
            <label className="block text-xs font-semibold text-brand-primary uppercase tracking-wider mb-1 ml-1">
              
              Register As
            </label>
            <select
              value={signupRole}
              onChange={(e) => setSignupRole(e.target.value)}
              className="w-full bg-brand-dark border border-gray-200 rounded-xl p-3 text-gray-600 text-sm focus:border-brand-primary focus:outline-none appearance-none cursor-pointer"
            >
              
              <option value="User">Candidate / User</option>
              <option value="HR">Recruiter / Admin</option>
            </select>
          </div>
          {signupRole === "HR" && (
            <div className="animate-fade-in">
              
              <label className="block text-xs font-semibold text-orange-400 uppercase tracking-wider mb-1 ml-1">
                
                Admin Secret Key
              </label>
              <input
                value={signupSecret}
                onChange={(e) => setSignupSecret(e.target.value)}
                type="password"
                placeholder="Enter key"
                className="w-full bg-brand-dark border border-orange-500/50 rounded-xl p-3 text-gray-900 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none transition-all"
              />
            </div>
          )}
        </div>
        <button
          onClick={handleSignup}
          className="w-full mt-6 bg-brand-accent hover:bg-brand-accent/90 text-white font-bold py-3 text-sm rounded-xl transition-all shadow-lg shadow-brand-accent/30 hover:shadow-brand-accent/50 transform hover:-translate-y-1"
          type="button"
        >
          
          Get Started
        </button>
        <p className="text-center text-gray-500 text-sm mt-4">
          
          Already a member?
          <button
            onClick={() => {
              onCloseSignup();
              onOpenLogin();
            }}
            className="text-brand-primary font-medium hover:text-brand-accent transition-colors ml-1"
            type="button"
          >
            
            Login
          </button>
        </p>
      </div>
    </>
  );
}


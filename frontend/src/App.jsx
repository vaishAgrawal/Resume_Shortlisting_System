import { useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import AOS from "aos";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import Home from "./pages/Home.jsx";
import Recruiter from "./pages/Recruiter.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserDashboard from "./pages/User.jsx";
import Documentation from "./pages/Documentation.jsx";
import Support from "./pages/Support.jsx";
import Privacy from "./pages/Privacy.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import ProfilePage from "./pages/U_profile.jsx";
import RecruiterProfile from "./pages/R_profile.jsx";

function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;
  if (allowedRole && role !== allowedRole) return <Navigate to="/" />;
  
  return children;
}

function RoleBasedProfile() {
  const token = localStorage.getItem("jwtToken");
  const role = (localStorage.getItem("role") || "").toUpperCase();
  if (!token) return <Navigate to="/login" />;
  return role === "RECRUITER" ? <RecruiterProfile /> : <ProfilePage />;
}


export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const hideChrome =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/profile";
  useEffect(() => {
    AOS.init({ once: true });
  }, []);
  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="bg-brand-dark text-gray-200 font-sans overflow-x-hidden selection:bg-brand-primary selection:text-gray-900">

      {!hideChrome && <Navbar />}
      <main>

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/recruiter" element={
            <ProtectedRoute allowedRole="RECRUITER">
              <Recruiter />
            </ProtectedRoute>
          }/>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/recruiter-dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<RoleBasedProfile />} />
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRole="USER">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          
        </Routes>
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && (
        <ScrollTopButton visible={showScrollTop} onClick={scrollToTop} />
      )}
    </div>
  );
}

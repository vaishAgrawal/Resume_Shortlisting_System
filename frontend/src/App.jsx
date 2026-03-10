import { useEffect, useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AOS from "aos";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollTopButton from "./components/ScrollTopButton.jsx";
import Home from "./pages/Home.jsx";
import Recruiter from "./pages/Recruiter.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import Documentation from "./pages/Documentation.jsx";
import Support from "./pages/Support.jsx";
import Privacy from "./pages/Privacy.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import { AdminPage, ProfilePage } from "./pages/Pages.jsx";
export default function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();
  const hideChrome =
    location.pathname === "/login" || location.pathname === "/signup";
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
  const yearText = useMemo(() => new Date().getFullYear(), []);
  return (
    <div className="bg-brand-dark text-gray-200 font-sans overflow-x-hidden selection:bg-brand-primary selection:text-gray-900">
      
      {!hideChrome && <Navbar />}
      <main>
        
        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/recruiter" element={<Recruiter />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/support" element={<Support />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      {!hideChrome && <Footer yearText={yearText} />}
      {!hideChrome && (
        <ScrollTopButton visible={showScrollTop} onClick={scrollToTop} />
      )}
    </div>
  );
}

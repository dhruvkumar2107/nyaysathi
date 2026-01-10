import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Find Lawyers", path: "/lawyers" },
    { name: "Legal AI Tools", path: "/ai-tools" },
    { name: "NyayVoice 🎙️", path: "/voice-assistant" },
    { name: "Resources", path: "/resources" },
    { name: "About", path: "/about" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 border-b ${scrolled
          ? "bg-white/90 backdrop-blur-md border-gray-200 shadow-sm py-3"
          : "bg-white border-transparent py-5"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-10">
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-slate-900 to-slate-700 text-white rounded-lg flex items-center justify-center text-xl font-bold shadow-md transform group-hover:scale-105 transition-transform duration-300">
              ⚖️
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900 group-hover:text-slate-700 transition-colors">
              Nyay<span className="text-blue-600">Sathi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${isActive(link.path)
                    ? "text-blue-600 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Judge Pro Badge Link */}
            <Link
              to="/judge-pro"
              className={`ml-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${isActive("/judge-pro")
                  ? "text-amber-700 bg-amber-50"
                  : "text-slate-600 hover:text-amber-700 hover:bg-amber-50"
                }`}
            >
              <span>Judge Pro</span>
              <span className="text-[10px] bg-gradient-to-r from-amber-400 to-amber-600 text-white px-1.5 py-0.5 rounded shadow-sm font-bold uppercase tracking-wider">
                PRO
              </span>
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={user.role === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard"}
                  className="text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold text-blue-700 shadow-sm">
                  {user.name?.[0].toUpperCase()}
                </div>
              </div>
            <Link to="/agreements" onClick={() => setMobileMenuOpen(false)} className="mx-auto w-full max-w-xs py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-lg transition">Agreements</Link>
            <Link to="/judge-ai" onClick={() => setMobileMenuOpen(false)} className="mx-auto w-full max-w-xs py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-lg transition">Judge AI</Link>
            <Link to="/assistant" onClick={() => setMobileMenuOpen(false)} className="mx-auto w-full max-w-xs py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-lg transition">AI Assistant</Link>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)} className="mx-auto w-full max-w-xs py-3 rounded-xl hover:bg-slate-50 text-slate-700 font-bold text-lg transition">Pricing</Link>
          </div>

          <div className="h-px bg-slate-200 my-6 w-1/2 mx-auto"></div>

          <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 text-slate-800 font-bold bg-slate-100 rounded-2xl">Log in</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 bg-[#0B1120] text-white font-bold rounded-2xl shadow-xl">Get Started</Link>
              </>
            ) : (
              <>
                <Link to={user.role === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard"} onClick={() => setMobileMenuOpen(false)} className="w-full text-center py-4 bg-blue-50 text-blue-700 font-bold rounded-2xl border border-blue-100">Go to Dashboard</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-center py-4 text-red-600 font-bold hover:bg-red-50 rounded-2xl transition">Sign Out</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, children, active }) {
  return (
    <Link
      to={to}
      className={`relative font-bold text-[15px] transition-colors duration-200 
        ${active ? "text-[#0B1120]" : "text-slate-500 hover:text-blue-600"}`}
    >
      {children}
      {/* Active Dot/Underline */}
      {active && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#0B1120] rounded-full"></span>
      )}
    </Link>
  );
}

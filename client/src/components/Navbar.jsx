import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const menuItems = [
    { to: user ? (user.role === 'lawyer' ? "/lawyer/dashboard" : "/client/dashboard") : "/", icon: "🏠", label: "Home" },
    { to: "/marketplace", icon: "⚖️", label: "Network" },
    { to: "/assistant", icon: "🤖", label: "AI Assistant" },
    { to: "/agreements", icon: "📄", label: "Agreements" },
    { to: "/pricing", icon: "💎", label: "Plans" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1F44]/90 backdrop-blur-md border-b border-white/10 h-[72px] flex items-center">
        <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between gap-6">

          {/* LEFT: Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white shrink-0 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition">
              <span className="text-xl">⚖️</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="group-hover:text-[#00D4FF] transition">NYAY</span>
              <span className="text-sm font-medium text-blue-300">SATHI</span>
            </div>
          </Link>

          {/* CENTER: Navigation (Desktop) */}
          <div className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
            {menuItems.map((item) => (
              <NavLink key={item.to} {...item} />
            ))}
          </div>

          {/* RIGHT: Profile / Auth */}
          <div className="flex items-center gap-4">
            {/* Search Trigger (Mobile/Desktop) */}
            <button className="p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-full transition">
              <span className="text-xl">🔍</span>
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-blue-300 capitalize">{user.plan || "Free"} Member</p>
                </div>
                <div className="relative group">
                  <button className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold ring-2 ring-[#00D4FF]/50 hover:ring-[#00D4FF] transition">
                    {user.name?.[0]}
                  </button>
                  {/* Dropdown */}
                  <div className="absolute top-12 right-0 w-48 bg-[#0F2A5F] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover:block animate-in fade-in slide-in-from-top-2">
                    <Link to="/settings" className="block px-4 py-3 text-sm text-blue-100 hover:bg-white/5 hover:text-white transition">Settings</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full text-blue-200 font-medium text-sm hover:text-white hover:bg-white/5 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-[#00D4FF] text-[#0A1F44] font-bold text-sm hover:bg-[#33ddff] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-blue-200 hover:bg-white/10 rounded-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-[280px] bg-[#0A1F44] border-l border-white/10 p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold text-white">Menu</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-blue-100 hover:bg-white/10 hover:text-[#00D4FF] transition"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ to, icon, label }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-blue-200 hover:text-white hover:bg-white/10 transition"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

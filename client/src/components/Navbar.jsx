'use client'

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale, BookOpen, FileText, Briefcase, Gavel,
  Mic, User, Search, MapPin, Video, DollarSign,
  Users, Menu, X, ChevronDown, LogOut, LayoutDashboard, Shield, Siren, Command, Sparkles
} from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const timeoutRef = useRef(null);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
  };

  const navItems = [
    {
      label: "Intelligence",
      items: [
        { name: "Judge AI", href: "/judge-ai", desc: "Strategic Prediction", icon: <Gavel size={18} /> },
        { name: "Legal Research", href: "/research", desc: "Semantic Search", icon: <Search size={18} /> },
        { name: "Drafting Lab", href: "/drafting", desc: "AI Automation", icon: <FileText size={18} /> },
        { name: "NyayVoice", href: "/voice-assistant", desc: "Multi-dialect AI", icon: <Mic size={18} /> },
        { name: "NyayCourt", href: "/courtroom-battle", desc: "Trial Simulator", icon: <Command size={18} /> },
        { name: "Legal SOS", href: "/legal-sos", desc: "Crisis Triage", icon: <Siren size={18} /> },
      ]
    },
    {
      label: "Enterprise",
      items: [
        { name: "Moot Court VR", href: "/moot-court", desc: "Elite Practice", icon: <Scale size={18} /> },
        { name: "Career Hub", href: "/career", desc: "Lawyer Network", icon: <Briefcase size={18} /> },
        { name: "Agreements", href: "/agreements", desc: "Verified Docs", icon: <BookOpen size={18} /> },
        { name: "AI Assistant", href: "/assistant", desc: "24/7 Counsel", icon: <Sparkles size={18} /> },
      ]
    },
    {
      label: "Network",
      items: [
        { name: "Find Lawyers", href: "/marketplace", desc: "Verified Counsel", icon: <Users size={18} /> },
        { name: "Nearby Help", href: "/nearby", desc: "Locate Services", icon: <MapPin size={18} /> },
        { name: "Video Meeting", href: "/meet", desc: "Secure Chambers", icon: <Video size={18} /> },
        { name: "Enterprise Pricing", href: "/pricing", desc: "Global Access", icon: <DollarSign size={18} /> },
      ]
    },
  ];

  return (
    <>
      <nav className="fixed top-0 w-full z-[9999] bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 h-[80px] transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-8 h-full flex items-center">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group relative z-50 shrink-0" aria-label="NyayNow Home">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-105 transition duration-300">
              <Image src="/logo.png" alt="NyayNow Logo" width={24} height={24} className="object-contain" />
            </div>
            <span className="text-xl font-bold tracking-[-0.03em] text-white hover:text-blue-400 transition-colors duration-300">NyayNow</span>
          </Link>

          {/* DESKTOP NAV - CENTERED */}
          <div className="hidden lg:flex items-center gap-2 h-full mx-auto">
            {user?.role !== 'admin' && navItems.map((category, idx) => (
              <div
                key={idx}
                className="relative h-full flex items-center"
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-bold tracking-tight transition-all duration-300 ${hoveredIndex === idx ? "text-blue-400 bg-white/5" : "text-slate-400 hover:text-white"}`}
                >
                  {category.label}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${hoveredIndex === idx ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {hoveredIndex === idx && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[540px]"
                    >
                      <div className="bg-[#030712] border border-white/5 rounded-3xl p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] grid grid-cols-2 gap-2 relative overflow-hidden">
                        {category.items.map((item, i) => (
                          <Link
                            key={i}
                            href={item.href}
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition group relative z-10"
                          >
                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:border-blue-500/30 group-hover:bg-blue-500/5 transition-all duration-300">
                              {item.icon}
                            </div>
                            <div>
                              <div className="text-white font-bold text-[13px] group-hover:text-blue-400 transition tracking-tight">{item.name}</div>
                              <div className="text-slate-500 text-[11px] font-medium tracking-tight">{item.desc}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 relative z-50 ml-auto shrink-0">
            {/* AUTH / PROFILE */}
            {!user ? (
              <div className="flex items-center gap-4">
                <Link href="/login" className="hidden sm:block font-bold text-[13px] text-slate-400 hover:text-white transition-all duration-300 px-4">
                  Sign in
                </Link>
                <div className="h-4 w-px bg-white/10 hidden sm:block" />
                <Link href="/register" className="px-6 py-2.5 bg-white text-slate-950 font-bold text-[13px] rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-xl shadow-white/5">
                  Get Started
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 p-1 hover:border-blue-500/50 transition duration-300 overflow-hidden flex items-center justify-center shadow-2xl">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="User profile" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="font-bold text-blue-500 text-base uppercase">{user.name[0]}</span>
                    )}
                  </div>

                  {/* PREMIUM DROPDOWN */}
                  <div className="absolute right-0 top-full mt-4 w-64 bg-[#030712] border border-white/5 rounded-3xl p-2 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-5 border-b border-white/5 mb-2 bg-white/5 rounded-[20px]">
                      <p className="text-white font-bold text-[13px] truncate tracking-tight">{user.name}</p>
                      <p className="text-slate-500 text-[11px] truncate tracking-tight mb-2 uppercase font-black">{user.role}</p>
                    </div>

                    <div className="space-y-1">
                      <Link href={user.role === 'admin' ? '/admin' : (user.role === 'lawyer' ? '/lawyer/dashboard' : '/client/dashboard')} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] transition font-bold tracking-tight">
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>

                      <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl text-[13px] transition font-bold tracking-tight">
                        <User size={16} /> Settings
                      </Link>

                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/5 rounded-2xl text-[13px] transition font-bold tracking-tight text-left">
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors duration-300"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[9998] bg-[#020617] pt-24 px-8 overflow-y-auto"
          >
            <div className="flex flex-col gap-10 pb-20">
              {navItems.map((group, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-blue-500 font-black text-[10px] uppercase tracking-[0.4em]">{group.label}</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {group.items.map((item, i) => (
                      <Link
                        key={i}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-white/5"
                      >
                        <div className="text-blue-400">{item.icon}</div>
                        <div>
                          <div className="text-white font-bold text-sm tracking-tight">{item.name}</div>
                          <div className="text-slate-500 text-xs tracking-tight">{item.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {!user && (
                <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/5">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full py-5 rounded-2xl bg-white/5 text-white font-bold text-center">Sign In</Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="w-full py-5 rounded-2xl bg-white text-slate-950 font-bold text-center">Get Started</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

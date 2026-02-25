'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import dynamic from 'next/dynamic';

const LegalReels = dynamic(() => import("../components/dashboard/LegalReels"), { ssr: false });
const CaseTimeline = dynamic(() => import("../components/dashboard/CaseTimeline"), { ssr: false });
const CalendarWidget = dynamic(() => import("../components/dashboard/CalendarWidget"), { ssr: false });
const TrustTimeline = dynamic(() => import("../components/dashboard/client/TrustTimeline"), { ssr: false });
const LegalConfessionBooth = dynamic(() => import("../components/dashboard/client/LegalConfessionBooth"), { ssr: false });
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PremiumLoader from "../components/PremiumLoader";

const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:4000");

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeCases, setActiveCases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [suggestedLawyers, setSuggestedLawyers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'cases', 'feed'
  const [posts, setPosts] = useState([]);
  const [newCase, setNewCase] = useState({ title: "", desc: "", budget: "" });
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchMyCases(),
        fetchPosts(),
        fetchInvoices(),
        fetchAppointments(),
        fetchSuggestedLawyers()
      ]).finally(() => setLoading(false));

      socket.emit("join_room", user._id || user.id);
    }
  }, [user]);

  const fetchSuggestedLawyers = async () => {
    try {
      const res = await axios.get("/api/users?role=lawyer");
      setSuggestedLawyers(res.data.slice(0, 4));
    } catch (err) { console.error(err); }
  }

  const fetchPosts = async () => {
    try {
      const res = await axios.get("/api/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Posts Fetch Error:", err);
      setPosts([]);
    }
  };

  const fetchMyCases = async () => {
    try {
      const identifier = user.phone || user.email || user._id;
      const res = await axios.get(`/api/cases?postedBy=${identifier}`);
      setActiveCases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Cases Fetch Error:", err);
      setActiveCases([]);
    }
  };

  const fetchInvoices = async () => {
    try {
      const uId = user._id || user.id;
      const res = await axios.get(`/api/invoices?clientId=${uId}`);
      setInvoices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Invoices Fetch Error:", err);
      setInvoices([]);
    }
  };

  const fetchAppointments = async () => {
    try {
      const uId = user._id || user.id;
      const res = await axios.get(`/api/appointments?clientId=${uId}`);
      setAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Appointments Fetch Error:", err);
      setAppointments([]);
    }
  };

  const handlePostCase = async () => {
    try {
      await axios.post("/api/cases", { ...newCase, postedBy: user.phone || user.email, postedAt: new Date() });
      setShowPostModal(false);
      fetchMyCases();
      toast.success("Legal Matter Posted Successfully!");
    } catch (err) { toast.error("Failed to post case. Please try again."); }
  };

  if (loading || !user) return <PremiumLoader text="Loading Workspace..." />;

  const activeCase = activeCases.find(c => c.stage !== 'Closed') || activeCases[0];

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-400 selection:bg-indigo-500/30">

      {/* SIDEBAR NAVIGATION (Fixed Left) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#020617] border-r border-white/5 flex flex-col z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gold-400 blur-[15px] opacity-10 group-hover:opacity-30 transition duration-500"></div>
              <img src="/logo.png" alt="NyayNow Logo" className="w-10 h-10 relative object-contain hover:scale-105 transition duration-300" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter transition-colors group-hover:text-indigo-400">NyayNow</span>
          </Link>

          <div className="space-y-1 mt-8">
            <NavItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon="⚖️" label="My Matters" active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} />
            <NavItem icon="📄" label="Documents" to="/agreements" />
            <NavItem icon="💳" label="Payments" active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} />
            <NavItem icon="📡" label="Legal Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
            <div className="my-2 h-px bg-white/5" />
            <NavItem icon="🎭" label="Confession Booth" active={activeTab === 'confessions'} onClick={() => setActiveTab('confessions')} badge="New" />
          </div>
        </div>

        <div className="mt-auto p-8 pt-0 relative">
          <div className="bg-[#1e293b]/50 rounded-xl p-4 border border-white/10 mb-6 backdrop-blur-sm cursor-pointer hover:bg-white/5 transition group" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-lg group-hover:scale-105 transition">
                {user.name?.[0]}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium text-sm leading-none mb-1">{user.name}</p>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{user.plan || "Premium"}</p>
              </div>
              <div className={`text-slate-400 transform transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}>▼</div>
            </div>
          </div>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute bottom-24 left-8 right-8 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 origin-bottom"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 mb-1">My Account</div>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition">
                    <span>⚙️</span> Settings
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition">
                    <span>👤</span> Profile
                  </Link>
                  <div className="h-px bg-white/5 my-1"></div>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition text-left">
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="pl-72 pt-8 pr-8 pb-8 min-h-screen">

        {/* HEADER */}
        <header className="flex justify-between items-end mb-10 px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-white to-cyan-400">{user.name?.split(' ')[0]}</span>
            </h1>
          </motion.div>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-500 transition flex items-center gap-2 shadow-lg shadow-indigo-500/20 border border-indigo-500/50"
          >
            <span>+</span> New Legal Matter
          </button>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-6 px-4">

          {/* PRIMARY CONTENT (8 COLS) */}
          <div className="col-span-8 space-y-6">

            {/* HERO CARD: ACTIVE CASE */}
            <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/10 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50 pointer-events-none group-hover:bg-indigo-500/20 transition duration-1000"></div>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Active Matter</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {activeCase ? activeCase.title : "No Active Legal Matters"}
                  </h2>
                  <p className="text-slate-400 max-w-lg leading-relaxed">
                    {activeCase ? activeCase.desc : "Post a new case to get started with our AI legal assistance and connect with top lawyers."}
                  </p>
                </div>
                {activeCase && <div className="text-right">
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Budget</p>
                  <p className="text-3xl font-bold text-white">₹{activeCase.budget}</p>
                </div>}
              </div>

              {
                activeCase ? (
                  <div className="bg-[#1e293b]/50 rounded-2xl p-6 border border-white/5">
                    <TrustTimeline stage={activeCase.stage || 'New Lead'} />
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center hover:bg-white/10 hover:border-indigo-500/30 transition cursor-pointer group" onClick={() => setShowPostModal(true)}>
                      <div className="text-2xl mb-2 group-hover:scale-110 transition">📝</div>
                      <div className="font-bold text-sm text-white">Draft Contract</div>
                    </div>
                    {/* JUDGE AI MINI WIDGET */}
                    <div className="p-4 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-500/30 text-center hover:scale-105 transition cursor-pointer group relative overflow-hidden" onClick={() => router.push('/judge-ai')}>
                      <div className="absolute inset-0 bg-indigo-500/10 animate-pulse"></div>
                      <div className="relative z-10">
                        <div className="text-2xl mb-2">⚖️</div>
                        <div className="font-bold text-sm text-white">Judge AI Scan</div>
                        <div className="text-[10px] text-indigo-300 mt-1">Check Win Probability</div>
                      </div>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center hover:bg-white/10 hover:border-indigo-500/30 transition cursor-pointer group" onClick={() => router.push('/marketplace')}>
                      <div className="text-2xl mb-2 group-hover:scale-110 transition">🔍</div>
                      <div className="font-bold text-sm text-white">Find Lawyer</div>
                    </div>
                  </div>
                )
              }
            </div>

            {/* REELS SECTION (PRO THEME) */}
            <LegalReels />

            {/* SECONDARY ROW: FEED & STATS */}
            <div className="grid grid-cols-2 gap-6 mt-8">
              {/* FEED SUMMARY */}
              <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-lg h-[400px] overflow-y-auto custom-scrollbar">
                <h3 className="font-bold text-lg text-white mb-4 sticky top-0 bg-[#0f172a] pb-2 border-b border-white/10 z-10">Legal Pulse</h3>
                <div className="space-y-4">
                  {posts.slice(0, 5).map(post => (
                    <div key={post._id} className="pb-4 border-b border-white/5 last:border-0 hover:bg-white/5 p-3 -mx-3 rounded-xl transition cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-300">{post.author?.name?.[0]}</div>
                        <span className="text-xs font-bold text-white">{post.author?.name}</span>
                        <span className="text-[10px] text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK STATS & BOOKINGS */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900 to-[#0f172a] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-white/10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20"></div>
                  <h3 className="font-bold text-lg mb-4 relative z-10">Financial Overview</h3>
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</p>
                      <p className="text-3xl font-bold">₹{invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Pending</p>
                      <p className="text-xl font-bold text-amber-400">₹{invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + (Number(i.amount) || 0), 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-lg flex-1">
                  <h3 className="font-bold text-lg text-white mb-4">Upcoming Meetings</h3>
                  {appointments.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-6">No meetings scheduled.</p>
                  ) : (
                    appointments.slice(0, 2).map(apt => (
                      <div key={apt._id} className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5 last:border-0 last:pb-0 last:mb-0">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex flex-col items-center justify-center text-xs font-bold border border-indigo-500/20">
                          <span>{new Date(apt.date).getDate()}</span>
                          <span className="uppercase text-[8px]">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{apt.lawyerName}</p>
                          <p className="text-xs text-slate-500">{apt.slot}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* CONFESSION BOOTH — Full Width */}
          {
            activeTab === 'confessions' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-12">
                <LegalConfessionBooth />
              </motion.div>
            )
          }

          {/* RIGHT SIDEBAR (4 COLS) — hidden on confession tab */}
          {
            activeTab !== 'confessions' && (
              <div className="col-span-4 space-y-6">
                {/* CALENDAR */}
                <div className="bg-[#0f172a] rounded-3xl p-4 border border-white/10 shadow-lg">
                  <CalendarWidget user={user} />
                </div>

                {/* SUGGESTED LAWYERS */}
                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-lg">
                  <h3 className="font-bold text-lg text-white mb-4">Recommended Counsel</h3>
                  <div className="space-y-4">
                    {suggestedLawyers.map(l => (
                      <div key={l._id} className="flex items-center gap-3 group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition">
                          {l.name?.[0]}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-white group-hover:text-indigo-400 transition">{l.name}</h4>
                          <p className="text-xs text-slate-500">{l.specialization || "Legal Expert"}</p>
                        </div>
                        <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:border-indigo-500 hover:text-indigo-400 transition">
                          +
                        </button>
                      </div>
                    ))}
                  </div>
                  <button onClick={() => router.push('/marketplace')} className="w-full mt-6 py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-white transition">
                    View Marketplace
                  </button>
                </div>
              </div>
            )
          }

        </div>
      </main >

      {/* MODAL FOR NEW CASE - Simple Glassmorphism */}
      {
        showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)}></div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl">
              <h3 className="font-bold text-2xl text-white mb-6">Brief Your Legal Matter</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Case Title</label>
                  <input type="text" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-white transition placeholder-slate-600" placeholder="e.g. Property Dispute in Delhi" value={newCase.title} onChange={e => setNewCase({ ...newCase, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Details</label>
                  <textarea rows="4" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-white transition placeholder-slate-600" placeholder="Describe your situation..." value={newCase.desc} onChange={e => setNewCase({ ...newCase, desc: e.target.value })}></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Estimated Budget (INR)</label>
                  <input type="number" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-white transition placeholder-slate-600" placeholder="5000" value={newCase.budget} onChange={e => setNewCase({ ...newCase, budget: e.target.value })} />
                </div>
                <button onClick={handlePostCase} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25 mt-2">
                  Post Case
                </button>
              </div>
            </motion.div>
          </div>
        )
      }

    </div>
  );
}

function NavItem({ icon, label, to, active, onClick, badge }) {
  const router = useRouter();
  const handleClick = () => {
    if (onClick) onClick();
    if (to) router.push(to);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all duration-300 ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-inner font-bold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl opacity-80">{icon}</span>
        <span className="text-sm tracking-wide font-medium">{label}</span>
      </div>
      {badge && <span className="text-[9px] font-black bg-violet-500/20 text-violet-400 border border-violet-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider">{badge}</span>}
    </div>
  )
}

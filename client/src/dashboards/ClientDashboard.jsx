import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import LegalReels from "../components/dashboard/LegalReels";
import CaseTimeline from "../components/dashboard/CaseTimeline";
import CalendarWidget from "../components/dashboard/CalendarWidget";
import TrustTimeline from "../components/dashboard/client/TrustTimeline";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

const socket = io(import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:4000");

export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeCases, setActiveCases] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [suggestedLawyers, setSuggestedLawyers] = useState([]);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'cases', 'feed'
  const [posts, setPosts] = useState([]);
  const [newCase, setNewCase] = useState({ title: "", desc: "", budget: "" });
  const [showPostModal, setShowPostModal] = useState(false);

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

  const fetchPosts = async () => axios.get("/api/posts").then(res => setPosts(res.data)).catch(console.error);
  const fetchMyCases = async () => axios.get(`/api/cases?postedBy=${user.phone || user.email || user._id}`).then(res => setActiveCases(res.data || [])).catch(console.error);
  const fetchInvoices = async () => axios.get(`/api/invoices?clientId=${user._id || user.id}`).then(res => setInvoices(res.data)).catch(console.error);
  const fetchAppointments = async () => axios.get(`/api/appointments?clientId=${user._id || user.id}`).then(res => setAppointments(res.data)).catch(console.error);

  const handlePostCase = async () => {
    try {
      await axios.post("/api/cases", { ...newCase, postedBy: user.phone || user.email, postedAt: new Date() });
      setShowPostModal(false);
      fetchMyCases();
    } catch (err) { alert("Failed to post case"); }
  };

  if (loading || !user) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 font-serif text-midnight-900">
      <div className="animate-pulse">Loading Workspace...</div>
    </div>
  );

  const activeCase = activeCases.find(c => c.stage !== 'Closed') || activeCases[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">

      {/* SIDEBAR NAVIGATION (Fixed Left) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-midnight-900 text-slate-300 flex flex-col z-50">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-white mb-10">
            <div className="w-8 h-8 bg-gradient-to-br from-gold-500 to-amber-600 rounded-lg flex items-center justify-center font-serif font-bold text-midnight-900 text-lg">N</div>
            <span className="font-serif text-2xl tracking-tight">NyayNow</span>
          </div>

          <div className="space-y-1">
            <NavItem icon="📊" label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
            <NavItem icon="⚖️" label="My Matters" active={activeTab === 'cases'} onClick={() => setActiveTab('cases')} />
            <NavItem icon="📄" label="Documents" to="/agreements" />
            <NavItem icon="💳" label="Payments" active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} />
            <NavItem icon="📡" label="Legal Feed" active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
          </div>
        </div>

        <div className="mt-auto p-8 pt-0">
          <div className="bg-midnight-800 rounded-xl p-4 border border-white/5 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-midnight-700 border border-white/10 flex items-center justify-center text-gold-500 font-serif font-bold text-lg">
                {user.name?.[0]}
              </div>
              <div>
                <p className="text-white font-serif text-sm leading-none mb-1">{user.name}</p>
                <p className="text-xs text-gold-500 font-bold uppercase tracking-wider">{user.plan || "Premium"}</p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-500 mt-2">
              <span>Cases: {activeCases.length}</span>
              <button onClick={logout} className="hover:text-white transition">Sign Out</button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="pl-72 pt-8 pr-8 pb-8 min-h-screen">

        {/* HEADER */}
        <header className="flex justify-between items-end mb-10 px-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-4xl font-serif text-midnight-900 leading-tight">
              Good Morning, {user.name?.split(' ')[0]}.
            </h1>
          </motion.div>
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-midnight-900 text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-midnight-800 transition flex items-center gap-2 shadow-xl shadow-midnight-900/10"
          >
            <span>+</span> New Legal Matter
          </button>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-6 px-4">

          {/* PRIMARY CONTENT (8 COLS) */}
          <div className="col-span-8 space-y-6">

            {/* HERO CARD: ACTIVE CASE */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 mix-blend-multiply filter blur-3xl opacity-50 pointer-events-none group-hover:bg-blue-50 transition duration-1000"></div>

              <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Active Matter</span>
                  </div>
                  <h2 className="text-2xl font-serif text-midnight-900 mb-2">
                    {activeCase ? activeCase.title : "No Active Legal Matters"}
                  </h2>
                  <p className="text-slate-500 max-w-lg leading-relaxed">
                    {activeCase ? activeCase.desc : "Post a new case to get started with our AI legal assistance and connect with top lawyers."}
                  </p>
                </div>
                {activeCase && <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-1">Budget</p>
                  <p className="text-3xl font-serif text-midnight-900">₹{activeCase.budget}</p>
                </div>}
              </div>

              {activeCase ? (
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                  <TrustTimeline stage={activeCase.stage || 'New Lead'} />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition cursor-pointer" onClick={() => setShowPostModal(true)}>
                    <div className="text-2xl mb-2">📝</div>
                    <div className="font-bold text-sm text-midnight-900">Draft Contract</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition cursor-pointer" onClick={() => navigate('/assistant')}>
                    <div className="text-2xl mb-2">🤖</div>
                    <div className="font-bold text-sm text-midnight-900">Ask AI Assistant</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center hover:bg-white hover:shadow-md transition cursor-pointer" onClick={() => navigate('/marketplace')}>
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="font-bold text-sm text-midnight-900">Find Lawyer</div>
                  </div>
                </div>
              )}
            </div>

            {/* SECONDARY ROW: FEED & STATS */}
            <div className="grid grid-cols-2 gap-6">
              {/* FEED SUMMARY */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm h-[400px] overflow-y-auto custom-scrollbar">
                <h3 className="font-serif text-lg text-midnight-900 mb-4 sticky top-0 bg-white pb-2 border-b border-slate-100">Legal Pulse</h3>
                <div className="space-y-4">
                  {posts.slice(0, 5).map(post => (
                    <div key={post._id} className="pb-4 border-b border-slate-50 last:border-0 hover:bg-slate-50 p-2 -mx-2 rounded-lg transition">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">{post.author?.name?.[0]}</div>
                        <span className="text-xs font-bold text-midnight-900">{post.author?.name}</span>
                        <span className="text-[10px] text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-slate-600 line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK STATS & BOOKINGS */}
              <div className="space-y-6">
                <div className="bg-midnight-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20"></div>
                  <h3 className="font-serif text-lg mb-4 relative z-10">Financial Overview</h3>
                  <div className="flex justify-between items-end relative z-10">
                    <div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total Spent</p>
                      <p className="text-3xl font-serif">₹{invoices.reduce((acc, i) => acc + (Number(i.amount) || 0), 0).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Pending</p>
                      <p className="text-xl font-serif text-gold-400">₹{invoices.filter(i => i.status !== 'paid').reduce((acc, i) => acc + (Number(i.amount) || 0), 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex-1">
                  <h3 className="font-serif text-lg text-midnight-900 mb-4">Upcoming Meetings</h3>
                  {appointments.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">No meetings scheduled.</p>
                  ) : (
                    appointments.slice(0, 2).map(apt => (
                      <div key={apt._id} className="flex items-center gap-3 mb-3 pb-3 border-b border-slate-50 last:border-0 last:pb-0 last:mb-0">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex flex-col items-center justify-center text-xs font-bold">
                          <span>{new Date(apt.date).getDate()}</span>
                          <span className="uppercase text-[8px]">{new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-midnight-900">{apt.lawyerName}</p>
                          <p className="text-xs text-slate-500">{apt.slot}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (4 COLS) */}
          <div className="col-span-4 space-y-6">
            {/* CALENDAR */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
              <CalendarWidget user={user} />
            </div>

            {/* SUGGESTED LAWYERS */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="font-serif text-lg text-midnight-900 mb-4">Recommended Counsel</h3>
              <div className="space-y-4">
                {suggestedLawyers.map(l => (
                  <div key={l._id} className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-lg transition">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-serif font-bold text-sm group-hover:bg-midhight-900 group-hover:text-midnight-900 transition">
                      {l.name?.[0]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-midnight-900 group-hover:text-gold-600 transition">{l.name}</h4>
                      <p className="text-xs text-slate-500">{l.specialization || "Legal Expert"}</p>
                    </div>
                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:border-gold-500 hover:text-gold-500 transition">
                      +
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full mt-6 py-3 border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-wider text-slate-500 hover:bg-slate-50 transition">
                View Marketplace
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* MODAL FOR NEW CASE - Simple Glassmorphism */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-midnight-900/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)}></div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-8 max-w-lg w-full relative z-10 shadow-2xl">
            <h3 className="font-serif text-2xl text-midnight-900 mb-6">Brief Your Legal Matter</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Case Title</label>
                <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-midnight-900 transition font-serif" placeholder="e.g. Property Dispute in Delhi" value={newCase.title} onChange={e => setNewCase({ ...newCase, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Details</label>
                <textarea rows="4" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-midnight-900 transition" placeholder="Describe your situation..." value={newCase.desc} onChange={e => setNewCase({ ...newCase, desc: e.target.value })}></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Estimated Budget (INR)</label>
                <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-midnight-900 transition font-serif" placeholder="5000" value={newCase.budget} onChange={e => setNewCase({ ...newCase, budget: e.target.value })} />
              </div>
              <button onClick={handlePostCase} className="w-full py-4 bg-midnight-900 text-white font-bold rounded-lg hover:bg-midnight-800 transition shadow-lg mt-2">
                Post Case
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}

function NavItem({ icon, label, to, active, onClick }) {
  const navigate = useNavigate();
  const handleClick = () => {
    if (onClick) onClick();
    if (to) navigate(to);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${active ? 'bg-white/10 text-white shadow-inner font-semibold' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
    >
      <span className="text-lg opacity-80">{icon}</span>
      <span className="text-sm tracking-wide">{label}</span>
    </div>
  )
}

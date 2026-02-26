'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import dynamic from 'next/dynamic';

const KanbanBoard = dynamic(() => import("../components/dashboard/KanbanBoard"), { ssr: false });
const CalendarWidget = dynamic(() => import("../components/dashboard/CalendarWidget"), { ssr: false });
const WorkloadMonitor = dynamic(() => import("../components/dashboard/lawyer/WorkloadMonitor"), { ssr: false });
const CaseIntelligencePanel = dynamic(() => import("../components/dashboard/lawyer/CaseIntelligencePanel"), { ssr: false });
const ClientCRM = dynamic(() => import("../components/dashboard/lawyer/ClientCRM"), { ssr: false });
const LegalNoticeGenerator = dynamic(() => import("../components/dashboard/lawyer/LegalNoticeGenerator"), { ssr: false });
const LegalReels = dynamic(() => import("../components/dashboard/LegalReels"), { ssr: false });

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import io from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import PremiumLoader from "../components/PremiumLoader";

const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:4000");

export default function LawyerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "board");
  const [leads, setLeads] = useState([]);
  const [acceptedCases, setAcceptedCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [crmData, setCrmData] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [newInvoice, setNewInvoice] = useState({ clientId: "", amount: "", description: "" });
  const [connections, setConnections] = useState([]);
  const [lawyers, setLawyers] = useState([]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      const uId = user._id || user.id;
      Promise.all([
        fetchLeads(),
        fetchAcceptedCases(uId),
        fetchAppointments(uId),
        fetchInvoices(uId),
        fetchNotifications(uId),
        fetchConnections(uId),
        fetchLawyers(),
        axios.get(`/api/crm/insights?userId=${uId}`).then(res => setCrmData(res.data)).catch(err => null)
      ]).finally(() => setLoading(false));

      socket.emit("join_room", uId);
      socket.emit("join_lawyer_pool");

      socket.on("dashboard_alert", (notif) => {
        setNotifications(prev => [notif, ...prev]);
        toast.success("New Alert: " + notif.message, { icon: '🔔' });
      });

      socket.on("incoming_lead", (payload) => {
        toast((t) => (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-bold text-sm">Instant Consult Request</span>
            </div>
            <p className="text-xs text-slate-600">Client: {payload.clientName}</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  socket.emit("accept_consult", {
                    lawyerId: uId,
                    clientId: payload.clientId,
                    lawyerName: user.name
                  });
                  toast.dismiss(t.id);
                }}
                className="bg-indigo-600 text-white px-3 py-1 rounded text-[10px] font-bold uppercase"
              >
                Accept
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="bg-slate-200 text-slate-600 px-3 py-1 rounded text-[10px] font-bold uppercase"
              >
                Ignore
              </button>
            </div>
          </div>
        ), { duration: 10000, position: 'top-right' });
      });

      socket.on("consult_start", (payload) => {
        if (payload.role === "lawyer") {
          router.push(`/meet/${payload.meetingId}`);
        }
      });

      return () => {
        socket.off("dashboard_alert");
        socket.off("incoming_lead");
        socket.off("consult_start");
      }
    }
  }, [user]);

  const fetchNotifications = async (uId) => {
    try {
      const res = await axios.get(`/api/notifications?userId=${uId}`);
      setNotifications(res.data);
    } catch (err) { console.error("Notif Error:", err); }
  };

  const handleMarkAllRead = async () => {
    try {
      const uId = user._id || user.id;
      await axios.put("/api/notifications/mark-all-read", { userId: uId });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) { console.error(err); }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read) {
        await axios.put(`/api/notifications/${notif._id}/read`);
        setNotifications(prev => prev.map(n => n._id === notif._id ? { ...n, read: true } : n));
      }
      if (notif.link) {
        router.push(notif.link);
        setShowNotifications(false);
      }
    } catch (err) { console.error(err); }
  };

  const fetchConnections = async (uId) => {
    try {
      const res = await axios.get(`/api/connections?userId=${uId}&status=active`);
      setConnections(res.data);
    } catch (err) { console.error("Connections Error:", err); }
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get("/api/cases?open=true");
      setLeads(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Leads Fetch Error:", err);
      setLeads([]);
    }
  };

  const fetchAcceptedCases = async (userId) => {
    try {
      // Assuming lawyers are identified by ID in the 'lawyer' field of Case model
      const res = await axios.get(`/api/cases?lawyerId=${userId}`);
      setAcceptedCases(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Accepted Cases Fetch Error:", err);
      setAcceptedCases([]);
    }
  };

  const fetchAppointments = async (id) => {
    try {
      const res = await axios.get(`/api/appointments?userId=${id}&role=lawyer`);
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setAppointments(list.filter(a => a.status !== 'rejected'));
    } catch (err) {
      console.error("Appointments Fetch Error:", err);
      setAppointments([]);
    }
  };

  const fetchInvoices = async (id) => {
    try {
      const res = await axios.get(`/api/invoices?lawyerId=${id}`);
      setInvoices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Invoices Fetch Error:", err);
      setInvoices([]);
    }
  };

  const fetchLawyers = async () => {
    try {
      const res = await axios.get("/api/lawyers");
      setLawyers(Array.isArray(res.data.lawyers) ? res.data.lawyers : []);
    } catch (err) {
      console.error("Lawyers Fetch Error:", err);
      setLawyers([]);
    }
  };

  const handleCreateInvoice = async () => {
    try {
      const uId = user._id || user.id;
      const client = connections.find(c => c._id === newInvoice.clientId);
      await axios.post("/api/invoices", {
        ...newInvoice,
        lawyerId: uId,
        lawyerName: user.name,
        clientName: client?.name || "Client"
      });
      toast.success("Invoice generated!");
      setShowInvoiceModal(false);
      fetchInvoices(uId);
    } catch (err) {
      toast.error("Failed to generate invoice");
    }
  };

  const acceptLead = async (id, tier) => {
    if (!user.verified) return toast.error("Verification Required. Please complete your profile.");
    const uId = user._id || user.id;
    try {
      await axios.post(`/api/cases/${id}/accept`, {
        lawyerPhone: user.phone || user.email,
        lawyerId: uId
      });
      toast.success("Lead Accepted! Client has been notified.");
      fetchLeads();
      fetchAcceptedCases(uId);
    } catch (err) { toast.error("Failed to accept lead."); }
  };

  if (loading || !user) return <PremiumLoader text="Initializing Command Center..." />;

  // Ensure user fields are safe
  const userName = user?.name || "Counsel";
  const userInitials = userName[0] || "?";

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-400 selection:bg-indigo-500/30">

      {/* SIDEBAR NAVIGATION (Fixed Left) */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0f172a] border-r border-white/10 flex flex-col z-50">
        <div className="p-8 pb-4">
          {/* LOGO REMOVED - ALREADY IN WORKSPACE CONTEXT */}
          <div className="mb-6 invisible" />

          <div className="space-y-1">
            <NavItem icon="📊" label="Command Center" active={activeTab === 'board'} onClick={() => setActiveTab('board')} />
            <NavItem icon="⚡" label="Lead Pool" count={leads.length} active={activeTab === 'leads'} onClick={() => setActiveTab('leads')} />
            <NavItem icon="👥" label="Client CRM" active={activeTab === 'clients'} onClick={() => setActiveTab('clients')} />
            <NavItem icon="💬" label="Messages" to="/messages" />
            <NavItem icon="📅" label="Calendar" to="/calendar" />
            <NavItem icon="📝" label="Invoices" active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')} />
            <div className="my-2 h-px bg-white/5" />
            <NavItem icon="📜" label="Legal Notice Generator" active={activeTab === 'notices'} onClick={() => setActiveTab('notices')} />
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
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{user.specialization || "Partner"}</p>
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
                  <Link href="/lawyer/profile/edit" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition">
                    <span>⚙️</span> Edit Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-lg transition">
                    <span>🔒</span> Security
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
        <header className="flex justify-between items-end mb-10 px-4 relative">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Practice Overview</p>
            <h1 className="text-4xl font-bold text-white leading-tight">
              Command Center.
            </h1>
          </motion.div>
          <div className="flex items-center gap-6">
            {/* VIDEO CALL BUTTON */}
            <button
              onClick={() => router.push('/video-call')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition group"
            >
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Virtual Courtroom
            </button>

            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition relative"
              >
                <span>🔔</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold animate-bounce">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-80 bg-[#1e293b] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden origin-top-right"
                  >
                    <div className="p-4 border-b border-white/5 flex justify-between items-center">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">Alerts</h4>
                      <button onClick={handleMarkAllRead} className="text-[10px] text-indigo-400 font-bold hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center opacity-30">
                          <p className="text-xs font-bold uppercase">All quiet on the front</p>
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            className={`p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition cursor-pointer ${!n.read ? 'bg-indigo-500/5' : ''}`}
                          >
                            <p className="text-xs text-white leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-slate-500 mt-2">{new Date(n.createdAt).toLocaleTimeString()}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-right">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-white">₹{invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (Number(i.amount) || 0), 0).toLocaleString()}</p>
            </div>
          </div>
        </header>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-6 px-4">

          {/* PRIMARY CONTENT (8 COLS) */}
          <div className="col-span-8 space-y-6">

            {activeTab === 'board' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                {/* ANALYTICS WIDGET (NEW) */}
                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg text-white">Performance Analytics</h3>
                    <select className="bg-white/5 border border-white/10 text-xs rounded-lg px-2 py-1 text-slate-400">
                      <option>Last 30 Days</option>
                      <option>Last 6 Months</option>
                    </select>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={crmData?.analytics || []}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }} itemStyle={{ color: '#f8fafc', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue (₹)" />
                        <Area type="monotone" dataKey="leads" stroke="#82ca9d" fillOpacity={1} fill="url(#colorLeads)" strokeWidth={2} name="New Leads" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* INTELLIGENCE PANEL */}
                <div className="grid grid-cols-2 gap-6">
                  {crmData && <WorkloadMonitor workload={crmData.workload} />}
                  {crmData && <CaseIntelligencePanel insights={crmData.caseInsights} />}
                </div>

                {/* KANBAN BOARD */}
                <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-xl min-h-[500px]">
                  <h3 className="font-bold text-lg text-white mb-6">Case Lifecycle</h3>
                  <KanbanBoard cases={acceptedCases} onUpdate={() => fetchAcceptedCases(user._id || user.id)} />
                </div>

                {/* LEGAL REELS (PRO THEME) */}
                <LegalReels />
              </motion.div>
            )}

            {activeTab === 'invoices' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="bg-[#0f172a] rounded-3xl p-8 border border-white/10 shadow-xl">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-2xl text-white">Financial Ledger</h3>
                    <button onClick={() => setShowInvoiceModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition">Generate New Invoice</button>
                  </div>
                  <div className="space-y-4">
                    {invoices.length === 0 ? (
                      <div className="py-20 text-center">
                        <p className="text-slate-500 font-bold uppercase tracking-widest">No transaction history found</p>
                      </div>
                    ) : (
                      invoices.map(inv => (
                        <div key={inv._id} className="p-6 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition">
                          <div>
                            <p className="text-white font-bold">{inv.clientName || 'Private Client'}</p>
                            <p className="text-xs text-slate-500">{new Date(inv.createdAt).toLocaleDateString()} • {inv.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">₹{inv.amount}</p>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${inv.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{inv.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'clients' && <ClientCRM />}

            {activeTab === 'leads' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-bold text-lg text-white mb-2">Available Professionals</h3>
                {lawyers.map(lawyer => (
                  <div key={lawyer._id} className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-500/50 transition group relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                          {lawyer.name?.[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-white group-hover:text-indigo-400 transition">{lawyer.name}</h4>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{lawyer.specialization || "Legal Expert"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">₹{lawyer.consultationFee || "0"}/hr</div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{lawyer.location?.city || "Remote"}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-4 bg-black/20 p-3 rounded-lg border border-white/5 line-clamp-2">{lawyer.bio || "Secure professional profile data."}</p>
                    <div className="flex gap-3">
                      <button onClick={() => router.push(`/messages?chatId=${lawyer._id}`)} className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">Connect</button>
                      <button onClick={() => router.push(`/lawyer-profile/${lawyer._id}`)} className="flex-1 bg-white/5 border border-white/10 text-slate-300 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition">View Dossier</button>
                    </div>
                  </div>
                ))}
                {lawyers.length === 0 && <p className="text-center text-slate-500 py-10">No professional entities found in the vault.</p>}
              </motion.div>
            )}

          </div>

          {/* LEGAL NOTICE GENERATOR — Full Width */}
          {activeTab === 'notices' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-12">
              <LegalNoticeGenerator />
            </motion.div>
          )}

          {/* RIGHT SIDEBAR (4 COLS) — Hidden on notices tab */}
          {activeTab !== 'notices' && (
            <div className="col-span-4 space-y-6">
              {/* CALENDAR */}
              <div className="bg-[#0f172a] rounded-3xl p-4 border border-white/10 shadow-lg h-[380px] overflow-hidden">
                <CalendarWidget user={user} />
              </div>

              {/* UPCOMING MEETINGS */}
              <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-lg">
                <h3 className="font-bold text-lg text-white mb-4">Agenda</h3>
                {appointments.length === 0 ? <p className="text-xs text-slate-500">No meetings scheduled.</p> : (
                  <div className="space-y-3">
                    {appointments.slice(0, 3).map(apt => (
                      <div key={apt._id} className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-xs text-white">{apt.clientId?.name || "Client"}</p>
                          <p className="text-[10px] text-slate-500">{new Date(apt.date).toLocaleDateString()} • {apt.slot}</p>
                        </div>
                        {apt.status === 'confirmed' ? (
                          <button onClick={() => window.open(`${window.location.origin}/meet/${apt._id}`, "_blank")} className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-md text-[10px] font-bold border border-purple-500/30 hover:bg-purple-500/30 transition">Join</button>
                        ) : <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded-md text-[10px] font-bold uppercase border border-amber-500/30">Pending</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* INVOICE MODAL */}
      <AnimatePresence>
        {showInvoiceModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowInvoiceModal(false)}></div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-[#0f172a] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl">
              <h3 className="font-bold text-2xl text-white mb-6">Generate Invoice</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Select Client</label>
                  <select
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-white transition"
                    value={newInvoice.clientId}
                    onChange={e => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                  >
                    <option value="">Select a client</option>
                    {connections.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                  <input type="text" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-white transition placeholder-slate-600" placeholder="e.g. Consultation Fee" value={newInvoice.description} onChange={e => setNewInvoice({ ...newInvoice, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Amount (INR)</label>
                  <input type="number" className="w-full p-4 bg-black/20 border border-white/10 rounded-xl outline-none focus:border-indigo-500 text-white transition placeholder-slate-600" placeholder="2000" value={newInvoice.amount} onChange={e => setNewInvoice({ ...newInvoice, amount: e.target.value })} />
                </div>
                <button onClick={handleCreateInvoice} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/25 mt-2">
                  Send Invoice
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function NavItem({ icon, label, to, count, active, onClick, badge }) {
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
      {count !== undefined && <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-md shadow-lg shadow-indigo-500/40">{count}</span>}
      {badge && <span className="text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md uppercase tracking-wider">{badge}</span>}
    </div>
  )
}

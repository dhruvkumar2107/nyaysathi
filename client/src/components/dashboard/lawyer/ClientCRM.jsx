import React, { useState, useEffect } from "react";
import { Search, Filter, Phone, Mail, MoreVertical, FileText, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";

export default function ClientCRM() {
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (user) {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        try {
            const res = await axios.get(`/api/connections?userId=${user._id || user.id}&status=active`);
            setClients(res.data);
        } catch (err) {
            console.error("CRM Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white">Client Directory</h3>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition"
                        />
                    </div>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#0f172a] rounded-3xl border border-white/5">
                        <Loader2 className="animate-spin text-indigo-500 mb-4" size={32} />
                        <p className="text-slate-500 font-medium">Synchronizing Secure Database...</p>
                    </div>
                ) : filteredClients.map(client => (
                    <div key={client._id} className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center text-indigo-400 font-black text-xl shadow-inner">
                                    {client.name?.[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg tracking-tight">{client.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">{client.location?.city || "Remote"}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                        <span className="text-indigo-400 text-xs font-bold">{client.plan || "Standard"} Client</span>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                            </div>

                            <button className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-lg transition">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-white/5 relative z-10">
                            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer group/item">
                                <div className="p-2 bg-white/5 rounded-lg group-hover/item:text-indigo-400 transition-colors"><Phone size={14} /></div>
                                <span className="text-xs font-medium">{client.phone || "No contact"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors cursor-pointer group/item">
                                <div className="p-2 bg-white/5 rounded-lg group-hover/item:text-indigo-400 transition-colors"><Mail size={14} /></div>
                                <span className="text-xs font-medium truncate max-w-[150px]">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 group/item">
                                <div className="p-2 bg-white/5 rounded-lg group-hover/item:text-indigo-400 transition-colors"><Calendar size={14} /></div>
                                <span className="text-xs font-medium text-slate-500 italic">Connected {new Date(client.createdAt || client.connectionDate || Date.now()).toLocaleDateString()}</span>
                            </div>
                            <div className="text-right">
                                <button className="bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-500/20 hover:bg-indigo-600 hover:text-white transition-all">
                                    Dossier
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {!loading && filteredClients.length === 0 && (
                    <div className="text-center py-20 bg-[#0f172a] rounded-3xl border border-white/5">
                        <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">No clients found in registry</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

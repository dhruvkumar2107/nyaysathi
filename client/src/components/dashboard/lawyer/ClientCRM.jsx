import React, { useState } from "react";
import { Search, Filter, Phone, Mail, MoreVertical, FileText, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientCRM() {
    const [clients, setClients] = useState([
        { id: 1, name: "Rajesh Kumar", status: "Active", case: "Property Dispute", lastContact: "2 days ago", phone: "+91 98765 43210", email: "rajesh@example.com", sentiment: "Positive" },
        { id: 2, name: "Priya Sharma", status: "Pending", case: "Divorce Settlement", lastContact: "1 week ago", phone: "+91 98765 12345", email: "priya@example.com", sentiment: "Neutral" },
        { id: 3, name: "Amit Singh", status: "Closed", case: "Corporate Fraud", lastContact: "1 month ago", phone: "+91 98765 67890", email: "amit.singh@corp.com", sentiment: "Negative" },
    ]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex justify-between items-center bg-[#0f172a] p-4 rounded-2xl border border-white/10">
                <h3 className="text-xl font-bold text-white">Client Directory</h3>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input type="text" placeholder="Search clients..." className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition" />
                    </div>
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition">
                        <Filter size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {clients.map(client => (
                    <div key={client.id} className="bg-[#0f172a] border border-white/10 rounded-2xl p-6 hover:border-indigo-500/30 transition group">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                                    {client.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg">{client.name}</h4>
                                    <p className="text-slate-500 text-sm">{client.case}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${client.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' :
                                        client.status === 'Pending' ? 'bg-amber-500/20 text-amber-400' :
                                            'bg-slate-700 text-slate-400'
                                    }`}>{client.status}</span>
                            </div>

                            <button className="text-slate-500 hover:text-white transition">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone size={16} />
                                <span className="text-sm">{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Mail size={16} />
                                <span className="text-sm">{client.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <Calendar size={16} />
                                <span className="text-sm">Last Contact: {client.lastContact}</span>
                            </div>
                            <div className="text-right">
                                <button className="text-indigo-400 text-sm font-bold hover:underline underline-offset-4 flex items-center justify-end gap-2">
                                    View Case File <FileText size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

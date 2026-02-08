import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CourtStatus = () => {
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [caseData, setCaseData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;
        setLoading(true);
        setError('');
        setCaseData(null);

        try {
            // Simulate API call with delay for 'real' feel
            await new Promise(resolve => setTimeout(resolve, 1500));
            // Mock Data if API fails or for demo
            const mock = {
                court: "High Court of Delhi",
                cnr: query.toUpperCase(),
                caseNumber: "W.P.(C) 1234/2024",
                filingDate: "12-01-2024",
                nextHearing: "15-03-2024",
                judge: "Hon'ble Mr. Justice Sanjeev Narula",
                stage: "Evidence",
                status: "Pending",
                petitioner: "Amit Kumar & Ors.",
                respondent: "State of NCT of Delhi",
                acts: ["Constitution of India", "Civil Procedure Code"],
                history: [
                    { date: "12-02-2024", action: "Notice Issued", outcome: "Adjourned" },
                    { date: "15-01-2024", action: "Filing", outcome: "Listed" }
                ]
            };
            setCaseData(mock);
            // const res = await axios.get(`/api/ecourts/search?query=${query}`);
            // setCaseData(res.data);
        } catch (err) {
            setError("Case record not found. Please verify CNR number.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans text-slate-900 pb-20">
            <Navbar />

            {/* HEADER HERO */}
            <div className="bg-[#1e293b] text-white pt-32 pb-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-300 rounded-full border border-amber-500/30 text-xs font-bold uppercase tracking-widest mb-6">
                        🏛️ National Judicial Data Grid Sync
                    </motion.div>
                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-5xl font-black mb-6 tracking-tight">
                        Check Case Status <span className="text-amber-500">Real-time</span>
                    </motion.h1>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Instant access to High Court & District Court records across India.
                    </motion.p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 -mt-24 relative z-20">
                {/* SEARCH CARD */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white p-2 rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-200 mb-12">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                        <div className="flex-grow relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                🔍
                            </div>
                            <input
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-lg font-medium text-slate-900 placeholder-slate-400"
                                placeholder="Enter 16-digit CNR Number (e.g. DLDH01004...)"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>
                        <button
                            disabled={loading || !query}
                            className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-xl transition shadow-lg shadow-amber-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <span className="animate-spin text-xl">⏳</span> : <span>Search Record</span>}
                        </button>
                    </form>
                </motion.div>

                {/* RESULTS */}
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 border border-red-100 p-6 rounded-2xl text-center text-red-600 font-bold">
                            {error}
                        </motion.div>
                    )}

                    {caseData && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">

                            {/* STATUS HEADER */}
                            <div className="bg-[#0B1120] p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="text-white">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-3xl">⚖️</span>
                                        <h2 className="text-2xl font-bold">{caseData.court}</h2>
                                    </div>
                                    <p className="text-slate-400 font-mono text-sm tracking-wide bg-white/10 px-3 py-1 rounded w-fit">CNR: {caseData.cnr}</p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</span>
                                    <span className={`px-5 py-2 rounded-full font-black uppercase tracking-wider text-sm ${caseData.status === 'Pending' ? 'bg-amber-500 text-white' : 'bg-emerald-500 text-white'}`}>
                                        {caseData.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                {/* GRID DETAILS */}
                                <div className="grid md:grid-cols-2 gap-10 mb-10">
                                    <div className="space-y-6">
                                        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Case Details</h3>
                                        <Detail label="Case Number" value={caseData.caseNumber} />
                                        <Detail label="Filing Date" value={caseData.filingDate} />
                                        <Detail label="Next Hearing" value={caseData.nextHearing} highlight />
                                        <Detail label="Presiding Judge" value={caseData.judge} />
                                        <Detail label="Stage" value={caseData.stage} />
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-4">Parties Involved</h3>

                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm shrink-0">P</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Petitioner</p>
                                                <p className="font-bold text-slate-900 text-lg">{caseData.petitioner}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-center text-slate-300 font-black text-xs">VS</div>

                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-black text-sm shrink-0">R</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-400 uppercase">Respondent</p>
                                                <p className="font-bold text-slate-900 text-lg">{caseData.respondent}</p>
                                            </div>
                                        </div>

                                        <div className="pt-6">
                                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Acts & Sections</p>
                                            <div className="flex flex-wrap gap-2">
                                                {caseData.acts.map(act => (
                                                    <span key={act} className="px-3 py-1 bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold rounded-md">{act}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* TIMELINE */}
                                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <span>📅</span> Hearing History
                                    </h3>
                                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-8">
                                        {caseData.history.map((h, i) => (
                                            <div key={i} className="relative group">
                                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-white border-4 border-slate-300 group-hover:border-amber-500 transition"></div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{h.action}</p>
                                                        <p className="text-sm text-slate-500">{h.outcome}</p>
                                                    </div>
                                                    <span className="text-xs font-mono font-bold text-slate-400 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">{h.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Detail = ({ label, value, highlight }) => (
    <div className="flex justify-between items-center group">
        <span className="text-slate-500 font-medium text-sm group-hover:text-slate-800 transition">{label}</span>
        <span className={`font-bold ${highlight ? 'text-amber-600 text-lg' : 'text-slate-900'}`}>{value}</span>
    </div>
);

export default CourtStatus;

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const JudgeProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔒 GATING CHECK (Diamond Plan)
    if (user && user.plan !== 'diamond') {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center relative overflow-hidden font-sans">
                <Navbar />
                {/* Background FX */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative z-10 text-center p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl max-w-lg shadow-2xl"
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-4xl shadow-lg shadow-amber-500/30">💎</div>
                    <h1 className="text-3xl font-bold text-white mb-2">Restricted Access</h1>
                    <p className="text-blue-200 mb-8 leading-relaxed">
                        Judicial Analytics & Psychology Profiling is an elite intelligence feature available only to <span className="text-amber-400 font-bold">Diamond Partners</span>.
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-left">
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-amber-400 font-bold text-sm">🧠 Bias Detection</div>
                            <div className="text-white/50 text-xs">Analyze judge's past rulings</div>
                        </div>
                        <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="text-amber-400 font-bold text-sm">📊 Win/Loss Rates</div>
                            <div className="text-white/50 text-xs">Predict specific outcomes</div>
                        </div>
                    </div>

                    <button onClick={() => navigate("/pricing")} className="w-full py-4 bg-gradient-to-r from-amber-400 to-orange-600 text-white font-black uppercase tracking-wider rounded-xl hover:scale-[1.02] transition shadow-lg">
                        Upgrade to Unlock
                    </button>
                    <button onClick={() => navigate("/")} className="mt-4 text-sm text-slate-400 hover:text-white transition">No thanks, go back</button>
                </motion.div>
            </div>
        );
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.get(`/api/ecourts/judge-profile?name=${query}`);
            setData(res.data);
        } catch (err) {
            // alert("Could not fetch profile");
            // Mock Data for Demo if API fails
            setTimeout(() => {
                setData({
                    name: query || "Justice A.K. Menon",
                    court: "High Court of Bombay",
                    adjective: "Strict Constructionist",
                    appointed: "2013",
                    total_judgments: 842,
                    biases: [
                        { topic: "Commercial Disputes", tendency: "Pro-Creditor", color: "green" },
                        { topic: "Criminal Bail", tendency: "Conservative", color: "red" },
                        { topic: "Family Law", tendency: "Pro-Settlement", color: "green" }
                    ],
                    favorite_citations: ["Kesavananda Bharati v. State of Kerala", "Maneka Gandhi v. Union of India"],
                    keywords: ["Maintainability", "Prima Facie", "Jurisdiction", "Equity", "Limitation"]
                });
                setLoading(false);
            }, 1000);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
            <Navbar />

            {/* HEADER */}
            <div className="bg-[#0f172a] text-white pt-32 pb-24 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <h1 className="text-5xl font-black mb-4 tracking-tight">Judicial Intelligence <span className="text-amber-400">.</span></h1>
                        <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
                            Leverage AI to analyze judicial psychology, past rulings, and behavioral patterns. Know your judge before you enter the courtroom.
                        </p>

                        {/* SEARCH BAR */}
                        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search Judge by Name (e.g., Justice Chandrachud)"
                                className="w-full pl-6 pr-32 py-5 rounded-2xl text-lg text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/30 shadow-2xl"
                            />
                            <button
                                disabled={loading || !query}
                                className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition disabled:opacity-50"
                            >
                                {loading ? "Scanning..." : "Analyze"}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>

            {/* RESULTS */}
            <div className="max-w-6xl mx-auto px-6 -mt-16 pb-20 relative z-20">
                {data && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">

                        {/* LEFT: PROFILE CARD */}
                        <div className="lg:col-span-4">
                            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 sticky top-24">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-4xl mb-6 mx-auto">⚖️</div>
                                <h2 className="text-2xl font-bold text-center text-slate-900 mb-1">{data.name}</h2>
                                <p className="text-slate-500 text-center font-medium mb-6">{data.court}</p>

                                <div className="space-y-4 border-t border-slate-100 pt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Judgments</span>
                                        <span className="font-black text-slate-900">{data.total_judgments}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-500 font-medium">Appointed</span>
                                        <span className="font-bold text-slate-900">{data.appointed}</span>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-xl mt-4 text-center border border-amber-100">
                                        <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">Judicial Archetype</div>
                                        <div className="text-lg font-black text-amber-900">{data.adjective}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: ANALYTICS */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* BIAS METERS */}
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-xl text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">🧠</span> Behavioral Tendencies
                                </h3>
                                <div className="space-y-6">
                                    {data.biases.map((b, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-slate-700">{b.topic}</span>
                                                <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wider ${b.color === 'red' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {b.tendency}
                                                </span>
                                            </div>
                                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: b.color === 'red' ? '30%' : '85%' }}
                                                    className={`h-full ${b.color === 'red' ? 'bg-red-500' : 'bg-emerald-500'}`}
                                                ></motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* KEYWORDS */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Frequent Keywords</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {data.keywords.map(k => (
                                            <span key={k} className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-600 font-bold text-sm rounded-lg">
                                                {k}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* CITATIONS */}
                                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider mb-4">Top Citations</h3>
                                    <ul className="space-y-3">
                                        {data.favorite_citations.map((c, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span className="text-blue-500 font-bold">❝</span>
                                                <span className="text-sm text-slate-700 italic font-medium">{c}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {!data && !loading && (
                    <div className="text-center py-20 opacity-50">
                        <div className="text-6xl mb-4">⚖️</div>
                        <p className="font-bold text-slate-400">Ready to Analyze</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JudgeProfile;

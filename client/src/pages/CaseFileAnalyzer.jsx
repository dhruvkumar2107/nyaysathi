import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

const CaseFileAnalyzer = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleAnalyze = async () => {
        if (!file) return toast.error("Please upload a PDF file first.");

        if (user?.plan === 'free' && user?.aiUsage?.count >= 3) {
            return toast.error("Free Limit Reached! Upgrade to Silver.");
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/ai/analyze-case-file', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });
            // Simulate scanning delay for effect
            setTimeout(() => {
                setAnalysis(res.data);
                toast.success("Forensic Analysis Complete");
                setLoading(false);
            }, 1000);
        } catch (err) {
            console.error(err);
            toast.error(err.response?.status === 403 ? "Usage Limit Reached" : "Analysis Failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0F4F8] font-sans text-slate-900 pb-20">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-6 pt-32">
                <header className="text-center mb-12">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase tracking-widest mb-4">
                        Legal Forensics v2.0
                    </motion.div>
                    <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        Case File <span className="text-blue-600">Intelligence</span>
                    </motion.h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-lg">
                        Upload FIRs, Chargesheets, or Contracts. Our AI extracts timelines, risks, and win probabilities with forensic precision.
                    </p>
                </header>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT PANEL: UPLOAD */}
                    <div className="lg:col-span-4 space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                            className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-white"
                        >
                            <div
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl shadow-sm">
                                    📂
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">Upload Case File</h3>
                                <p className="text-xs text-slate-400 mb-6">PDF Format Only • Max 10MB</p>

                                <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="file-upload" />
                                <label htmlFor="file-upload" className="block w-full py-3 px-4 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50 transition mb-2 truncate">
                                    {file ? file.name : "Select Document"}
                                </label>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !file}
                                className="w-full mt-4 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing...</>
                                ) : "🚀 Run Analysis"}
                            </button>
                        </motion.div>

                        {/* Tips Card */}
                        <div className="bg-blue-600 text-white rounded-3xl p-6 shadow-lg relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                            <h4 className="font-bold mb-2 relative z-10">Pro Tip</h4>
                            <p className="text-sm text-blue-100 relative z-10">
                                This tool works best with scanned PDFs that have clear text. If the file is blurred, accuracy may drop.
                            </p>
                        </div>
                    </div>

                    {/* RIGHT PANEL: RESULTS */}
                    <div className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {!analysis && !loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                                    <span className="text-6xl mb-4 grayscale opacity-50">📊</span>
                                    <p className="font-medium text-slate-400">Analysis results will appear here</p>
                                </motion.div>
                            )}

                            {loading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full min-h-[400px] flex flex-col items-center justify-center">
                                    <div className="w-24 h-24 relative">
                                        <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    </div>
                                    <p className="mt-8 font-bold text-slate-900 animate-pulse">Extracting forensic data...</p>
                                </motion.div>
                            )}

                            {analysis && !loading && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                                    {/* Top Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                            <div className="absolute right-0 top-0 p-4 opacity-10 text-6xl">🏆</div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Win Probability</p>
                                            <p className={`text-5xl font-black ${analysis.winProbability > 60 ? 'text-emerald-500' : 'text-orange-500'}`}>
                                                {analysis.winProbability}%
                                            </p>
                                        </div>
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AI Summary</p>
                                            <p className="text-slate-700 leading-relaxed font-medium">{analysis.summary}</p>
                                        </div>
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                        <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                                            <span className="bg-slate-100 p-2 rounded-lg text-lg">📅</span> Extracted Timeline
                                        </h3>
                                        <div className="relative border-l-2 border-slate-100 ml-3 space-y-8 pl-8">
                                            {analysis.timeline?.map((item, i) => (
                                                <div key={i} className="relative">
                                                    <span className="absolute -left-[41px] top-1.5 w-5 h-5 bg-white border-4 border-blue-500 rounded-full shadow-sm"></span>
                                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">{item.date}</span>
                                                    <p className="text-slate-700 font-medium">{item.event}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* SWOT Grid */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                                            <h3 className="font-bold text-rose-800 mb-4 flex items-center gap-2">⚠️ Identified Risks</h3>
                                            <ul className="space-y-3">
                                                {analysis.risks?.map((r, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-rose-700">
                                                        <span className="font-bold">•</span> {r}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100">
                                            <h3 className="font-bold text-amber-800 mb-4 flex items-center gap-2">🔍 Contradictions</h3>
                                            <ul className="space-y-3">
                                                {analysis.contradictions?.map((c, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-amber-900">
                                                        <span className="font-bold">•</span> {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Citations */}
                                    <div className="bg-[#0B1120] text-white p-6 rounded-2xl shadow-lg">
                                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">📚 Relevant Precedents</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.citations?.map((c, i) => (
                                                <span key={i} className="px-3 py-1 bg-white/10 rounded-lg text-sm font-mono text-blue-200 border border-white/10 hover:bg-white/20 transition cursor-default">
                                                    {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CaseFileAnalyzer;

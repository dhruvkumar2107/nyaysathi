import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const CaseFileAnalyzer = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAnalyze = async () => {
        if (!file) return toast.error("Please upload a PDF file first.");

        // Basic Plan Check (Client-side pre-check, server also enforces)
        if (user?.plan === 'free' && user?.aiUsage?.count >= 3) {
            return toast.error("Free Limit Reached! Upgrade to Silver for 10 analyses.");
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/ai/analyze-case-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            setAnalysis(res.data);
            toast.success("Case Analysis Complete!");
        } catch (err) {
            console.error(err);
            if (err.response?.status === 403) {
                toast.error(err.response.data.error || "Usage Limit Reached");
            } else {
                toast.error("Analysis Failed. Ensure PDF is text-readable.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-bold text-slate-900">Judge AI <span className="text-blue-600">Pro</span></h1>
                    <p className="text-lg text-slate-600">Upload your FIR, Charge Sheet, or Agreement. We'll find the loopholes.</p>
                </div>

                {/* UPLOAD AREA */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center transition-all hover:shadow-2xl">
                    <div className="border-4 border-dashed border-blue-100 rounded-xl p-10 bg-blue-50/50">
                        <span className="text-6xl mb-4 block">📂</span>
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg cursor-pointer transition transform hover:scale-105"
                        >
                            {file ? file.name : "Select PDF Case File"}
                        </label>
                        <p className="mt-4 text-sm text-slate-400">Supported: PDF (Max 10MB)</p>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !file}
                        className="mt-8 px-12 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full md:w-auto"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-3">
                                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Analyzing Evidence...
                            </span>
                        ) : "🕵️ Analyze Case File"}
                    </button>
                </div>

                {/* RESULTS DASHBOARD */}
                {analysis && (
                    <div className="space-y-8 animate-fade-in-up">

                        {/* 1. WIN PROBABILITY & SUMMARY */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-50">
                                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Win Probability</div>
                                <div className={`text-6xl font-black ${analysis.winProbability > 60 ? 'text-green-600' : 'text-orange-500'}`}>
                                    {analysis.winProbability}%
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 col-span-1 md:col-span-2">
                                <h3 className="text-lg font-bold text-slate-900 mb-2">Executive Summary</h3>
                                <p className="text-slate-600 leading-relaxed">{analysis.summary}</p>
                            </div>
                        </div>

                        {/* 2. TIMELINE */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">⏱️ Chronological Timeline</h3>
                            <div className="space-y-6 relative border-l-2 border-slate-100 ml-4 pl-8">
                                {analysis.timeline?.map((item, i) => (
                                    <div key={i} className="relative">
                                        <span className="absolute -left-[41px] top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white shadow-sm"></span>
                                        <span className="text-sm font-bold text-blue-600 block mb-1">{item.date}</span>
                                        <p className="text-slate-700">{item.event}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 3. RISKS & CONTRADICTIONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                                <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">⚠️ Major Risks</h3>
                                <ul className="space-y-3">
                                    {analysis.risks?.map((risk, i) => (
                                        <li key={i} className="flex gap-3 text-red-800">
                                            <span>•</span>
                                            {risk}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                <h3 className="text-xl font-bold text-orange-900 mb-4 flex items-center gap-2">🔍 Logical Contradictions</h3>
                                <ul className="space-y-3">
                                    {analysis.contradictions?.map((con, i) => (
                                        <li key={i} className="flex gap-3 text-orange-800">
                                            <span>•</span>
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 4. PRECEDENTS */}
                        <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">⚖️ Cited Case Law</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {analysis.citations?.map((cite, i) => (
                                    <div key={i} className="bg-white/10 p-4 rounded-lg hover:bg-white/20 transition cursor-pointer flex items-center gap-4">
                                        <span className="text-2xl">🏛️</span>
                                        <span className="font-medium text-blue-200">{cite}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default CaseFileAnalyzer;

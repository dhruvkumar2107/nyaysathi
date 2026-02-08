import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { useNavigate, Link } from "react-router-dom";
import PaywallModal from "../components/PaywallModal";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function Agreements() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const navigate = useNavigate();

  const analyzeAgreement = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/ai/agreement", { text });
      setResult(res.data);
      if (res.data.isLocked) setShowPaywall(true);
    } catch (err) {
      if (err.response?.status === 403) setShowPaywall(true);
      else if (err.response?.status === 401) navigate("/login");
      else alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'high': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans selection:bg-blue-100">
      <Navbar />
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            ✨ AI Document Intelligence
          </motion.div>
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Analyze Contracts using <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Legal AI</span>
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-slate-500 leading-relaxed">
            Identify hidden risks, missing clauses, and loophole detections in seconds.
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 flex gap-4 justify-center">
            <Link to="/rent-agreement" className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition shadow-sm">
              Draft New Contract
            </Link>
            <button onClick={() => document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' })} className="px-6 py-3 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-lg shadow-slate-900/20">
              Starts Analyzing ↓
            </button>
          </motion.div>
        </div>

        {/* WORKSPACE */}
        <div id="analyzer" className="grid lg:grid-cols-2 gap-8 min-h-[700px]">

          {/* INPUT */}
          <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="flex flex-col h-full">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 flex-1 flex flex-col overflow-hidden relative group">
              <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400/50"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400/50"></div>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Document</span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your agreement text here..."
                className="flex-1 w-full resize-none p-8 outline-none text-slate-600 leading-relaxed font-mono text-sm placeholder:text-slate-300"
              />
              <div className="absolute bottom-6 right-6">
                <button
                  onClick={analyzeAgreement}
                  disabled={loading || !text}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-105 transition disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
                >
                  {loading ? <span className="animate-spin text-xl">⏳</span> : <span>⚡ Analyze Risk</span>}
                </button>
              </div>
            </div>
          </motion.div>

          {/* OUTPUT */}
          <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }} className="h-full">
            <AnimatePresence mode="wait">
              {!result ? (
                <div className="h-full bg-slate-50 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-sm mb-6">📄</div>
                  <h3 className="text-lg font-bold text-slate-600 mb-2">Waiting for Input</h3>
                  <p className="max-w-xs text-sm">Paste a legal document on the left to generate a comprehensive risk report.</p>
                  <div className="mt-8 opacity-50 text-xs font-mono">
                    SECURE • ENCRYPTED • PRIVATE
                  </div>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white h-full rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col">
                  {/* Result Header */}
                  <div className="bg-slate-50 border-b border-slate-100 px-6 py-4 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Analysis Report</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getRiskColor(result.riskLevel)}`}>
                      {result.riskLevel} Risk
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                    {/* Score */}
                    <div className="flex items-center gap-6">
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <svg className="transform -rotate-90 w-24 h-24">
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - (result.accuracyScore / 100))} className="text-blue-600" />
                        </svg>
                        <span className="absolute text-xl font-bold text-slate-900">{result.accuracyScore}%</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Confidence Score</h4>
                        <p className="text-sm text-slate-500">Based on legal precedents and clause matching.</p>
                      </div>
                    </div>

                    {/* Missing Clauses */}
                    {result.missingClauses?.length > 0 && (
                      <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
                        <h4 className="font-bold text-rose-800 mb-4 flex items-center gap-2"><span className="text-lg">⚠️</span> Critical Omissions</h4>
                        <ul className="space-y-3">
                          {result.missingClauses.map((c, i) => (
                            <li key={i} className="flex gap-3 text-sm text-rose-700 font-medium">
                              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Markdown Content */}
                    <div className="prose prose-slate prose-sm max-w-none">
                      <ReactMarkdown>{result.analysisText}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </main>
  );
}

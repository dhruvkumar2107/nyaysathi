import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { useNavigate } from "react-router-dom";
import PaywallModal from "../components/PaywallModal";

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
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setShowPaywall(true);
      } else if (err.response?.status === 401) {
        navigate("/login");
      } else {
        alert("Analysis failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getriskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'low': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'medium': return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
      case 'high': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1F44] text-white pb-20 pt-24">
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <span className="text-5xl">📄</span> Agreement Analyzer
        </h1>
        <p className="text-blue-200 mb-8 max-w-2xl text-lg">
          Paste your contract or legal agreement below. Our AI scans for risks, missing clauses, and legal accuracy.
        </p>

        {/* INPUT AREA */}
        <div className="glass-panel rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste agreement text here..."
            className="w-full bg-[#0F2A5F]/50 border border-white/10 rounded-xl p-4 text-white placeholder-blue-300/50 focus:outline-none focus:border-[#00D4FF] focus:mode-ring transition resize-y"
          />

          <div className="mt-6 flex justify-end">
            <button
              onClick={analyzeAgreement}
              disabled={loading}
              className="px-8 py-3 bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44] rounded-xl font-bold text-lg transition shadow-[0_0_20px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin text-xl">⏳</span> Scanning...
                </>
              ) : (
                "Analyze Now"
              )}
            </button>
          </div>
        </div>

        {/* RESULTS */}
        {result && (
          <div className="mt-12 animate-in slide-in-from-bottom-8 duration-700">
            {/* SCORE CARD */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-2">Accuracy Score</div>
                <div className="text-5xl font-bold text-[#00D4FF]">{result.accuracyScore || "N/A"}%</div>
              </div>

              <div className={`glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center border ${getriskColor(result.riskLevel)}`}>
                <div className="text-inherit text-sm font-medium uppercase tracking-wider mb-2">Risk Level</div>
                <div className="text-4xl font-bold">{result.riskLevel || "Unknown"}</div>
              </div>

              <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-2">Jurisdiction</div>
                <div className="text-xl font-bold text-white">{result.jurisdictionContext || "General"}</div>
              </div>
            </div>

            {/* DETAILED ANALYSIS */}
            <div className="glass-panel rounded-2xl p-8 shadow-2xl border-t-4 border-t-[#00D4FF]">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>📊</span> Detailed Analysis
              </h2>

              {/* Missing Clauses */}
              {result.missingClauses?.length > 0 && (
                <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">⚠️ Missing Critical Clauses</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-200">
                    {result.missingClauses.map((c, i) => <li key={i}>{c}</li>)}
                  </ul>
                </div>
              )}

              <div className="prose prose-invert max-w-none text-blue-100/90 leading-relaxed">
                <ReactMarkdown>{result.analysisText}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

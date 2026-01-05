import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';

export default function Agreements() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  /* -------------------------------------------
     REAL AI ANALYSIS
  ------------------------------------------- */
  const analyzeAgreement = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/ai/agreement", { text });

      // The AI route now returns { analysis: "markdown string" }
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 pb-20 pt-24">
      <div className="max-w-[1128px] mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Agreement Analyzer
        </h1>
        <p className="text-gray-500 mb-8 max-w-2xl">
          Paste your agreement text below and let AI provide a professional analysis.
        </p>

        {/* INPUT AREA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste agreement text here..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-gray-900"
          />

          <button
            onClick={analyzeAgreement}
            className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-white transition shadow-md shadow-blue-200"
          >
            Analyze Agreement
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-8 text-blue-600 font-medium flex items-center gap-2">
            <span className="animate-spin text-xl">⏳</span> Analyzing agreement…
          </div>
        )}

        {/* RESULTS */}
        {result && (
          <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Analysis Report</h2>
            <div className="prose prose-blue max-w-none text-gray-700">
              <ReactMarkdown>{result.analysis}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

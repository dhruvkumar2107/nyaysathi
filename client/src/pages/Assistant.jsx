// // import { useState } from "react";

// // export default function Assistant() {
// //   const [messages, setMessages] = useState([
// //     {
// //       role: "assistant",
// //       content: "Hello 👋 I’m your AI Legal Assistant. Ask me any legal question.",
// //     },
// //   ]);
// //   const [input, setInput] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const sendMessage = async () => {
// //     if (!input.trim()) return;

// //     const userMsg = { role: "user", content: input };
// //     setMessages((prev) => [...prev, userMsg]);
// //     setInput("");
// //     setLoading(true);

// //     // TEMP response (API will be wired later)
// //     setTimeout(() => {
// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           role: "assistant",
// //           content:
// //             "Thanks for your question. I will analyze it based on Indian law and respond accurately.",
// //         },
// //       ]);
// //       setLoading(false);
// //     }, 1000);
// //   };

// //   return (
// //     <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white">
// //       <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[calc(100vh-80px)]">
// //         <h1 className="text-3xl font-bold mb-4 text-indigo-400">
// //           AI Legal Assistant
// //         </h1>

// //         {/* CHAT AREA */}
// //         <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
// //           {messages.map((msg, i) => (
// //             <div
// //               key={i}
// //               className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed ${
// //                 msg.role === "user"
// //                   ? "ml-auto bg-indigo-600 text-white"
// //                   : "bg-slate-800 text-slate-200"
// //               }`}
// //             >
// //               {msg.content}
// //             </div>
// //           ))}

// //           {loading && (
// //             <div className="bg-slate-800 text-slate-400 px-4 py-3 rounded-xl w-fit">
// //               Typing…
// //             </div>
// //           )}
// //         </div>

// //         {/* INPUT */}
// //         <div className="mt-4 flex gap-2">
// //           <input
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             placeholder="Ask your legal question..."
// //             className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:outline-none focus:border-indigo-500"
// //           />
// //           <button
// //             onClick={sendMessage}
// //             className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold"
// //           >
// //             Send
// //           </button>
// //         </div>
// //       </div>
// //     </main>
// //   );
// // }
// import { useState } from "react";
// import axios from "axios";

// export default function Assistant() {
//   const [messages, setMessages] = useState([
//     { role: "assistant", content: "Hello 👋 I’m your AI Legal Assistant." },
//   ]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const sendMessage = async () => {
//     if (!input.trim()) return;

//     const userText = input;
//     setMessages((m) => [...m, { role: "user", content: userText }]);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await axios.post("/api/assistant", {
//         question: userText,
//         language: "English",
//         location: "India",
//       });

//       setMessages((m) => [
//         ...m,
//         { role: "assistant", content: res.data.answer },
//       ]);
//     } catch {
//       setMessages((m) => [
//         ...m,
//         {
//           role: "assistant",
//           content: "⚠️ Unable to reach AI service.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black text-white p-6">
//       <div className="max-w-3xl mx-auto space-y-4">
//         {messages.map((m, i) => (
//           <div key={i} className={m.role === "user" ? "text-right" : ""}>
//             <span className="inline-block bg-slate-800 p-3 rounded-xl">
//               {m.content}
//             </span>
//           </div>
//         ))}
//         {loading && <p>Typing…</p>}
//         <input
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           className="w-full p-3 bg-slate-900 rounded"
//           placeholder="Ask a legal question…"
//         />
//         <button onClick={sendMessage} className="bg-indigo-600 px-4 py-2 rounded">
//           Send
//         </button>
//       </div>
//     </main>
//   );
// }
import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PaywallModal from "../components/PaywallModal";
import { Link } from "react-router-dom";

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello 👋 I’m your AI Legal Assistant. Ask me any legal question or draft a notice.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Features
  const [language, setLanguage] = useState("English");
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [modalInput, setModalInput] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  const languages = ["English", "Hindi", "Marathi", "Kannada", "Tamil", "Telugu", "Bengali", "Gujarati", "Malayalam", "Punjabi"];

  const handleError = (err) => {
    if (err.response?.status === 403) {
      setShowPaywall(true);
      return "🔒 You have reached your free limit. Please upgrade to continue.";
    }
    return err.response?.data?.answer || "⚠️ Unable to reach AI service.";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setInput("");
    setLoading(true);

    try {
      const history = messages.slice(-6);
      const res = await axios.post("/api/ai/assistant", {
        question: userText,
        history: history,
        language: language,
        location: "India",
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.answer },
      ]);
    } catch (err) {
      const msg = handleError(err);
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const generateDocument = async () => {
    if (!modalInput.trim()) return;
    setModalLoading(true);
    setShowNoticeModal(false);

    setMessages((prev) => [...prev, { role: "user", content: `Drafting Legal Notice...` }]);
    setLoading(true);

    try {
      const res = await axios.post('/api/ai/draft-notice', {
        notice_details: modalInput,
        language,
        type: "Legal Notice"
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.data.draft },
      ]);
    } catch (err) {
      const msg = handleError(err);
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setModalLoading(false);
      setLoading(false);
      setModalInput("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1F44] text-white pb-32 pt-24">
      <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

      <div className="max-w-4xl mx-auto px-6 space-y-6">

        {/* TOP TOOLBAR */}
        <div className="flex flex-wrap gap-3 justify-between items-center glass-panel p-3 rounded-xl shadow-lg mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-200">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-[#0A1F44] text-white text-sm px-3 py-1.5 rounded-lg border border-blue-500/30 focus:outline-none focus:border-[#00D4FF]"
            >
              {languages.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowNoticeModal(true)}
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition shadow-lg flex items-center gap-2 font-semibold"
            >
              <span>⚖️</span> Draft Notice
            </button>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="space-y-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl max-w-[85%] shadow-md ${m.role === "user"
                ? "ml-auto bg-blue-600 text-white"
                : "glass-panel border-white/5 text-blue-50"
                }`}
            >
              {m.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🤖</span>
                  <span className="text-xs font-bold text-[#00D4FF] uppercase tracking-wide">NyaySathi AI</span>
                </div>
              )}
              <div className={`prose max-w-none text-sm md:text-base leading-relaxed ${m.role === "user" ? "prose-invert" : "prose-invert"}`}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {loading && (
            <div className="glass-panel p-4 rounded-2xl w-fit flex items-center gap-2">
              <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-[#00D4FF] rounded-full animate-bounce delay-150"></div>
            </div>
          )}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0A1F44]/90 backdrop-blur-md border-t border-white/10 p-4 z-40">
        <div className="max-w-4xl mx-auto flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={`Ask a legal question in ${language}...`}
            className="flex-1 p-3.5 rounded-xl bg-[#0F2A5F] border border-blue-500/20 focus:border-[#00D4FF] focus:outline-none transition-all text-white placeholder:text-blue-300/50"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44] font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Send
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-[#0F2A5F] border border-white/10 rounded-2xl p-8 w-full max-w-lg space-y-6 shadow-2xl relative">
            <button onClick={() => setShowNoticeModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Draft Legal Notice</h3>
              <p className="text-blue-200">Who is this for? What are your grievances and demands?</p>
            </div>

            <textarea
              rows={6}
              className="w-full bg-[#0A1F44] border border-blue-500/20 rounded-xl p-4 focus:outline-none focus:border-[#00D4FF] text-white resize-none"
              placeholder="E.g. Notice to tenant Mr. Sharma for unpaid rent of 3 months..."
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
            />

            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowNoticeModal(false)} className="px-5 py-2.5 text-blue-200 hover:text-white hover:bg-white/5 rounded-xl transition font-medium">Cancel</button>
              <button
                onClick={generateDocument}
                disabled={modalLoading}
                className="px-6 py-2.5 bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44] rounded-xl font-bold shadow-[0_0_15px_rgba(0,212,255,0.3)] transition"
              >
                {modalLoading ? "Generating..." : "Generate Notice"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}

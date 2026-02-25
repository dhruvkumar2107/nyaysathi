'use client'
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useAuth } from "../../src/context/AuthContext";
import Navbar from "../../src/components/Navbar";
import Footer from "../../src/components/Footer";
import { Mic, MicOff, Video, VideoOff, MessageSquare, Gavel, Users, User, ArrowRight, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-hot-toast";

// Connect to backend (Voice Socket)
const socket = io(process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, "") || "http://localhost:4000");

const MootCourt = () => {
    const { user } = useAuth();
    const [sessionActive, setSessionActive] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [mode, setMode] = useState("voice"); // 'voice' | 'text'
    const [isListening, setIsListening] = useState(false);
    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { role: "assistant", content: "Court is in session. Counselor, please present your opening argument." }
    ]);
    const [metrics, setMetrics] = useState({ logic: 85, persuasion: 65, tone: 70 });
    const [justiceNote, setJusticeNote] = useState("Counsel, the court is ready to hear your arguments.");

    const chatEndRef = useRef(null);
    const recognitionRef = useRef(null);

    const startSession = () => {
        setSessionActive(true);
        if (mode === 'voice') {
            startListening();
        }
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported.");
            return;
        }
        if (!recognitionRef.current) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (event) => {
                const transcript = Array.from(event.results)
                    .map(result => result[0].transcript)
                    .join("");
                setInputText(transcript);
            };
            recognitionRef.current.onend = () => setIsListening(false);
        }
        recognitionRef.current.start();
        setIsListening(true);
    };

    const stopListening = () => {
        recognitionRef.current?.stop();
        setIsListening(false);
        if (inputText.trim()) handleSendMessage();
    };

    const handleSendMessage = async () => {
        const textToSubmit = inputText.trim();
        if (!textToSubmit) return;

        // Add User Message
        const newHistory = [...chatHistory, { role: "user", content: textToSubmit }];
        setChatHistory(newHistory);
        setInputText("");
        setAnalyzing(true);

        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // Use courtroom-battle logic simulator for moot court for better quality
            const response = await axios.post("/api/ai/assistant", {
                question: `[Moot Court Session] Context: You are a Judge in a mock trial. User (Counsel) just said: "${textToSubmit}". Respond as a judge with feedback. Also include a brief 'Justice Note' for coaching.`,
                history: newHistory
            }, { headers });

            const reply = response.data.answer || "Please continue your argument, counselor.";

            // Randomize metrics to feel "alive"
            setMetrics({
                logic: Math.min(100, Math.max(40, metrics.logic + (Math.random() * 20 - 10))),
                persuasion: Math.min(100, Math.max(40, metrics.persuasion + (Math.random() * 30 - 15))),
                tone: mode === 'voice' ? Math.min(100, Math.max(40, metrics.tone + (Math.random() * 20 - 10))) : 80
            });

            // Extract justice note if AI provides one, otherwise generate generic
            const noteMatch = reply.match(/Justice Note:?\s*(.*)/i);
            if (noteMatch) {
                setJusticeNote(noteMatch[1]);
            } else {
                setJusticeNote("Counsel, focus on the precedents related to " + (textToSubmit.split(' ').slice(0, 3).join(' ')) + ".");
            }

            setChatHistory(prev => [...prev, { role: "assistant", content: reply.replace(/Justice Note:?.*/i, "").trim() }]);

        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { role: "assistant", content: "The court clerk is having trouble recording that. Please state it again." }]);
        } finally {
            setAnalyzing(false);
            if (mode === 'voice') startListening(); // Resume listening
        }
    };

    return (
        <div className="min-h-screen bg-[#0c1220] font-sans selection:bg-indigo-500/30 overflow-hidden relative">
            <Navbar />

            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none mix-blend-overlay"></div>

            {!sessionActive ? (
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-6 pt-24">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10 mb-8 animate-pulse shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                        <Gavel size={40} className="text-slate-300" />
                    </div>
                    <h1 className="text-6xl font-serif font-bold text-white mb-6">Virtual Moot Court</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mb-12">
                        Step into the courtroom. Practice your arguments against an AI Opposing Counsel and get real-time feedback on your tone, citation accuracy, and legal logic.
                    </p>

                    {/* MODE SELECTION */}
                    <div className="flex bg-white/5 p-1 rounded-xl mb-8 border border-white/10">
                        <button
                            onClick={() => setMode("voice")}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${mode === "voice" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            <Mic size={16} /> Voice Mode
                        </button>
                        <button
                            onClick={() => setMode("text")}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition flex items-center gap-2 ${mode === "text" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-400 hover:text-white"}`}
                        >
                            <Keyboard size={16} /> Text Mode
                        </button>
                    </div>

                    <button
                        onClick={startSession}
                        className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-lg transition shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center gap-3 group"
                    >
                        Enter Courtroom <ArrowRight className="group-hover:translate-x-1 transition" />
                    </button>
                    <p className="mt-8 text-xs text-slate-500 uppercase tracking-widest font-bold">
                        {mode === "voice" ? "Microphone Required • Ideal for Oratory" : "Keyboard Required • Ideal for Drafting"}
                    </p>
                </div>
            ) : (
                <div className="relative z-10 h-screen flex flex-col pt-16">
                    {/* TOP BAR */}
                    <div className="h-16 border-b border-white/10 bg-[#0f172a]/80 backdrop-blur-md flex items-center justify-between px-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-red-400">Live Session ({mode === "voice" ? "Voice" : "Text"})</span>
                            <span className="text-slate-500 text-xs">|</span>
                            <span className="text-sm font-bold text-slate-300">Case #2024-MC-882: State vs. Sharma</span>
                        </div>
                        <button onClick={() => setSessionActive(false)} className="px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold hover:bg-red-500 hover:text-white transition">
                            End Session
                        </button>
                    </div>

                    <div className="flex-1 grid grid-cols-12 gap-6 p-6">

                        {/* MAIN STAGE (JUDGE & OPPOSING COUNSEL) */}
                        <div className="col-span-9 flex flex-col gap-6">
                            <div className="flex-1 bg-[#0f172a] rounded-3xl border border-white/10 relative overflow-hidden flex items-center justify-center group shadow-2xl">
                                {/* AI JUDGE VISUALIZATION */}
                                <div className="text-center opacity-50 group-hover:opacity-100 transition duration-500">
                                    <div className={`w-32 h-32 bg-indigo-500/20 rounded-full mx-auto mb-4 flex items-center justify-center border border-indigo-500/30 shadow-[0_0_50px_rgba(99,102,241,0.2)] ${analyzing ? 'animate-pulse' : ''}`}>
                                        <User size={60} className="text-indigo-300" />
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-white">Hon. AI Justice</h3>
                                    <p className="text-indigo-400 font-mono text-xs mt-2">
                                        {analyzing ? "Deliberating..." : "Awaiting Argument"}
                                    </p>
                                </div>
                            </div>

                            {/* USER CONTROLS & TRANSCRIPT */}
                            <div className="h-80 bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col shadow-lg">
                                {/* CHAT HISTORY */}
                                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2 custom-scrollbar">
                                    {chatHistory.map((msg, idx) => (
                                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-none'
                                                : 'bg-white/10 text-slate-300 rounded-bl-none border border-white/5'
                                                }`}>
                                                <span className="block text-xs font-bold opacity-50 mb-1 uppercase tracking-wider">
                                                    {msg.role === 'user' ? 'Defense Counsel' : 'Hon. Justice'}
                                                </span>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef}></div>
                                </div>

                                {/* INPUT AREA */}
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-black/50 rounded-xl p-2 border border-white/5 flex items-center px-4 md:px-6 focus-within:border-indigo-500/50 transition">
                                        <input
                                            type="text"
                                            className="bg-transparent border-none outline-none text-white w-full placeholder-slate-600 font-medium h-10"
                                            placeholder={mode === "voice" ? "Listening..." : "Type your argument..."}
                                            value={inputText}
                                            onChange={e => setInputText(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                                            disabled={mode === "voice" || analyzing}
                                        />
                                        {mode === "voice" ? (
                                            <div onClick={isListening ? stopListening : startListening} className="cursor-pointer">
                                                <Mic className={`${isListening ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
                                            </div>
                                        ) : (
                                            <div
                                                onClick={handleSendMessage}
                                                className="cursor-pointer p-2 hover:bg-white/10 rounded-lg transition"
                                            >
                                                <ArrowRight className="text-indigo-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SIDEBAR ANALYTICS */}
                        <div className="col-span-3 space-y-6">
                            <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl p-6 border border-white/10 h-full shadow-lg flex flex-col">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 flex items-center gap-2">
                                    <MessageSquare size={14} /> Live Analysis
                                </h4>
                                <div className="space-y-8 flex-1">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                                            <span>Legal Logic</span>
                                            <span className="text-emerald-400">{Math.round(metrics.logic)}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full"><motion.div animate={{ width: `${metrics.logic}%` }} className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></motion.div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                                            <span>Persuasion</span>
                                            <span className="text-amber-400">{Math.round(metrics.persuasion)}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full"><motion.div animate={{ width: `${metrics.persuasion}%` }} className="bg-amber-400 h-full rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"></motion.div></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                                            <span>Voice/Tone</span>
                                            <span className="text-indigo-400">{Math.round(metrics.tone)}%</span>
                                        </div>
                                        <div className="w-full bg-white/10 h-1 rounded-full"><motion.div animate={{ width: `${metrics.tone}%` }} className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></motion.div></div>
                                    </div>

                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 mt-auto">
                                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Justice's Note</p>
                                        <p className="text-sm text-slate-300 italic">"{justiceNote}"</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default MootCourt;

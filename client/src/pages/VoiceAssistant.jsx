import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, X } from "lucide-react";

const VoiceAssistant = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [response, setResponse] = useState("");
    const [speaking, setSpeaking] = useState(false);
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                const currentTranscript = Array.from(event.results)
                    .map((result) => result[0].transcript)
                    .join("");
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                if (transcript) handleAIResponse(transcript);
            };
        }
    }, [transcript]);

    const handleAIResponse = (text) => {
        // Mock AI Logic - In production, send 'text' to backend
        const lowerText = text.toLowerCase();
        let reply = "I'm not sure specifically, but I can connect you with a lawyer.";

        if (lowerText.includes("hello") || lowerText.includes("hi")) reply = "Hello! I am NyayVoice. How can I help you today?";
        else if (lowerText.includes("lawyer")) reply = "I can help you find a lawyer. Please visit the Marketplace section.";
        else if (lowerText.includes("fir")) reply = "To file an FIR, you should visit your nearest police station. Would you like me to find one?";
        else if (lowerText.includes("rights")) reply = "Usage of Fundamental Rights is guaranteed by the Constitution of India.";

        setResponse(reply);
        speak(reply);
    };

    const speak = (text) => {
        if (synthRef.current) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            synthRef.current.speak(utterance);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setTranscript("");
            setResponse("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden font-sans">
            <Navbar />

            {/* Background Ambient Mesh */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-center h-screen pt-16">

                {/* Status Text */}
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-center mb-10"
                >
                    <p className="text-indigo-400 font-bold tracking-[0.3em] text-xs uppercase mb-4">NyayVoice Interface v1.0</p>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
                        {isListening ? "Listening..." : speaking ? "Speaking..." : "Tap to Speak"}
                    </h1>
                </motion.div>

                {/* ORB ANIMATION */}
                <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer" onClick={toggleListening}>
                    {/* Core */}
                    <motion.div
                        animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-32 h-32 rounded-full flex items-center justify-center z-20 shadow-[0_0_50px_rgba(99,102,241,0.5)] transition-all duration-500 ${isListening ? 'bg-indigo-500' : 'bg-slate-800 border border-white/10'}`}
                    >
                        {isListening ? <Mic size={40} /> : <MicOff size={40} className="text-slate-500" />}
                    </motion.div>

                    {/* Ripples */}
                    {isListening && (
                        <>
                            <motion.div
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full border border-indigo-500/50"
                            />
                            <motion.div
                                animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeOut" }}
                                className="absolute inset-0 rounded-full border border-indigo-400/30"
                            />
                        </>
                    )}

                    {/* Speaking Waveforms (Mock) */}
                    {speaking && (
                        <div className="absolute inset-0 flex items-center justify-center gap-1 z-30 pointer-events-none">
                            {[1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [10, 40, 10] }}
                                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                    className="w-1 bg-white rounded-full"
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Transcript Area */}
                <div className="mt-12 max-w-2xl w-full px-6 text-center space-y-6 min-h-[100px]">
                    {transcript && (
                        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xl text-slate-300">
                            "{transcript}"
                        </motion.p>
                    )}
                    {response && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl inline-block backdrop-blur-md">
                            <p className="text-2xl font-serif text-indigo-300">{response}</p>
                        </motion.div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default VoiceAssistant;

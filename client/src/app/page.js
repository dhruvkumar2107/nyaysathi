'use client'

import React from "react"
import Link from "next/link"
import { useAuth } from "../context/AuthContext"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { LegalSOSSection } from "../components/home/LegalSOSSection"
import { ComparisonSection } from "../components/home/ComparisonSection"
import { BentoGrid } from "../components/home/BentoGrid"
import {
    Gavel,
    Mic,
    Users,
    FileText,
    Search,
    Briefcase,
    Zap,
    Shield,
    Scale,
    Sparkles,
    ArrowRight
} from "lucide-react"
import Image from "next/image"

export default function Home() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen bg-[#0c1220] font-sans text-slate-400 selection:bg-indigo-500/30">
            {/* ══════════════════════════════════════════════════════
          NEW HERO ENTRANCE
      ══════════════════════════════════════════════════════ */}
            <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-[#0c1220] to-[#0c1220] pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
                    <Image src="/noise.svg" alt="" fill className="object-cover" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-gold-400 text-[10px] font-black uppercase tracking-[0.25em] mb-10 backdrop-blur-xl shadow-sm"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-gold-500 animate-pulse shadow-[0_0_10px_#fbbf24]" />
                        Free for Every Indian Citizen
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                        className="text-5xl md:text-7xl font-serif font-black text-white mb-6 leading-[0.95] tracking-tight"
                    >
                        Justice shouldn't
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-yellow-500 to-amber-600">
                            be a luxury.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed tracking-wide"
                    >
                        NyayNow puts the full power of the Indian legal system in your pocket. <br className="hidden md:block" />
                        Designed for the <span className="text-white font-bold">1.4 billion</span> who deserve access to justice.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5"
                    >
                        <Link
                            href={!user ? "/register" : (user.role === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard")}
                            className="group relative w-full sm:w-auto px-12 py-5 rounded-2xl text-midnight-950 font-black text-lg bg-gradient-to-r from-gold-400 to-yellow-600 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] transition-all duration-300 active:scale-95 overflow-hidden"
                            aria-label={!user ? "Get Started for Free" : "Go to Dashboard"}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                ✦ {!user ? "Get Started Free" : "Enter Command Center"}
                            </span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>
                        <Link
                            href="/legal-sos"
                            className="w-full sm:w-auto px-10 py-5 rounded-2xl font-bold text-base text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/40 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                            aria-label="Activate Legal SOS for Emergency Assistance"
                        >
                            🚨 Legal SOS
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* TRUST BAR */}
            <section className="py-10 border-y border-white/5 bg-[#0a0f1d] flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Trusted by the Indian Legal Community</p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-30 grayscale hover:opacity-60 transition-all duration-700">
                    <span className="font-serif italic text-xl md:text-2xl text-white tracking-[0.3em]">SUPREME COURT</span>
                    <span className="font-serif italic text-xl md:text-2xl text-white tracking-[0.3em]">HIGH COURTS</span>
                    <span className="font-serif italic text-xl md:text-2xl text-white tracking-[0.3em]">LEGAL AID</span>
                    <span className="font-serif italic text-xl md:text-2xl text-white tracking-[0.3em]">NALSAR</span>
                    <span className="font-serif italic text-xl md:text-2xl text-white tracking-[0.3em]">NLSIU</span>
                </div>
            </section>

            {/* STATS */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        {[
                            { val: "100K+", label: "Legal Queries", color: "text-indigo-400" },
                            { val: "50,000+", label: "Lawyers Joined", color: "text-violet-400" },
                            { val: "₹0", label: "Paid for Counsel", color: "text-emerald-400" },
                            { val: "14", label: "Languages", color: "text-amber-400" }
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={`text-4xl md:text-6xl font-black mb-2 ${stat.color} tracking-tighter`}>{stat.val}</div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <LegalSOSSection />
            <ComparisonSection />
            <BentoGrid />

            <Footer />
        </div>
    )
}

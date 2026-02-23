'use client'

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "../../context/AuthContext"
import Image from "next/image"

export default function HeroSection() {
    const { user } = useAuth()

    return (
        <section className="relative pt-40 pb-32 lg:pt-56 lg:pb-48 overflow-hidden text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-[#0c1220] to-[#0c1220] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[700px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
                <Image src="/noise.svg" alt="" fill className="object-cover" />
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6">
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
    )
}

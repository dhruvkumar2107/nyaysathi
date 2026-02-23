'use client'

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Scale, Mic, Users, FileText, Search, Briefcase } from "lucide-react"

export function BentoGrid() {
    return (
        <section className="py-32 relative overflow-hidden bg-black/10 border-y border-white/5">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-serif font-black text-white mb-4">Elite Capabilities.</h2>
                    <p className="text-slate-400 text-lg">The world's most advanced legal operating system.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[180px]">
                    <BentoCard
                        title="Moot Court VR"
                        desc="Experience the raw intensity of a real courtroom without leaving your home. Practice your oral arguments against a ruthless, adaptive AI Judge that listens to every word."
                        icon={<Scale className="text-white" size={20} />}
                        color="from-indigo-500 via-purple-500 to-pink-500"
                        href="/moot-court"
                        badge="Flagship"
                        className="md:col-span-8 md:row-span-2"
                        isLarge={true}
                    />
                    <BentoCard
                        title="NyayVoice"
                        desc="Break the language barrier with our multilingual AI assistant. Speak naturally in Hindi, Tamil, or any of 10+ Indian languages."
                        icon={<Mic className="text-white" size={18} />}
                        color="from-violet-600 via-indigo-600 to-purple-600"
                        href="/voice-assistant"
                        className="md:col-span-4"
                    />
                    <BentoCard
                        title="Elite Network"
                        desc="Gain direct access to the top 1% of India's legal minds. Our verified network connects you with expert advocates."
                        icon={<Users className="text-white" size={18} />}
                        color="from-amber-400 via-orange-500 to-red-500"
                        href="/marketplace"
                        badge="Exclusive"
                        className="md:col-span-4"
                    />
                    <BentoCard
                        title="Drafting Lab"
                        desc="Generate ironclad contracts, notices, and agreements in seconds using standard legal templates."
                        icon={<FileText className="text-white" size={18} />}
                        color="from-emerald-500 via-green-500 to-teal-500"
                        href="/drafting"
                        className="md:col-span-4"
                    />
                    <BentoCard
                        title="Deep Research"
                        desc="Find winning precedents with advanced semantic search across a massive database of past case laws."
                        icon={<Search className="text-white" size={18} />}
                        color="from-blue-500 via-cyan-500 to-indigo-500"
                        href="/research"
                        className="md:col-span-4"
                    />
                    <BentoCard
                        title="Career Hub"
                        desc="Launch your legal career with NyayNow. Explore exclusive internships and mentorship programs."
                        icon={<Briefcase className="text-white" size={18} />}
                        color="from-rose-500 via-pink-500 to-orange-500"
                        href="/career"
                        className="md:col-span-4"
                    />
                </div>
            </div>
        </section>
    )
}

function BentoCard({ title, desc, icon, color, href, badge, className, isLarge }) {
    return (
        <Link
            href={href}
            className={`relative group bg-white/5 border border-white/10 rounded-[24px] ${isLarge ? 'p-8 md:p-12' : 'p-5'} overflow-hidden hover:border-indigo-500/20 transition-all shadow-sm hover:shadow-xl flex flex-col focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${className}`}
            aria-label={`Explore ${title}: ${desc}`}
        >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500`} />
            <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${color} blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

            {badge && (
                <span className={`absolute ${isLarge ? 'top-8 right-8' : 'top-5 right-5'} px-3 py-1 bg-white/5 border border-white/10 rounded-full ${isLarge ? 'text-[10px]' : 'text-[8px]'} font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-400 transition-colors`}>
                    {badge}
                </span>
            )}

            <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={`${isLarge ? 'w-16 h-16 rounded-2xl' : 'w-10 h-10 rounded-xl'} bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${isLarge ? 'mb-8' : 'mb-3'} relative z-10`}
            >
                <div className={`absolute inset-0 ${isLarge ? 'rounded-2xl' : 'rounded-xl'} bg-white/20 blur-sm scale-90 opacity-0 group-hover:opacity-100 transition-opacity`} />
                {React.cloneElement(icon, { size: isLarge ? 32 : 20 })}
            </motion.div>

            <div className="relative z-10">
                <h3 className={`${isLarge ? 'text-2xl' : 'text-lg'} font-display font-bold text-white mb-2 group-hover:text-indigo-400 transition-all duration-300`}>
                    {title}
                </h3>
                <p className={`text-slate-400 ${isLarge ? 'text-sm' : 'text-[12px]'} leading-relaxed ${isLarge ? '' : 'max-w-sm'} group-hover:text-slate-200 transition-colors`}>
                    {desc}
                </p>
            </div>

            <div className="mt-auto pt-2 relative z-10">
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 group-hover:text-indigo-600 transition-all">
                    Explore Module
                    <motion.span
                        className="inline-block"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >→</motion.span>
                </span>
            </div>
        </Link>
    )
}

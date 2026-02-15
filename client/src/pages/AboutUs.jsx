import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Shield, Users, Globe, Award, Zap } from 'lucide-react';


export default function AboutUs() {
    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-900 selection:bg-indigo-500/30">

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-white border border-slate-200 text-amber-600 text-xs font-bold uppercase tracking-[0.2em] mb-8 shadow-sm"
                    >
                        Our Mission
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-serif font-bold text-slate-900 mb-8 leading-tight"
                    >
                        Democratizing Justice on <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600">Internet Scale.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        NyayNow is building the world's most advanced legal operating system. We bridge the gap between complex legal systems and the people they serve with military-grade AI.
                    </motion.p>
                </div>
            </section>

            {/* STATS ROW */}
            <section className="py-12 border-y border-white/5 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    <StatCard number="1M+" label="Case Laws Indexed" icon={<Scale size={20} />} />
                    <StatCard number="50k+" label="Documents Drafted" icon={<Zap size={20} />} />
                    <StatCard number="98%" label="Accuracy Rate" icon={<Award size={20} />} />
                    <StatCard number="24/7" label="AI Availability" icon={<Globe size={20} />} />
                </div>
            </section>

            {/* VISION CARDS */}
            <section className="py-24 relative">
                <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
                    <VisionCard
                        title="The Problem"
                        desc="Legal services have historically been opaque, expensive, and inaccessible. For the average citizen, navigating the court system is daunting. For lawyers, hours are wasted on repetitive research."
                        icon={<Shield size={32} className="text-red-400" />}
                        gradient="from-red-500/20 to-transparent"
                    />
                    <VisionCard
                        title="Our Solution"
                        desc="We deploy Large Legal Models (LLMs) trained on 50 years of case law. Our AI doesn't just retrieve information; it reasons, drafts, and predicts outcomes with unprecedented precision."
                        icon={<Zap size={32} className="text-emerald-400" />}
                        gradient="from-emerald-500/20 to-transparent"
                    />
                </div>
            </section>




        </div>
    );
}

function StatCard({ number, label, icon }) {
    return (
        <div className="text-center group cursor-default">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-slate-400 mb-4 group-hover:bg-white/10 group-hover:text-white transition">
                {icon}
            </div>
            <div className="text-4xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition">{number}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
        </div>
    )
}

function VisionCard({ title, desc, icon, gradient }) {
    return (
        <div className={`p-10 rounded-3xl border border-white/10 bg-gradient-to-br ${gradient} relative overflow-hidden group hover:border-white/20 transition duration-500`}>
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition transform group-hover:scale-110 duration-500">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-6 font-serif">{title}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">
                {desc}
            </p>
        </div>
    )
}

function TeamCard({ name, role, color }) {
    return (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition group">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 ${color} flex items-center justify-center text-3xl font-bold text-white/50 shadow-lg group-hover:scale-110 transition duration-300`}>
                {name.charAt(0)}
            </div>
            <h4 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition">{name}</h4>
            <p className="text-sm text-slate-500 uppercase tracking-wider">{role}</p>
        </div>
    )
}

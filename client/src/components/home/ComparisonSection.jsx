'use client'

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function ComparisonSection() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-serif font-bold text-white mb-4"
                    >
                        Two Minds. One Purpose.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-400 max-w-2xl mx-auto text-lg"
                    >
                        Choose the right intelligence for your legal battle.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* JUDGE AI */}
                    <ComparisonCard
                        title="Judge AI"
                        subtitle="The Strategist"
                        emoji="⚖️"
                        color="from-red-500 to-orange-600"
                        desc="Predict win probability, identify risks, and formulate a winning strategy."
                        highlight="WIN"
                        href="/judge-ai"
                    />
                    {/* AI ASSISTANT */}
                    <ComparisonCard
                        title="AI Assistant"
                        subtitle="The Consultant"
                        emoji="🧠"
                        color="from-cyan-500 to-blue-600"
                        desc="Get instant legal opinions and research complex topics conversationally."
                        highlight="UNDERSTAND"
                        href="/assistant"
                    />
                </div>
            </div>
        </section>
    )
}

function ComparisonCard({ title, subtitle, emoji, color, desc, highlight, href }) {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="group relative"
        >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-orange-600 rounded-3xl blur opacity-5 group-hover:opacity-20 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative h-full bg-[#0d1526]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden hover:border-red-500/30 transition-all duration-500 shadow-xl flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-4xl shadow-lg mb-8 relative z-10 text-white">
                    {emoji}
                </div>
                <h3 className="text-3xl font-serif font-bold text-white mb-2">{title}</h3>
                <p className={`font-bold uppercase tracking-widest text-xs mb-8 text-indigo-400`}>{subtitle}</p>
                <div className="text-lg text-slate-300 leading-relaxed mb-8 font-light">
                    "Use {title} to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 font-black text-2xl">{highlight}</span> the law."
                </div>
                <p className="text-sm text-slate-500 max-w-xs mx-auto mb-8">{desc}</p>
                <Link href={href} className="px-8 py-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-wider text-sm mt-auto">
                    Launch Module
                </Link>
            </div>
        </motion.div>
    )
}

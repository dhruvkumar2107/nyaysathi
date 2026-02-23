'use client'

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function LegalSOSSection() {
    return (
        <section className="relative py-24 overflow-hidden bg-black/5">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-[#0c1220] to-[#0c1220] pointer-events-none" />
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-50 border border-red-200 mb-6">
                            <span className="text-red-700 font-black text-xs tracking-[0.2em] uppercase text-[10px]">Emergency AI</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl font-serif font-black text-white mb-5 leading-[1.1]">
                            Legal emergency? <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-500">60 seconds.</span>
                        </h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-lg">
                            Hit SOS to get your rights, an AI-drafted FIR, and connect with a lawyer instantly.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/legal-sos"
                                className="group relative flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-base tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden active:scale-95"
                            >
                                🚨 Activate Legal SOS
                            </Link>
                            <a
                                href="tel:112"
                                className="flex items-center justify-center gap-2 px-8 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-base hover:bg-white/10 transition active:scale-95"
                            >
                                📞 Call 112
                            </a>
                        </div>
                    </motion.div>

                    <div className="space-y-4">
                        <SOSCard step="01" title="Describe Emergency" desc="AI classifies your crisis instantly." color="from-red-500/10 to-rose-500/5" border="border-red-500/20" />
                        <SOSCard step="02" title="Know Your Rights" desc="Get fundamental rights in plain language." color="from-amber-500/10 to-orange-500/5" border="border-amber-500/20" />
                        <SOSCard step="03" title="AI-Drafted FIR" desc="Ready in 30 seconds under BNS/IPC." color="from-indigo-500/10 to-blue-500/5" border="border-indigo-500/20" />
                    </div>
                </div>
            </div>
        </section>
    )
}

function SOSCard({ step, title, desc, color, border }) {
    return (
        <div className={`relative flex items-start gap-5 p-6 rounded-2xl bg-white/5 border ${border} hover:scale-[1.02] transition-transform duration-300 shadow-sm`}>
            <div className="text-2xl flex-shrink-0 font-black text-white/20">{step}</div>
            <div>
                <h3 className="text-white font-bold text-base mb-1">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
            </div>
        </div>
    )
}

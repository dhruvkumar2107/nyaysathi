import React from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { motion } from 'framer-motion'
import LegalSOSClient from '../../components/legal-sos/LegalSOSClient'
import Link from 'next/link'

export default function LegalSOSPage() {
    return (
        <div className="min-h-screen bg-[#0c1220] font-sans selection:bg-red-500/10">
            <Navbar />
            <div className="relative pt-28 pb-16 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-red-900/25 rounded-full blur-[140px] pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/30 mb-6 font-sans">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                        </span>
                        <span className="text-red-400 font-black text-xs tracking-[0.2em] uppercase">Emergency Response Active</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif font-black text-white mb-4 leading-tight">
                        Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-400 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">SOS</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        In a legal emergency? Get your rights and an FIR draft in under <span className="text-white font-bold">60 seconds</span>.
                    </p>
                </div>
            </div>

            <LegalSOSClient />

            <Footer />
        </div>
    )
}

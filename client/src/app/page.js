import React from "react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { LegalSOSSection } from "../components/home/LegalSOSSection"
import { ComparisonSection } from "../components/home/ComparisonSection"
import { BentoGrid } from "../components/home/BentoGrid"
import HeroSection from "../components/home/HeroSection"

export default function Home() {
    return (
        <div className="min-h-screen bg-[#0c1220] font-sans text-slate-400 selection:bg-indigo-500/30">
            <Navbar />

            <HeroSection />

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
                            <div key={stat.label}>
                                <div className={`text-4xl md:text-6xl font-black mb-2 ${stat.color} tracking-tighter`}>{stat.val}</div>
                                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
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

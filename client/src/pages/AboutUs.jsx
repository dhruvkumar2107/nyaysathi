import React from 'react';
import { motion } from 'framer-motion';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Democratizing Justice on <span className="text-indigo-600">Internet Scale.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        NyayNow is building the world's most advanced legal operating system, making high-quality legal intelligence accessible to everyone, from Supreme Court advocates to everyday citizens.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 mb-20">
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To bridge the gap between complex legal systems and the people they serve. We believe that legal rights shouldn't be a privilege of the few but a fundamental power available to all. By leveraging state-of-the-art AI, we are reducing legal costs by 90% and speeding up processes by 100x.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
                        <p className="text-slate-600 leading-relaxed">
                            A future where "Access to Justice" isn't just a constitutional ideal, but a digital reality. We envision a world where anyone, regardless of their background or budget, can instantly understand their rights, draft ironclad agreements, and navigate the courts with confidence.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-8">Built for the Future of Law</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <StatCard number="1M+" label="Case Laws Indexed" />
                        <StatCard number="50k+" label="Documents Drafted" />
                        <StatCard number="98%" label="Accuracy Rate" />
                        <StatCard number="24/7" label="AI Availability" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ number, label }) {
    return (
        <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">{number}</div>
            <div className="text-sm font-semibold text-slate-500 uppercase tracking-wide">{label}</div>
        </div>
    )
}

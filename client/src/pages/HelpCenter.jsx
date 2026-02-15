import React from 'react';
import { motion } from 'framer-motion';

export default function HelpCenter() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="text-4xl">👋</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 mb-6">
                        How can we <span className="text-indigo-600">help you?</span>
                    </h1>
                    <div className="max-w-xl mx-auto relative group">
                        <input
                            type="text"
                            placeholder="Search for answers..."
                            className="w-full pl-12 pr-6 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition shadow-sm"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
                    </div>
                </motion.div>

                <div className="grid gap-6">
                    <FaqItem
                        question="Is the legal advice provided by AI binding?"
                        answer="No. NyayNow's AI provides 'legal information' and 'predictions' based on data. It is a powerful tool to assist research and drafting, but it is NOT a substitute for a licensed attorney. Always consult a human lawyer for specialized advice."
                    />
                    <FaqItem
                        question="How accurate is the Judge AI Predictor?"
                        answer="Our Judge AI has shown a 94% accuracy rate in historical case validations. However, future cases have variables that no model can fully predict. Use the probability score as a strategic indicator, not a guarantee."
                    />
                    <FaqItem
                        question="Is my case data private and secure?"
                        answer="Absolutely. We use enterprise-grade AES-256 encryption. Your case files are anonymized before being processed by our AI models. We do not sell your data to third parties."
                    />
                    <FaqItem
                        question="Can I hire a lawyer through the platform?"
                        answer="Yes! Our Marketplace connects you with top-rated lawyers. You can view their profiles, past case history (verified), and book consultations directly."
                    />
                    <FaqItem
                        question="What languages does NyayVoice support?"
                        answer="Currently, NyayVoice supports English, Hindi, Tamil, Telugu, Marathi, and Bengali. We are adding support for Kannada and Malayalam in the next update."
                    />
                </div>

                <div className="mt-16 text-center">
                    <p className="text-slate-600 mb-4">Still stuck? We are here to help.</p>
                    <a href="/contact" className="text-indigo-600 font-bold hover:underline">Contact Support</a>
                </div>

            </div>
        </div>
    );
}

function FaqItem({ question, answer }) {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-300 transition cursor-pointer group">
            <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{question}</h3>
            <p className="text-slate-600 leading-relaxed">{answer}</p>
        </div>
    )
}

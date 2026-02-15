import React from 'react';
import { motion } from 'framer-motion';

export default function Blog() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        NyayNow <span className="text-indigo-600">Insights</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Deep dives into LegalTech, summaries of landmark judgments, and updates on our AI models.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <BlogCard
                        category="LegalTech"
                        date="Feb 14, 2026"
                        title="How AI is Predicting Supreme Court Judgments with 94% Accuracy"
                        desc="An inside look at the transformer models powering our Judge AI and how predictive justice is reshaping litigation strategy."
                        color="bg-indigo-600"
                    />
                    <BlogCard
                        category="Updates"
                        date="Feb 10, 2026"
                        title="Introducing NyayVoice: Legal Assistance in 10+ Indian Languages"
                        desc="Breaking the language barrier in Indian law. How we trained our speech-to-text models on regional dialects."
                        color="bg-purple-600"
                    />
                    <BlogCard
                        category="Rights"
                        date="Feb 05, 2026"
                        title="The Rent Control Act: 5 Things Every Tenant Must Know"
                        desc="A simplified breakdown of your rights as a tenant in metropolitan cities. Don't sign a lease without reading this."
                        color="bg-emerald-600"
                    />
                </div>

            </div>
        </div>
    );
}

function BlogCard({ category, date, title, desc, color }) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full">
            <div className={`h-48 ${color} opacity-90 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider mb-3">
                    <span className={`${color.replace('bg-', 'text-')} bg-opacity-10 px-2 py-1 rounded bg-slate-100`}>{category}</span>
                    <span className="text-slate-400">{date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-indigo-600 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                    {desc}
                </p>
                <div className="flex items-center text-indigo-600 font-bold text-sm mt-auto">
                    ages Read More <span>→</span>
                </div>
            </div>
        </div>
    )
}

import React from 'react';
import { motion } from 'framer-motion';

export default function Careers() {
    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block">We are Hiring</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Legal Revolution.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Help us build the intelligence layer for the Indian Justice System. Work on cutting-edge LLMs, high-scale systems, and products that impact millions.
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    <JobCard
                        title="Senior AI Engineer (LLM Implementation)"
                        type="Full-time"
                        location="Remote / Bangalore"
                        desc="Lead the development of our core legal reasoning models. Experience with RAG pipelines, fine-tuning Llama/Mistral, and Python is a must."
                    />
                    <JobCard
                        title="Full Stack Developer (MERN)"
                        type="Full-time"
                        location="Remote"
                        desc="Build beautiful, responsive interfaces and robust APIs. extensive experience with React, Node.js, and MongoDB required."
                    />
                    <JobCard
                        title="Legal Domain Expert"
                        type="Contract / Full-time"
                        location="Delhi NCR"
                        desc="Collaborate with engineers to ensure our AI models accurately reflect Indian Penal Code and case laws. Law degree required."
                    />
                </div>

                <div className="mt-16 text-center bg-indigo-900 rounded-2xl p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-4">Don't see a fit?</h3>
                        <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
                            We are always looking for exceptional talent. If you think you can make a difference, send your resume and a short note about why you belong here.
                        </p>
                        <a href="mailto:nyaynow.in@gmail.com" className="px-8 py-3 bg-white text-indigo-900 font-bold rounded-lg hover:bg-indigo-50 transition shadow-lg inline-block">
                            Email Us
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
}

function JobCard({ title, type, location, desc }) {
    return (
        <div className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all cursor-pointer group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h3>
                <div className="flex gap-3 text-xs font-bold uppercase tracking-wide">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{type}</span>
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full">{location}</span>
                </div>
            </div>
            <p className="text-slate-500 mb-6 max-w-3xl">{desc}</p>
            <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:underline">
                View Details & Apply <span>→</span>
            </div>
        </div>
    )
}

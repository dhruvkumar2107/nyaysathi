import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        toast.success("Message sent! We'll get back to you shortly.");
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                        Get in <span className="text-indigo-600">Touch.</span>
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                        Have questions about our AI tools? Need help with your account? We are here to listen.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Contact Info */}
                    <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl">
                        <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <span className="text-2xl">📧</span>
                                <div>
                                    <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Email Us</p>
                                    <a href="mailto:nyaynow.in@gmail.com" className="text-lg font-medium hover:text-white transition-colors">nyaynow.in@gmail.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-2xl">🏢</span>
                                <div>
                                    <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Headquarters</p>
                                    <p className="text-slate-300 leading-relaxed">
                                        NyayNow Labs,<br />
                                        Cyber City, DLF Phase 2,<br />
                                        Gurugram, India 122002
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <span className="text-2xl">🕒</span>
                                <div>
                                    <p className="text-indigo-300 text-sm font-bold uppercase tracking-wider mb-1">Support Hours</p>
                                    <p className="text-slate-300">Mon - Fri: 9:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-700">
                            <p className="text-slate-400 text-sm">Follow us on social media for updates.</p>
                            <div className="flex gap-4 mt-4 text-2xl">
                                <a href="#" className="hover:text-indigo-400 transition">𝕏</a>
                                <a href="#" className="hover:text-indigo-400 transition">In</a>
                                <a href="#" className="hover:text-indigo-400 transition">Ig</a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                placeholder="Your full name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                            <textarea
                                required
                                rows="4"
                                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition resize-none"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            ></textarea>
                        </div>
                        <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95">
                            Send Message
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
}

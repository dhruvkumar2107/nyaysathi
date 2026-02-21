import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Sparkles, Download, Eye, EyeOff, ChevronDown, AlertCircle, CheckCircle, Loader2, RotateCcw, Pen } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../../context/AuthContext';
import jsPDF from 'jspdf';

const NOTICE_TYPES = [
    { value: 'Demand Notice (Money Recovery)', label: '💰 Demand Notice — Money Recovery', color: 'emerald' },
    { value: 'Cheque Bounce Notice (Section 138 NI Act)', label: '🏦 Cheque Bounce — Section 138 NI Act', color: 'amber' },
    { value: 'Eviction Notice (Tenant Removal)', label: '🏠 Eviction Notice — Tenant Removal', color: 'blue' },
    { value: 'Defamation Notice (Online/Offline)', label: '📣 Defamation Notice', color: 'rose' },
    { value: 'Consumer Complaint Notice (Consumer Protection Act)', label: '🛒 Consumer Complaint Notice', color: 'purple' },
    { value: 'Employment Termination Dispute Notice', label: '💼 Employment Termination Dispute', color: 'orange' },
    { value: 'Property Encroachment Notice', label: '🗺️ Property Encroachment Notice', color: 'teal' },
    { value: 'Maintenance Notice (Family Law)', label: '👨‍👩‍👧 Maintenance Notice — Family Law', color: 'pink' },
    { value: 'Intellectual Property Infringement Notice', label: '©️ IP Infringement Notice', color: 'indigo' },
    { value: 'Breach of Contract Notice', label: '📋 Breach of Contract Notice', color: 'red' },
];

const FIELD_CLASS = "w-full bg-[#020617] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/20 transition duration-200";

export default function LegalNoticeGenerator() {
    const { user } = useAuth();

    const [form, setForm] = useState({
        noticeType: '',
        senderName: user?.name || '',
        senderAddress: '',
        senderBarCouncil: '',
        recipientName: '',
        recipientAddress: '',
        facts: '',
        amount: '',
        complianceDays: '15',
        additionalClauses: '',
    });

    const [generatedNotice, setGeneratedNotice] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [step, setStep] = useState(1); // 1 = form, 2 = preview

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGenerate = async () => {
        if (!form.noticeType || !form.senderName || !form.recipientName || !form.facts) {
            toast.error('Please fill in Notice Type, Sender Name, Recipient Name, and Facts.');
            return;
        }
        setLoading(true);
        setGeneratedNotice('');
        try {
            const { data } = await axios.post('/api/ai/legal-notice', form);
            setGeneratedNotice(data.notice);
            setStep(2);
            toast.success('Legal Notice generated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to generate notice. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = () => {
        const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
        const margin = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const usableWidth = pageWidth - margin * 2;
        const pageHeight = doc.internal.pageSize.getHeight();

        // — Header decorative bar —
        doc.setFillColor(55, 48, 163); // indigo-800
        doc.rect(0, 0, pageWidth, 14, 'F');

        // — NyayNow branding in header —
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.text('NYAYNOW LEGAL SERVICES', margin, 9);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('nyaynow.in | AI-Powered Legal Platform', pageWidth - margin, 9, { align: 'right' });

        // — Title —
        doc.setFont('times', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(30, 30, 30);
        doc.text('LEGAL NOTICE', pageWidth / 2, 30, { align: 'center' });

        // — Divider under title —
        doc.setDrawColor(99, 102, 241);
        doc.setLineWidth(0.5);
        doc.line(margin, 33, pageWidth - margin, 33);

        // — Body text —
        doc.setFont('times', 'normal');
        doc.setFontSize(10.5);
        doc.setTextColor(40, 40, 40);

        const clean = generatedNotice.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#{1,6}\s/g, '');
        const lines = doc.splitTextToSize(clean, usableWidth);
        let y = 40;

        lines.forEach(line => {
            if (y > pageHeight - 40) {
                doc.addPage();
                // Repeat header on new page
                doc.setFillColor(55, 48, 163);
                doc.rect(0, 0, pageWidth, 14, 'F');
                y = 20;
            }
            doc.text(line, margin, y);
            y += 5.5;
        });

        // — Signature slot box —
        const sigY = Math.min(y + 15, pageHeight - 70);
        doc.setFillColor(248, 248, 252);
        doc.setDrawColor(200, 200, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(margin, sigY, usableWidth / 2 - 5, 45, 3, 3, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 120);
        doc.text('ADVOCATE SIGNATURE', margin + 5, sigY + 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 150);
        doc.text('(Sign with official seal)', margin + 5, sigY + 14);
        // Signature line
        doc.setDrawColor(160, 160, 180);
        doc.setLineWidth(0.4);
        doc.line(margin + 5, sigY + 32, margin + usableWidth / 2 - 15, sigY + 32);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 120);
        doc.text(form.senderName, margin + 5, sigY + 38);
        if (form.senderBarCouncil) {
            doc.text(`Enrol. No: ${form.senderBarCouncil}`, margin + 5, sigY + 43);
        }

        // — Date block (right side) —
        doc.setFillColor(248, 248, 252);
        doc.roundedRect(pageWidth / 2 + 5, sigY, usableWidth / 2 - 5, 45, 3, 3, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 120);
        doc.text('DATE OF NOTICE', pageWidth / 2 + 10, sigY + 8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(50, 50, 80);
        const today = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
        doc.text(today, pageWidth / 2 + 10, sigY + 22);
        doc.setFontSize(8);
        doc.setTextColor(130, 130, 150);
        doc.text(`Notice Type: ${form.noticeType.split('(')[0].trim()}`, pageWidth / 2 + 10, sigY + 30);
        doc.text(`Compliance: ${form.complianceDays} days`, pageWidth / 2 + 10, sigY + 36);

        // — Watermark —
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(60);
        doc.setTextColor(240, 240, 245);
        doc.text('NYAYNOW', pageWidth / 2, pageHeight / 2, { align: 'center', angle: 45 });

        // — Footer —
        const footerY = pageHeight - 10;
        doc.setFillColor(55, 48, 163);
        doc.rect(0, footerY - 6, pageWidth, 16, 'F');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 220);
        doc.text(
            `This notice was generated via NyayNow AI Legal Platform. Confidential & Privileged Communication. | nyaynow.in`,
            pageWidth / 2, footerY, { align: 'center' }
        );

        doc.save(`Legal_Notice_${form.recipientName.replace(/\s+/g, '_')}_${Date.now()}.pdf`);
        toast.success('PDF downloaded!');
    };

    const selectedType = NOTICE_TYPES.find(t => t.value === form.noticeType);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#0f172a] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-violet-600/5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <FileText className="text-indigo-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                Instant Legal Notice Generator
                                <span className="text-xs px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-indigo-300 font-medium">AI-Powered</span>
                            </h2>
                            <p className="text-slate-500 text-sm mt-0.5">Generate court-ready legal notices in seconds. Export as PDF with signature slot.</p>
                        </div>
                    </div>

                    {step === 2 && (
                        <button
                            onClick={() => { setStep(1); setGeneratedNotice(''); }}
                            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition"
                        >
                            <RotateCcw size={14} /> New Notice
                        </button>
                    )}
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-3 mt-6">
                    {[{ n: 1, label: 'Fill Details' }, { n: 2, label: 'Review & Export' }].map(({ n, label }) => (
                        <React.Fragment key={n}>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition ${step >= n ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-white/5 text-slate-600 border border-white/5'}`}>
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step > n ? 'bg-emerald-500 text-white' : step === n ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-600'}`}>
                                    {step > n ? '✓' : n}
                                </span>
                                {label}
                            </div>
                            {n < 2 && <div className={`flex-1 h-px max-w-[60px] ${step > n ? 'bg-indigo-500/50' : 'bg-white/5'}`} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">

                        {/* Notice Type */}
                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/10">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Notice Type *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {NOTICE_TYPES.map(type => (
                                    <button
                                        key={type.value}
                                        onClick={() => setForm(p => ({ ...p, noticeType: type.value }))}
                                        className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${form.noticeType === type.value ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300' : 'bg-white/3 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'}`}
                                    >
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sender Details */}
                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/10">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Pen size={14} className="text-indigo-400" /> Sender (Advocate) Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Full Name *</label>
                                    <input name="senderName" value={form.senderName} onChange={handleChange} placeholder="Adv. Rajesh Kumar" className={FIELD_CLASS} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Bar Council Enrolment No.</label>
                                    <input name="senderBarCouncil" value={form.senderBarCouncil} onChange={handleChange} placeholder="MH/1234/2020" className={FIELD_CLASS} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Office Address</label>
                                    <input name="senderAddress" value={form.senderAddress} onChange={handleChange} placeholder="Chamber No. 12, District Court, Mumbai — 400001" className={FIELD_CLASS} />
                                </div>
                            </div>
                        </div>

                        {/* Recipient Details */}
                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/10">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><AlertCircle size={14} className="text-rose-400" /> Recipient (Noticee) Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Full Name *</label>
                                    <input name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="ABC Enterprises / John Doe" className={FIELD_CLASS} />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Compliance Period (Days)</label>
                                    <div className="flex gap-2">
                                        {['7', '15', '30', '60'].map(d => (
                                            <button
                                                key={d}
                                                onClick={() => setForm(p => ({ ...p, complianceDays: d }))}
                                                className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition ${form.complianceDays === d ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}`}
                                            >
                                                {d}d
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Address</label>
                                    <input name="recipientAddress" value={form.recipientAddress} onChange={handleChange} placeholder="Flat 4B, XYZ Building, Andheri West, Mumbai — 400053" className={FIELD_CLASS} />
                                </div>
                            </div>
                        </div>

                        {/* Case Facts */}
                        <div className="bg-[#0f172a] rounded-2xl p-6 border border-white/10">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><FileText size={14} className="text-amber-400" /> Brief of the Matter</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-slate-500 mb-1.5 font-medium">Facts of the Case * <span className="text-slate-600">(Include dates, events, what went wrong)</span></label>
                                    <textarea
                                        name="facts"
                                        value={form.facts}
                                        onChange={handleChange}
                                        rows={5}
                                        placeholder="e.g. My client lent ₹5,00,000 to the noticee on 15/01/2025 via NEFT (ref: HDFC12345). The noticee issued a cheque no. 004567 dated 01/02/2025 which was dishonoured on 05/02/2025 citing 'insufficient funds'. Despite repeated requests, payment has not been made..."
                                        className={`${FIELD_CLASS} resize-none leading-relaxed`}
                                    />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1.5 font-medium">Amount in Dispute (₹)</label>
                                        <input name="amount" value={form.amount} onChange={handleChange} placeholder="500000" type="number" className={FIELD_CLASS} />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-500 mb-1.5 font-medium">Additional Clauses (optional)</label>
                                        <input name="additionalClauses" value={form.additionalClauses} onChange={handleChange} placeholder="e.g. Claim for interest @18% p.a." className={FIELD_CLASS} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Generate Button */}
                        <motion.button
                            onClick={handleGenerate}
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Drafting your notice with AI...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    Generate Legal Notice
                                </>
                            )}
                        </motion.button>
                    </motion.div>

                ) : (
                    <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">

                        {/* Action Bar */}
                        <div className="bg-[#0f172a] rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <CheckCircle className="text-emerald-400" size={16} />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">Notice Generated Successfully</p>
                                    <p className="text-slate-500 text-xs">{form.noticeType.split('(')[0].trim()} • {form.complianceDays} days compliance</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition font-medium"
                                >
                                    {showPreview ? <EyeOff size={15} /> : <Eye size={15} />}
                                    {showPreview ? 'Hide' : 'Preview'}
                                </button>
                                <motion.button
                                    onClick={handleDownloadPDF}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition"
                                >
                                    <Download size={15} />
                                    Download PDF
                                </motion.button>
                            </div>
                        </div>

                        {/* Notice Preview */}
                        <AnimatePresence>
                            {showPreview && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-[#0f172a] rounded-2xl border border-white/10 overflow-hidden">
                                        {/* Preview Header — mimics document header */}
                                        <div className="bg-indigo-700 px-6 py-3 flex justify-between items-center">
                                            <span className="text-white font-bold text-sm tracking-wide">NYAYNOW LEGAL SERVICES</span>
                                            <span className="text-indigo-200 text-xs">nyaynow.in | AI-Powered Legal Platform</span>
                                        </div>
                                        <div className="p-8">
                                            <h2 className="text-2xl font-bold text-white text-center mb-1 font-serif">LEGAL NOTICE</h2>
                                            <div className="w-full h-px bg-indigo-500/40 mb-6" />
                                            <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                                                {generatedNotice}
                                            </pre>

                                            {/* Signature Slot */}
                                            <div className="mt-10 grid grid-cols-2 gap-6">
                                                <div className="border border-dashed border-white/20 rounded-2xl p-5 bg-white/2">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-8">Advocate Signature &amp; Seal</p>
                                                    <div className="border-b border-white/20 mb-3" />
                                                    <p className="text-slate-400 text-sm font-medium">{form.senderName}</p>
                                                    {form.senderBarCouncil && <p className="text-slate-600 text-xs">Enrol. No: {form.senderBarCouncil}</p>}
                                                </div>
                                                <div className="border border-dashed border-white/20 rounded-2xl p-5 bg-white/2">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date of Notice</p>
                                                    <p className="text-2xl font-bold text-white mt-4">
                                                        {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                    </p>
                                                    <p className="text-slate-600 text-xs mt-2">Compliance: {form.complianceDays} days</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Quick info cards */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'Notice Type', value: form.noticeType.split('(')[0].trim(), icon: '📋' },
                                { label: 'Recipient', value: form.recipientName, icon: '👤' },
                                { label: 'Compliance', value: `${form.complianceDays} days`, icon: '⏰' },
                            ].map(({ label, value, icon }) => (
                                <div key={label} className="bg-[#0f172a] rounded-2xl p-4 border border-white/10">
                                    <p className="text-lg mb-1">{icon}</p>
                                    <p className="text-xs text-slate-600 uppercase font-bold tracking-wider">{label}</p>
                                    <p className="text-slate-200 text-sm font-semibold truncate mt-0.5">{value || '—'}</p>
                                </div>
                            ))}
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

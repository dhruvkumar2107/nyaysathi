import { useState } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import PaywallModal from "../components/PaywallModal";
import { motion, AnimatePresence } from "framer-motion";

export default function AgreementForm() {
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [docType, setDocType] = useState("Rent Agreement");
    const [loading, setLoading] = useState(false);
    const [contract, setContract] = useState("");
    const [showPaywall, setShowPaywall] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        partyA: "", partyB: "", amount: "", duration: "", location: "", extraTerms: ""
    });

    const handleDraft = async () => {
        if (!user && parseInt(localStorage.getItem("ai_usage_agreement") || "0") >= 1) {
            setShowPaywall(true); return;
        }
        setLoading(true);
        try {
            const res = await axios.post("/api/ai/draft-contract", {
                type: docType,
                parties: { Party_1: formData.partyA, Party_2: formData.partyB },
                terms: { Amount: formData.amount, Duration: formData.duration, Location: formData.location, Extra_Terms: formData.extraTerms }
            });
            setContract(res.data.contract);
            if (!user) localStorage.setItem("ai_usage_agreement", "1");
            setStep(3);
        } catch (err) {
            if (err.response?.status === 403) setShowPaywall(true);
            else alert("Drafting Failed");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFC] text-slate-900 font-sans selection:bg-blue-100 pb-20">
            <Navbar />
            <PaywallModal isOpen={showPaywall} onClose={() => setShowPaywall(false)} />

            {/* PROGRESS HEADER */}
            <div className="fixed top-20 left-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 py-4">
                <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                    <h1 className="font-bold text-slate-900">AI Drafter <span className="text-slate-400 font-normal">/ {docType}</span></h1>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-12 bg-blue-600' : 'w-4 bg-slate-200'}`}></div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-40 max-w-4xl mx-auto px-6 relative z-10">
                <AnimatePresence mode="wait">

                    {/* STEP 1: TYPE SELECTION */}
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="step1">
                            <h2 className="text-4xl font-black text-center mb-4">What are we drafting today?</h2>
                            <p className="text-slate-500 text-center mb-12 text-lg">Select a template to get started with your legal document.</p>

                            <div className="grid md:grid-cols-3 gap-6">
                                {[
                                    { name: "Rent Agreement", icon: "🏠", desc: "Lease for residential or commercial property." },
                                    { name: "NDA", icon: "🔒", desc: "Non-Disclosure Agreement for confidentiality." },
                                    { name: "Employment Contract", icon: "💼", desc: "Job offer terms and conditions." },
                                    { name: "Sale Deed", icon: "📜", desc: "Asset transfer and ownership proof." },
                                    { name: "Freelance Agreement", icon: "💻", desc: "Client-Contractor work scope." },
                                    { name: "Custom", icon: "✨", desc: "Tailor-made for specific needs." },
                                ].map(t => (
                                    <button
                                        key={t.name}
                                        onClick={() => { setDocType(t.name); setStep(2); }}
                                        className={`p-8 rounded-3xl border-2 text-left hover:scale-[1.02] transition shadow-sm group
                                        ${docType === t.name ? 'border-blue-600 bg-blue-50 ring-4 ring-blue-100' : 'border-slate-100 bg-white hover:border-blue-300'}`}
                                    >
                                        <span className="text-4xl mb-4 block group-hover:scale-110 transition origin-left">{t.icon}</span>
                                        <h3 className="font-bold text-xl text-slate-900 mb-1">{t.name}</h3>
                                        <p className="text-sm text-slate-500">{t.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DETAILS FORM */}
                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} key="step2">
                            <h2 className="text-3xl font-bold mb-8">Enter Details for {docType}</h2>
                            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <Input label="First Party (e.g. Landlord)" placeholder="Full Legal Name" value={formData.partyA} onChange={e => setFormData({ ...formData, partyA: e.target.value })} />
                                    <Input label="Second Party (e.g. Tenant)" placeholder="Full Legal Name" value={formData.partyB} onChange={e => setFormData({ ...formData, partyB: e.target.value })} />
                                    <Input label="Terms Value (Amount)" placeholder="₹ 0.00" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                    <Input label="Duration / Date" placeholder="e.g. 11 Months" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                </div>
                                <Input label="Property / Location Address" placeholder="Complete Address" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Extra Clauses / Specific Terms</label>
                                    <textarea
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition resize-none h-32"
                                        placeholder="Any specific conditions..."
                                        value={formData.extraTerms}
                                        onChange={e => setFormData({ ...formData, extraTerms: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                    <button onClick={() => setStep(1)} className="text-slate-500 font-bold hover:text-slate-800 transition">Back to Templates</button>
                                    <button onClick={handleDraft} disabled={loading} className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:scale-[1.02] transition shadow-lg disabled:opacity-50 flex items-center gap-2">
                                        {loading ? <><span className="animate-spin">⏳</span> Generating...</> : <>✨ Generate Contract</>}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: PREVIEW */}
                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} key="step3">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold flex items-center gap-2"><span className="text-green-500">✓</span> Your Draft is Ready</h2>
                                <div className="flex gap-4">
                                    <button onClick={() => setStep(2)} className="text-slate-500 font-bold px-4 hover:bg-slate-100 py-2 rounded-lg transition">Edit Details</button>
                                    <button onClick={() => window.print()} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition">Download PDF</button>
                                </div>
                            </div>

                            <div className="bg-white p-12 shadow-2xl shadow-slate-300/50 min-h-[800px] border border-slate-200 mx-auto max-w-3xl print:shadow-none print:border-0">
                                <article className="prose prose-slate max-w-none prose-p:leading-loose prose-headings:font-serif prose-headings:font-bold">
                                    <ReactMarkdown>{contract}</ReactMarkdown>
                                </article>

                                <div className="mt-20 flex justify-between pt-10 border-t-2 border-slate-900/10 print:flex">
                                    <div className="text-center w-64 border-t border-slate-400 pt-4">
                                        <p className="font-bold text-slate-900">{formData.partyA || "Party A"}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Signature</p>
                                    </div>
                                    <div className="text-center w-64 border-t border-slate-400 pt-4">
                                        <p className="font-bold text-slate-900">{formData.partyB || "Party B"}</p>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Signature</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
}

function Input({ label, value, onChange, placeholder }) {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">{label}</label>
            <input
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition font-medium"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    )
}

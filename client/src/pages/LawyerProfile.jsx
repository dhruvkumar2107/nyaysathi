import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function LawyerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [lawyer, setLawyer] = useState(null);
    const [connection, setConnection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        if (!user) {
            toast.error("Please login to view lawyer profiles");
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const profileRes = await axios.get(`/api/users/public/${id}`);
                setLawyer(profileRes.data);

                if (user) {
                    const connRes = await axios.get(`/api/connections?userId=${user._id || user.id}&status=all`);
                    const myConnection = connRes.data.find(c => c._id === id);
                    if (myConnection) {
                        setConnection({
                            status: myConnection.connectionStatus,
                            _id: myConnection.connectionId
                        });
                    }
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, navigate]);

    const handleConnect = async () => {
        try {
            setConnecting(true);
            await axios.post("/api/connections", {
                clientId: user._id || user.id,
                lawyerId: id,
                initiatedBy: user.role
            });
            toast.success("Request sent successfully!");
            setConnection({ status: 'pending' });
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to send request");
        } finally {
            setConnecting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!lawyer) return <div className="min-h-screen flex items-center justify-center font-bold text-xl">Lawyer not found</div>;

    return (
        <main className="min-h-screen bg-[#FDFDFC] font-sans">
            <Navbar />

            {/* HERMIT-STYLE HERO */}
            <div className="relative pt-32 pb-20 px-4 max-w-7xl mx-auto">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>
                <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-50 -z-10"></div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT: PROFILE INFO (Sticky) */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                            <div className="w-40 h-40 mx-auto rounded-full p-1 bg-gradient-to-br from-blue-100 to-white shadow-inner mb-6">
                                {lawyer.image ? (
                                    <img src={lawyer.image} className="w-full h-full object-cover rounded-full" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center text-5xl">⚖️</div>
                                )}
                            </div>

                            <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">{lawyer.name}</h1>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-bold mb-6">
                                <span>🛡️</span> {lawyer.specialization}
                            </div>

                            <div className="flex justify-center gap-10 border-t border-slate-50 pt-6 mb-6">
                                <div className="text-center">
                                    <div className="text-2xl font-black text-slate-900">{lawyer.experience || 1}+</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Years Exp</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-slate-900">4.9</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rating ★</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-black text-slate-900">{lawyer.casesWon || 24}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cases Won</div>
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="space-y-3">
                                {connection?.status === 'active' ? (
                                    <button onClick={() => navigate(`/messages?chatId=${id}`)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:scale-[1.02] transition">
                                        💬 Message
                                    </button>
                                ) : connection?.status === 'pending' ? (
                                    <button disabled className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed">
                                        🕒 Request Sent
                                    </button>
                                ) : (
                                    <button onClick={handleConnect} disabled={connecting} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-[1.02] transition">
                                        {connecting ? "Sending..." : "⚡ Connect Now"}
                                    </button>
                                )}

                                {user?.role !== 'lawyer' && (
                                    <button onClick={() => toast("Booking Calendar coming next update!")} className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition">
                                        📅 Book Consultation
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: BENTO GRID CONTENT */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* ABOUT CARD */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center text-sm">📜</span>
                                About Me
                            </h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {lawyer.bio || "This advocate is a dedicated legal professional with a strong track record of success in various courts. They specialize in providing strategic legal counsel and representation."}
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* SKILLS / AREAS */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-pink-100 text-pink-600 flex items-center justify-center text-sm">🎯</span>
                                    Expertise
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(lawyer.specialization?.split(',') || ["Corporate Law", "Civil Rights", "Family Law"]).map((s, i) => (
                                        <span key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-600 text-sm hover:bg-slate-100 transition cursor-default">
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>

                            {/* COURTS */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm"
                            >
                                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm">🏛️</span>
                                    Admitted Courts
                                </h3>
                                <ul className="space-y-3">
                                    {(lawyer.courts || ["Supreme Court of India", "Delhi High Court"]).map((c, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* FEES & CONTACT */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-center"
                        >
                            <div>
                                <h3 className="text-xl font-bold mb-1">Fee Structure</h3>
                                <p className="text-slate-400 text-sm">Transparent pricing for peace of mind.</p>
                            </div>
                            <div className="mt-4 md:mt-0 text-center md:text-right">
                                <div className="text-4xl font-black text-white">₹{lawyer.consultationFee || 2000}</div>
                                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider">Per Hour / Consultation</div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* SOCIALS */}
                            <a href={`mailto:${lawyer.email}`} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 transition flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">📧</div>
                                <span className="font-bold text-slate-900 text-sm">Email</span>
                            </a>
                            <a href={lawyer.socials?.linkedin || "#"} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-300 transition flex flex-col items-center justify-center gap-2 group cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition">🔗</div>
                                <span className="font-bold text-slate-900 text-sm">LinkedIn</span>
                            </a>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
                                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xl">🗣️</div>
                                <span className="font-bold text-slate-900 text-sm">{lawyer.languages?.[0] || 'English'}</span>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 text-center">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xl">📍</div>
                                <span className="font-bold text-slate-900 text-sm truncate w-full">
                                    {typeof lawyer.location === 'object' ? lawyer.location.city || lawyer.location.address : lawyer.location}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}

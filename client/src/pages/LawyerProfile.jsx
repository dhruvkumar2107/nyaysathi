import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LawyerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [lawyer, setLawyer] = useState(null);
    const [connection, setConnection] = useState(null); // { status: 'active' | 'pending', _id: ... }
    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Lawyer Public Profile
                const profileRes = await axios.get(`/api/users/public/${id}`);
                setLawyer(profileRes.data);

                // 2. Fetch Connection Status (if logged in)
                if (user) {
                    // Check if *this specific lawyer* is in my connections
                    // We fetch all connections (pending or active) involving us
                    const connRes = await axios.get(`/api/connections?userId=${user._id || user.id}&status=all`);

                    // The API returns profiles mixed with connection status. 
                    // We need to find the one that matches the profile page ID.
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
                if (!lawyer) {
                    toast.error("Lawyer not found");
                    navigate("/marketplace");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, user, navigate]);

    const handleConnect = async () => {
        if (!user) return toast.error("Please login to connect");
        setConnecting(true);
        try {
            await axios.post("/api/connections", {
                clientId: user.role === 'client' ? (user._id || user.id) : id, // If I am client, I am clientId
                lawyerId: user.role === 'lawyer' ? (user._id || user.id) : id, // If I am lawyer, I am lawyerId
                initiatedBy: user._id || user.id
            });
            setConnection({ status: 'pending' });
            toast.success("Connection Request Sent!");
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to connect");
        } finally {
            setConnecting(false);
        }
    };

    const handleMessage = () => {
        // Go to messages with this user selected
        navigate(`/messages?chatId=${connection._id || id}`); // Ideally we pass the user ID and let Messages page find/create room
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
        </div>
    );

    if (!lawyer) return null;

    return (
        <main className="min-h-screen bg-gray-50 pb-12">

            {/* 1. HERO BANNER (LinkedIn Style) */}
            <div className="bg-gradient-to-r from-slate-800 to-blue-900 h-48 relative">
                {/* Optional: Add a cover photo here if schema supports it */}
                <div className="absolute inset-0 bg-black/20"></div>
            </div>

            <div className="max-w-[1128px] mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">

                {/* PROFILE CARD */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end gap-6 relative">

                        {/* AVATAR */}
                        <div className="flex-shrink-0">
                            <div className="w-40 h-40 rounded-full border-4 border-white shadow-lg bg-gray-100 overflow-hidden relative z-10">
                                {lawyer.profileImage ? (
                                    <img src={lawyer.profileImage} alt={lawyer.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-5xl text-gray-300 font-bold bg-slate-50">
                                        {lawyer.name?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* INFO */}
                        <div className="flex-1 mb-2">
                            <h1 className="text-3xl font-bold text-gray-900">{lawyer.name}</h1>
                            <p className="text-lg text-gray-600 font-medium mt-1">{lawyer.headline || lawyer.specialization || "Legal Professional"}</p>

                            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    📍 {typeof lawyer.location === 'string' ? lawyer.location : lawyer.location?.city || "India"}
                                </span>
                                <span className="flex items-center gap-1">
                                    🎓 {lawyer.education?.[0]?.degree || "Law Graduate"}
                                </span>
                                <span className="flex items-center gap-1 text-blue-600 font-semibold hover:underline cursor-pointer">
                                    500+ Connections
                                </span>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mb-2">

                            {/* DYNAMIC CONNECT BUTTON */}
                            {connection?.status === 'active' ? (
                                <button
                                    onClick={handleMessage}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition flex items-center justify-center gap-2"
                                >
                                    <span>💬</span> Message
                                </button>
                            ) : connection?.status === 'pending' ? (
                                <button
                                    disabled
                                    className="px-6 py-2.5 bg-gray-100 text-gray-500 font-bold rounded-full cursor-not-allowed flex items-center justify-center gap-2 border border-gray-200"
                                >
                                    <span>🕒</span> Request Sent
                                </button>
                            ) : (
                                <button
                                    onClick={handleConnect}
                                    disabled={connecting}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-blue-200"
                                >
                                    {connecting ? "Sending..." : "➕ Connect"}
                                </button>
                            )}

                            <button
                                onClick={() => toast("Consultation Booking - Coming Soon!")}
                                className="px-6 py-2.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-full transition"
                            >
                                Book Consultation
                            </button>

                            <button className="p-2.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 aspect-square flex items-center justify-center">
                                ...
                            </button>
                        </div>
                    </div>
                </div>

                {/* GRID CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                    {/* LEFT SIDEBAR (Skills, Languages) */}
                    <div className="space-y-6">
                        {/* LANGUAGE CARD */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Languages</h3>
                            <div className="flex flex-wrap gap-2">
                                {lawyer.languages?.length > 0 ? lawyer.languages.map((l, i) => (
                                    <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{l}</span>
                                )) : <span className="text-gray-400">English</span>}
                            </div>
                        </div>

                        {/* CONTACT CARD */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Info</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">📧</span>
                                    {lawyer.email}
                                </li>
                                {lawyer.socials?.website && (
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">🌐</span>
                                        <a href={lawyer.socials.website} target="_blank" className="text-blue-600 hover:underline truncate">{lawyer.socials.website}</a>
                                    </li>
                                )}
                                {lawyer.socials?.linkedin && (
                                    <li className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">🔗</span>
                                        <a href={lawyer.socials.linkedin} target="_blank" className="text-blue-600 hover:underline truncate">LinkedIn</a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* MAIN CONTENT (About, Experience) */}
                    <div className="md:col-span-2 space-y-6">

                        {/* ABOUT */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {lawyer.bio || "This user has not added a bio yet."}
                            </p>
                        </div>

                        {/* EXPERIENCE CARD */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Experience & Courts</h2>

                            <div className="mb-6">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Courts Practicing In</h4>
                                <div className="flex flex-wrap gap-2">
                                    {lawyer.courts?.length > 0 ? lawyer.courts.map((court, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-lg">
                                            <span>🏛️</span>
                                            <span className="font-medium text-gray-700">{court}</span>
                                        </div>
                                    )) : <p className="text-gray-400">Not specified</p>}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Highlights</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
                                        <span className="text-gray-700"><span className="font-bold">{lawyer.experience || 0} Years</span> of legal practice experience.</span>
                                    </li>
                                    {lawyer.awards?.map((award, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="mt-1 w-2 h-2 rounded-full bg-yellow-400 flex-shrink-0"></div>
                                            <span className="text-gray-700">{award}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* FEES CARD */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex justify-between items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Consultation Fee</h2>
                                <p className="text-gray-500 text-sm">Standard hourly rate</p>
                            </div>
                            <div className="text-2xl font-bold text-green-700">
                                ₹{lawyer.consultationFee || 500}<span className="text-sm text-gray-500 font-normal">/hr</span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </main>
    );
}

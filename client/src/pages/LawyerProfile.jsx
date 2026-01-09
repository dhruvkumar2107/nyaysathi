import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function LawyerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [lawyer, setLawyer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLawyer = async () => {
            try {
                // Use the public route we just created
                const res = await axios.get(`/api/users/public/${id}`);
                setLawyer(res.data);
            } catch (err) {
                toast.error("Lawyer not found");
                navigate("/marketplace");
            } finally {
                setLoading(false);
            }
        };
        fetchLawyer();
    }, [id, navigate]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Profile...</div>;
    if (!lawyer) return null;

    return (
        <main className="min-h-screen bg-gray-50 pt-24 pb-12 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

                {/* LEFT COLUMN: IDENTIFY & CONTACT */}
                <div className="md:col-span-1 space-y-6">
                    {/* CARD */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 text-center">
                        <div className="w-40 h-40 mx-auto rounded-full bg-gray-100 mb-4 overflow-hidden border-4 border-white shadow-lg">
                            {lawyer.profileImage ? (
                                <img src={lawyer.profileImage} alt={lawyer.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 font-bold">
                                    {lawyer.name[0]}
                                </div>
                            )}
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900">{lawyer.name}</h1>
                        <p className="text-blue-600 font-medium mt-1">{lawyer.headline || lawyer.specialization}</p>

                        <div className="flex justify-center gap-2 mt-4 text-sm text-gray-500">
                            <span>📍 {typeof lawyer.location === 'string' ? lawyer.location : lawyer.location?.city}</span>
                            <span>•</span>
                            <span>{lawyer.experience}+ Years Exp.</span>
                        </div>

                        <div className="mt-6 space-y-3">
                            <button onClick={() => toast.success("Feature coming soon!")} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md shadow-blue-200 transition">
                                Book Consultation
                            </button>
                            <button className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold transition">
                                Message
                            </button>
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-4 text-left space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Consultation Fee</span>
                                <span className="font-bold text-gray-900">₹{lawyer.consultationFee || "500"}/hr</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Availability</span>
                                <span className="font-medium text-green-600">{lawyer.availability || "Mon-Fri"}</span>
                            </div>
                        </div>
                    </div>

                    {/* SOCIALS */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Connect</h3>
                        <div className="space-y-3">
                            {lawyer.socials?.linkedin && (
                                <a href={lawyer.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition">
                                    <span>🔗</span> LinkedIn Profile
                                </a>
                            )}
                            {lawyer.socials?.website && (
                                <a href={lawyer.socials.website} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition">
                                    <span>🌐</span> Website
                                </a>
                            )}
                            <div className="flex items-center gap-3 text-gray-600">
                                <span>📧</span> {lawyer.email}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: DETAILS */}
                <div className="md:col-span-2 space-y-6">

                    {/* ABOUT */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
                        <div className="prose text-gray-600 leading-relaxed">
                            {lawyer.bio ? (
                                <p>{lawyer.bio}</p>
                            ) : (
                                <p className="italic text-gray-400">No bio added yet.</p>
                            )}
                        </div>
                    </div>

                    {/* EXPERTISE & COURTS */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>⚖️</span> Courts
                            </h3>
                            {lawyer.courts?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {lawyer.courts.map((court, i) => (
                                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">{court}</span>
                                    ))}
                                </div>
                            ) : (<span className="text-gray-400 text-sm">Not specified</span>)}
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🗣️</span> Languages
                            </h3>
                            {lawyer.languages?.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {lawyer.languages.map((lang, i) => (
                                        <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">{lang}</span>
                                    ))}
                                </div>
                            ) : (<span className="text-gray-400 text-sm">English</span>)}
                        </div>
                    </div>

                    {/* AWARDS */}
                    {lawyer.awards?.length > 0 && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <span>🏆</span> Awards & Recognition
                            </h3>
                            <ul className="space-y-2">
                                {lawyer.awards.map((award, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                                        {award}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>

            </div>
        </main>
    );
}

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import VerifiedBadge from "../components/VerifiedBadge";
import { motion } from "framer-motion";

const planPriority = { diamond: 3, gold: 2, silver: 1 };

export default function Marketplace() {
  const { user } = useAuth();
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [searchParams] = useSearchParams();
  const query = searchParams.get("search") || "";

  useEffect(() => { fetchLawyers(); }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axios.get("/api/lawyers");
      const sorted = res.data.sort((a, b) => (planPriority[b.plan] || 0) - (planPriority[a.plan] || 0));
      setLawyers(sorted);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const lawyerCity = !lawyer.location ? "" : (typeof lawyer.location === 'string' ? lawyer.location : lawyer.location.city || "");
    const lawyerSpec = lawyer.specialization || "";
    const lowerQ = query.toLowerCase();

    return (!query || lawyer.name?.toLowerCase().includes(lowerQ) || lawyerSpec.toLowerCase().includes(lowerQ) || lawyerCity.toLowerCase().includes(lowerQ)) &&
      (!selectedCategory || lawyerSpec.toLowerCase().includes(selectedCategory.toLowerCase())) &&
      (!selectedCity || lawyerCity.toLowerCase() === selectedCity.toLowerCase());
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-6 font-sans">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-[280px_1fr] gap-8">

        {/* --- LEFT: FILTERS (Glass Panel) --- */}
        <aside className="h-fit sticky top-24 space-y-8">
          <div className="glass p-6 rounded-2xl border border-white/50 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 font-display">Filter Lawyers</h3>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Practice Area</p>
              <select
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 outline-none transition"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Specializations</option>
                {["Criminal Law", "Family Law", "Corporate Law", "Civil Law", "Property Law", "Cyber Law"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Location</p>
              <select
                className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 block p-3 outline-none transition"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {["Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune", "Jaipur"].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* PROMO CARD */}
          {user?.role === "lawyer" && user.plan === "silver" && (
            <div className="bg-gradient-to-br from-[#0B1120] to-slate-900 rounded-2xl p-6 text-white text-center shadow-xl shadow-slate-900/10">
              <h3 className="font-bold text-lg mb-2">Go Diamond 💎</h3>
              <p className="text-slate-400 text-sm mb-4">Get 10x more visibility and exclusive leads.</p>
              <a href="/pricing" className="block w-full py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold text-sm transition">Upgrade Now</a>
            </div>
          )}
        </aside>

        {/* --- RIGHT: GRID --- */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 font-display">Top Legal Experts</h1>
              <p className="text-slate-500">Showing {filteredLawyers.length} verified advocates</p>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(n => <div key={n} className="h-64 bg-white/50 animate-pulse rounded-2xl border border-slate-200"></div>)}
            </div>
          ) : filteredLawyers.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <span className="text-4xl">🔍</span>
              <p className="text-slate-500 mt-2 font-medium">No lawyers found.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredLawyers.map((lawyer) => <LawyerCard key={lawyer._id} lawyer={lawyer} />)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function LawyerCard({ lawyer }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-6 rounded-2xl flex flex-col justify-between group hover:border-indigo-200 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${lawyer.plan === "diamond" ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
            lawyer.plan === "gold" ? "bg-amber-50 text-amber-600 border-amber-100" :
              "bg-slate-50 text-slate-500 border-slate-100"
          }`}>
          {lawyer.plan || "SILVER"}
        </span>
      </div>

      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-600 border border-slate-200">
          {lawyer.name?.[0]}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition flex items-center gap-1">
            {lawyer.name}
            <VerifiedBadge plan={lawyer.plan} />
          </h3>
          <p className="text-sm text-slate-500 font-medium">{lawyer.specialization || "General Practice"}</p>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400 font-medium">
            <span>📍 {lawyer.location?.city || "India"}</span>
            <span>•</span>
            <span>{lawyer.experience ? `${lawyer.experience} Years Exp.` : "New"}</span>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/lawyer/${lawyer._id}`)}
        className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-indigo-600 transition shadow-lg shadow-slate-900/10 active:scale-95"
      >
        View Profile
      </button>
    </motion.div>
  );
}

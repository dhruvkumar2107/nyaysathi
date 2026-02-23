'use client'

import React, { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, ShieldCheck, Filter, X } from "lucide-react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Image from "next/image"
import axios from "axios"

// We will add generateMetadata in a separate layout.js or page segment if needed, 
// but for Client Components we can still use Helmet or export metadata from a parent layout.
// In Next.js App Router, for a page that is 'use client', we usually put metadata in a 
// separate server component file or use a layout. 

export default function MarketplacePage() {
    const [lawyers, setLawyers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    // Filters State
    const [selectedSpecialization, setSelectedSpecialization] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const [selectedExperience, setSelectedExperience] = useState([])

    useEffect(() => {
        fetchLawyers()
    }, [])

    const fetchLawyers = async () => {
        try {
            // NOTE: Using full URL if needed, or ensuring proxy/base is set. 
            // In Next.js we often use an absolute URL or a relative one if using a proxy.
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/users?role=lawyer`)
            setLawyers(data)
        } catch (error) {
            console.error("Failed to fetch lawyers", error)
        } finally {
            setLoading(false)
        }
    }

    // Derive Filters
    const specializations = useMemo(() => [...new Set(lawyers.map(l => l.specialization).filter(Boolean))], [lawyers])
    const locations = useMemo(() => [...new Set(lawyers.map(l => l.location?.city || l.city).filter(Boolean))], [lawyers])
    const experienceLevels = ["0-5 Years", "5-10 Years", "10+ Years"]

    // Filter Logic
    const filteredLawyers = useMemo(() => {
        return lawyers.filter(lawyer => {
            const matchesSearch =
                lawyer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lawyer.specialization?.toLowerCase().includes(searchQuery.toLowerCase())

            if (!matchesSearch) return false

            if (selectedSpecialization.length > 0 && !selectedSpecialization.includes(lawyer.specialization)) return false

            const city = lawyer.location?.city || lawyer.city
            if (selectedLocation.length > 0 && !selectedLocation.includes(city)) return false

            if (selectedExperience.length > 0) {
                const exp = lawyer.experience || 0
                const matchesExp = selectedExperience.some(range => {
                    if (range === "0-5 Years") return exp <= 5
                    if (range === "5-10 Years") return exp > 5 && exp <= 10
                    if (range === "10+ Years") return exp > 10
                    return false
                })
                if (!matchesExp) return false
            }

            return true
        })
    }, [lawyers, searchQuery, selectedSpecialization, selectedLocation, selectedExperience])

    const toggleFilter = (setFn, value) => {
        setFn(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value])
    }

    return (
        <div className="min-h-screen bg-[#020617] font-sans text-slate-400 pb-20 selection:bg-indigo-500/30">
            <Navbar />

            {/* HEADER */}
            <div className="bg-[#0f172a] text-white pt-32 pb-24 relative overflow-hidden text-center border-b border-white/5">
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none">
                    <Image src="/noise.svg" alt="" fill className="object-cover" />
                </div>
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">The Elite Legal Network</h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Connect with India's top 1% of legal minds. Verified, vetted, and ready to represent you.
                    </p>

                    <div className="max-w-3xl mx-auto relative group">
                        <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
                        <div className="relative flex items-center bg-[#1e293b]/80 border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-md">
                            <Search className="text-slate-500 ml-4" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search expertise..."
                                className="flex-1 p-4 bg-transparent outline-none text-white placeholder:text-slate-500 text-lg"
                            />
                            <button
                                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20"
                                aria-label="Find Legal Experts"
                            >
                                Find Experts
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid grid-cols-12 gap-8">
                    <div className="col-span-3 hidden lg:block">
                        <div className="bg-[#0f172a] rounded-2xl p-6 shadow-xl border border-white/10 sticky top-28 text-left backdrop-blur-md">
                            <div className="flex items-center justify-between mb-6 text-white font-bold">
                                <div className="flex items-center gap-2"><Filter size={18} /> Filters</div>
                                {(selectedSpecialization.length > 0 || selectedLocation.length > 0 || selectedExperience.length > 0) && (
                                    <button onClick={() => { setSelectedSpecialization([]); setSelectedLocation([]); setSelectedExperience([]); }} className="text-[10px] text-indigo-400 hover:text-white transition uppercase tracking-wider">Reset</button>
                                )}
                            </div>
                            <div className="space-y-6">
                                <FilterSection title="Practice Area" options={specializations} selected={selectedSpecialization} toggle={(val) => toggleFilter(setSelectedSpecialization, val)} />
                                <FilterSection title="Location" options={locations} selected={selectedLocation} toggle={(val) => toggleFilter(setSelectedLocation, val)} />
                                <FilterSection title="Experience" options={experienceLevels} selected={selectedExperience} toggle={(val) => toggleFilter(setSelectedExperience, val)} />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-12 lg:col-span-9">
                        {loading ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="bg-[#0f172a] rounded-2xl p-6 border border-white/5 animate-pulse h-64"></div>
                                ))}
                            </div>
                        ) : filteredLawyers.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 italic bg-[#0f172a] rounded-2xl border border-white/10">
                                <p>No lawyers found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 gap-6">
                                <AnimatePresence mode="wait">
                                    {filteredLawyers.map((lawyer, i) => (
                                        <motion.div key={lawyer._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                                            <LawyerCard lawyer={lawyer} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

function FilterSection({ title, options, selected, toggle }) {
    if (options.length === 0) return null
    return (
        <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-3">{title}</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                {options.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="hidden" onChange={() => toggle(option)} checked={selected.includes(option)} />
                        <div className={`w-4 h-4 rounded border transition flex items-center justify-center ${selected.includes(option) ? 'bg-indigo-600 border-indigo-600' : 'bg-black/20 border-slate-600 group-hover:border-indigo-500'}`}>
                            {selected.includes(option) && <div className="w-2 h-2 bg-white rounded-sm" />}
                        </div>
                        <span className={`text-sm transition ${selected.includes(option) ? 'text-white font-bold' : 'text-slate-400 group-hover:text-white'}`}>
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    )
}

function LawyerCard({ lawyer }) {
    return (
        <motion.div whileHover={{ y: -5 }} className="bg-[#0f172a]/80 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group">
            <div className="flex justify-between items-start mb-6">
                <Link href={`/lawyer/${lawyer._id}`} className="flex gap-4 cursor-pointer">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 overflow-hidden relative">
                        {lawyer.profileImage ? (
                            <Image
                                src={lawyer.profileImage}
                                alt={`${lawyer.name}'s profile`}
                                fill
                                className="object-cover"
                            />
                        ) : lawyer.name?.[0]}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{lawyer.name}</h3>
                        <p className="text-sm font-medium text-slate-500 mb-1">{lawyer.specialization || "Legal Consultant"}</p>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                            <MapPin size={12} /> {lawyer.location?.city || lawyer.city || "Online"}
                        </div>
                    </div>
                </Link>
                {lawyer.verified && (
                    <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                        <ShieldCheck size={12} /> Verified
                    </div>
                )}
            </div>
            <div className="flex items-center gap-6 mb-6 p-4 bg-black/20 rounded-xl border border-white/5 text-xs">
                <div>
                    <p className="uppercase font-bold text-slate-500 mb-1">Exp</p>
                    <p className="font-bold text-white">{lawyer.experience || 0} Yrs</p>
                </div>
                <div>
                    <p className="uppercase font-bold text-slate-500 mb-1">Fee</p>
                    <p className="font-bold text-white">₹{lawyer.hourlyRate || 500}/hr</p>
                </div>
            </div>
            <div className="flex gap-3 text-sm font-bold">
                <Link href={`/lawyer/${lawyer._id}`} className="flex-1 py-3 text-center rounded-lg bg-white/5 text-white hover:bg-indigo-600 transition border border-white/10">
                    View Profile
                </Link>
            </div>
        </motion.div>
    )
}

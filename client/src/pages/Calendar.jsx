import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Calendar() {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);

    useEffect(() => {
        if (user) fetchAppointments();
    }, [user]);

    const fetchAppointments = async () => {
        try {
            const roleKey = user.role === 'lawyer' ? 'lawyer' : 'client'; // though backend uses role param
            const res = await axios.get(`/api/appointments?userId=${user._id || user.id}&role=${user.role}`);

            // Transform to event format
            const mapped = res.data.map(apt => ({
                id: apt._id,
                title: user.role === 'lawyer' ? `Meeting with ${apt.clientId?.name || 'Client'}` : `Consultation: ${apt.lawyerId?.name || 'Lawyer'}`,
                date: apt.date,
                time: apt.slot,
                status: apt.status
            }));
            setEvents(mapped);
        } catch (err) {
            console.error("Failed to fetch appointments");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Calendar 📅</h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Calendar View (Static Visualization) */}
                    <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-lg">Upcoming Schedule</h2>
                        </div>

                        {/* Simple Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-400 mb-2">
                            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {[...Array(5).keys()].map(i => <div key={`empty-${i}`}></div>)} {/* Padding */}
                            {[...Array(31).keys()].map(d => {
                                const day = d + 1;
                                // Simple check if any event falls on this day number (very rough approx for visualization)
                                const dateStr = `2026-01-${day.toString().padStart(2, '0')}`;
                                const hasEvent = events.some(e => e.date === dateStr);

                                return (
                                    <div key={day} className={`p-2 rounded-full cursor-pointer hover:bg-blue-50 transition ${hasEvent ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-700"}`}>
                                        {day}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Upcoming Events List */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="font-bold text-lg mb-4">Appointments</h2>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto">
                            {events.length === 0 && <p className="text-gray-500 text-sm">No upcoming meetings.</p>}
                            {events.map(ev => (
                                <div key={ev.id} className={`border-l-4 pl-3 py-1 ${ev.status === 'confirmed' ? 'border-green-500' : 'border-blue-500'}`}>
                                    <h3 className="font-semibold text-gray-900">{ev.title}</h3>
                                    <p className="text-sm text-gray-500">{ev.date} at {ev.time}</p>
                                    <span className="text-[10px] uppercase font-bold text-gray-400">{ev.status}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={fetchAppointments}
                            className="w-full mt-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                        >
                            Refresh
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

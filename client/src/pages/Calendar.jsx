import { useState } from "react";

export default function Calendar() {
    // Mock Events
    const [events, setEvents] = useState([
        { id: 1, title: "Client Meeting - Rahul", date: "2026-01-10", time: "10:00 AM" },
        { id: 2, title: "High Court Hearing", date: "2026-01-12", time: "02:00 PM" },
        { id: 3, title: "Consultation Call", date: "2026-01-15", time: "05:00 PM" },
    ]);

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">My Calendar</h1>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Calendar View (Static Visualization) */}
                    <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-lg">January 2026</h2>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-100 rounded">◀</button>
                                <button className="p-1 hover:bg-gray-100 rounded">▶</button>
                            </div>
                        </div>

                        {/* Simple Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-400 mb-2">
                            <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                        </div>
                        <div className="grid grid-cols-7 gap-2 text-center text-sm">
                            {[...Array(5).keys()].map(i => <div key={`empty-${i}`}></div>)} {/* Padding */}
                            {[...Array(31).keys()].map(d => {
                                const day = d + 1;
                                const isEvent = [10, 12, 15].includes(day);
                                return (
                                    <div key={day} className={`p-2 rounded-full cursor-pointer hover:bg-blue-50 transition ${isEvent ? "bg-blue-100 text-blue-700 font-bold" : "text-gray-700"}`}>
                                        {day}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Upcoming Events List */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                        <h2 className="font-bold text-lg mb-4">Upcoming Events</h2>
                        <div className="space-y-4">
                            {events.map(ev => (
                                <div key={ev.id} className="border-l-4 border-blue-500 pl-3 py-1">
                                    <h3 className="font-semibold text-gray-900">{ev.title}</h3>
                                    <p className="text-sm text-gray-500">{ev.date} at {ev.time}</p>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">
                            + Add Event
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

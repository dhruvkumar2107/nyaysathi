import { useState } from "react";
import axios from "axios";

export default function BookingModal({ lawyer, client, onClose }) {
    const [date, setDate] = useState("");
    const [slot, setSlot] = useState("");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    // Mock available slots
    const TIME_SLOTS = ["10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM", "06:00 PM"];

    const handleBook = async () => {
        if (!date || !slot) return alert("Please select date and time");

        setLoading(true);
        try {
            await axios.post("/api/appointments", {
                clientId: client._id || client.id,
                lawyerId: lawyer._id,
                date,
                slot,
                notes
            });
            alert(`Appointment requested with ${lawyer.name}!`);
            onClose();
        } catch (err) {
            alert(err.response?.data?.error || "Booking failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>

                <h2 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h2>
                <p className="text-sm text-gray-500 mb-6">Schedule a consultation with {lawyer.name}</p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Date</label>
                        <input
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500"
                            min={new Date().toISOString().split("T")[0]}
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Select Time Slot</label>
                        <div className="grid grid-cols-3 gap-2">
                            {TIME_SLOTS.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setSlot(t)}
                                    className={`py-2 text-xs font-medium rounded-lg border transition ${slot === t
                                            ? "bg-blue-600 text-white border-blue-600"
                                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Notes (Optional)</label>
                        <textarea
                            rows={2}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 resize-none"
                            placeholder="Briefly describe your issue..."
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleBook}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200 disabled:opacity-50"
                    >
                        {loading ? "Booking..." : "Confirm Booking"}
                    </button>
                </div>
            </div>
        </div>
    );
}

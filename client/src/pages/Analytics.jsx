import { useAuth } from "../context/AuthContext";

export default function Analytics() {
    const { user } = useAuth();

    const stats = [
        { label: "Profile Views", value: 128, change: "+12%" },
        { label: "Search Appearances", value: 45, change: "+5%" },
        { label: "Leads Contacted", value: 12, change: "+8%" },
        { label: "Client Messages", value: 24, change: "+20%" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h1>

                {/* Key Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {stats.map((s, i) => (
                        <div key={i} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                            <p className="text-sm text-gray-500 mb-1">{s.label}</p>
                            <h2 className="text-2xl font-bold text-gray-900">{s.value}</h2>
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">{s.change}</span>
                        </div>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Traffic Overview</h3>
                        {/* Mock Bar Chart */}
                        <div className="flex items-end gap-2 h-48 mt-4 pl-2 border-l border-b border-gray-200">
                            {[40, 65, 30, 80, 55, 90, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition relative group" style={{ height: `${h}%` }}>
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold bg-gray-800 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition">{h}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4">Lead Conversion</h3>
                        {/* Mock Pie Chart (CSS Conic Gradient) */}
                        <div className="flex items-center justify-center py-4">
                            <div className="w-40 h-40 rounded-full" style={{ background: "conic-gradient(#3b82f6 0% 60%, #e5e7eb 60% 100%)" }}></div>
                        </div>
                        <div className="flex justify-center gap-6 mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 bg-blue-500 rounded-full"></span> Converted (60%)</div>
                            <div className="flex items-center gap-2 text-sm text-gray-600"><span className="w-3 h-3 bg-gray-200 rounded-full"></span> Pending (40%)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

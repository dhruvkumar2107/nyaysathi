export default function UnifiedActivityFeed({ feed }) {
    if (!feed || feed.length === 0) return <div className="text-center text-slate-400 py-10 text-xs">No recent activity.</div>;

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden h-[500px] flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="font-bold text-slate-800">Recent Activity</h3>
            </div>

            <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar flex-1">
                {feed.map((item) => (
                    <div key={`${item.type}-${item.id}`} className="flex gap-4 group">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition">
                                {item.icon}
                            </div>
                            <div className="h-full w-0.5 bg-slate-100 mt-2"></div>
                        </div>
                        <div className="pb-6">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.category}</span>
                                <span className="text-[10px] text-slate-300">•</span>
                                <span className="text-[10px] text-slate-400">{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

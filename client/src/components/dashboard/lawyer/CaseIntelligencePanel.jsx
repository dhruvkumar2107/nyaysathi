import { useRouter } from 'next/navigation';

export default function CaseIntelligencePanel({ insights }) {
    const router = useRouter();

    if (!insights || insights.length === 0) return null;

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    ⚡ Case Intelligence
                </h3>
                <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-full uppercase">AI Analyzed</span>
            </div>

            <div className="space-y-4">
                {insights.map((item) => (
                    <div key={item.caseId} className="border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                        <div className="flex justify-between items-start mb-1">
                            <h4
                                onClick={() => router.push(`/case/${item.caseId}`)}
                                className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer truncate w-2/3"
                            >
                                {item.title}
                            </h4>
                            <div className="text-right">
                                <div className={`text-sm font-black ${item.health < 50 ? 'text-red-600' : 'text-emerald-600'}`}>
                                    {item.health}%
                                </div>
                                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Health</div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-500 mb-2">Client: {item.clientName}</p>

                        {/* Smart Action */}
                        <div className="bg-slate-50 p-2 rounded-lg flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">Suggestion:</span>
                            <button className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1">
                                {item.nextAction} →
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

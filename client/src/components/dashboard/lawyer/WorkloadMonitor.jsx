export default function WorkloadMonitor({ workload }) {
    if (!workload) return null;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Light': return 'bg-emerald-100 text-emerald-700';
            case 'Balanced': return 'bg-blue-100 text-blue-700';
            case 'Overloaded': return 'bg-amber-100 text-amber-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Current Workload</p>
                <span className={`px-2 py-1 rounded-md text-xs font-black uppercase tracking-wide ${getStatusColor(workload.status)}`}>
                    {workload.status}
                </span>
            </div>
            <div className="text-right">
                <p className="text-2xl font-black text-slate-800">{workload.activeCases}</p>
                <p className="text-[10px] text-slate-500 font-medium">Active Cases</p>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import axios from 'axios';

const STAGES = ['New Lead', 'Discovery', 'Filing', 'Hearing', 'Judgment', 'Closed'];

export default function KanbanBoard({ cases, onUpdate }) {
    const [board, setBoard] = useState({});

    useEffect(() => {
        // Group cases by stage
        const grouped = STAGES.reduce((acc, stage) => {
            acc[stage] = cases.filter(c => (c.stage || 'New Lead') === stage);
            return acc;
        }, {});
        setBoard(grouped);
    }, [cases]);

    const moveCard = async (caseId, newStage) => {
        try {
            await axios.patch(`/api/cases/${caseId}/stage`, { stage: newStage });
            onUpdate(); // Refresh parent
        } catch (err) {
            alert("Failed to move case");
        }
    };

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-[1200px]">
                {STAGES.map(stage => (
                    <div key={stage} className="w-72 bg-slate-50 rounded-xl p-3 border border-slate-200 flex-shrink-0 flex flex-col max-h-[600px]">
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h4 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{stage}</h4>
                            <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{board[stage]?.length || 0}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                            {board[stage]?.map(c => (
                                <div key={c._id} className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase">{c.category || 'Case'}</span>
                                        <button onClick={() => window.open(`/case/${c._id}`, '_blank')} className="text-slate-400 hover:text-blue-600">↗</button>
                                    </div>
                                    <h5 className="font-bold text-slate-800 text-sm mb-1 leading-tight">{c.title}</h5>
                                    <p className="text-xs text-slate-500 mb-2 truncate">{c.client?.name || "Client"}</p>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 mt-2 opacity-100 transition-opacity">
                                        <button
                                            disabled={stage === 'New Lead'}
                                            onClick={() => moveCard(c._id, STAGES[STAGES.indexOf(stage) - 1])}
                                            className="text-slate-400 hover:text-slate-600 font-bold text-lg disabled:opacity-20 flex-1 text-left"
                                        >←</button>
                                        <button
                                            disabled={stage === 'Closed'}
                                            onClick={() => moveCard(c._id, STAGES[STAGES.indexOf(stage) + 1])}
                                            className="text-slate-400 hover:text-blue-600 font-bold text-lg disabled:opacity-20 flex-1 text-right"
                                        >→</button>
                                    </div>
                                </div>
                            ))}
                            {(!board[stage] || board[stage].length === 0) && (
                                <div className="h-24 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 text-xs font-medium">
                                    Empty
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

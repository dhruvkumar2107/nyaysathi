import { Link } from "react-router-dom";

export default function PaywallModal({ isOpen, onClose, title = "Upgrade to Access" }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-[#0F2A5F] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-3xl">💎</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-blue-200 text-lg mb-8 max-w-lg mx-auto">
                        You've reached your free trial limit. Unlock unlimited access to AI analysis, drafting, and legal insights.
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
                        <PlanCard
                            name="Silver"
                            price="₹499"
                            features={["Full Accuracy Scores", "Unlimited Drafting", "Basic Support"]}
                        />
                        <PlanCard
                            name="Gold"
                            price="₹999"
                            highlight
                            features={["Everything in Silver", "Priority Processing", "Advanced Legal Insights"]}
                        />
                        <PlanCard
                            name="Diamond"
                            price="₹2499"
                            features={["Unlock Everything", "Human Lawyer Review", "Concierge Support"]}
                        />
                    </div>

                    <Link
                        to="/pricing"
                        className="inline-flex items-center gap-2 bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44] px-8 py-3 rounded-xl font-bold text-lg transition transform hover:scale-105"
                    >
                        View Upgrade Options <span>→</span>
                    </Link>

                    <button
                        onClick={onClose}
                        className="block mx-auto mt-4 text-sm text-gray-400 hover:text-white transition"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
}

function PlanCard({ name, price, features, highlight }) {
    return (
        <div className={`p-4 rounded-xl border ${highlight ? 'bg-blue-600/20 border-[#00D4FF]' : 'bg-white/5 border-white/10'}`}>
            <h3 className={`font-bold ${highlight ? 'text-[#00D4FF]' : 'text-white'}`}>{name}</h3>
            <div className="text-2xl font-bold text-white my-2">{price}</div>
            <ul className="space-y-2">
                {features.map((f, i) => (
                    <li key={i} className="text-xs text-blue-100 flex items-start gap-2">
                        <span className="text-[#00D4FF] mt-0.5">✓</span> {f}
                    </li>
                ))}
            </ul>
        </div>
    )
}

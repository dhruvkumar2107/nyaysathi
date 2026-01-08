import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Pricing() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Toggles for Client vs Lawyer
  const [activeTab, setActiveTab] = useState(user?.role === "lawyer" ? "lawyer" : "client");

  const plans = {
    client: [
      {
        title: "Free",
        price: "0",
        features: [
          "3 Free AI Usages (Shared)",
          "Basic Lawyer Search",
          "6-Hour Trial Window"
        ],
        benefit: "For Verification",
        highlight: false,
        limitations: "Limited AI Tools"
      },
      {
        title: "Silver",
        price: "499",
        features: [
          "1 User (Individual)",
          "Full Agreement Analysis",
          "District Courts & Local Tribunals",
          "Standard Email Support",
          "Unlimited Drafting (No FIRs)"
        ],
        benefit: "Essential Legal Access",
        highlight: false,
        limitations: "No Criminal or Cybercrime support"
      },
      {
        title: "Gold",
        price: "999",
        features: [
          "State/High Courts + District Courts",
          "All cases (Criminal & Cybercrime included)",
          "Priority AI Processing",
          "Comparative Agreement Analysis",
          "Priority Chat Support"
        ],
        benefit: "Complete Protection",
        highlight: true
      },
      {
        title: "Diamond",
        price: "2499",
        features: [
          "Family Coverage (User + Spouse)",
          "Supreme Court + All Tribunals",
          "Concierge Legal Review",
          "Drafting + Human Verification",
          "24/7 Priority Manager"
        ],
        benefit: "Elite Family Coverage",
        highlight: false
      }
    ],
    lawyer: [
      {
        title: "Silver",
        price: "1000",
        features: [
          "Individual Practitioner Profile",
          "Listed for District-level queries",
          "Access to basic Civil Leads",
          "Basic Digital Signature Tools",
          "Profile visible in local searches"
        ],
        benefit: "For Starting Practice",
        highlight: false,
        limitations: "No High/Supreme Court Leads"
      },
      {
        title: "Gold",
        price: "2500",
        features: [
          "\"Verified Professional\" Badge",
          "Listed for High Court & State level",
          "Access to high-stakes Criminal Leads",
          "Advanced Legal Research Database",
          "Priority listing in search results",
          "Client Management Dashboard (CRM)"
        ],
        benefit: "Accelerate Your Growth",
        highlight: true
      },
      {
        title: "Diamond",
        price: "5000",
        features: [
          "\"Elite Partner\" Status",
          "Featured at Top of Search",
          "Global/National Lead Generation",
          "Dedicated \"Virtual Office\" Tools",
          "Direct Booking Integration",
          "Profile View Analytics & Insights"
        ],
        benefit: "Dominate Your Market",
        highlight: false
      }
    ]
  };

  /* ===================== PAYMENT HANDLER (RAZORPAY) ===================== */
  const handleBuy = async (plan, price) => {
    if (!user) {
      if (confirm("You must be logged in to purchase a plan. Go to login?")) {
        navigate("/login");
      }
      return;
    }

    if (price === "0") return;

    setLoading(true);

    try {
      // 1️⃣ CREATE ORDER (BACKEND)
      const { data } = await axios.post(
        "/api/payments/create-order",
        {
          amount_rupees: Number(price),
          plan,
          email: user.email
        }
      );

      // 2️⃣ OPEN RAZORPAY CHECKOUT
      const options = {
        key: data.key,
        amount: data.amount,
        currency: "INR",
        name: "Nyay-Sathi",
        description: `${plan} Subscription`,
        order_id: data.orderId,

        handler: async function (response) {
          // 3️⃣ VERIFY PAYMENT
          const verifyRes = await axios.post(
            "/api/payments/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan,
              email: user.email,
              amount: Number(price)
            }
          );

          if (verifyRes.data.success && verifyRes.data.user) {
            updateUser(verifyRes.data.user);
          }

          navigate("/payment/success");
        },

        prefill: {
          email: user.email
        },

        theme: {
          color: "#00D4FF"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open(); // 🔥 OPENS RAZORPAY (UPI / CARDS / NETBANKING)

    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ===================== UI ===================== */
  return (
    <main className="min-h-screen bg-[#0A1F44] text-white py-24 px-6">
      <div className="max-w-[1128px] mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Plans that scale with you
          </h1>
          <p className="text-blue-200 text-lg">
            Choose the plan that fits your legal needs
          </p>
        </div>

        {/* ROLE TABS */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 p-1 rounded-xl flex gap-1 border border-white/5">
            <button
              onClick={() => setActiveTab("client")}
              className={`px-8 py-3 rounded-lg font-semibold transition ${activeTab === "client" ? "bg-[#00D4FF] text-[#0A1F44]" : "text-blue-200 hover:text-white"}`}
            >
              For Clients
            </button>
            <button
              onClick={() => setActiveTab("lawyer")}
              className={`px-8 py-3 rounded-lg font-semibold transition ${activeTab === "lawyer" ? "bg-[#00D4FF] text-[#0A1F44]" : "text-blue-200 hover:text-white"}`}
            >
              For Lawyers
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {plans[activeTab].map((p, i) => (
            <div
              key={i}
              className={`relative p-8 rounded-2xl border transition-all duration-300 shadow-xl flex flex-col glass-panel
                ${p.highlight
                  ? "border-[#00D4FF] ring-2 ring-[#00D4FF]/20 transform scale-105 z-10"
                  : "border-white/10 hover:border-white/20"}`}
            >
              {p.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00D4FF] text-[#0A1F44] px-4 py-1 rounded-full text-sm font-bold">
                  Recommended
                </span>
              )}

              <h3 className="text-xl font-bold mb-2 text-white">{p.title}</h3>
              <div className="flex items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-white">₹{p.price}</span>
                <span className="text-blue-300 mb-1">/mo</span>
              </div>
              <p className="text-sm text-[#00D4FF] font-semibold mb-6">
                {p.benefit}
              </p>

              <ul className="space-y-4 flex-1 mb-8">
                {p.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-blue-100/80 text-sm">
                    <span className="text-[#00D4FF] font-bold">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleBuy(p.title, p.price)}
                disabled={loading || p.price === "0" || user?.plan?.toLowerCase() === p.title.toLowerCase()}
                className={`w-full py-3 rounded-xl font-bold transition
                  ${user?.plan?.toLowerCase() === p.title.toLowerCase()
                    ? "bg-green-600/20 text-green-400 cursor-default border border-green-500/50"
                    : p.highlight
                      ? "bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44]"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }
                  ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {loading
                  ? "Processing..."
                  : user?.plan?.toLowerCase() === p.title.toLowerCase()
                    ? "Current Plan"
                    : "Upgrade"}
              </button>
            </div>
          ))}
        </div>

        {/* Diamond Plan All Benefits Indicator */
          user?.plan === "diamond" && (
            <div className="mt-12 p-6 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl text-white text-center shadow-lg animate-fade-in-up">
              <h2 className="text-2xl font-bold mb-2">💎 All Premium Features Unlocked!</h2>
              <p className="opacity-90">
                You are on the highest tier. Enjoy unlimited access to lawyers, AI analysis, and contract redlining.
              </p>
            </div>
          )}
      </div>
    </main>
  );
}

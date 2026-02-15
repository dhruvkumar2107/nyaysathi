import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Shield } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const { user } = useAuth();
  const [billingCycle, setBillingCycle] = useState('monthly');

  const handleUpgrade = async (plan, price) => {
    if (!user) return alert("Please login first");
    try {
      // Initiate payment logic here
      alert(`Initiating upgrade to ${plan} Plan`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      {/* HERO */}
      <div className="pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 px-6">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">Invest in Your Legal Security.</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Professional-grade AI tools for lawyers, law firms, and individuals who demand the best.
          </p>

          {/* TOGGLE */}
          <div className="inline-flex bg-white/5 border border-white/10 p-1 rounded-full backdrop-blur-sm">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${billingCycle === 'yearly' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              Yearly <span className="text-[10px] text-emerald-300 ml-1">-20%</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRICING CARDS */}
      <div className="container mx-auto px-6 pb-32 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">

          {/* FREE TIER */}
          <PricingCard
            title="Basic"
            price="Free"
            desc="Essential tools for everyday legal queries."
            features={['Basic AI Chat (5/day)', 'Access to Marketplace', 'Standard Support']}
            icon={<Shield className="text-slate-400" />}
          />

          {/* GOLD TIER */}
          <PricingCard
            title="Gold"
            price={billingCycle === 'monthly' ? "₹999" : "₹9,999"}
            period={billingCycle === 'monthly' ? "/mo" : "/yr"}
            desc="For independent lawyers and power users."
            features={['Unlimited AI Chat', 'Document Drafting (10/mo)', 'Priority Support', 'Legal Research Access']}
            highlight
            popular
            icon={<Zap className="text-white" />}
            onAction={() => handleUpgrade('Gold', 999)}
          />

          {/* DIAMOND TIER */}
          <PricingCard
            title="Diamond"
            price={billingCycle === 'monthly' ? "₹2,499" : "₹24,999"}
            period={billingCycle === 'monthly' ? "/mo" : "/yr"}
            desc="Full suite access for law firms."
            features={['Everything in Gold', 'Judge AI Predictor', 'Moot Court VR Access', 'API Access', 'Dedicated Account Manager']}
            icon={<Star className="text-amber-400" />}
            special
            onAction={() => handleUpgrade('Diamond', 2499)}
          />

        </div>
      </div>

      <Footer />
    </div>
  );
};

const PricingCard = ({ title, price, period, desc, features, highlight, popular, special, icon, onAction }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className={`relative p-8 rounded-3xl border flex flex-col h-full ${special
        ? "bg-gradient-to-b from-slate-800 to-slate-900 border-amber-500/50 shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]"
        : highlight
          ? "bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/40"
          : "bg-white/5 border-white/10 backdrop-blur-sm"
      }`}
  >
    {popular && (
      <div className="absolute top-0 right-0 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl uppercase tracking-wider">
        Most Popular
      </div>
    )}

    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-2xl ${highlight ? 'bg-white/20' : 'bg-white/5'}`}>
      {icon}
    </div>

    <h3 className={`text-xl font-bold mb-2 ${special ? 'text-amber-400' : 'text-white'}`}>{title}</h3>
    <p className={`text-sm mb-6 ${highlight ? 'text-indigo-100' : 'text-slate-400'}`}>{desc}</p>

    <div className="mb-8">
      <span className="text-4xl font-serif font-bold">{price}</span>
      <span className={`text-sm ${highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{period}</span>
    </div>

    <div className="space-y-4 mb-8 flex-1">
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className={`p-0.5 rounded-full ${highlight ? 'bg-indigo-400' : 'bg-slate-700'}`}>
            <Check size={10} className="text-white" />
          </div>
          <span className={`text-sm ${highlight ? 'text-indigo-50' : 'text-slate-300'}`}>{f}</span>
        </div>
      ))}
    </div>

    <button
      onClick={onAction}
      className={`w-full py-4 rounded-xl font-bold transition shadow-lg ${highlight
          ? "bg-white text-indigo-600 hover:bg-slate-50"
          : special
            ? "bg-gradient-to-r from-amber-400 to-gold-600 text-black hover:opacity-90"
            : "bg-white/10 hover:bg-white/20 text-white"
        }`}
    >
      Get Started
    </button>
  </motion.div>
);

export default Pricing;

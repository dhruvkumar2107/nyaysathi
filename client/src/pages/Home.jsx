import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Backgrounds */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-white to-transparent pointer-events-none"
        />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">AI-Powered Legal Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]"
          >
            Your Personal
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Legal Supermind.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Navigate the complexities of Indian Law with confidence. Draft notices, analyze contracts, and consult top lawyers—all powered by advanced AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {!user ? (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 text-white font-bold text-base hover:bg-slate-800 transition shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-95 duration-200"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-700 border border-slate-200 font-bold text-base hover:bg-slate-50 transition active:scale-95 duration-200"
                >
                  Sign In
                </Link>
              </>
            ) : (
              <Link
                to={user.role === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard"}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20 active:scale-95 duration-200"
              >
                Go to Dashboard
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- LEGAL SUPERMIND SHOWCASE (3D TILT EFFECT) --- */}
      <section className="py-32 bg-slate-900 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="px-4 py-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-[0.2em]"
            >
              The Pro Suite
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-black text-white mt-6 mb-4 tracking-tight">
              Legal <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Supermind.</span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
              A comprehensive arsenal of AI tools designed for the next generation of legal professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* CARD 1: MOOT COURT */}
            <TiltCard
              title="Moot Court VR"
              desc="Practice oral arguments against an AI Judge with real-time feedback."
              icon="🏛️"
              color="from-purple-500 to-indigo-600"
              href="/moot-court"
              badge="Flagship"
            />

            {/* CARD 2: RESEARCH */}
            <TiltCard
              title="Deep Research"
              desc="Semantic search that understands legal context, not just keywords."
              icon="🔍"
              color="from-blue-500 to-cyan-500"
              href="/research"
            />

            {/* CARD 3: DRAFTING */}
            <TiltCard
              title="Drafting Lab"
              desc="Auto-generate ironclad contracts and detect risks instantly."
              icon="📝"
              color="from-emerald-500 to-teal-500"
              href="/drafting"
            />

            {/* CARD 4: CAREER */}
            <TiltCard
              title="Career Hub"
              desc="Virtual internships and mentorship from top legal minds."
              icon="💼"
              color="from-pink-500 to-rose-500"
              href="/career"
            />

          </div>
        </div>
      </section>


      {/* --- TRUST FOOTER --- */}
      <section className="py-12 border-t border-slate-200 bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition duration-500">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Trusted By Teams At</span>
          <div className="flex gap-8 items-center">
            <div className="h-6 w-24 bg-slate-300 rounded"></div>
            <div className="h-6 w-24 bg-slate-300 rounded"></div>
            <div className="h-6 w-24 bg-slate-300 rounded"></div>
            <div className="h-6 w-24 bg-slate-300 rounded"></div>
          </div>
        </div>
      </section>

    </div>
  );
}

function TiltCard({ title, desc, icon, color, href, badge }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="relative group cursor-pointer"
      onClick={() => window.location.href = href}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-500`}></div>
      <div className="relative h-full bg-slate-800/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-start overflow-hidden hover:border-white/20 transition-colors">

        {badge && (
          <span className="absolute top-4 right-4 px-2 py-1 bg-white/10 text-white text-[10px] font-bold uppercase rounded-md border border-white/10">
            {badge}
          </span>
        )}

        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-3xl shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-colors">
          {title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed mb-6">
          {desc}
        </p>

        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-white opacity-60 group-hover:opacity-100 transition-opacity">
          Explore Feature <span className="group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </div>
    </motion.div>
  );
}

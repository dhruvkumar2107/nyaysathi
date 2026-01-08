import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="min-h-screen bg-[#0A1F44] text-white pt-20">
      {/* HERO SECTION */}
      <section className="bg-[#0A1F44] pb-16 pt-12 border-b border-white/5 relative overflow-hidden">
        {/* Abstract Background Blurs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00D4FF]/10 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        <div className="max-w-[1128px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">

          {/* LEFT: TEXT */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D4FF] to-blue-400">Legal Intelligence</span>
              <br />
              for Everyone
            </h1>
            <p className="text-xl text-blue-200 font-light max-w-lg">
              Analyze agreements, draft notices, and find verified lawyers with India's most advanced AI legal companion.
            </p>

            <div className="space-y-4 pt-4">
              <FeatureRow text="Instant AI Agreement Analysis" />
              <FeatureRow text="Verified Supreme Court & High Court Lawyers" />
              <FeatureRow text="Multilingual 24/7 Legal Assistance" />
            </div>

            {!user ? (
              <div className="flex gap-4 pt-6">
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-xl bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44] font-bold text-lg transition shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-lg transition backdrop-blur-md"
                >
                  Sign in
                </Link>
              </div>
            ) : (
              <div className="pt-6">
                <Link
                  to={user.role === "lawyer" ? "/lawyer/dashboard" : "/client/dashboard"}
                  className="inline-block px-8 py-3.5 rounded-xl bg-[#00D4FF] hover:bg-[#00b4d8] text-[#0A1F44] font-bold text-lg transition shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>

          {/* RIGHT: ILLUSTRATION / HERO IMAGE */}
          <div className="relative animate-in slide-in-from-right duration-1000">
            <div className="aspect-[4/3] glass-panel rounded-2xl p-8 relative overflow-hidden flex items-center justify-center border border-white/10 shadow-2xl">
              {/* Abstract UI Representation */}
              <div className="absolute inset-0 bg-blue-500/5"></div>

              <div className="relative z-10 w-full max-w-sm bg-[#0F2A5F]/80 backdrop-blur-md rounded-xl shadow-2xl border border-white/10 p-6 space-y-4">
                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                  <div className="space-y-2">
                    <div className="h-2 w-24 bg-white/20 rounded"></div>
                    <div className="h-2 w-16 bg-white/10 rounded"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-2 w-full bg-white/10 rounded"></div>
                  <div className="h-2 w-full bg-white/10 rounded"></div>
                  <div className="h-2 w-2/3 bg-white/10 rounded"></div>
                </div>
                <div className="pt-4 flex gap-3">
                  <div className="h-8 w-24 bg-[#00D4FF] rounded-lg opacity-80"></div>
                  <div className="h-8 w-20 bg-white/5 rounded-lg border border-white/10"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-10 right-10 p-4 glass-panel rounded-xl shadow-lg animate-bounce delay-700">
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="absolute bottom-10 left-10 p-4 glass-panel rounded-xl shadow-lg animate-bounce">
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="py-20 relative">
        <div className="max-w-[1128px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Empowering Justice with Technology</h2>
            <p className="text-blue-200">Everything you need to navigate the Indian legal system.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card
              title="Find a Lawyer"
              desc="Search verified Supreme Court and High Court advocates by specialization."
              link="/marketplace"
              icon="🔍"
            />
            <Card
              title="Analyze Agreements"
              desc="Upload contracts to detect risks, missing clauses, and ambiguities instantly."
              link="/agreements"
              icon="📄"
            />
            <Card
              title="AI Legal Assistant"
              desc="Get instant answers and draft legal notices in 10+ Indian languages."
              link="/assistant"
              icon="🤖"
            />
          </div>
        </div>
      </section>

    </main>
  );
}

function FeatureRow({ text }) {
  return (
    <div className="flex items-center gap-4 group cursor-default">
      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00D4FF]/20 flex items-center justify-center text-[#00D4FF] shadow-[0_0_10px_rgba(0,212,255,0.2)]">
        <span className="text-xs">✓</span>
      </span>
      <span className="text-lg text-blue-100 font-light group-hover:text-white transition">{text}</span>
    </div>
  )
}

function Card({ title, desc, link, icon }) {
  return (
    <Link to={link} className="block group">
      <div className="glass-panel rounded-2xl p-8 h-full hover:bg-white/5 transition duration-300 border border-white/5 hover:border-[#00D4FF]/50 relative top-0 hover:-top-2">
        <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center text-3xl mb-6 group-hover:bg-[#00D4FF]/20 transition text-[#00D4FF]">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00D4FF] transition flex items-center gap-2">
          {title}
        </h3>
        <p className="text-blue-200 leading-relaxed text-sm">{desc}</p>
      </div>
    </Link>
  )
}

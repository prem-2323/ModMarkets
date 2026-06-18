import React from "react";
import { Gamepad2, Upload, TrendingUp, ShieldCheck, Activity, Users, ArrowRight, Sparkles, Star, Zap, DollarSign } from "lucide-react";
import { UserProfile } from "../types";

interface HomeViewProps {
  user: UserProfile | null;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
}

export default function HomeView({ user, setCurrentView, onOpenAuth }: HomeViewProps) {
  const featuredStats = [
    { label: "Community Downloads", value: "248,310+", icon: Activity, color: "text-[#12CFCE]" },
    { label: "Modifications Uploaded", value: "12,940+", icon: Gamepad2, color: "text-purple-400" },
    { label: "Sum Cleared to Creators", value: "$325,480", icon: DollarSign, color: "text-emerald-400" },
    { label: "Fixed Platform Service Fee", value: "5.0%", icon: TrendingUp, color: "text-amber-400" },
  ];

  const features = [
    {
      title: "Ultra Low 5% Protocol Fee",
      desc: "Retain 95% of every single purchase. No complex subscription gates, lock-ins, or hidden developer distribution fees.",
      icon: DollarSign,
      color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400"
    },
    {
      title: "Instant UPI Payout Settlement",
      desc: "Avoid waiting 30 days for payment clearance. Load your UPI handle and request withdrawals with near-instant balance clearance.",
      icon: Zap,
      color: "from-[#12CFCE]/10 to-cyan-500/10 border-[#12CFCE]/20 text-[#12CFCE]"
    },
    {
      title: "Multi-Platform Compatibility",
      desc: "Optimized for game mod distribution on PC, Android, iOS, PlayStation, and Xbox with custom platform filtering badges.",
      icon: Gamepad2,
      color: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-400"
    },
    {
      title: "Robust Asset Verification",
      desc: "Every code upload, version patch, and screenshot is indexed with clean audit telemetry, securing users against malware.",
      icon: ShieldCheck,
      color: "from-blue-500/10 to-[#12CFCE]/10 border-blue-500/20 text-blue-400"
    }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden pt-12">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#12CFCE]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#1B2945] border border-[#12CFCE]/30 px-3 py-1.5 rounded-full text-xs font-semibold text-[#12CFCE] tracking-wide animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            THE NEXT-GEN GAME MODDING NEXUS
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-bold text-white tracking-tight leading-tight sm:leading-none">
            Monetize & Distribute <br />
            Your Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12CFCE] to-teal-400">Modifications</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            The premier premium marketplace for gaming authors. Host files securely, showcase high-res screenshots, track telemetry, and request withdrawals via UPI with keeping <strong className="text-transparent bg-clip-text bg-gradient-to-r from-[#12CFCE] to-emerald-400 font-bold">95% split of earnings</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setCurrentView("library")}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#12CFCE] to-teal-500 text-slate-950 rounded-xl font-bold hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_25px_rgba(18,207,206,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              id="hero-explore-btn"
            >
              Explore Studio Library
              <ArrowRight className="w-5 h-5 text-slate-950" />
            </button>
            
            {user ? (
              <button
                onClick={() => setCurrentView("upload")}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#151D30] text-white rounded-xl font-bold border border-[#232F4C] hover:bg-[#232F4C]/50 hover:border-[#12CFCE]/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-upload-btn"
              >
                <Upload className="w-5 h-5 text-[#12CFCE]" />
                Upload New Mod
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#151D30] text-white rounded-xl font-bold border border-[#232F4C] hover:bg-[#232F4C]/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                id="hero-join-btn"
              >
                <Users className="w-5 h-5 text-purple-400" />
                Join Creator Program
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#151D30]/60 rounded-2xl border border-[#232F4C] p-6 sm:p-8 relative">
          <div className="absolute top-0 right-1/4 w-[120px] h-[120px] bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
          <h2 className="text-xs font-bold text-slate-400 tracking-wider text-center uppercase mb-8">
            MODMARKET BY THE NUMBERS
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredStats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center space-y-2 group">
                  <div className="mx-auto w-10 h-10 rounded-lg bg-slate-950 border border-[#232F4C] flex items-center justify-center group-hover:border-[#12CFCE]/40 transition-all">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Platform Introduction and Features */}
      <section className="max-w-7xl mx-auto px-4 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-xs font-bold text-[#12CFCE] tracking-widest uppercase">PLATFORM ARSENAL</h2>
          <h3 className="text-2xl sm:text-4xl font-display font-bold text-white leading-tight">
            Designed for Speed. Engineered for Authors.
          </h3>
          <p className="text-sm sm:text-base text-slate-400 font-light">
            We provide creators with the structural tooling necessary to transform their gaming passions into cleared financial balances.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className={`bg-gradient-to-b ${feat.color.split(" ")[0]} ${feat.color.split(" ")[1]} rounded-2xl border ${feat.color.split(" ")[2]} p-6 sm:p-8 flex flex-col justify-between group hover:scale-[1.01] hover:border-[#12CFCE]/30 transition-all`}
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-[#232F4C]">
                    <Icon className={`w-6 h-6 ${feat.color.split(" ")[3]}`} />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#12CFCE] transition-all">
                    {feat.title}
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-light">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Secondary CTA / Launching Guideline */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-[#1B2945] to-[#111A2E] rounded-3xl border border-[#232F4C] overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 sm:p-12 gap-8 relative">
          <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px]" />
          
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Ready to submit your first mod patch?
            </h3>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Verify your developer profile immediately, set compatible platforms, set your custom pricing tier, and connect with thousands of active players searching for your creations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <button
              onClick={() => {
                if (user) {
                  setCurrentView("upload");
                } else {
                  onOpenAuth();
                }
              }}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-teal-400 to-[#12CFCE] text-slate-950 font-bold rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              id="cta-bottom"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button
              onClick={() => setCurrentView("library")}
              className="w-full sm:w-auto px-6 py-3 bg-[#151D30] text-slate-300 border border-[#232F4C] rounded-xl hover:text-white hover:border-slate-500 transition-all text-sm cursor-pointer"
              id="cta-bottom-browse"
            >
              Browse Games List
            </button>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="border-t border-[#232F4C] mt-24 pt-12 pb-8 text-center text-xs text-slate-500 space-y-4 max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 text-slate-400 mb-6">
          <button onClick={() => setCurrentView("home")} className="hover:text-[#12CFCE] transition-all cursor-pointer">Platform Overview</button>
          <button onClick={() => setCurrentView("library")} className="hover:text-[#12CFCE] transition-all cursor-pointer">Mods Index</button>
          <button onClick={() => { if (user) setCurrentView("upload"); else onOpenAuth(); }} className="hover:text-[#12CFCE] transition-all cursor-pointer">Creator Upload</button>
          <button onClick={() => { if (user) setCurrentView("payout"); else onOpenAuth(); }} className="hover:text-[#12CFCE] transition-all cursor-pointer">Settlement Dashboard</button>
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          ModMarket operates as a decentralised metadata registry for game modifications. All names, assets, and games are trademarks of their respective publishers and owners.
        </p>
        <p className="font-mono text-[10px]">
          &copy; {new Date().getFullYear()} ModMarket Inc. Authorized with Cryptographic Signatures.
        </p>
      </footer>
    </div>
  );
}

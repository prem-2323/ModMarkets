import React, { useState } from "react";
import { Mail, Lock, User, Sparkles, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { UserProfile } from "../types";

interface AuthViewProps {
  onAuthSuccess: (user: UserProfile) => void;
  onClose: () => void;
}

export default function AuthView({ onAuthSuccess, onClose }: AuthViewProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleAuthSubmit = async (e: React.FormEvent) => {
e.preventDefault();

setErrorMsg("");
setSuccessMsg("");
setIsLoading(true);

try {

if (isSignUp) {

  if (!email || !password || !displayName) {
    throw new Error("All fields are required");
  }

  if (password !== confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const response = await fetch(
    "http://localhost:5000/api/auth/signup",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: displayName,
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  setSuccessMsg("Account created successfully!");

} else {

  const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  localStorage.setItem("token", data.token);

  const user: UserProfile = {
    uid: data.user._id,
    email: data.user.email,
    displayName: data.user.username,
    totalEarnings: 0,
    pendingBalance: 0,
    withdrawableBalance: 0,
    createdAt: new Date().toISOString()
  };

  setSuccessMsg("Login successful!");

  setTimeout(() => {
    onAuthSuccess(user);
  }, 1000);
}


} catch (err: any) {
setErrorMsg(err.message || "Authentication failed");
} finally {
setIsLoading(false);
}
};


  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-[#0B0F19]/90 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#12CFCE]/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#151D30] rounded-2xl border border-[#232F4C] overflow-hidden shadow-2xl relative z-10">
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-[#12CFCE]" />
              Mod<span className="text-[#12CFCE]">Market</span>
            </h2>
            <p className="text-sm text-slate-400">
              {isSignUp ? "Create your account to get started" : "Sign in to your account"}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3.5 flex items-start gap-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Display Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Creator Name"
                    className="w-full bg-slate-950/80 border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-950/80 border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/80 border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#12CFCE] hover:bg-[#10B5B5] disabled:opacity-50 text-[#0B0F19] font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-6"
            >
              {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-slate-400 hover:text-[#12CFCE] transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

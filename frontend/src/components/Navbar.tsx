import React, { useState } from "react";
import { Gamepad2, Upload, BookOpen, CreditCard, LogIn, LogOut, Menu, X, Coins, Sparkles } from "lucide-react";
import { UserProfile } from "../types";

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  user: UserProfile | null;
  onSignOut: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ currentView, setCurrentView, user, onSignOut, onOpenAuth }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", id: "home", icon: Gamepad2 },
    { label: "Upload", id: "upload", icon: Upload, authRequired: true },
    { label: "Library", id: "library", icon: BookOpen },
    { label: "Payout", id: "payout", icon: CreditCard, authRequired: true },
  ];

  const handleNavClick = (viewId: string) => {
    if (!user && navItems.find((n) => n.id === viewId)?.authRequired) {
      onOpenAuth();
    } else {
      setCurrentView(viewId);
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-md border-b border-[#232F4C] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setCurrentView("home")}
          className="flex items-center gap-2 text-xl font-display font-bold text-white cursor-pointer group"
          id="nav-logo-btn"
        >
          <div className="bg-[#12CFCE]/10 p-2 rounded-lg border border-[#12CFCE]/30 group-hover:bg-[#12CFCE]/20 transition-all">
            <Gamepad2 className="w-6 h-6 text-[#12CFCE] " />
          </div>
          <span className="bg-gradient-to-r from-white via-slate-100 to-[#12CFCE] bg-clip-text text-transparent">
            Mod<span className="text-[#12CFCE]">Market</span>
          </span>
        </button>

        {/* Desktop Navigation links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1B2945] text-[#12CFCE] border-b border-[#12CFCE]"
                    : "text-slate-300 hover:text-white hover:bg-[#151D30]"
                }`}
                id={`nav-${item.id}-btn`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Right side Actions (User Profile or Login) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Balances Quick Badge */}
              <button
                onClick={() => handleNavClick("payout")}
                className="flex items-center gap-2 bg-[#151D30] border border-[#232F4C] hover:border-[#12CFCE]/40 px-3 py-1.5 rounded-lg transition-all text-xs text-slate-300 cursor-pointer"
                id="nav-payout-shortcut-btn"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cleared: <strong className="text-emerald-400 font-mono">${user.withdrawableBalance.toFixed(2)}</strong></span>
              </button>

              {/* Profile Card */}
              <div className="flex items-center gap-2 bg-[#1B2945]/40 px-3  py-1.5 rounded-lg border border-[#232F4C]">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-[10px] text-white">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">{user.displayName}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={onSignOut}
                className="p-2 border border-[#232F4C] text-slate-400 hover:text-rose-400 hover:border-rose-500/30 rounded-lg hover:bg-rose-500/5 transition-all text-sm cursor-pointer"
                id="nav-logout-btn"
                title="Log Out"
              >
                <LogOut className="w-4 h-4"/>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 bg-gradient-to-r from-[#12CFCE] to-teal-500 text-slate-950 px-4 py-2 rounded-lg font-medium hover:brightness-110 active:brightness-100 transition-all shadow-[0_0_15px_rgba(18,207,206,0.3)] cursor-pointer text-sm"
              id="nav-login-cta"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile menu trigger button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <div className="flex items-center bg-[#151D30] border border-[#232F4C] px-2.5 py-1 rounded-lg text-xs font-mono text-emerald-400">
              ${user.withdrawableBalance.toFixed(2)}
            </div>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white hover:bg-[#151D30] rounded-lg border border-[#232F4C]"
            id="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-[#232F4C] flex flex-col gap-2 bg-[#0B0F19] rounded-lg p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium w-full text-left transition-all ${
                  isActive
                    ? "bg-[#1B2945] text-[#12CFCE]"
                    : "text-slate-300 hover:text-white hover:bg-[#151D30]"
                }`}
                id={`mobile-nav-${item.id}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}

          <div className="h-px bg-[#232F4C] my-1" />

          {user ? (
            <div className="px-4 py-2 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
                  {user.displayName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.displayName}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#151D30] p-2 rounded-lg border border-[#232F4C]">
                  <p className="text-slate-400">Total Cleared</p>
                  <p className="text-sm font-bold text-emerald-400 font-mono">${user.withdrawableBalance.toFixed(2)}</p>
                </div>
                <div className="bg-[#151D30] p-2 rounded-lg border border-[#232F4C]">
                  <p className="text-slate-400">Pending</p>
                  <p className="text-sm font-bold text-amber-400 font-mono">${user.pendingBalance.toFixed(2)}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onSignOut();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-950/40 text-rose-400 border border-rose-900/30 rounded-lg hover:bg-rose-900/20 text-sm font-medium transition-all"
                id="mobile-logout-btn"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#12CFCE] to-teal-500 text-slate-950 px-4 py-2.5 rounded-lg font-medium text-sm transition-all shadow-[0_0_15px_rgba(18,207,206,0.3)]"
              id="mobile-login-btn"
            >
              <LogIn className="w-4 h-4 text-slate-950" />
              Sign In / Sign Up
            </button>
          )}
        </div>
      )}
    </nav>
  );
}

import React, { useState } from "react";
import { X } from "lucide-react";
import Navbar from "./components/Navbar";
import HomeView from "./components/HomeView";
import AuthView from "./components/AuthView";
import UploadView from "./components/UploadView";
import LibraryView from "./components/LibraryView";
import PayoutView from "./components/PayoutView";
import { UserProfile, Mod } from "./types";

// Demo user for frontend-only mode
const DEMO_USER: UserProfile = {
  uid: "demo-user",
  email: "creator@modmarket.com",
  displayName: "Demo Creator",
  totalEarnings: 0,
  pendingBalance: 0,
  withdrawableBalance: 0,
  createdAt: new Date().toISOString(),
};

export default function App() {
  const [currentView, setCurrentView] = useState<"home" | "upload" | "library" | "payout">("home");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editingMod, setEditingMod] = useState<Mod | null>(null);
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);

  const handleSignOut = () => {
    setUser(null);
    setCurrentView("home");
  };

  const handleAuthSuccess = (loggedUser: UserProfile) => {
    setUser(loggedUser);
    setShowAuthOverlay(false);
    if (currentView === "home" || currentView === "upload") {
      setCurrentView("library");
    }
  };

  const handleEditModTrigger = (mod: Mod) => {
    setEditingMod(mod);
    setCurrentView("upload");
  };

  const handleRefreshUserBalances = () => {
    // Frontend-only: no-op
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col justify-between text-slate-100 font-sans antialiased selection:bg-[#12CFCE]/20 selection:text-[#12CFCE]">
      {/* Primary Navigation Hub */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          // If we navigate away from Upload, clear any active editing metadata
          if (view !== "upload") {
            setEditingMod(null);
          }
          setCurrentView(view);
        }}
        user={user}
        onSignOut={handleSignOut}
        onOpenAuth={() => setShowAuthOverlay(true)}
      />

      {/* Main Page Layout Wrapper */}
      <main className="flex-grow pt-8 max-w-7xl mx-auto w-full px-4">
        {currentView === "home" && (
          <HomeView
            user={user}
            setCurrentView={setCurrentView}
            onOpenAuth={() => setShowAuthOverlay(true)}
          />
        )}

        {currentView === "upload" && (
          <UploadView
            onUploadSuccess={() => {
              setEditingMod(null);
              setCurrentView("library");
            }}
            existingMod={editingMod || undefined}
          />
        )}

        {currentView === "library" && (
          <LibraryView
            user={user}
            onEditMod={handleEditModTrigger}
            onRefreshUser={handleRefreshUserBalances}
            onOpenAuth={() => setShowAuthOverlay(true)}
          />
        )}

        {currentView === "payout" && (
          <PayoutView
            user={user}
            onRefreshUser={handleRefreshUserBalances}
          />
        )}
      </main>

      {/* MODAL: AUTHENTICATION POPUP OVERLAY */}
      {showAuthOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-md bg-[#151D30] rounded-2xl border border-[#232F4C] overflow-hidden">
            {/* Close trigger button */}
            <button
              onClick={() => setShowAuthOverlay(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded bg-slate-950 border border-[#232F4C] cursor-pointer"
              title="Close Panel"
              id="close-auth-modal-overlay-btn"
            >
              <X className="w-4 h-4" />
            </button>
            <AuthView
              onAuthSuccess={handleAuthSuccess}
              onClose={() => setShowAuthOverlay(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

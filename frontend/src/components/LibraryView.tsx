import React, { useState } from "react";
import { Search, Gamepad2, Layers, Download, CheckCircle2, Edit3, Trash2, X, Filter } from "lucide-react";
import { Mod, UserProfile } from "../types";

interface LibraryViewProps {
  user: UserProfile | null;
  onEditMod: (mod: Mod) => void;
  onRefreshUser: () => void;
  onOpenAuth: () => void;
}

export default function LibraryView({ user, onEditMod, onRefreshUser, onOpenAuth }: LibraryViewProps) {
  const [mods, setMods] = useState<Mod[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [downloadSuccessLog, setDownloadSuccessLog] = useState<string | null>(null);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedGame("All");
    setSelectedPlatform("All");
  };

  const filteredMods = mods.filter((mod) => {
    const matchesSearch =
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGame = selectedGame === "All" || mod.gameName === selectedGame;
    const matchesPlatform = selectedPlatform === "All" || mod.platform === selectedPlatform;
    return matchesSearch && matchesGame && matchesPlatform;
  });

  const uniqueGames = ["All", ...Array.from(new Set(mods.map((m) => m.gameName)))];
  const platformsList = ["All", "PC", "Android", "iOS", "PlayStation", "Xbox"];

  const handleDeleteMod = (modId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this mod?")) {
      setMods(mods.filter(m => m.id !== modId));
      if (selectedMod?.id === modId) {
        setSelectedMod(null);
      }
    }
  };

  const handleDownloadMod = (mod: Mod) => {
    if (!user) {
      onOpenAuth();
      return;
    }
    setDownloadSuccessLog(`Successfully downloaded - ${mod.fileName}!`);
    setMods((old) =>
      old.map((m) => (m.id === mod.id ? { ...m, downloadsCount: m.downloadsCount + 1 } : m))
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 pb-12">
      {/* Banner/Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#12CFCE]" />
          Studio Mod Marketplace
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Filter, select, edit or download high performance mods safely. Clicking a mod card reveals extensive details, markdown installation files, and licensing.
        </p>
      </div>

      {/* Filter panel card */}
      <div className="bg-[#151D30] border border-[#232F4C] p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input bar */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search mods by name, game, features..."
            className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl py-2 pl-11 pr-4 text-sm text-white placeholder-slate-600 transition-all"
            id="market-search-bar"
          />
        </div>

        {/* Filters Group options */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-stretch sm:items-center">
          {/* Game filter dropdown */}
          <div className="flex items-center gap-2 bg-[#0B0F19] px-3 py-1.5 rounded-xl border border-[#232F4C] shrink-0">
            <Gamepad2 className="w-4 h-4 text-slate-500" />
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="bg-transparent text-xs text-white border-none focus:outline-none cursor-pointer"
              id="game-filter-dropdown"
            >
              {uniqueGames.map((game, idx) => (
                <option key={idx} value={game} className="bg-slate-950 text-white">
                  Game: {game}
                </option>
              ))}
            </select>
          </div>

          {/* Platform filter dropdown */}
          <div className="flex items-center gap-2 bg-[#0B0F19] px-3 py-1.5 rounded-xl border border-[#232F4C] shrink-0">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-transparent text-xs text-white border-none focus:outline-none cursor-pointer"
              id="platform-filter-dropdown"
            >
              {platformsList.map((plat, idx) => (
                <option key={idx} value={plat} className="bg-slate-950 text-white">
                  Platform: {plat}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#1B2945] hover:bg-[#1B2945]/80 text-white rounded-xl text-xs font-semibold cursor-pointer border border-[#232F4C]"
            id="refresh-mods-btn"
          >
            Reset list
          </button>
        </div>
      </div>

      {/* Mods Grid */}
      {filteredMods.length === 0 ? (
        <div className="text-center bg-[#151D30]/30 border border-[#232F4C] rounded-2xl p-12 space-y-4">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-400 text-sm">
            No game modifications cataloged matching the specified criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#1B2945] text-[#12CFCE] text-xs font-semibold rounded-lg hover:underline cursor-pointer"
          >
            Clear current query parameters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMods.map((mod) => (
            <div
              key={mod.id}
              onClick={() => setSelectedMod(mod)}
              className="bg-[#151D30] border border-[#232F4C] rounded-xl overflow-hidden hover:border-[#12CFCE] transition-all cursor-pointer group hover:shadow-lg hover:shadow-[#12CFCE]/10"
            >
              {/* Mod Card Image */}
              <div className="w-full h-40 bg-slate-950 overflow-hidden">
                <img
                  src={mod.screenshots[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80"}
                  alt={mod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2">{mod.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{mod.gameName}</p>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="bg-[#12CFCE]/10 text-[#12CFCE] px-2 py-1 rounded">
                    {mod.platform}
                  </span>
                  <span className="text-slate-400">{mod.version}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#232F4C]">
                  <div className="text-xs">
                    <p className="text-slate-400">Downloads</p>
                    <p className="text-white font-bold">{mod.downloadsCount}</p>
                  </div>
                  <div className="text-xs text-right">
                    <p className="text-slate-400">Price</p>
                    <p className="text-[#12CFCE] font-bold">
                      {mod.price === 0 ? "Free" : `$${mod.price}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILED MODAL */}
      {selectedMod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#151D30] rounded-2xl border border-[#232F4C] overflow-hidden max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#232F4C]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-[#12CFCE]/10 text-[#12CFCE] px-2.5 py-1 rounded border border-[#12CFCE]/20 uppercase">
                  {selectedMod.platform}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Version {selectedMod.version}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedMod(null);
                  setDownloadSuccessLog(null);
                }}
                className="p-1 px-2.5 text-slate-400 hover:text-white rounded bg-slate-950 border border-[#232F4C] cursor-pointer"
                id="close-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Screenshot */}
              <div className="w-full h-48 bg-slate-950 rounded-lg overflow-hidden">
                <img
                  src={selectedMod.screenshots[0] || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80"}
                  alt={selectedMod.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                  {selectedMod.title}
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                  <span>Game: <strong className="text-slate-200">{selectedMod.gameName}</strong></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Creator: <strong className="text-[#12CFCE]">{selectedMod.authorName}</strong></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Published: <strong className="text-slate-300">{new Date(selectedMod.createdAt).toLocaleDateString()}</strong></span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-[#232F4C] text-xs">
                <div>
                  <p className="text-slate-400">Downloads</p>
                  <p className="text-base font-bold text-white mt-1 font-mono">{selectedMod.downloadsCount}</p>
                </div>
                <div>
                  <p className="text-slate-400">File Size</p>
                  <p className="text-base font-bold text-white mt-1 font-mono">{selectedMod.fileSize}</p>
                </div>
                <div>
                  <p className="text-slate-400">Platform Fee</p>
                  <p className="text-base font-bold text-amber-400 mt-1 font-mono">${selectedMod.platformFee.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-slate-400">Total Earnings</p>
                  <p className="text-base font-bold text-emerald-400 mt-1 font-mono">${selectedMod.totalEarnings.toFixed(2)}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</h3>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-light bg-[#0B0F19]/60 p-4 rounded-xl border border-[#232F4C]/50">
                  {selectedMod.description}
                </div>
              </div>

              {/* Success notification */}
              {downloadSuccessLog && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{downloadSuccessLog}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 p-4 border-t border-[#232F4C] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Price:</span>
                <span className="text-lg font-mono font-bold text-[#12CFCE]">
                  {selectedMod.price === 0 ? "Free" : `$${selectedMod.price.toFixed(2)}`}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Edit/Delete for owner */}
                {user && selectedMod.authorId === user.uid && (
                  <div className="flex items-center gap-2 mr-2">
                    <button
                      onClick={() => {
                        onEditMod(selectedMod);
                        setSelectedMod(null);
                      }}
                      className="p-2 border border-[#232F4C] rounded-lg hover:border-slate-500 text-slate-300 hover:text-white transition-all cursor-pointer bg-[#151D30]"
                      title="Edit Mod"
                      id="edit-modal-btn"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteMod(selectedMod.id, e)}
                      className="p-2 border border-rose-950 text-rose-400 rounded-lg hover:bg-rose-500/10 transition-all cursor-pointer bg-[#151D30]"
                      title="Delete Mod"
                      id="delete-modal-btn"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDownloadMod(selectedMod)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-teal-400 to-[#12CFCE] hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl text-slate-950 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                  id="final-download-modal-btn"
                >
                  <Download className="w-4 h-4" />
                  {selectedMod.price === 0 ? "Download Free" : "Download"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

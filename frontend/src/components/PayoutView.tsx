import React, { useState } from "react";
import { Coins, PiggyBank, ArrowDownLeft, AlertCircle, CheckCircle2, XCircle, Clock, Calendar, ArrowRightLeft, Sparkles, Check, X, ShieldAlert, Award } from "lucide-react";
import { Payout, UserProfile } from "../types";

interface PayoutViewProps {
  user: UserProfile | null;
  onRefreshUser: () => void;
}

export default function PayoutView({ user, onRefreshUser }: PayoutViewProps) {
  const [upiId, setUpiId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [payoutsList, setPayoutsList] = useState<Payout[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user) return;

    if (!upiId || !withdrawAmount) {
      setErrorMsg("Please fill in UPI ID and amount");
      return;
    }

    const amountNum = parseFloat(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setErrorMsg("Amount must be greater than 0");
      return;
    }

    if (amountNum > user.withdrawableBalance) {
      setErrorMsg(`Insufficient balance. Max: $${user.withdrawableBalance.toFixed(2)}`);
      return;
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9.\-_]+$/;
    if (!upiRegex.test(upiId)) {
      setErrorMsg("Invalid UPI format (e.g., user@bank)");
      return;
    }

    setActionLoading(true);
    setTimeout(() => {
      setSuccessMsg("Withdrawal request submitted!");
      setWithdrawAmount("");
      setActionLoading(false);
    }, 1000);
  };

  const pendingPayouts = payoutsList.filter(p => p.status === "pending");

  return (
    <div className="space-y-10 max-w-7xl mx-auto px-4 pb-12">
      {/* Title Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-display font-black text-white tracking-tight flex items-center gap-2">
          <Coins className="w-6 h-6 text-[#12CFCE]" />
          Financial Settlement & Payouts
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl font-light">
          Monitor your cumulative gross earnings, pending clearances, cleared balances, and file instant withdrawals straight to your UPI handler.
        </p>
      </div>

      {user ? (
        <>
          {/* STATS TILES GRID ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="payout-stats-grid">
            {/* Tile 1: Total Revenue */}
            <div className="bg-[#151D30] border border-[#232F4C] p-5 rounded-2xl relative group hover:border-[#12CFCE]/20 transition-all">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-950 border border-[#232F4C] flex items-center justify-center text-[#12CFCE]">
                <Award className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Earnings</p>
                <p className="text-2xl font-display font-extrabold text-white tracking-tight font-mono">
                  ${user.totalEarnings.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-500">Gross lifetime developer share</p>
              </div>
            </div>

            {/* Tile 2: Cleared Balance / Withdrawable */}
            <div className="bg-[#151D30] border border-[#232F4C] p-5 rounded-2xl relative group hover:border-emerald-500/20 transition-all">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-950 border border-emerald-950 flex items-center justify-center text-emerald-400">
                <Coins className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Cleared Balance</p>
                <p className="text-2xl font-display font-extrabold text-emerald-400 tracking-tight font-mono">
                  ${user.withdrawableBalance.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-500">Available for instant UPI execution</p>
              </div>
            </div>

            {/* Tile 3: Pending Balance */}
            <div className="bg-[#151D30] border border-[#232F4C] p-5 rounded-2xl relative group hover:border-amber-500/20 transition-all">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-950 border border-amber-950 flex items-center justify-center text-amber-500">
                <PiggyBank className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-500 uppercase tracking-widest">Pending Balance</p>
                <p className="text-2xl font-display font-extrabold text-amber-500 tracking-tight font-mono">
                  ${user.pendingBalance.toFixed(2)}
                </p>
                <p className="text-[10px] text-slate-500">Inescrow awaiting release audits</p>
              </div>
            </div>

            {/* Tile 4: Total Downloads */}
            <div className="bg-[#151D30] border border-[#232F4C] p-5 rounded-2xl relative group hover:border-purple-500/20 transition-all">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-950 border border-purple-950 flex items-center justify-center text-purple-400">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Global Telemetry</p>
                <p className="text-2xl font-display font-extrabold text-white tracking-tight font-mono">
                  {totalDownloads} Downloads
                </p>
                <p className="text-[10px] text-slate-500">Cumulative file fetches logged</p>
              </div>
            </div>
          </div>

          {/* Feedback logs */}
          {(errorMsg || successMsg) && (
            <div className="space-y-2">
              {errorMsg && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl p-3.5 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3.5 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{successMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* CORE SECTION LAYOUT */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Withdrawal form card (1/3 columns) */}
            <div className="bg-[#151D30] border border-[#232F4C] rounded-2xl p-6 h-fit space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Coins className="w-4.5 h-4.5 text-[#12CFCE]" />
                  Initiate Liquidation
                </h3>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Funds are withdrawn instantly to your UPI addresses. Commission splits are checked server-side.
                </p>
              </div>

              <form onSubmit={handleWithdrawalRequest} className="space-y-4" id="upi-withdrawal-form">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">UPI Address URL</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. cybermo@okhdfcbank"
                    className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 transition-all font-mono"
                  />
                  <span className="text-[10px] text-slate-500 block leading-tight">Formatted as user@bank handle</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Withdrawal Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="1"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="e.g. 50.00"
                      className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl py-2.5 pl-7 pr-3 text-sm font-mono font-bold text-white transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 flex justify-between">
                    <span>Minimum: $1.00</span>
                    <button
                      type="button"
                      onClick={() => setWithdrawAmount(user.withdrawableBalance.toFixed(2))}
                      className="text-[#12CFCE] hover:underline"
                    >
                      Withdraw Maximum
                    </button>
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading || user.withdrawableBalance < 1}
                  className="w-full py-2.5 bg-gradient-to-r from-[#12CFCE] to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  id="submit-payout-btn"
                >
                  {actionLoading ? "Processing..." : "Submit UPI Withdrawal"}
                </button>
              </form>
            </div>

            {/* Withdrawal records table (2/3 columns) */}
            <div className="bg-[#151D30] border border-[#232F4C] rounded-2xl p-6 lg:col-span-2 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                    <ArrowRightLeft className="w-4.5 h-4.5 text-[#12CFCE]" />
                    Settlement Registries History
                  </h3>
                  <p className="text-xs text-slate-400 font-light leading-relaxed">
                    A list of withdrawal disbursements registered to this account.
                  </p>
                </div>
                <div className="text-xs font-mono bg-slate-950 border border-[#232F4C] px-3 py-1.5 rounded-lg text-slate-400">
                  Total logged: {payoutsList.length}
                </div>
              </div>

              {loading ? (
                <div className="py-20 text-center text-xs text-slate-500 font-mono uppercase animate-pulse">
                  Querying clearing balances...
                </div>
              ) : payoutsList.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-sm bg-slate-950/40 rounded-xl border border-[#232F4C]/50">
                  No payout history entries found for this account.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#232F4C] text-slate-500 font-mono uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-2">Settlement Date</th>
                        <th className="py-3 px-2">Target UPI ID</th>
                        <th className="py-3 px-2">Disbursed Val</th>
                        <th className="py-3 px-2 text-right">Settlement Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payoutsList.map((p) => {
                        // Choose badge colors based on status
                        let badgeStyle = "bg-amber-500/10 border border-amber-500/20 text-amber-400";
                        if (p.status === "approved") {
                          badgeStyle = "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400";
                        } else if (p.status === "rejected") {
                          badgeStyle = "bg-rose-500/10 border border-rose-500/20 text-rose-400";
                        }
                        return (
                          <tr key={p.id} className="border-b border-[#232F4C]/60 hover:bg-[#1B2945]/20 transition-all font-sans">
                            <td className="py-3 px-2 text-slate-300">
                              <span className="flex items-center gap-1.5 text-[11px]">
                                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                {new Date(p.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3 px-2 font-mono text-[11px] text-[#12CFCE]">{p.upiId}</td>
                            <td className="py-3 px-2 text-white font-mono font-bold text-[11px]">${p.amount.toFixed(2)}</td>
                            <td className="py-3 px-2 text-right">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badgeStyle}`}>
                                {p.status === "pending" && <Clock className="w-3 h-3" />}
                                {p.status === "approved" && <CheckCircle2 className="w-3 h-3" />}
                                {p.status === "rejected" && <XCircle className="w-3 h-3" />}
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* SANDBOX MOCK ADMIN SIMULATOR (Brilliant developer panel!) */}
          {pendingPayouts.length > 0 && (
            <div className="bg-[#12CFCE]/5 border-2 border-dashed border-[#12CFCE]/20 rounded-2xl p-6 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[110px] h-[110px] bg-[#12CFCE]/5 rounded-full blur-2xl" />
              
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4.5 h-4.5 text-[#12CFCE] animate-pulse" />
                  Developer Playground (Sync Administrative Clearing Actions)
                </h4>
                <p className="text-xs text-slate-400">
                  Because ModMarket settlements require administrative audit releases, this sandbox widget lets you act as the auditor to instantly **Approve** or **Reject** pending payouts for live simulation testing!
                </p>
              </div>

              <div className="space-y-2.5">
                {pendingPayouts.map((p) => (
                  <div key={p.id} className="bg-slate-950 p-4 rounded-xl border border-[#232F4C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-xs">
                      <p className="text-slate-200">
                        Withdrawal: <strong className="text-white font-mono font-bold">${p.amount.toFixed(2)}</strong> to <span className="font-mono text-[#12CFCE]">{p.upiId}</span>
                      </p>
                      <p className="text-[10px] text-slate-500">Receipt ID: {p.id} • Registered {new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleSandboxApproveReject(p.id, "approved")}
                        className="flex-1 sm:flex-initial px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                        title="Mock Approve"
                      >
                        <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3px]" />
                        Approve Settlement
                      </button>
                      <button
                        onClick={() => handleSandboxApproveReject(p.id, "rejected")}
                        className="flex-1 sm:flex-initial px-4 py-1.5 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1 cursor-pointer"
                        title="Mock Reject"
                      >
                        <X className="w-3.5 h-3.5 text-slate-950 stroke-[3px]" />
                        Reject & Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-[#151D30] border border-[#232F4C] p-6 text-center rounded-2xl">
          <p className="text-slate-400">Please authenticate to access payout dashboard.</p>
        </div>
      )}
    </div>
  );
}

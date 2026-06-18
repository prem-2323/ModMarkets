import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, Sparkles, FileText, BadgeDollarSign, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Mod, PlatformType } from "../types";

interface UploadViewProps {
  onUploadSuccess: () => void;
  existingMod?: Mod;
}

export default function UploadView({ onUploadSuccess, existingMod }: UploadViewProps) {
  const [title, setTitle] = useState(existingMod?.title || "");
  const [gameName, setGameName] = useState(existingMod?.gameName || "");
  const [version, setVersion] = useState(existingMod?.version || "v1.0.0");
  const [platform, setPlatform] = useState<PlatformType>(existingMod?.platform || "PC");
  const [price, setPrice] = useState<string>(existingMod?.price?.toString() || "0");
  const [description, setDescription] = useState(existingMod?.description || "");

  const [modFile, setModFile] = useState<{ name: string; size: string; content?: string } | null>(
    existingMod ? { name: existingMod.fileName, size: existingMod.fileSize } : null
  );
  const [screenshot1, setScreenshot1] = useState<string>(existingMod?.screenshots[0] || "");
  const [screenshot2, setScreenshot2] = useState<string>(existingMod?.screenshots[1] || "");
  const [screenshot3, setScreenshot3] = useState<string>(existingMod?.screenshots[2] || "");

  const [isDragOverFile, setIsDragOverFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const ss1InputRef = useRef<HTMLInputElement>(null);
  const ss2InputRef = useRef<HTMLInputElement>(null);
  const ss3InputRef = useRef<HTMLInputElement>(null);

  const numericPrice = parseFloat(price) || 0;
  const computedPlatformFee = (numericPrice * 0.05).toFixed(2);
  const creatorPayoutShare = (numericPrice * 0.95).toFixed(2);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 1;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleModFileChange = async (file: File) => {
    if (!file) return;
    const formattedSize = formatBytes(file.size);
    try {
      const content = await toBase64(file);
      setModFile({
        name: file.name,
        size: formattedSize,
        content
      });
      setErrorMsg("");
    } catch {
      setModFile({ name: file.name, size: formattedSize });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverFile(true);
  };

  const handleDragLeave = () => {
    setIsDragOverFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleModFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleScreenshotChange = async (file: File, setter: (val: string) => void) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload a valid image file");
      return;
    }
    try {
      const base64 = await toBase64(file);
      setter(base64);
      setErrorMsg("");
    } catch {
      setErrorMsg("Failed to parse image file");
    }
  };

  const executeFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccess(false);

    if (!title || !gameName || !version || !platform) {
      setErrorMsg("Please fill in all required fields");
      return;
    }

    if (!modFile) {
      setErrorMsg("Please upload a mod file");
      return;
    }

    // Simulate upload progress
    setUploadProgress(5);
    const interval = setInterval(() => {
      setUploadProgress((old) => {
        if (old === null) return null;
        if (old >= 95) {
          clearInterval(interval);
          return 95;
        }
        const step = Math.floor(Math.random() * 15) + 5;
        return old + step;
      });
    }, 150);

    try {
      setUploadProgress(100);
      setTimeout(() => {
        clearInterval(interval);
        setSuccess(true);
        setUploadProgress(null);
        setTimeout(() => {
          onUploadSuccess();
        }, 1200);
      }, 500);
    } catch (err: any) {
      clearInterval(interval);
      setUploadProgress(null);
      setErrorMsg(err.message || "Upload failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-12">
      <div className="bg-[#151D30] rounded-2xl border border-[#232F4C] overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/40 to-slate-950 p-6 border-b border-[#232F4C] flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5.5 h-5.5 text-[#12CFCE]" />
              {existingMod ? "Revising Mod Metadata" : "Distribute New Game Mod"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light">
              Submit accurate version tags, compatible platform profiles, and set your premium prices.
            </p>
          </div>
          <div className="hidden sm:block text-xs bg-[#1B2945] border border-[#12CFCE]/30 text-[#12CFCE] px-3 py-1.5 rounded-full font-mono font-semibold">
            Service Charge: 5.0%
          </div>
        </div>

        {/* Feedback Messages */}
        <div className="px-6 sm:px-8 pt-6">
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-start gap-3 text-xs text-rose-300">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-300 animate-pulse">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>
                {existingMod
                  ? "Mod patch finalized successfully! Redirecting..."
                  : "Mod package submitted and verified successfully! Redirecting..."}
              </span>
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={executeFormSubmit} className="p-6 sm:p-8 space-y-8" id="mod-upload-form">
          {/* Section 1: General Details */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#12CFCE] tracking-wider uppercase border-b border-[#232F4C] pb-2">
              1. Mod Nomenclature & Catalog Profile
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Mod Title <strong className="text-[#12CFCE]">*</strong></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ray Tracing Ray-Reconstruction Overhaul"
                  className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Target Game Name <strong className="text-[#12CFCE]">*</strong></label>
                <input
                  type="text"
                  required
                  value={gameName}
                  onChange={(e) => setGameName(e.target.value)}
                  placeholder="e.g. Cyberpunk 2077, GTA V"
                  className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Mod Version <strong className="text-[#12CFCE]">*</strong></label>
                <input
                  type="text"
                  required
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="v1.0.0-b2"
                  className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all font-sans font-medium font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-400">Compatible Platform <strong className="text-[#12CFCE]">*</strong></label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as PlatformType)}
                  className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white transition-all font-sans font-medium"
                >
                  <option value="PC">PC (Windows / Linux)</option>
                  <option value="Android">Android</option>
                  <option value="iOS">iOS</option>
                  <option value="PlayStation">PlayStation Network (PS4 / PS5)</option>
                  <option value="Xbox">Xbox Live Network</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: File Upload (Supports Drag and Drop + click) */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#12CFCE] tracking-wider uppercase border-b border-[#232F4C] pb-2">
              2. Package File Payload
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400">
                Main Mod Binary File (.zip, .jar, .pak) <strong className="text-[#12CFCE]">*</strong>
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOverFile
                    ? "border-[#12CFCE] bg-[#12CFCE]/5 shadow-[0_0_15px_rgba(18,207,206,0.1)]"
                    : modFile
                    ? "border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500/60"
                    : "border-[#232F4C] hover:border-slate-500 hover:bg-[#151D30]"
                }`}
                id="drag-drop-zone-wrapper"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleModFileChange(e.target.files[0])}
                  className="hidden"
                  id="actual-mod-file-picker"
                />

                <div className={`p-4 rounded-xl ${modFile ? "bg-emerald-950/40 border border-emerald-500/20 text-emerald-400" : "bg-slate-950 text-slate-500 border border-[#232F4C]"}`}>
                  <Upload className="w-7 h-7" />
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    {modFile ? modFile.name : "Drag & Drop or Click to Upload Mod File"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {modFile
                      ? `Size cataloged: ${modFile.size}`
                      : "Supports ZIP, JAR, ESP, PAK archives up to 50MB"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Screenshots and description */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#12CFCE] tracking-wider uppercase border-b border-[#232F4C] pb-2">
              3. Visual Presentation Gallery
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 mb-1 block">
                Up to 3 Screenshots (PNG, JPG, WEBP)
              </label>

              <div className="grid sm:grid-cols-3 gap-4">
                {/* Image 1 */}
                <div className="space-y-2">
                  <div
                    onClick={() => ss1InputRef.current?.click()}
                    className="aspect-video bg-slate-950 rounded-xl border border-[#232F4C] hover:border-slate-500 transition-all cursor-pointer flex flex-col items-center justify-center p-2 relative overflow-hidden group"
                  >
                    <input
                      type="file"
                      ref={ss1InputRef}
                      onChange={(e) => e.target.files?.[0] && handleScreenshotChange(e.target.files[0], setScreenshot1)}
                      className="hidden"
                      accept="image/*"
                    />
                    {screenshot1 ? (
                      <>
                        <img src={screenshot1} className="w-full h-full object-cover rounded-lg" alt="Thumbnail 1" />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs text-[#12CFCE] font-bold">
                          Replace Screenshot 1
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1 text-slate-500 py-4">
                        <ImageIcon className="w-5 h-5 mx-auto" />
                        <span className="text-[11px] block">Upload Screenshot 1</span>
                      </div>
                    )}
                  </div>
                  {screenshot1 && (
                    <button
                      type="button"
                      onClick={() => setScreenshot1("")}
                      className="text-[10px] text-rose-400 hover:underline block text-right w-full cursor-pointer"
                    >
                      Remove Thumbnail
                    </button>
                  )}
                </div>

                {/* Image 2 */}
                <div className="space-y-2">
                  <div
                    onClick={() => ss2InputRef.current?.click()}
                    className="aspect-video bg-slate-950 rounded-xl border border-[#232F4C] hover:border-slate-500 transition-all cursor-pointer flex flex-col items-center justify-center p-2 relative overflow-hidden group"
                  >
                    <input
                      type="file"
                      ref={ss2InputRef}
                      onChange={(e) => e.target.files?.[0] && handleScreenshotChange(e.target.files[0], setScreenshot2)}
                      className="hidden"
                      accept="image/*"
                    />
                    {screenshot2 ? (
                      <>
                        <img src={screenshot2} className="w-full h-full object-cover rounded-lg" alt="Thumbnail 2" />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs text-[#12CFCE] font-bold">
                          Replace Screenshot 2
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1 text-slate-500 py-4">
                        <ImageIcon className="w-5 h-5 mx-auto" />
                        <span className="text-[11px] block">Upload Screenshot 2</span>
                      </div>
                    )}
                  </div>
                  {screenshot2 && (
                    <button
                      type="button"
                      onClick={() => setScreenshot2("")}
                      className="text-[10px] text-rose-400 hover:underline block text-right w-full cursor-pointer"
                    >
                      Remove Thumbnail
                    </button>
                  )}
                </div>

                {/* Image 3 */}
                <div className="space-y-2">
                  <div
                    onClick={() => ss3InputRef.current?.click()}
                    className="aspect-video bg-slate-950 rounded-xl border border-[#232F4C] hover:border-slate-500 transition-all cursor-pointer flex flex-col items-center justify-center p-2 relative overflow-hidden group"
                  >
                    <input
                      type="file"
                      ref={ss3InputRef}
                      onChange={(e) => e.target.files?.[0] && handleScreenshotChange(e.target.files[0], setScreenshot3)}
                      className="hidden"
                      accept="image/*"
                    />
                    {screenshot3 ? (
                      <>
                        <img src={screenshot3} className="w-full h-full object-cover rounded-lg" alt="Thumbnail 3" />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs text-[#12CFCE] font-bold">
                          Replace Screenshot 3
                        </div>
                      </>
                    ) : (
                      <div className="text-center space-y-1 text-slate-500 py-4">
                        <ImageIcon className="w-5 h-5 mx-auto" />
                        <span className="text-[11px] block">Upload Screenshot 3</span>
                      </div>
                    )}
                  </div>
                  {screenshot3 && (
                    <button
                      type="button"
                      onClick={() => setScreenshot3("")}
                      className="text-[10px] text-rose-400 hover:underline block text-right w-full cursor-pointer"
                    >
                      Remove Thumbnail
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-1 pt-2">
              <label className="text-xs font-semibold text-slate-400">Detailed Description (Supports Markdown)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Detail full features, installations instructions, key modifications and hardware impact of your mod..."
                className="w-full bg-[#0B0F19] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 transition-all font-sans font-light leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Monetary pricing details with auto fee calculations */}
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-[#12CFCE] tracking-wider uppercase border-b border-[#232F4C] pb-2">
              4. Pricing Tier Configuration
            </h2>

            <div className="grid sm:grid-cols-3 gap-6 bg-[#0B0F19] p-4 sm:p-5 rounded-2xl border border-[#232F4C]">
              {/* Mod price input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                  <BadgeDollarSign className="w-4 h-4 text-[#12CFCE]" />
                  Your Mod Price (USD) <strong className="text-[#12CFCE]">*</strong>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono font-bold">$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-[#151D30] border border-[#232F4C] focus:border-[#12CFCE] focus:outline-none rounded-lg py-2 pl-7 pr-3 text-sm font-mono font-bold text-white transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Insert 0 for free download</p>
              </div>

              {/* Platform Service Charge (Read-Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Platform Commission (Fixed 5%)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono font-bold">$</span>
                  <input
                    type="text"
                    readOnly
                    value={computedPlatformFee}
                    className="w-full bg-[#151D30]/40 border border-[#232F4C]/50 rounded-lg py-2 pl-7 pr-3 text-sm font-mono font-bold text-[#12CFCE] focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Fixed rate across all mods</p>
              </div>

              {/* Creator split payout (Read-Only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">
                  Your Net Earnings Share (95%)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-500 font-mono font-bold">$</span>
                  <input
                    type="text"
                    readOnly
                    value={creatorPayoutShare}
                    className="w-full bg-emerald-950/20 border border-emerald-900/30 rounded-lg py-2 pl-7 pr-3 text-sm font-mono font-bold text-emerald-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] text-slate-500">Acquired balance to payout</p>
              </div>
            </div>
          </div>

          {/* Progress bar panel */}
          {uploadProgress !== null && (
            <div className="space-y-2 bg-[#0B0F19] border border-[#232F4C] p-4 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#12CFCE] animate-ping" />
                  Uploading cryptographic bundle packages...
                </span>
                <span className="font-mono font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-[#2F3C56]">
                <div
                  className="bg-gradient-to-r from-[#12CFCE] to-teal-400 h-full transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#232F4C]">
            <button
              type="button"
              onClick={onUploadSuccess}
              className="px-5 py-2.5 bg-[#151D30] hover:bg-[#232F4C] text-slate-300 font-medium rounded-xl text-sm border border-[#232F4C] transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploadProgress !== null}
              className="px-8 py-2.5 bg-gradient-to-r from-[#12CFCE] to-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer"
              id="upload-submit-final-btn"
            >
              {existingMod ? "Revise Mod Patch" : "Catalog Mod Package"}
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

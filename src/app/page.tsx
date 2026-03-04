"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ResultCard from "@/components/ResultCard";
import { Sparkles, Loader2, Target, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/components/Toast";
import { cn } from "@/components/Toast";

type Tone = "Professional" | "Casual" | "Bold";

export default function Home() {
  const [aboutText, setAboutText] = useState("");
  const [tone, setTone] = useState<Tone>("Professional");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkQueue, setBulkQueue] = useState({ total: 0, completed: 0 });
  const [bulkResults, setBulkResults] = useState<any[]>([]);

  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!aboutText.trim()) {
      toast("Please enter a LinkedIn About section", "error");
      return;
    }

    const bio = localStorage.getItem("lw_company_bio") || "";
    const safety = localStorage.getItem("lw_safety_check") === "true";

    if (isBulkMode) {
      const leads = aboutText.split("---").map(t => t.trim()).filter(t => t.length > 10);
      if (leads.length === 0) {
        toast("No valid leads found. Separate with '---'", "error");
        return;
      }

      setIsLoading(true);
      setBulkQueue({ total: leads.length, completed: 0 });
      setBulkResults([]);
      setResult(null);

      const results = [];
      for (let i = 0; i < leads.length; i++) {
        try {
          const res = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ aboutText: leads[i], tone, companyBio: bio, safetyCheck: safety }),
          });
          if (!res.ok) throw new Error("API Error");
          const data = await res.json();
          results.push({ ...data, originalText: leads[i].substring(0, 40) + "..." });
        } catch (error) {
          results.push({ error: true, originalText: leads[i].substring(0, 40) + "..." });
        }
        setBulkQueue({ total: leads.length, completed: i + 1 });
        setBulkResults([...results]);
      }
      setIsLoading(false);
      toast(`Processed ${leads.length} leads!`, "success");

    } else {
      setIsLoading(true);
      setResult(null);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            aboutText,
            tone,
            companyBio: bio,
            safetyCheck: safety
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to analyze profile");
        }

        setResult(data);
        toast("Omni-channel analysis complete!", "success");
      } catch (error: any) {
        toast(error.message || "An unexpected error occurred", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const tones: Tone[] = ["Professional", "Casual", "Bold"];

  return (
    <div className="flex min-h-screen bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <Sidebar />

      <main className="flex-1 ml-64 p-8 md:p-12 relative z-10 w-full overflow-y-auto max-h-screen">
        <div className="max-w-4xl mx-auto pb-20">
          <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70 mb-4 shadow-sm">
              <Target size={14} className="text-primary" />
              <span>Multi-Channel SDR Suite</span>
            </div>
            <h2 className="text-4xl font-bold mb-3 tracking-tight">New Campaign</h2>
            <p className="text-white/50 text-lg">Analyze a prospect's LinkedIn profile to generate hyper-personalized outreach across all channels.</p>
          </header>

          <div className="space-y-8">
            <div className="glass-panel p-1 rounded-2xl animate-in fade-in zoom-in-95 duration-500 delay-100 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
              <div className="bg-black/40 rounded-xl p-6 flex flex-col gap-6">

                {/* Tone Selector */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div className="flex items-center gap-2 text-white/80">
                    <SlidersHorizontal size={18} className="text-primary" />
                    <span className="font-semibold uppercase tracking-wide text-sm">Outreach Tone</span>
                  </div>

                  <div className="flex bg-black/50 p-1.5 rounded-xl border border-white/5 shadow-inner">
                    {tones.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTone(t)}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                          tone === t
                            ? "bg-white/10 text-white shadow-md border border-white/10"
                            : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-white/80 uppercase tracking-wide flex justify-between items-center w-full">
                    <span>{isBulkMode ? "Paste Bulk LinkedIn 'About' Sections" : "Paste LinkedIn 'About' Section"}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white/50 lowercase tracking-normal">Bulk Mode</span>
                      <div
                        className={cn(
                          "w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors relative",
                          isBulkMode ? "bg-primary" : "bg-white/20"
                        )}
                        onClick={() => setIsBulkMode(!isBulkMode)}
                      >
                        <div
                          className={cn(
                            "bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 absolute top-0.5",
                            isBulkMode ? "translate-x-5" : "translate-x-0"
                          )}
                        />
                      </div>
                    </div>
                  </label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder={isBulkMode ? "Paste multiple sections, separating each lead with '---' \n\ne.g.\nLead 1 bio...\n---\nLead 2 bio..." : "e.g. Passionate software engineer with 10 years of experience building scalable systems..."}
                    className="w-full h-40 bg-black/60 border border-white/10 rounded-xl p-5 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none shadow-inner text-sm leading-relaxed"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleAnalyze}
                    disabled={isLoading || !aboutText.trim()}
                    className="flex items-center gap-2 px-8 py-3.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary disabled:cursor-not-allowed text-primary-foreground font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] active:scale-95 group"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} className="group-hover:text-yellow-200 transition-colors" />}
                    {isLoading ? "Analyzing Profile..." : "Generate Magic"}
                  </button>
                </div>
              </div>
            </div>

            {isLoading && isBulkMode && bulkQueue.total > 0 && (
              <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>Processing Queue</span>
                  <span className="text-primary">{bulkQueue.completed} / {bulkQueue.total} processed</span>
                </div>
                <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                  <div className="h-full bg-primary transition-all duration-300 relative" style={{ width: `${(bulkQueue.completed / bulkQueue.total) * 100}%` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            )}

            {isBulkMode ? (
              <div className="flex flex-col gap-8">
                {bulkResults.map((res: any, idx: number) => (
                  <div key={idx} className="flex flex-col gap-3 relative before:absolute before:inset-0 before:-z-10 before:bg-white/5 before:blur-xl before:rounded-3xl">
                    <div className="text-xs font-semibold text-white/50 px-3 py-1.5 bg-black/40 rounded-lg self-start border border-white/10 shadow-sm flex items-center gap-2">
                      <span className="text-primary">Lead {idx + 1}</span>
                      <span className="opacity-50">|</span>
                      <span>{res.originalText}</span>
                    </div>
                    {res.error ? (
                      <div className="text-red-400/80 p-5 glass rounded-xl border border-red-500/20 bg-red-500/5 text-sm">Failed to process this lead. Skipped.</div>
                    ) : (
                      <ResultCard data={res} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              result && (
                <div className="pt-2">
                  <ResultCard data={result} />
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

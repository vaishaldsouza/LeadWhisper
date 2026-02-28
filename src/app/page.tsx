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
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!aboutText.trim()) {
      toast("Please enter a LinkedIn About section", "error");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const bio = localStorage.getItem("lw_company_bio") || "";
      const safety = localStorage.getItem("lw_safety_check") === "true";

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

                {/* Input Area */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-semibold text-white/80 uppercase tracking-wide">
                    Paste LinkedIn 'About' Section
                  </label>
                  <textarea
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="e.g. Passionate software engineer with 10 years of experience building scalable systems..."
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

            {result && (
              <div className="pt-2">
                <ResultCard data={result} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

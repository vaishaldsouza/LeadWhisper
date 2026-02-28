"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { User, Volume2, ShieldCheck, Mail, CheckCircle2, Save } from "lucide-react";
import { cn } from "@/components/Toast";
import { useToast } from "@/components/Toast";

type SettingSection = "account" | "voice" | "deliverability";

export default function SettingsPage() {
    const [activeSection, setActiveSection] = useState<SettingSection>("voice");
    const { toast } = useToast();

    // Local state for settings
    const [companyBio, setCompanyBio] = useState("");
    const [safetyEnabled, setSafetyEnabled] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Load from local storage
    useEffect(() => {
        const savedBio = localStorage.getItem("lw_company_bio");
        const savedSafety = localStorage.getItem("lw_safety_check");
        if (savedBio) setCompanyBio(savedBio);
        if (savedSafety !== null) setSafetyEnabled(savedSafety === "true");
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        localStorage.setItem("lw_company_bio", companyBio);
        localStorage.setItem("lw_safety_check", safetyEnabled.toString());

        setTimeout(() => {
            setIsSaving(false);
            toast("Settings saved successfully", "success");
        }, 600);
    };

    const sections = [
        { id: "account", label: "Account Profile", icon: User },
        { id: "voice", label: "AI Voice & Persona", icon: Volume2 },
        { id: "deliverability", label: "Deliverability", icon: ShieldCheck },
    ] as const;

    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <Sidebar />

            <main className="flex-1 ml-64 p-8 md:p-12 relative z-10 w-full overflow-y-auto max-h-screen">
                <div className="max-w-5xl mx-auto space-y-8 pb-10">

                    <header className="animate-in fade-in slide-in-from-top-4 duration-500">
                        <h2 className="text-4xl font-bold mb-2 tracking-tight">Settings</h2>
                        <p className="text-white/50 text-lg">Manage your account, AI preferences, and deliverability safety.</p>
                    </header>

                    <div className="flex flex-col md:flex-row gap-8 animate-in fade-in zoom-in-95 duration-500 delay-100">
                        {/* Settings Sidebar */}
                        <aside className="md:w-64 flex-shrink-0 flex flex-col gap-2">
                            {sections.map(sec => {
                                const Icon = sec.icon;
                                const isActive = activeSection === sec.id;
                                return (
                                    <button
                                        key={sec.id}
                                        onClick={() => setActiveSection(sec.id)}
                                        className={cn(
                                            "flex items-center justify-between px-4 py-3 rounded-xl transition-all w-full text-left",
                                            isActive
                                                ? "glass bg-white/10 text-white font-medium shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                                                : "text-white/50 hover:bg-white/5 hover:text-white"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon size={18} className={cn(isActive && "text-primary")} />
                                            {sec.label}
                                        </div>
                                    </button>
                                )
                            })}
                        </aside>

                        {/* Settings Content */}
                        <div className="flex-1 glass-panel rounded-2xl p-8 min-h-[500px]">
                            {activeSection === "account" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <h3 className="text-xl font-bold border-b border-white/10 pb-4">Account Profile</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-2xl font-bold shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                                            JD
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg text-white">John Doe</h4>
                                            <p className="text-white/50 text-sm">john@example.com</p>
                                            <button className="mt-2 text-xs px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10 text-white/80">
                                                Change Avatar
                                            </button>
                                        </div>
                                    </div>
                                    {/* Additional form fields would go here */}
                                </div>
                            )}

                            {activeSection === "voice" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                                    <div>
                                        <h3 className="text-xl font-bold pb-2">AI Voice & Persona</h3>
                                        <p className="text-white/50 text-sm mb-6">Train LeadWhisper AI to speak in your company's tone. This context is injected into every campaign.</p>
                                    </div>

                                    <div className="flex-1 flex flex-col gap-3">
                                        <label className="text-sm font-semibold text-white/80 flex justify-between items-center">
                                            <span>My Company Bio</span>
                                            <span className="text-xs text-white/40 font-normal">{companyBio.length} / 500 chars</span>
                                        </label>
                                        <textarea
                                            value={companyBio}
                                            onChange={(e) => setCompanyBio(e.target.value)}
                                            placeholder="e.g. We are a B2B SaaS company that helps engineering teams reduce deployment times by 40% through AI-driven CI/CD orchestration..."
                                            className="w-full flex-1 min-h-[200px] bg-black/40 border border-white/10 rounded-xl p-5 text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none shadow-inner"
                                            maxLength={500}
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end border-t border-white/10">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary font-semibold rounded-xl transition-all border border-primary/30 hover:border-primary/50"
                                        >
                                            {isSaving ? <span className="animate-spin text-lg">↻</span> : <Save size={16} />}
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeSection === "deliverability" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full flex flex-col">
                                    <div>
                                        <h3 className="text-xl font-bold pb-2">Deliverability & Safety</h3>
                                        <p className="text-white/50 text-sm mb-6">Protect your domain reputation and ensure your outreach hits the primary inbox.</p>
                                    </div>

                                    <div className="bg-black/30 p-5 rounded-xl border border-white/5 flex items-start gap-4">
                                        <div className={cn(
                                            "p-3 rounded-full shrink-0 transition-colors",
                                            safetyEnabled ? "bg-green-500/10 text-green-400" : "bg-white/5 text-white/40"
                                        )}>
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <h4 className="font-medium text-white">Auto-check for Spammy Language</h4>

                                                {/* Custom Toggle Switch */}
                                                <div
                                                    className={cn(
                                                        "w-11 h-6 rounded-full p-1 cursor-pointer transition-colors relative",
                                                        safetyEnabled ? "bg-primary" : "bg-white/20"
                                                    )}
                                                    onClick={() => setSafetyEnabled(!safetyEnabled)}
                                                >
                                                    <div
                                                        className={cn(
                                                            "bg-white w-4 h-4 rounded-full shadow-md transition-transform duration-300 absolute top-1",
                                                            safetyEnabled ? "translate-x-5" : "translate-x-0"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-sm text-white/50 leading-relaxed mt-2">
                                                When enabled, LeadWhisper AI will automatically filter out common spam trigger words (e.g. "free", "urgent", "guarantee") from the final generated email copy to maximize inbox placement.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-4 flex justify-end border-t border-white/10">
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-primary/20 hover:bg-primary/30 text-primary font-semibold rounded-xl transition-all border border-primary/30 hover:border-primary/50"
                                        >
                                            {isSaving ? <span className="animate-spin text-lg">↻</span> : <Save size={16} />}
                                            Save Preferences
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

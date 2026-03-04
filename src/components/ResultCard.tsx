import { Copy, CheckCircle2, Mail, Linkedin, Twitter, Phone, Fingerprint, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "./Toast";
import { cn } from "./Toast";

interface ResultCardProps {
    data: {
        buyerPersona: string;
        intelligenceSignal: string;
        spamScore: number;
        painPoints: string[];
        companyContext: string;
        outreach: {
            email: {
                subject: string;
                body: string;
            };
            linkedIn: {
                inMail: string;
            };
            twitter: {
                dm: string;
            };
            coldCall: {
                hook: string;
                objectionTips: string[];
            };
        };
    };
}

type Channel = "email" | "linkedin" | "twitter" | "phone";

export default function ResultCard({ data }: ResultCardProps) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<Channel>("email");

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast("Copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: "email", label: "Email", icon: Mail },
        { id: "linkedin", label: "LinkedIn", icon: Linkedin },
        { id: "twitter", label: "Twitter", icon: Twitter },
        { id: "phone", label: "Cold Call", icon: Phone },
    ] as const;

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Persona Badge Section */}
            <div className="flex items-center">
                <div className="glass px-4 py-2.5 rounded-xl flex items-center gap-2.5 relative group cursor-help border border-primary/20 bg-primary/5 shadow-sm">
                    <Fingerprint size={16} className="text-primary" />
                    <span className="text-sm font-semibold text-white/90">{data.buyerPersona} Persona</span>
                    <span className="flex h-2 w-2 rounded-full bg-primary/50"></span>

                    {/* Tooltip */}
                    <div className="absolute top-full left-0 mt-3 w-72 p-4 glass-panel rounded-xl text-xs text-white/80 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 shadow-xl border-primary/20">
                        <span className="font-semibold text-primary mb-1 block">Intelligence Signal</span>
                        {data.intelligenceSignal}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass p-5 rounded-2xl flex flex-col gap-3 card-hover transition-all">
                    <h3 className="text-primary font-semibold text-sm uppercase tracking-wider flex items-center gap-2">
                        Identified Pain Points
                    </h3>
                    <ul className="space-y-2">
                        {data.painPoints?.map((pt: string, i: number) => (
                            <li key={i} className="flex gap-3 text-white/80 text-sm">
                                <span className="text-primary/70 mt-0.5">•</span>
                                <span>{pt}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="glass p-5 rounded-2xl flex flex-col gap-3 card-hover transition-all">
                    <h3 className="text-primary font-semibold text-sm uppercase tracking-wider">
                        Company & Persona Context
                    </h3>
                    <p className="text-white/80 text-sm leading-relaxed">{data.companyContext}</p>
                </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden">
                {/* Glow effect slightly behind */}
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-4">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        Multi-Channel Outreach
                    </h3>

                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shadow-inner">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as Channel)}
                                    className={cn(
                                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300",
                                        activeTab === tab.id
                                            ? "bg-primary/20 text-primary shadow-[0_0_10px_rgba(139,92,246,0.3)] border border-primary/30"
                                            : "text-white/50 hover:bg-white/5 hover:text-white/80 border border-transparent"
                                    )}
                                >
                                    <Icon size={14} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {activeTab === "email" && (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <div className="text-sm flex flex-col sm:flex-row sm:items-center gap-3">
                                <div>
                                    <span className="text-white/40">Subject: </span>
                                    <span className="text-white font-medium">{data.outreach.email.subject}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/10" title="Deliverability Score">
                                    <ShieldCheck size={14} className={cn(
                                        data.spamScore > 80 ? "text-green-400" :
                                            data.spamScore >= 50 ? "text-yellow-400" : "text-red-400"
                                    )} />
                                    <span className={cn("text-xs font-semibold",
                                        data.spamScore > 80 ? "text-green-400" :
                                            data.spamScore >= 50 ? "text-yellow-400" : "text-red-400"
                                    )}>{data.spamScore}/100</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleCopy(`Subject: ${data.outreach.email.subject}\n\n${data.outreach.email.body}`)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-all btn-glow"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-white/60" />}
                                {copied ? <span className="text-green-400">Copied</span> : <span className="text-white/80">Copy Email</span>}
                            </button>
                        </div>
                        <div className="bg-black/30 p-5 rounded-xl border border-white/5 font-mono text-sm inline-block text-white/80 whitespace-pre-wrap leading-relaxed shadow-inner">
                            {data.outreach.email.body}
                        </div>
                    </div>
                )}

                {activeTab === "linkedin" && (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">LinkedIn InMail / Connection Request</span>
                            <button
                                onClick={() => handleCopy(data.outreach.linkedIn.inMail)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-all btn-glow"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-white/60" />}
                                {copied ? <span className="text-green-400">Copied</span> : <span className="text-white/80">Copy InMail</span>}
                            </button>
                        </div>
                        <div className="bg-black/30 p-5 rounded-xl border border-white/5 font-mono text-sm inline-block text-white/80 whitespace-pre-wrap leading-relaxed shadow-inner relative">
                            <div className="absolute top-2 right-2 opacity-5"><Linkedin size={40} /></div>
                            {data.outreach.linkedIn.inMail}
                        </div>
                    </div>
                )}

                {activeTab === "twitter" && (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-white/60 text-sm">Twitter Direct Message</span>
                            <button
                                onClick={() => handleCopy(data.outreach.twitter.dm)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-all btn-glow"
                            >
                                {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-white/60" />}
                                {copied ? <span className="text-green-400">Copied</span> : <span className="text-white/80">Copy DM</span>}
                            </button>
                        </div>
                        <div className="bg-black/30 p-5 rounded-xl border border-white/5 font-mono text-sm inline-block text-white/80 whitespace-pre-wrap leading-relaxed shadow-inner relative">
                            <div className="absolute top-2 right-2 opacity-5"><Twitter size={40} /></div>
                            {data.outreach.twitter.dm}
                        </div>
                    </div>
                )}

                {activeTab === "phone" && (
                    <div className="animate-in fade-in slide-in-from-right-2 duration-300 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-white/80 font-medium text-sm text-primary">Call Hook</span>
                                <button
                                    onClick={() => handleCopy(data.outreach.coldCall.hook)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-medium transition-all btn-glow"
                                >
                                    {copied ? <CheckCircle2 size={14} className="text-green-400" /> : <Copy size={14} className="text-white/60" />}
                                    <span className="text-white/80">Copy Hook</span>
                                </button>
                            </div>
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-sm text-white/90 italic border-l-2 border-l-primary">
                                "{data.outreach.coldCall.hook}"
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 mt-2">
                            <span className="text-white/80 font-medium text-sm text-orange-400">Objection Battlecards</span>
                            <div className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 flex flex-col gap-3">
                                {data.outreach.coldCall.objectionTips?.map((tip: string, i: number) => (
                                    <div key={i} className="flex gap-3 text-white/80 text-sm">
                                        <span className="text-orange-400/70 mt-0.5 font-bold">{i + 1}.</span>
                                        <span>{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

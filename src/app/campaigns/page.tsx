"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { UploadCloud, FileSpreadsheet, PlayCircle, PauseCircle, MoreVertical, Search, Filter, Plus, ArrowUpRight, CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/components/Toast";

export default function CampaignsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const stats = [
        { label: "Total Opens", value: "4,621", increase: "+14.2%" },
        { label: "Total Replies", value: "532", increase: "+5.1%" },
        { label: "Meetings Booked", value: "48", increase: "+12.4%" },
    ];

    const campaigns = [
        { id: 1, name: "Q1 Enterprise Outreach", status: "Active", progress: 68, sent: 1240, total: 1800, opens: '42%', replies: '8%' },
        { id: 2, name: "SaaS Founders - US", status: "Paused", progress: 34, sent: 340, total: 1000, opens: '38%', replies: '4%' },
        { id: 3, name: "VPs of Engineering Follow-up", status: "Active", progress: 89, sent: 890, total: 1000, opens: '51%', replies: '11%' },
        { id: 4, name: "Cold Email Sequence A", status: "Completed", progress: 100, sent: 500, total: 500, opens: '46%', replies: '9%' },
    ];

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        // would handle file mapping here
    };

    return (
        <div className="flex min-h-screen bg-background relative overflow-hidden">
            <div className="absolute top-[-20%] left-[20%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />

            <Sidebar />

            <main className="flex-1 ml-64 p-8 md:p-12 relative z-10 w-full overflow-y-auto max-h-screen">
                <div className="max-w-6xl mx-auto space-y-8 pb-10">

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div>
                            <h2 className="text-4xl font-bold mb-2 tracking-tight">Campaigns</h2>
                            <p className="text-white/50 text-lg">Manage your outreach campaigns and track performance.</p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] active:scale-95 btn-glow"
                        >
                            <Plus size={18} />
                            Import Leads
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in zoom-in-95 duration-500 delay-100">
                        {stats.map((stat, i) => (
                            <div key={i} className="glass p-6 rounded-2xl flex flex-col gap-2 relative overflow-hidden group">
                                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <ArrowUpRight size={100} />
                                </div>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-white/60 font-medium text-sm">{stat.label}</span>
                                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                                        <ArrowUpRight size={12} />
                                        {stat.increase}
                                    </span>
                                </div>
                                <div className="text-4xl font-bold bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="glass-panel rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
                        <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h3 className="text-xl font-bold">Active Campaigns</h3>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Search campaigns..."
                                        className="pl-9 pr-4 py-2 bg-black/40 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 text-white placeholder:text-white/30"
                                    />
                                </div>
                                <button className="p-2 bg-black/40 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-white/60 hover:text-white">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-black/20">
                                        <th className="p-4 pl-6 text-sm font-semibold text-white/60 uppercase tracking-wider">Campaign Name</th>
                                        <th className="p-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Progress</th>
                                        <th className="p-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Opens</th>
                                        <th className="p-4 text-sm font-semibold text-white/60 uppercase tracking-wider">Replies</th>
                                        <th className="p-4 pr-6 text-sm font-semibold text-white/60 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {campaigns.map((camp) => (
                                        <tr key={camp.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4 pl-6">
                                                <div className="font-medium text-white group-hover:text-primary transition-colors">{camp.name}</div>
                                                <div className="text-xs text-white/40 mt-1">{camp.sent} / {camp.total} sent</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                    camp.status === 'Active' ? "bg-primary/10 text-primary border-primary/20" :
                                                        camp.status === 'Paused' ? "bg-orange-500/10 text-orange-400 border-orange-500/20" :
                                                            "bg-white/5 text-white/60 border-white/10"
                                                )}>
                                                    {camp.status === 'Active' && <PlayCircle size={12} />}
                                                    {camp.status === 'Paused' && <PauseCircle size={12} />}
                                                    {camp.status === 'Completed' && <CheckCircle2 size={12} />}
                                                    {camp.status}
                                                </span>
                                            </td>
                                            <td className="p-4 min-w-[200px]">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                                        <div
                                                            className={cn(
                                                                "h-full rounded-full relative",
                                                                camp.status === 'Completed' ? "bg-green-500/70" : "bg-primary"
                                                            )}
                                                            style={{ width: `${camp.progress}%` }}
                                                        >
                                                            {camp.status === 'Active' && (
                                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="text-sm font-medium text-white/80">{camp.progress}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm">{camp.opens}</td>
                                            <td className="p-4 text-sm font-medium">{camp.replies}</td>
                                            <td className="p-4 pr-6 text-right">
                                                <button className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Import Leads Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="glass-panel w-full max-w-lg rounded-2xl p-6 relative z-10 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold mb-2">Import Leads</h3>
                        <p className="text-white/60 text-sm mb-6">Upload a CSV containing your prospect data (Name, LinkedIn URL, Company).</p>

                        <div
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                            className={cn(
                                "border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
                                dragActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                            )}
                        >
                            <div className="bg-white/5 p-4 rounded-full mb-4">
                                <UploadCloud size={32} className={dragActive ? "text-primary" : "text-white/60"} />
                            </div>
                            <p className="font-medium text-white mb-1">Click to upload or drag and drop</p>
                            <p className="text-white/40 text-xs">CSV, XLSX (max 5MB)</p>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors text-white/80"
                            >
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-all btn-glow">
                                Upload Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

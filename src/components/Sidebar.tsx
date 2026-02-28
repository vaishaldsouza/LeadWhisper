"use client";

import { LayoutDashboard, MessageSquare, Settings, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/components/Toast";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Campaigns", href: "/campaigns", icon: MessageSquare },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <aside className="fixed top-0 left-0 h-screen w-64 glass-panel border-r border-white/5 flex flex-col z-20">
            <div className="p-6 flex items-center gap-3 border-b border-white/10">
                <div className="bg-primary/20 p-2 rounded-lg text-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                    <Zap size={24} />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    LeadWhisper AI
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 mt-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                isActive
                                    ? "bg-white/10 text-white border border-white/20 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                                    : "text-white/50 hover:bg-white/5 hover:text-white border border-transparent"
                            )}
                        >
                            <Icon size={20} className={cn(isActive ? "text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]" : "")} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 relative overflow-hidden text-sm">
                    <div className="absolute -top-3 -right-3 p-2 opacity-10">
                        <Zap size={64} />
                    </div>
                    <h4 className="font-semibold text-white mb-1 relative z-10">Pro Plan Active</h4>
                    <p className="text-white/60 relative z-10 text-xs mt-1">450 analysis credits remaining this month.</p>
                </div>
            </div>
        </aside>
    );
}

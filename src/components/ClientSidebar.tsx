"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    BookUser,
    Settings,
    Inbox,
    HelpCircle,
} from "lucide-react";

const navItems = [
    {
        label: "Dashboard",
        href: "/client",
        icon: LayoutDashboard,
    },

    {
        label: "Shipments",
        href:"/client/shipments",
        icon: Package,
    },

    {
        label: "Address Book",
        href: "/client/address-book",
        icon: BookUser,
    },

    {
        label: "Settings",
        href: "/client/settings",
        icon: Settings,
    },

    {
        label: "My inbox",
        href: "/client/inbox",
        icon: Inbox,
    },

    {
        label: "Help Centre",
        href: "/client/help",
        icon: HelpCircle,
    },
];

export default function ClientSidebar({
    onNavigate,
}: {
    onNavigate?: () => void;
}) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-1 h-screen overflow-y-auto">
            <div className="p-6 font-bold text-lg text-black">
                SwiftLink
            </div>

            <nav className="space-y-1 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition
                                ${isActive ? "bg-blue-50 text-blue-600 font-semibold border-r-4 border-blue-600" 
                                    : "text-gray-600 hover:bg-gray-100"}`}
                            >
                            <Icon className="w-5 h-5"/>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
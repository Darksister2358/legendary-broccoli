"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
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
        href:"/client/shipment",
        icon: Package,
    },

    {
        label: "Address Book",
        href: "/client/address",
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

const accountNavItems = [
    {
        label: "My Profile",
        href: "/client/profile",
        icon: BookUser,
    },

    {
        label: "Account",
        href: "/client/account",
        icon: Settings,
    },
];

export default function ClientSidebar({
    onNavigate,
}: {
    onNavigate?: () => void;
}) {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white border-1 h-screen flex flex-col">
            <div className="p-6 font-bold text-lg text-black">
                SwiftLink
            </div>

            <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
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

            <div className="border-t px-3 py-4 space-y-1">
                {accountNavItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

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
                    )
                })}

                <LogoutButton/>
            </div>
        </aside>
    );
}

function LogoutButton() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }

    return (
        <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-red-600 
            hover:bg-red-50 transition">
            <LogOut className="w-5 h-5"/>
            Log out
        </button>
    )
}
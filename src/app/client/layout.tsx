import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Analytics } from "@vercel/analytics/next"
import  Link  from "next/link";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        redirect('/login')
    }

    return (
        <div className="flex h-screen bg-gray-100 text-black">

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>

            <aside className="w-64 bg-gray-900 text-white flex flex-col border-1 border-gray-700">
                <div className="p-6 text-x1 font-bold border-b border-gray-700">
                    SwiftLink
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <NavItem href="/client">Dashboard</NavItem>
                    <NavItem href="/client/shipments">Shipments</NavItem>
                    <NavItem href="/client/address-book">Address Book</NavItem>
                    <NavItem href="/client/settings">Settings</NavItem>
                    <NavItem href="/client/help">Help Centre</NavItem>
                </nav>

                <div className="p-4 border-t border-gray-800 text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} SwiftLink. All rights reserved.
                </div>
            </aside>
            <Analytics />
        </div>
    )
}

function NavItem({ 
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
        href={href}
        className="block rounded-md px-3 py-2 hover:bg-gray-800 transition"
        >
        {children}
        </Link>
    )
}
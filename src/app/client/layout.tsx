import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Analytics } from "@vercel/analytics/next"
import  ClientSidebar from "@/components/ClientSidebar";

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
        <div className="min-h-screen flex bg-gray-100 text-black">
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
            <ClientSidebar />
            <Analytics />
        </div>
    )
}

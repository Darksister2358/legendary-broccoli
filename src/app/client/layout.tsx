import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { Analytics } from "@vercel/analytics/next"
import  ClientSidebar from "@/components/ClientSidebar";
import MobileSidebar from "@/components/MobileSidebar";

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
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user || userError) {
        redirect('/login')
    }

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
        throw new Error("Failed to load profile");
    }

    if (!profile.onboarding_complete || profile.onboarding_complete) {
        redirect('/onboarding');
    }
    
    return (
        <div className="min-h-screen flex bg-gray-100 text-black">
            <div className="flex-1 overflow-y-auto">
                <MobileSidebar />
                {children}
            </div>
            <div className="hidden md:block">
                <ClientSidebar />
            </div>
            <Analytics />
        </div>
    )
}
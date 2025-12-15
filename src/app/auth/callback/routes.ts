import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { CookieOptions } from "@supabase/ssr";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    const origin = new URL(request.url).origin;

    if (!code) {
        return NextResponse.redirect(`${origin}/login`);
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { 
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    // Use the built-in delete API to remove a cookie
                    // `options` may include path or other attributes; spread when supported
                    if (typeof cookieStore.delete === "function") {
                        try {
                            // cookieStore.delete supports both string name and object form in different Next versions
                            // prefer the simple name-based form
                            cookieStore.delete(name);
                        } catch {
                            // fallback to setting empty value
                            cookieStore.set({ name, value: "", ...options });
                        }
                    } else {
                        cookieStore.set({ name, value: "", ...options });
                    }
                },
            },
        }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
        console.error("Error exchanging code for session:", error.message);
        return NextResponse.redirect(`${origin}/login?error=auth`);
    }

    return NextResponse.redirect(`${origin}/client`);
}
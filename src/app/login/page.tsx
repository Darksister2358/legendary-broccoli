"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push("/client")
        router.refresh()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-600">
            <div className="w-full max-w-md rounded-xl bg-white p-8 rounded-x1 shadow">
                <h1 className="text-2x1 font-bold mb-6 text-center text-black">
                    Log in to SwiftLink
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email" required
                        className="w-full border rounded px-3 py-2 text-black"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                      type="password"
                      placeholder="Password" required
                      className="w-full border rounded px-3 py-2 text-black"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      />

                      <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                      >

                      {loading ? "Logging in..." : "Log In"}
                      </button>  
                </form>

                {error && (
                    <p className="text-red-600 text-sm mt-4 text-center">{error}</p>
                )}

                <p className="mt-6 text-center text-sm tet-gray-600">
                    Don`t have an account?{" "}
                    <a href="/signup" className="text-blue-600 font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}

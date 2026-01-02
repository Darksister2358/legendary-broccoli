"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (signUpError){
      setError(signUpError.message);
      setLoading(false);
      return
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      setError("Failed to create user.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        role: "client",
        onboarding_complete: false,
        first_name: "",
        last_name: "",
        phone: "",
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-600">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl"
      >
        <h1 className="mb-6 text-2xl font-semibold text-black bg-white px-2 py-1 inline-block rounded">
          Create your SwiftLink account
        </h1>

        {error && (
          <p className="mb-4 rounded bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {success ? (
          <p className="rounded bg-green-100 px-3 py-2 text-sm text-green-700">
            Check your email to confirm your account.
          </p>
        ) : (
          <>
            <label className="mb-2 block text-sm font-medium text-black bg-white px-1 rounded">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="mb-2 block text-sm font-medium text-black bg-white px-1 rounded">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 w-full rounded border border-gray-300 px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}

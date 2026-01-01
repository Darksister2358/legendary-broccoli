"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function OnboardingPage() {
    const router = useRouter();
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        phone: "",
        line1: "",
        city: "",
        province: "",
        postal_code: "",
        country: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("User not authenticated.");
            setLoading(false);
            return;
        }

        const { error: profileError } = await supabase
            .from("profiles")
            .update({
                first_name: form.first_name,
                last_name: form.last_name,
                phone: form.phone,
                onboarding_complete: true,
            })
            .eq("id", user.id);

        if (profileError) {
            setError(profileError.message);
            setLoading(false);
            return;
        }

        const { error: addressError } = await supabase
            .from("addresses")
            .insert({
                user_id: user.id,
                line1: form.line1,
                city: form.city,
                province: form.province,
                postal_code: form.postal_code,
                country: form.country,
                is_promary: true,
            });

        if (addressError) {
            setError(addressError.message);
            setLoading(false);
            return;
        }

        router.push("/client");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form 
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-white p-8 rounded-xl shadow space-y-4"
            >
                <h1 className="text-2xl font-bold text-black">
                    Let&apos;s finish setting up your profile
                </h1>

                <p className="text-gray-600 text-sm">
                    We just need a few more details before you can start using SwiftLink.
                </p>

                <input
                    name="first_name"
                    placeholder="First Name" required
                    onChange={handleChange}
                    className="input" 
                />
                <input
                    name="last_name"
                    placeholder="Last Name" required
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="phone"
                    placeholder="Phone Number" required
                    onChange={handleChange}
                    className="input"
                />

                <hr/>

                <input
                    name="line1"
                    placeholder="Address Line 1" required
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="city"
                    placeholder="City" required
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="province"
                    placeholder="Province" required
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="postal_code"
                    placeholder="Postal Code" required
                    onChange={handleChange}
                    className="input"
                />
                <input
                    name="country"
                    placeholder="Country" required
                    onChange={handleChange}
                    className="input"
                />

                {error && <p className="text-red-600 text-sm">{error}</p>}
                
                <button
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    );
}
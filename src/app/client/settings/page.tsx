"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function SettingsPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [form, setFrom] = useState({
        first_name: "",
        last_name: "",
        phone: "",
    });

    useEffect(() => {
        const loadProfile = async () => {
            const { data: authData } = await supabase.auth.getUser();
            const user = authData.user;

            if (!user) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            setEmail(user.email ?? "");

            const { data: profile, error } = await supabase
                .from("profiles")
                .select("first_name, last_name, phone")
                .eq("id", user.id)
                .single();

                    if (error) {
                        setError("Failed to load profile");
                    } else {
                        setFrom({
                            first_name: profile.first_name || "",
                            last_name: profile.last_name || "",
                            phone: profile.phone || "",
                        });
        
                        setLoading(false);
                    }
                };
        
                loadProfile();
            }, []);
        
            const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                setFrom({ ...form, [e.target.name]: e.target.value });
            };

            const handleSave = async () => {
                setSaving(true);
                setError(null);

                const { data: authData } = await supabase.auth.getUser();
                const user = authData.user;

                if (!user) {
                    setError("Not authenticated");
                    setSaving(false);
                    return;
                }

                const { error } = await supabase
                    .from("profiles")
                    .update({
                        first_name: form.first_name,
                        last_name: form.last_name,
                        phone: form.phone,
                    })
                    .eq("id", user.id);

                    if (error) {
                        setError("Failed to save profile");
                    }

                setSaving(false);
            };

            if (loading) {
                return <div className="p-6"> Loading settings...</div>
            }
        
    return (
        <div className="max-w-3x1 mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold">Settings</h1>

            <section className="bg-white rounded-x1 shadow p-6 space-y-4">
                <h2 className="text-lg font-semibold">Profile</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="first_name"
                        placeholder="First Name"
                        value={form.first_name}
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        name="last_name"
                        placeholder="Last Name"
                        value={form.last_name}
                        onChange={handleChange}
                        className="input"
                    />
                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className="input md:col-span-2"
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </section>

            <section className="bg-white rounded-x1 shadow p-6 space-y-2">
                <h2 className="text-lg font-semibold">Account</h2>

                <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{email}</p>
                </div>

                <p className="text-sm text-gray-500">
                    To change your email address or password, please visit the
                    account management page.
                </p>
            </section>
        </div>
    );
}
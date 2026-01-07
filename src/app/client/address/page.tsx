"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Address = {
    id: string;
    line1: string;
    suburb: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    is_primary: boolean;
};

export default function AddressPage() {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [ error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (!user || userError) {
                setError("User not authenticated");
                setLoading(false);
                return;
            }

            const { data, error} = await supabase
                .from("address_book")
                .select("*")
                .eq("user_id", user.id)
                .order("is_primary", { ascending: false });

            if (error) {
                setError(error.message);
            } else {
                setAddresses(data ?? []);
            }

            setLoading(false);
        };

        fetchAddresses();
    }, [supabase]);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Address Book</h1>

            {loading && (
                <p className="text-gray-500 text-sm">Loading addresses...</p>
            )}

            {error && (
                <p className="text-red-600 text-sm">{error}</p>
            )}

            {!loading && addresses.length === 0 && (
                <p className="text-gray-500">
                    No addresses found.
                </p>
            )}

            <div className="grid gap-4">
                {addresses.map((address) => (
                    <div
                        key={address.id}
                        className="bg-white rounded-lg shadow p-4 flex justify-between items-start">

                        <div>
                            <p className="font-medium">
                                {address.line1}
                                {address.suburb && `, ${address.suburb}`}
                            </p>

                            <p className="text-sm text-gray-600">
                                {address.city},
                                {address.province}
                            </p>

                            <p className="text-sm text-gray-600">
                                {address.postal_code}, {address.country}
                            </p>
                        </div>

                        {address.is_primary && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Primary
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
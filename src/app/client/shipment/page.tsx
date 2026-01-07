"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserClient } from "@supabase/ssr";

type Shipment = {
    id: string;
    waybill: string;
    receiver_name: string;
    receiver_address: string;
    status: 'CREATED' | 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'FAILED';
    created_at: string;
};

export default function ShipmentPage() {
    const [ shipments, setShipments] = useState<Shipment[]>([]);
    const [ loading, setLoading] = useState(false);

    const [waybill, setWaybill] = useState("");
    const [status, setStatus] = useState('');
    const [ fromDate, setFromDate] = useState('');
    const [ toDate, setToDate] = useState('');

    const supabase = useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []);

    useEffect(() => {
        async function fetchShipments() {
            setLoading(true);

            let query = supabase
                .from("shipments")
                .select("*")
                .order("created_at", { ascending: false });

            if (waybill) {
                query = query.ilike("waybill", `%${waybill}%`);
            }

            if (status) {
                query = query.eq("status", status);
            }

            if (fromDate) {
                query = query.gte("created_at", fromDate);
            }

            if (toDate) {
                query = query.lte("created_at", toDate);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching shipments:", error);
            } else {
                setShipments(data || []);
            }

            setLoading(false);
        }

        fetchShipments();
    }, [supabase, waybill, status, fromDate, toDate]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Shipments</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by waybill no."
                    className="border px-3 py-2 rounded w-48"
                    value={waybill}
                    onChange={(e) => setWaybill(e.target.value)}
                />    

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border rounded px-3 py-2"
                >
                    <option value="">All Statuses</option>
                    <option value="CREATED">Created</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="FAILED">Failed</option>
                </select>

                <input
                    type="text"
                    className="border rounded px-3 py-2"
                    placeholder="From Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                />

                <input
                    type="text"
                    className="border rounded px-3 py-2"
                    placeholder="To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2 text-left">Waybill No.</th>
                            <th className="border px-4 py-2 text-left">Receiver</th>
                            <th className="border px-4 py-2 text-left">Address</th>
                            <th className="border px-4 py-2 text-left">Status</th>
                            <th className="border px-4 py-2 text-left">Created At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={5} className="text-center py-6">
                                    Loading shipments...
                                </td>
                            </tr>
                        )}

                        {!loading && shipments.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center py-6">
                                    No shipments found.
                                </td>
                            </tr>
                        )}

                        {!loading && shipments.map((shipment) => (
                            <tr key={shipment.id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2 font-mono">{shipment.waybill}</td>
                                <td className="border px-4 py-2">{shipment.receiver_name}</td>
                                <td className="border px-4 py-2">{shipment.receiver_address}</td>
                                <td className="border px-4 py-2">{shipment.status}</td>
                                <td className="border px-4 py-2">{new Date(shipment.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>
    );
}
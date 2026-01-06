"use client";

import { useState } from "react";

export default function ShipmentPage() {

    const [filters, setFilters] = useState({
        waybill: "",
        status: "all",
        from: "",
        to: "",
    });
    
        return (
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Shipments</h1>
                    <p className="text-sm text-gray-500">Manage your shipments</p>
                </div>

                <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by waybill no."
                        className="border rounded px-3 py-2"
                        value={filters.waybill}
                        onChange={(e) => setFilters({...filters, waybill: e.target.value})}
                    />    

                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value})}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <input
                        type="text"
                        className="border rounded px-3 py-2"
                        value={filters.from}
                        onChange={(e) => setFilters({...filters, from: e.target.value})}
                    />

                    <input
                        type="text"
                        className="border rounded px-3 py-2"
                        value={filters.to}
                        onChange={(e) => setFilters({...filters, to: e.target.value})}
                    />
                </div>

                <div className="bg-white rounded-lg shadow">
                    <div className="p-4 text-sm text-gray-500">
                        No shipments
                    </div>
                </div>
            </div>
        );
    }
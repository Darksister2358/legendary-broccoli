"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import ClientSidebar from "./ClientSidebar";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b">
        <span className="font-semibold text-black">SwiftLink</span>
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6 text-black" />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
      )}

      {/* Slide panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-white transform transition-transform
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-black">Menu</span>
          <button onClick={() => setOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <ClientSidebar onNavigate={() => setOpen(false)} />
      </div>
    </>
  );
}

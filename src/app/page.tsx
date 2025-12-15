"use client";

import Link from "next/link";
import { Truck, Package, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm">
        <div className="text-2xl font-bold text-blue-600">SwiftLink</div>

        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#features">Features</Link>
          <Link href="#track">Track Parcel</Link>
          <Link href="#pricing">Pricing</Link>
          <Link href="#contact">Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            Client Login
          </Link>
          <Link
            href="/signup"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section
        id="track"
        className="flex-1 flex flex-col items-center justify-center text-center px-6"
      >
        <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
          Fast, Reliable Parcel Delivery — Without the Headaches
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-xl">
          Track your parcel instantly using your waybill number. No account
          required.
        </p>

        {/* Tracking Bar */}
        <div className="mt-10 w-full max-w-xl flex">
          <input
            type="text"
            placeholder="Enter waybill number"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-l-2xl focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-r-2xl text-sm font-medium hover:bg-blue-700"
          >
            Track
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Need pricing?{" "}
          <Link href="#contact" className="text-blue-600 hover:underline">
            Contact sales
          </Link>
        </p>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 text-center">
          <Feature
            icon={<Package />}
            title="Simple Waybills"
            description="Generate and track shipments with unique waybill numbers. No paperwork chaos."
          />
          <Feature
            icon={<MapPin />}
            title="Live Tracking"
            description="Track parcels in real time using a link or waybill number — no account needed."
          />
          <Feature
            icon={<Truck />}
            title="Driver Dispatch"
            description="Drivers use a mobile-friendly app to update statuses on the go."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 px-8 py-12">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold text-lg">SwiftLink</h3>
            <p className="mt-4 text-sm">
              Modern courier management built for speed, clarity, and scale.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features">Features</Link></li>
              <li><Link href="#pricing">Pricing</Link></li>
              <li><Link href="#track">Track Parcel</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Careers</Link></li>
              <li><Link href="#contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-3">Get Started</h4>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="mt-12 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} SwiftLink. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm">
      <div className="mx-auto mb-4 h-10 w-10 flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <h3 className="font-semibold text-black">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}

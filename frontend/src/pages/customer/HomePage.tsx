import React from "react";
import { Link } from "react-router-dom";
import MetricCard from "../../components/customer/ui/MetricCard";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import { useAuth } from "../../context/customer/AuthContext";
import { useBookingContext } from "../../context/customer/BookingContext";
import { useWalletContext } from "../../context/customer/WalletContext";

const HomePage = () => {
  const { user } = useAuth();
  const { bookings } = useBookingContext();
  const { balance, currency } = useWalletContext();

  return (
    <div className="space-y-8">
      <SectionHeader title={`Welcome back, ${user?.firstName ?? "traveler"}`} subtitle="Your DigitalSafaris travel hub is ready for your next journey." />
      <div className="grid gap-4 xl:grid-cols-4">
        <MetricCard label="Current trips" value={String(bookings.length)} />
        <MetricCard label="Loyalty points" value={String(user?.loyaltyPoints ?? 0)} />
        <MetricCard label="Saved wallet" value={`${currency} ${balance.toLocaleString()}`} />
        <MetricCard label="Recommendations" value="Loading..." />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">AI Concierge</h3>
          <p className="mt-3 text-sm text-slate-400">Plan your next adventure, get personalized accommodations, dining and transport recommendations across Africa.</p>
          <Link to="/customer/chat" className="mt-6 inline-flex rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-500">
            Start chat
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Traveler spotlight</h3>
          <p className="mt-3 text-sm text-slate-400">Your profile, bookings, wallet, and curated travel services in one place.</p>
          <Link to="/customer/profile" className="mt-6 inline-flex rounded-2xl bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600">
            View profile
          </Link>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Discover destinations</h3>
          <p className="mt-3 text-sm text-slate-400">Explore hotels, restaurants and transport options across the DigitalSafaris network.</p>
          <Link to="/customer/search" className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400">
            Search now
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Food delivery</h3>
          <p className="mt-3 text-sm text-slate-400">Browse restaurant offers and order from partner kitchens in real time.</p>
          <Link to="/customer/food" className="mt-6 inline-flex rounded-2xl bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600">
            Order food
          </Link>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="text-lg font-semibold text-white">Transport services</h3>
          <p className="mt-3 text-sm text-slate-400">Request a ride, manage transfers and track drivers on DigitalSafaris.</p>
          <Link to="/customer/transport" className="mt-6 inline-flex rounded-2xl bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600">
            Book transport
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

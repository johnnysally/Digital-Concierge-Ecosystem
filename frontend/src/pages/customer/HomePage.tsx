import React from "react";
import { Link } from "react-router-dom";
import MetricCard from "../../components/customer/ui/MetricCard";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import CalendarPlanner from "../../components/customer/ui/CalendarPlanner";
import ChartCard from "../../components/customer/ui/ChartCard";
import Pie3DCard from "../../components/customer/ui/Pie3DCard";
import { useAuth } from "../../context/customer/AuthContext";
import { useBookingContext } from "../../context/customer/BookingContext";
import { useWalletContext } from "../../context/customer/WalletContext";
import { useTheme } from "../../context/customer/ThemeContext";

const HomePage = () => {
  const { user } = useAuth();
  const { bookings } = useBookingContext();
  const { balance, currency } = useWalletContext();
  const { theme, isDark, toggleTheme } = useTheme();
  const pageShellClass = isDark
    ? "h-full bg-slate-950 p-4 text-slate-100"
    : "h-full bg-gradient-to-b from-white to-slate-50 p-4 text-slate-900";
  const surfaceClass = isDark
    ? "rounded-[24px] border border-slate-800 bg-slate-900/95 p-4 shadow-[0_20px_70px_-25px_rgba(2,6,23,0.85)] backdrop-blur-xl"
    : "rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_12px_45px_-20px_rgba(15,23,42,0.28)] backdrop-blur-xl";
  const softSurfaceClass = isDark
    ? "rounded-[20px] border border-slate-800 bg-slate-950/90 p-3 shadow-[0_12px_35px_-18px_rgba(2,6,23,0.8)] backdrop-blur-sm"
    : "rounded-[20px] border border-white/60 bg-white/80 p-3 shadow-sm backdrop-blur-sm";
  const heroClass = isDark
    ? "overflow-hidden rounded-[30px] border border-slate-800 bg-slate-900/95 p-5 text-white shadow-[0_20px_70px_-25px_rgba(2,6,23,0.85)] backdrop-blur-xl sm:p-6"
    : "overflow-hidden rounded-[30px] border border-slate-200/80 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-800/90 p-5 text-white shadow-[0_20px_70px_-25px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-6";
  const panelClass = isDark
    ? "rounded-[24px] border border-slate-800 bg-slate-900/95 p-4 shadow-[0_12px_45px_-20px_rgba(2,6,23,0.85)] backdrop-blur-xl sm:p-5"
    : "rounded-[24px] border border-white/60 bg-white/70 p-4 shadow-[0_12px_45px_-20px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:p-5";
  const mutedTextClass = isDark ? "text-slate-400" : "text-slate-600";
  const headingTextClass = isDark ? "text-slate-100" : "text-slate-900";
  const bodyTextClass = isDark ? "text-slate-300" : "text-slate-600";
  const pillClass = isDark
    ? "rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-sm font-medium text-slate-200"
    : "rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-700";

  const activityData = React.useMemo(() => {
    const base = bookings.length > 0 ? [44, 58, 68, 74, 81, 76, 86, 92, 88, 91, 95, 98] : [24, 36, 42, 48, 54, 60, 66, 72, 74, 78, 82, 88];
    return base;
  }, [bookings.length]);

  const activityBreakdown = React.useMemo(() => {
    const confirmedStays = Math.max(4, bookings.length * 2 + 1);
    const diningOrders = Math.max(3, Math.min(16, bookings.length + 4));
    const transportRides = Math.max(2, Math.min(14, Math.floor(bookings.length / 2) + 3));
    const supportChats = Math.max(2, Math.min(10, bookings.length + 1));

    return [
      { label: "Confirmed stays", value: confirmedStays, color: "#f97316" },
      { label: "Dining orders", value: diningOrders, color: "#f43f5e" },
      { label: "Transport rides", value: transportRides, color: "#34d399" },
      { label: "Support chats", value: supportChats, color: "#60a5fa" },
    ];
  }, [bookings.length]);

  const nextBooking = React.useMemo(() => {
    return bookings?.[0] ?? null;
  }, [bookings]);

  return (
    <div className={`${pageShellClass} space-y-3 sm:space-y-4`}>
      <SectionHeader title={`Welcome back, ${user?.firstName ?? "traveler"}`} subtitle="Your DigitalSafaris travel hub is ready for your next journey." />

      <div className={heroClass}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-cyan-300">Customer dashboard</p>
            <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Your travel world, beautifully organized</h2>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">Stay updates, intelligent suggestions, and your next plans in one calm, elegant workspace.</p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold text-white backdrop-blur-lg transition hover:bg-white/20"
            >
              {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
            </button>
            <div className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-lg">
            <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Wallet</p>
                  <p className="mt-1 text-xl font-semibold">{currency} {balance.toLocaleString()}</p>
                </div>
                <Link to="/customer/wallet" className="rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-3 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-8px_rgba(16,185,129,0.7)]">Top up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={surfaceClass}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className={`text-base font-semibold ${headingTextClass}`}>Today at a glance</h3>
            <p className={`text-sm ${bodyTextClass}`}>A quick view of your most important travel signals.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className={pillClass}>{bookings.length} active trips</div>
            <div className={pillClass}>{currency} {balance.toLocaleString()} wallet</div>
            <div className={pillClass}>{user?.loyaltyPoints ?? 0} rewards</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="Current trips" value={String(bookings.length)} icon={<span>🧳</span>} className={isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"} />
            <MetricCard label="Loyalty points" value={String(user?.loyaltyPoints ?? 0)} icon={<span>🏅</span>} className={isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"} />
            <MetricCard label="Recommendations" value="Personalized" icon={<span>💡</span>} className={isDark ? "border-slate-800 bg-slate-900/80" : "border-slate-200/70 bg-white/90"} />
          </div>

          <div className={panelClass}>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className={`text-base font-semibold ${headingTextClass}`}>Trip intelligence</h3>
                <p className={`text-sm ${bodyTextClass}`}>A compact view of your activity and travel mix.</p>
              </div>
              <div className={isDark ? "inline-flex items-center gap-2 rounded-full border border-emerald-700/60 bg-emerald-900/70 px-2.5 py-1.5 text-sm font-semibold text-emerald-200" : "inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-sm font-medium text-emerald-700"}>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Live activity
              </div>
            </div>

            <div className="mt-4 grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
              <div className={isDark ? "rounded-[20px] border border-slate-800 bg-slate-950/80 p-2 backdrop-blur-sm" : "rounded-[20px] border border-white/60 bg-slate-50/70 p-2 backdrop-blur-sm"}>
                <ChartCard title="Activity" data={activityData} theme={theme} />
              </div>

              <div className="space-y-3">
                <div className={softSurfaceClass}>
                  <Pie3DCard title="Service Mix" slices={activityBreakdown} theme={theme} />
                </div>

                <div className={isDark ? "rounded-[20px] border border-slate-800 bg-gradient-to-br from-cyan-600/20 to-violet-600/20 p-3 text-white shadow-[0_10px_25px_-12px_rgba(2,6,23,0.8)]" : "rounded-[20px] border border-gray-100 bg-gradient-to-br from-cyan-500 to-violet-600 p-3 text-white shadow-[0_10px_25px_-12px_rgba(99,102,241,0.7)]"}>
                  <p className="text-sm font-medium opacity-90">Next stay</p>
                  <p className="mt-2 text-base font-semibold">{nextBooking?.propertyName ?? "No upcoming stay"}</p>
                  <p className="mt-1 text-sm opacity-80">{nextBooking?.checkIn ?? "Book your next adventure"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-semibold ${headingTextClass}`}>Recent activity</h3>
              <Link to="/customer/chat" className={`text-sm font-semibold ${isDark ? "text-cyan-300" : "text-cyan-600"}`}>Ask AI</Link>
            </div>
            <ul className="mt-3 space-y-2">
              <li className={isDark ? "flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5" : "flex items-center gap-3 rounded-xl border border-gray-100 bg-white/80 p-2.5"}>
                <div className={isDark ? "flex h-8 w-8 items-center justify-center rounded-full bg-slate-800" : "flex h-8 w-8 items-center justify-center rounded-full bg-gray-50"}>📩</div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${headingTextClass}`}>Payment received</p>
                  <p className={`text-xs ${bodyTextClass}`}>Your wallet was credited with USD 120</p>
                </div>
                <div className={isDark ? "text-xs text-slate-500" : "text-xs text-slate-500"}>2h ago</div>
              </li>
              <li className={isDark ? "flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-2.5" : "flex items-center gap-3 rounded-xl border border-gray-100 bg-white/80 p-2.5"}>
                <div className={isDark ? "flex h-8 w-8 items-center justify-center rounded-full bg-slate-800" : "flex h-8 w-8 items-center justify-center rounded-full bg-gray-50"}>🛎️</div>
                <div className="flex-1">
                  <p className={`text-sm font-semibold ${headingTextClass}`}>Booking confirmed</p>
                  <p className={`text-xs ${bodyTextClass}`}>3-night stay confirmed at Safari Inn</p>
                </div>
                <div className={isDark ? "text-xs text-slate-500" : "text-xs text-slate-500"}>1d ago</div>
              </li>
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <div className={surfaceClass}>
            <h4 className={`text-sm font-semibold ${headingTextClass}`}>Plan your next trip</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link to="/customer/search" className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-2 text-center text-sm font-semibold text-white">Find stays</Link>
              <Link to="/customer/food" className={isDark ? "rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-100" : "rounded-xl bg-gray-100 px-3 py-2 text-center text-sm font-semibold text-slate-900"}>Order food</Link>
              <Link to="/customer/transport" className={isDark ? "rounded-xl bg-slate-800 px-3 py-2 text-center text-sm font-semibold text-slate-100" : "rounded-xl bg-gray-100 px-3 py-2 text-center text-sm font-semibold text-slate-900"}>Request ride</Link>
            </div>
          </div>

          <div className={surfaceClass}>
            <h4 className={`text-sm font-semibold ${headingTextClass}`}>Upcoming stays</h4>
            <div className="mt-3 space-y-2">
              {bookings.length > 0 ? (
                bookings.slice(0, 3).map((b: any, i: number) => (
                  <div key={i} className={isDark ? "rounded-xl border border-slate-800 bg-slate-950/60 p-2.5" : "rounded-xl border border-gray-100 bg-white/80 p-2.5"}>
                    <p className={`font-semibold ${headingTextClass}`}>{b.propertyName ?? "Upcoming stay"}</p>
                    <p className={`text-xs ${bodyTextClass}`}>{b.checkIn ?? "Date unknown"}</p>
                  </div>
                ))
              ) : (
                <div className={isDark ? "rounded-xl bg-slate-800/70 p-2.5 text-sm text-slate-300" : "rounded-xl bg-gray-50 p-2.5 text-sm text-slate-600"}>No upcoming trips</div>
              )}
            </div>
          </div>

          <div className={isDark ? "rounded-[24px] border border-emerald-900/40 bg-gradient-to-br from-emerald-950/80 via-cyan-950/70 to-slate-900/80 p-4 shadow-[0_12px_45px_-20px_rgba(0,0,0,0.55)] backdrop-blur-xl" : "rounded-[24px] border border-emerald-100/80 bg-gradient-to-br from-emerald-50/80 via-cyan-50/80 to-white/80 p-4 shadow-[0_12px_45px_-20px_rgba(16,185,129,0.3)] backdrop-blur-xl"}>
            <h4 className={`text-sm font-semibold ${headingTextClass}`}>Rewards insight</h4>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>You are {user?.loyaltyPoints ?? 0} points away from premium offers and better perks.</p>
            <div className={`mt-3 h-2 rounded-full ${isDark ? "bg-slate-800" : "bg-white"}`}>
              <div className="h-2 w-3/4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-500" />
            </div>
          </div>

          <div className={surfaceClass}>
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-semibold ${headingTextClass}`}>Smart assistant</h4>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? "bg-cyan-500/20 text-cyan-200" : "bg-cyan-100 text-cyan-700"}`}>New</span>
            </div>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>Get instant suggestions for dining, transport, and stay upgrades based on your plans.</p>
            <Link to="/customer/chat" className="mt-3 inline-flex items-center rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white">Open assistant</Link>
          </div>

          <div className={surfaceClass}>
            <div className="flex items-center justify-between">
              <h4 className={`text-sm font-semibold ${headingTextClass}`}>Priority support</h4>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? "bg-emerald-500/20 text-emerald-200" : "bg-emerald-100 text-emerald-700"}`}>24/7</span>
            </div>
            <p className={`mt-2 text-sm ${isDark ? "text-slate-300" : "text-slate-700"}`}>Escalate issues fast and get concierge help for bookings, delays, or special requests.</p>
            <Link to="/customer/chat" className="mt-3 inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-2 text-sm font-semibold text-white">Contact support</Link>
          </div>
        </div>
      </div>

      <div className={`${surfaceClass} sm:p-6`}>
        <CalendarPlanner />
      </div>
    </div>
  );
};

export default HomePage;

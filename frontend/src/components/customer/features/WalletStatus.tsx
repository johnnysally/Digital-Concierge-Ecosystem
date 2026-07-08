import React from "react";
import { formatCurrency } from "../../../utils/formatCurrency";

const WalletStatus = () => {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Wallet summary</p>
      <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(34200, "KES")}</p>
      <p className="mt-4 text-sm text-slate-400">Available for bookings, orders and transport payments.</p>
    </section>
  );
};

export default WalletStatus;

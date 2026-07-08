import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import { useWalletContext } from "../../context/customer/WalletContext";
import { formatCurrency } from "../../utils/formatCurrency";

const WalletPage = () => {
  const { balance, currency, transactions } = useWalletContext();

  return (
    <div className="space-y-8">
      <SectionHeader title="Digital wallet" subtitle="Manage payments, receipts and refunds across DigitalSafaris." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-sm text-slate-400">Current balance</p>
          <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(balance, currency)}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <h3 className="text-lg font-semibold text-white">Recent transactions</h3>
        <div className="mt-4 space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
              <div className="flex items-center justify-between gap-4 text-sm text-slate-300">
                <span>{transaction.date}</span>
                <span className={transaction.amount < 0 ? "text-rose-400" : "text-emerald-400"}>{formatCurrency(transaction.amount, currency)}</span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{transaction.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletPage;

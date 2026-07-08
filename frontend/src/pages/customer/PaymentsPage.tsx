import React from "react";
import SectionHeader from "../../components/customer/ui/SectionHeader";
import { useWalletContext } from "../../context/customer/WalletContext";
import { formatCurrency } from "../../utils/formatCurrency";

const PaymentsPage = () => {
  const { balance, currency } = useWalletContext();

  return (
    <div className="space-y-8">
      <SectionHeader title="Payments" subtitle="Secure payment management for DigitalSafaris bookings and orders." />
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <p className="text-sm text-slate-400">Available balance</p>
        <p className="mt-3 text-3xl font-semibold text-white">{formatCurrency(balance, currency)}</p>
      </div>
    </div>
  );
};

export default PaymentsPage;

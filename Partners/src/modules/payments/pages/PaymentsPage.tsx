import React from 'react';
import { useQuery } from '@tanstack/react-query';
import * as paymentsService from '../services/paymentsService';

export default function PaymentsPage() {
  const { data: payouts } = useQuery({
    queryKey: ['payouts'],
    queryFn: paymentsService.fetchPayouts,
  });

  const { data: transactions } = useQuery({
    queryKey: ['transactions'],
    queryFn: paymentsService.fetchTransactions,
  });

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm uppercase text-slate-500">Financial Hub</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Payments & Payouts</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Total Balance</p>
          <p className="mt-2 text-3xl font-semibold">$24,580</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">Pending Payout</p>
          <p className="mt-2 text-3xl font-semibold">$3,200</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-600">This Month Revenue</p>
          <p className="mt-2 text-3xl font-semibold">$12,450</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {transactions?.slice(0, 5).map((tx) => (
            <div key={tx.id} className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <p className="font-medium text-sm">{tx.type}</p>
                <p className="text-xs text-slate-600">{tx.createdAt}</p>
              </div>
              <p className="font-semibold">${tx.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

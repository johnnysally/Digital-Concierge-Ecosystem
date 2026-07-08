import React, { createContext, ReactNode, useContext, useState } from "react";
import { WalletTransaction } from "../../types/customer";

interface WalletContextState {
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
  addTransaction: (transaction: WalletTransaction) => void;
}

const WalletContext = createContext<WalletContextState | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(0);
  const [currency] = useState("KES");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);

  const addTransaction = (transaction: WalletTransaction) => {
    setTransactions((current) => [transaction, ...current]);
    setBalance((current) => current + transaction.amount);
  };

  return (
    <WalletContext.Provider value={{ balance, currency, transactions, addTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
};

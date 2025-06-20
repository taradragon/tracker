
import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Transaction, TransactionType, IncomeTransaction, ExpenseTransaction, CertificateInvestmentTransaction, NewTransaction } from '../types';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transactionData: NewTransaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (updatedTransaction: Transaction) => void; // Added for updating transactions
  getSummary: () => { totalIncome: number; totalExpenses: number; totalInvestments: number; netBalance: number };
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);

  const addTransaction = (transactionData: NewTransaction) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: crypto.randomUUID(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const getSummary = () => {
    let totalIncome = 0;
    let totalExpenses = 0;
    let totalInvestments = 0;

    transactions.forEach(t => {
      if (t.type === TransactionType.INCOME) {
        totalIncome += t.amount;
      } else if (t.type === TransactionType.EXPENSE) {
        totalExpenses += t.amount;
      } else if (t.type === TransactionType.INVESTMENT) {
        // For summary, 'amount' is principal. Actual income is handled separately.
        totalInvestments += t.amount;
      }
    });
    const netBalance = totalIncome - totalExpenses;
    return { totalIncome, totalExpenses, totalInvestments, netBalance };
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction, deleteTransaction, updateTransaction, getSummary }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

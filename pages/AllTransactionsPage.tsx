
import React from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionTable from '../components/TransactionTable';

const AllTransactionsPage: React.FC = () => {
  const { transactions } = useTransactions();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-200">All Transactions</h1>
      <TransactionTable transactions={transactions} showTypeColumn={true} />
    </div>
  );
};

export default AllTransactionsPage;


import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { TransactionType, Transaction } from '../types';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import { PlusIconSolid } from '../constants';

const ExpensesPage: React.FC = () => {
  const { transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const expenseTransactions = transactions.filter(t => t.type === TransactionType.EXPENSE) as Transaction[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-red-400">Expenses</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
        >
          {PlusIconSolid}
          <span className="ml-2">Add Expense</span>
        </button>
      </div>
      <TransactionTable transactions={expenseTransactions} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Expense">
        <TransactionForm transactionType={TransactionType.EXPENSE} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default ExpensesPage;

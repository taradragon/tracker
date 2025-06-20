
import React, { useState } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { TransactionType, Transaction } from '../types';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import { PlusIconSolid } from '../constants';

const IncomePage: React.FC = () => {
  const { transactions } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const incomeTransactions = transactions.filter(t => t.type === TransactionType.INCOME) as Transaction[];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-400">Income</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
        >
          {PlusIconSolid}
          <span className="ml-2">Add Income</span>
        </button>
      </div>
      <TransactionTable transactions={incomeTransactions} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Income">
        <TransactionForm transactionType={TransactionType.INCOME} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default IncomePage;


import React from 'react';
import { Transaction, TransactionType, IncomeTransaction, ExpenseTransaction, CertificateInvestmentTransaction, Account } from '../types';
import { TrashIconSolid } from '../constants';
import { useTransactions } from '../contexts/TransactionContext';
import { useAccounts } from '../contexts/AccountContext'; // Added useAccounts

interface TransactionTableProps {
  transactions: Transaction[];
  showTypeColumn?: boolean; // To show 'Type' column, useful for AllTransactionsPage
  showAccountColumn?: boolean; // To show 'Account' column
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions, showTypeColumn = false, showAccountColumn = true }) => {
  const { deleteTransaction } = useTransactions();
  const { getAccountById } = useAccounts(); // Get account utility

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const getTransactionSpecificDetails = (transaction: Transaction) => {
    switch (transaction.type) {
      case TransactionType.INCOME:
        return `Source: ${(transaction as IncomeTransaction).source}`;
      case TransactionType.EXPENSE:
        return `Category: ${(transaction as ExpenseTransaction).category}`;
      case TransactionType.INVESTMENT:
        const cert = transaction as CertificateInvestmentTransaction;
        let details = `Cert: ${cert.certificateName}, Rate: ${cert.initialInterestRate}%, Term: ${cert.termYears}yr`;
        if (cert.interestStepDown && cert.interestStepDown.length > 0) {
          details += ` (w/ steps)`;
        }
        const firstYearMonthlyEarning = (cert.amount * (cert.initialInterestRate / 100)) / 12;
        details += ` | Est. Mo. Earn (Yr1): ${formatCurrency(firstYearMonthlyEarning)}`;
        return details;
      default:
        const unknownTransaction = transaction as any;
        if (unknownTransaction.type) {
          return `Unknown type: ${unknownTransaction.type}`;
        }
        return 'Details unavailable';
    }
  };
  
  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case TransactionType.INCOME: return 'text-green-400';
      case TransactionType.EXPENSE: return 'text-red-400';
      case TransactionType.INVESTMENT: return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  if (transactions.length === 0) {
    return <p className="text-center text-slate-400 py-8 text-lg">No transactions yet. Add one to get started!</p>;
  }

  return (
    <div className="overflow-x-auto bg-slate-800 shadow-xl rounded-lg">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-750">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Description</th>
            {showTypeColumn && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Type</th>}
            {showAccountColumn && <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Account</th>}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider min-w-[300px]">Details</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700">
          {transactions.map((transaction) => {
            const account = transaction.accountId ? getAccountById(transaction.accountId) : null;
            return (
              <tr key={transaction.id} className="hover:bg-slate-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{formatDate(transaction.date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">{transaction.description}</td>
                {showTypeColumn && <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getTypeColor(transaction.type)}`}>{transaction.type}</td>}
                {showAccountColumn && <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{account ? account.name : 'N/A'}</td>}
                <td className="px-6 py-4 text-sm text-slate-400 whitespace-normal break-words">{getTransactionSpecificDetails(transaction)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-semibold ${getTypeColor(transaction.type)}`}>
                  {transaction.type === TransactionType.EXPENSE ? '-' : ''}{formatCurrency(transaction.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => deleteTransaction(transaction.id)}
                    className="text-red-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-900/50"
                    aria-label={`Delete transaction ${transaction.description}`}
                  >
                    {TrashIconSolid}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;

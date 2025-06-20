
import React, { useState, useEffect } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { useAccounts } from '../contexts/AccountContext'; // Added useAccounts
import { TransactionType, IncomeTransaction, ExpenseTransaction, CertificateInvestmentTransaction, Transaction, NewTransaction, Account } from '../types';
import { PlusIconSolid, TrashIconSolid } from '../constants';

interface TransactionFormProps {
  transactionType: TransactionType;
  onClose: () => void;
  transactionToEdit?: Transaction | null;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transactionType, onClose, transactionToEdit }) => {
  const { addTransaction } = useTransactions();
  const { accounts } = useAccounts(); // Get accounts from context
  
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(''); // State for selected account

  // Income-specific
  const [source, setSource] = useState<string>('');
  // Expense-specific
  const [category, setCategory] = useState<string>('');
  // Investment-specific
  const [certificateName, setCertificateName] = useState<string>('');
  const [initialInterestRate, setInitialInterestRate] = useState<string>('');
  const [termYears, setTermYears] = useState<string>('');
  const [interestStepDowns, setInterestStepDowns] = useState<Array<{ yearTrigger: string; newRate: string }>>([]);

  useEffect(() => {
    if (transactionToEdit) {
      setDate(transactionToEdit.date);
      setDescription(transactionToEdit.description);
      setAmount(String(transactionToEdit.amount));
      setSelectedAccountId(transactionToEdit.accountId || '');

      if (transactionToEdit.type === TransactionType.INCOME) {
        setSource((transactionToEdit as IncomeTransaction).source);
      } else if (transactionToEdit.type === TransactionType.EXPENSE) {
        setCategory((transactionToEdit as ExpenseTransaction).category);
      } else if (transactionToEdit.type === TransactionType.INVESTMENT) {
        const investment = transactionToEdit as CertificateInvestmentTransaction;
        setCertificateName(investment.certificateName);
        setInitialInterestRate(String(investment.initialInterestRate));
        setTermYears(String(investment.termYears));
        setInterestStepDowns(
          investment.interestStepDown?.map(sd => ({ yearTrigger: String(sd.yearTrigger), newRate: String(sd.newRate) })) || []
        );
      }
    } else {
      // Reset form for new transaction
      setDate(new Date().toISOString().split('T')[0]);
      setDescription('');
      setAmount('');
      setSelectedAccountId('');
      setSource('');
      setCategory('');
      setCertificateName('');
      setInitialInterestRate('');
      setTermYears('');
      setInterestStepDowns([]);
    }
  }, [transactionToEdit, transactionType]);

  const handleAddStepDown = () => {
    setInterestStepDowns([...interestStepDowns, { yearTrigger: '', newRate: '' }]);
  };

  const handleRemoveStepDown = (index: number) => {
    setInterestStepDowns(interestStepDowns.filter((_, i) => i !== index));
  };

  const handleStepDownChange = (index: number, field: 'yearTrigger' | 'newRate', value: string) => {
    const newStepDowns = [...interestStepDowns];
    newStepDowns[index][field] = value;
    setInterestStepDowns(newStepDowns);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      alert('Please enter a valid positive amount/principal.');
      return;
    }

    let transactionData: NewTransaction;
    const commonData = { date, description, amount: numericAmount, accountId: selectedAccountId || undefined };

    switch (transactionType) {
      case TransactionType.INCOME:
        if (!source.trim()) {
            alert('Please enter a source for income.');
            return;
        }
        transactionData = { ...commonData, type: TransactionType.INCOME, source };
        addTransaction(transactionData);
        break;
      case TransactionType.EXPENSE:
        if (!category.trim()) {
            alert('Please enter a category for expense.');
            return;
        }
        transactionData = { ...commonData, type: TransactionType.EXPENSE, category };
        addTransaction(transactionData);
        break;
      case TransactionType.INVESTMENT:
        const numInitialInterestRate = parseFloat(initialInterestRate);
        const numTermYears = parseInt(termYears, 10);

        if (!certificateName.trim()) {
            alert('Please enter a certificate name.'); return;
        }
        if (isNaN(numInitialInterestRate) || numInitialInterestRate <= 0) {
            alert('Please enter a valid initial interest rate.'); return;
        }
        if (isNaN(numTermYears) || numTermYears <= 0) {
            alert('Please enter a valid term in years.'); return;
        }
        
        const parsedStepDowns = interestStepDowns
          .map(sd => ({
            yearTrigger: parseInt(sd.yearTrigger, 10),
            newRate: parseFloat(sd.newRate),
          }))
          .filter(sd => !isNaN(sd.yearTrigger) && sd.yearTrigger > 1 && sd.yearTrigger <= numTermYears && !isNaN(sd.newRate) && sd.newRate > 0);
        
        for (const sd of parsedStepDowns) {
            if (sd.yearTrigger <= 1 || sd.yearTrigger > numTermYears) {
                alert(`Invalid year trigger ${sd.yearTrigger} in step-down. Must be between 2 and ${numTermYears}.`);
                return;
            }
        }

        transactionData = { 
          ...commonData,
          type: TransactionType.INVESTMENT, 
          certificateName,
          initialInterestRate: numInitialInterestRate,
          termYears: numTermYears,
          interestStepDown: parsedStepDowns.length > 0 ? parsedStepDowns : undefined,
        };
        addTransaction(transactionData);
        break;
      default:
        console.error("Unhandled transaction type in form submission:", transactionType);
        return;
    }
    
    onClose();
  };

  const commonFields = (
    <>
      <div className="mb-4">
        <label htmlFor="date" className="block text-sm font-medium text-slate-300 mb-1">Date</label>
        <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required 
               className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-1">Description</label>
        <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} required 
               placeholder={transactionType === TransactionType.INVESTMENT ? "e.g., US Treasury Bond Series I" : "e.g., Monthly Salary, Groceries"}
               className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-1">
          {transactionType === TransactionType.INVESTMENT ? 'Principal Amount' : 'Amount'}
        </label>
        <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} required min="0.01" step="0.01"
               placeholder="0.00"
               className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
      </div>
      <div className="mb-6">
        <label htmlFor="account" className="block text-sm font-medium text-slate-300 mb-1">Account (Optional)</label>
        <select 
          id="account" 
          value={selectedAccountId} 
          onChange={(e) => setSelectedAccountId(e.target.value)}
          className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"
        >
          <option value="">No Account</option>
          {accounts.map((account: Account) => (
            <option key={account.id} value={account.id}>{account.name}</option>
          ))}
        </select>
        {accounts.length === 0 && <p className="text-xs text-slate-400 mt-1">No accounts created yet. You can add accounts on the 'Accounts' page.</p>}
      </div>
    </>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {commonFields}
      {transactionType === TransactionType.INCOME && (
        <div className="mb-4">
          <label htmlFor="source" className="block text-sm font-medium text-slate-300 mb-1">Source</label>
          <input type="text" id="source" value={source} onChange={(e) => setSource(e.target.value)} required 
                 placeholder="e.g., Salary, Freelance Work"
                 className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
        </div>
      )}
      {transactionType === TransactionType.EXPENSE && (
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-slate-300 mb-1">Category</label>
          <input type="text" id="category" value={category} onChange={(e) => setCategory(e.target.value)} required 
                 placeholder="e.g., Food, Transport, Utilities"
                 className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
        </div>
      )}
      {transactionType === TransactionType.INVESTMENT && (
        <>
          <div className="mb-4">
            <label htmlFor="certificateName" className="block text-sm font-medium text-slate-300 mb-1">Certificate Name</label>
            <input type="text" id="certificateName" value={certificateName} onChange={(e) => setCertificateName(e.target.value)} required 
                   placeholder="e.g., 5-Year CD, Treasury Note"
                   className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="initialInterestRate" className="block text-sm font-medium text-slate-300 mb-1">Initial Annual Rate (%)</label>
              <input type="number" id="initialInterestRate" value={initialInterestRate} onChange={(e) => setInitialInterestRate(e.target.value)} required min="0.01" step="0.01"
                     placeholder="e.g., 5.0"
                     className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
            </div>
            <div>
              <label htmlFor="termYears" className="block text-sm font-medium text-slate-300 mb-1">Term (Years)</label>
              <input type="number" id="termYears" value={termYears} onChange={(e) => setTermYears(e.target.value)} required min="1" step="1"
                     placeholder="e.g., 5"
                     className="w-full p-2 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"/>
            </div>
          </div>
          <div className="mb-4 space-y-3">
            <h4 className="text-sm font-medium text-slate-300 mb-1">Interest Rate Step-Downs (Optional)</h4>
            {interestStepDowns.map((step, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border border-slate-600 rounded-md">
                <input 
                  type="number" 
                  placeholder="Year (e.g. 2)" 
                  value={step.yearTrigger}
                  min="2"
                  max={termYears || undefined}
                  onChange={(e) => handleStepDownChange(index, 'yearTrigger', e.target.value)}
                  className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"
                />
                <input 
                  type="number" 
                  placeholder="New Rate % (e.g. 4.5)" 
                  value={step.newRate}
                  min="0.01"
                  step="0.01"
                  onChange={(e) => handleStepDownChange(index, 'newRate', e.target.value)}
                  className="w-full p-2 bg-slate-600 border border-slate-500 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100"
                />
                <button type="button" onClick={() => handleRemoveStepDown(index)} className="p-2 text-red-500 hover:text-red-400">
                  {TrashIconSolid}
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={handleAddStepDown}
              className="flex items-center text-sm text-sky-400 hover:text-sky-300 py-1"
            >
              {PlusIconSolid} <span className="ml-1">Add Step-Down</span>
            </button>
          </div>
        </>
      )}
      <div className="flex justify-end space-x-3 pt-2">
        <button type="button" onClick={onClose} 
                className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500">
          Cancel
        </button>
        <button type="submit" 
                className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500">
          Save Transaction
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;

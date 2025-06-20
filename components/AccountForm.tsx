
import React, { useState } from 'react';
import { useAccounts } from '../contexts/AccountContext';

interface AccountFormProps {
  onClose: () => void;
}

const AccountForm: React.FC<AccountFormProps> = ({ onClose }) => {
  const [name, setName] = useState<string>('');
  const { addAccount } = useAccounts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Account name cannot be empty.');
      return;
    }
    addAccount(name);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="accountName" className="block text-sm font-medium text-slate-300 mb-1">
          Account Name
        </label>
        <input
          type="text"
          id="accountName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g., Savings Account, Main Checking"
          className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md focus:ring-sky-500 focus:border-sky-500 text-slate-100 placeholder-slate-400"
        />
      </div>
      {/* Future: Add field for Account Type if needed */}
      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-300 bg-slate-600 hover:bg-slate-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Add Account
        </button>
      </div>
    </form>
  );
};

export default AccountForm;

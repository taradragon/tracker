
import React, { useState } from 'react';
import { useAccounts } from '../contexts/AccountContext';
import Modal from '../components/Modal';
import AccountForm from '../components/AccountForm';
import { PlusIconSolid, AccountIconSVG } from '../constants';
import { Account } from '../types';

const AccountsPage: React.FC = () => {
  const { accounts } = useAccounts();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-sky-400 flex items-center">
          {AccountIconSVG} <span className="ml-2">My Accounts</span>
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
          aria-label="Add new account"
        >
          {PlusIconSolid}
          <span className="ml-2">Add Account</span>
        </button>
      </div>

      {accounts.length === 0 ? (
        <div className="text-center text-slate-400 py-10 bg-slate-800 rounded-lg shadow-xl">
          <p className="text-xl mb-2">No accounts found.</p>
          <p>Click "Add Account" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account: Account) => (
            <div key={account.id} className="bg-slate-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center space-x-3 mb-3">
                 <div className="p-2 bg-slate-700 rounded-full text-sky-400">
                    {AccountIconSVG}
                 </div>
                <h2 className="text-xl font-semibold text-sky-300 truncate" title={account.name}>{account.name}</h2>
              </div>
              <p className="text-sm text-slate-400">Account ID: <span className="font-mono text-xs">{account.id}</span></p>
              {/* Future: Display account type or balance here */}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Account">
        <AccountForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default AccountsPage;

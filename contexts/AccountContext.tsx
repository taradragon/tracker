
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Account } from '../types';

interface AccountContextType {
  accounts: Account[];
  addAccount: (name: string) => void;
  getAccountById: (id: string) => Account | undefined;
  // Future: deleteAccount, updateAccount
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useLocalStorage<Account[]>('accounts', []);

  const addAccount = useCallback((name: string) => {
    if (!name.trim()) {
        alert("Account name cannot be empty.");
        return;
    }
    const newAccount: Account = {
      id: crypto.randomUUID(),
      name: name.trim(),
    };
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
  }, [setAccounts]);

  const getAccountById = useCallback((id: string): Account | undefined => {
    return accounts.find(acc => acc.id === id);
  }, [accounts]);

  return (
    <AccountContext.Provider value={{ accounts, addAccount, getAccountById }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccounts = (): AccountContextType => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccounts must be used within an AccountProvider');
  }
  return context;
};


export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
  INVESTMENT = 'Investment',
}

export interface Account {
  id: string;
  name: string;
  // Future: type?: 'Checking' | 'Savings' | 'Investment' | 'Credit Card';
  // Future: initialBalance?: number;
}

export interface BaseTransaction {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  description: string;
  amount: number; // For Investments, this is the Principal Amount
  accountId?: string; // Links transaction to a specific account
}

export interface IncomeTransaction extends BaseTransaction {
  type: TransactionType.INCOME;
  source: string;
}

export interface ExpenseTransaction extends BaseTransaction {
  type: TransactionType.EXPENSE;
  category: string;
}

export interface CertificateInvestmentTransaction extends BaseTransaction {
  type: TransactionType.INVESTMENT;
  certificateName: string;
  initialInterestRate: number; // Annual rate as percentage, e.g., 5 for 5%
  termYears: number;
  interestStepDown?: Array<{ yearTrigger: number; newRate: number }>;
  lastIncomeClaimedDate?: string; // YYYY-MM format, tracks the last month for which income was processed
}

export type Transaction = IncomeTransaction | ExpenseTransaction | CertificateInvestmentTransaction;

// For form state & addTransaction context function.
export type NewIncomeTransaction = Omit<IncomeTransaction, 'id'>;
export type NewExpenseTransaction = Omit<ExpenseTransaction, 'id'>;
export type NewCertificateInvestmentTransaction = Omit<CertificateInvestmentTransaction, 'id'>;

export type NewTransaction =
  | NewIncomeTransaction
  | NewExpenseTransaction
  | NewCertificateInvestmentTransaction;

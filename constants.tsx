
import React from 'react';

export const APP_NAME = "FinTrack Pro";

export const NAV_LINKS = [
  { name: 'Dashboard', path: '/' },
  { name: 'Accounts', path: '/accounts'},
  { name: 'Income', path: '/income' },
  { name: 'Expenses', path: '/expenses' },
  { name: 'Investments', path: '/investments' },
  { name: 'All Transactions', path: '/transactions' },
];

export const HomeIconSVG: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955M3.75 12V21.75A.75.75 0 004.5 22.5h15a.75.75 0 00.75-.75V12M12 22.5V15" />
  </svg>
);

export const PlusIconSolid: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

export const TrashIconSolid: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.177-2.34.299A.75.75 0 003 5.25v1.5a.75.75 0 00.75.75H4.5v7.5A2.75 2.75 0 007.25 17h5.5A2.75 2.75 0 0015.5 14.25V7.5h.75a.75.75 0 00.75-.75v-1.5a.75.75 0 00-.66-.748 42.43 42.43 0 00-2.34-.3V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.414 0 .75.336.75.75V15a.75.75 0 01-1.5 0V4.75A.75.75 0 0110 4z" clipRule="evenodd" />
  </svg>
);

export const IncomeIcon: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-green-400">
     <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.219 12.768 11 12 11c-.768 0-1.536.219-2.121.659H9.879Z" />
     <path strokeLinecap="round" strokeLinejoin="round" d="M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const ExpenseIcon: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
  </svg>
);

export const InvestmentIcon: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
  </svg>
);

export const WalletIcon: React.ReactNode = (
   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-sky-400">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 12m18 0v6.062c0 .375-.19.718-.484.916l-3.72 2.48a2.25 2.25 0 0 1-2.592 0l-3.72-2.48A1.125 1.125 0 0 0 9 18.062V12m12 0c0-1.032-.42-1.974-1.104-2.648A3.375 3.375 0 0 0 16.5 9H7.5a3.375 3.375 0 0 0-3.396.352C3.42 9.974 3 10.968 3 12" />
  </svg>
);

export const AccountIconSVG: React.ReactNode = (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3M3.75 15H2.25v-2.25A2.25 2.25 0 0 1 4.5 10.5h15a2.25 2.25 0 0 1 2.25 2.25V15M1.5 12.75V15A2.25 2.25 0 0 0 3.75 17.25h16.5A2.25 2.25 0 0 0 22.5 15V12.75m-21 0A2.25 2.25 0 0 0 3.75 15h16.5a2.25 2.25 0 0 0 2.25-2.25m0 0V6.75A2.25 2.25 0 0 0 20.25 4.5H3.75A2.25 2.25 0 0 0 1.5 6.75v6Z" />
  </svg>
);

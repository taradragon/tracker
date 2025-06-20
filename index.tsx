
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { TransactionProvider } from './contexts/TransactionContext';
import { AccountProvider } from './contexts/AccountContext'; // Added AccountProvider

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HashRouter>
      <AccountProvider> {/* Added AccountProvider */}
        <TransactionProvider>
          <App />
        </TransactionProvider>
      </AccountProvider> {/* Added AccountProvider */}
    </HashRouter>
  </React.StrictMode>
);

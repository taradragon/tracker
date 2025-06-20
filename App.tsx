import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BottomNavBar from "./components/BottomNavBar";
import DashboardPage from "./pages/DashboardPage";
import IncomePage from "./pages/IncomePage";
import ExpensesPage from "./pages/ExpensesPage";
import InvestmentsPage from "./pages/InvestmentsPage";
import AllTransactionsPage from "./pages/AllTransactionsPage";
import AccountsPage from "./pages/AccountsPage"; // Added AccountsPage import
import { APP_NAME } from "./constants";

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100">
      {/* Top Navbar: hidden on small screens */}
      <div className="hidden sm:block">
        <Navbar appName={APP_NAME} />
      </div>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/accounts" element={<AccountsPage />} />{" "}
          {/* Added AccountsPage route */}
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/investments" element={<InvestmentsPage />} />
          <Route path="/transactions" element={<AllTransactionsPage />} />
        </Routes>
      </main>
      {/* Bottom Navbar: only on mobile */}
      <BottomNavBar />
      <footer className="text-center p-4 text-sm text-slate-400 border-t border-slate-700">
        © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
      </footer>
    </div>
  );
};

export default App;

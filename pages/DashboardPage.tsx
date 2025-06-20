import React, { useState } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import StatCard from "../components/StatCard";
import TransactionTable from "../components/TransactionTable";
import Modal from "../components/Modal";
import TransactionForm from "../components/TransactionForm";
import {
  IncomeIcon,
  ExpenseIcon,
  InvestmentIcon,
  WalletIcon,
  PlusIconSolid,
} from "../constants";
import { TransactionType } from "../types";

const formatCurrency = (
  amount: number,
  options?: { signDisplay?: "auto" | "never" | "always" | "exceptZero" }
) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  });
};

const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

// Helper function to describe an SVG arc for a donut segment
const describeDonutArc = (
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number,
  startAngle: number,
  endAngle: number
): string => {
  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    startOuter.x,
    startOuter.y,
    "A",
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    0,
    endOuter.x,
    endOuter.y,
    "L",
    endInner.x,
    endInner.y,
    "A",
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    1,
    startInner.x,
    startInner.y,
    "Z",
  ].join(" ");

  return d;
};

const RingChart: React.FC<{
  income: number;
  expenses: number;
  netBalance: number;
}> = ({ income, expenses, netBalance }) => {
  const total = income + expenses;

  // Responsive: use smaller SVG and radii for mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const outerRadius = isMobile ? 60 : 80;
  const innerRadius = isMobile ? 38 : 55;
  const cx = isMobile ? 75 : 100;
  const cy = isMobile ? 75 : 100;
  const svgSize = isMobile ? 150 : 200;

  if (total === 0) {
    return (
      <div
        className="text-center text-slate-400 py-10 relative"
        style={{ width: svgSize, height: svgSize, margin: "0 auto" }}
      >
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          className="transform -rotate-90"
        >
          <circle
            cx={cx}
            cy={cy}
            r={outerRadius}
            fill="none"
            stroke="#475569"
            strokeWidth={isMobile ? 8 : 10}
          />
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius}
            fill="none"
            stroke="#334155"
            strokeWidth={2}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-lg text-slate-400">No Data</p>
          <p className="text-xs text-slate-500">Add transactions</p>
        </div>
        <div className="mt-4 space-y-1 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 bg-slate-600 rounded-full"></span>
            <span className="text-xs text-slate-400">
              Income: {formatCurrency(0)}
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 bg-slate-600 rounded-full"></span>
            <span className="text-xs text-slate-400">
              Expenses: {formatCurrency(0)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  const incomeAngle = Math.max(0, (income / total) * 360); // Ensure non-negative
  const expenseAngle = Math.max(0, (expenses / total) * 360); // Ensure non-negative

  // Prevent NaN if total is 0 but income/expense might be tiny (should be caught by total === 0)
  const finalIncomeAngle = total > 0 && income > 0 ? incomeAngle : 0;
  const finalExpenseAngle = total > 0 && expenses > 0 ? expenseAngle : 0;

  return (
    <div
      className="flex flex-col items-center relative"
      style={{ width: svgSize, height: svgSize, margin: "0 auto" }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="transform -rotate-90"
      >
        {/* Background Ring (optional, for empty state or full track) */}
        <circle
          cx={cx}
          cy={cy}
          r={(outerRadius + innerRadius) / 2}
          fill="none"
          stroke="#334155"
          strokeWidth={outerRadius - innerRadius}
        />

        {/* Income Slice */}
        {finalIncomeAngle > 0 && (
          <path
            d={describeDonutArc(
              cx,
              cy,
              outerRadius,
              innerRadius,
              0,
              finalIncomeAngle
            )}
            className="fill-green-500"
          />
        )}
        {/* Expense Slice */}
        {finalExpenseAngle > 0 && (
          <path
            d={describeDonutArc(
              cx,
              cy,
              outerRadius,
              innerRadius,
              finalIncomeAngle,
              finalIncomeAngle + finalExpenseAngle
            )}
            className="fill-red-500"
          />
        )}
      </svg>
      <div
        className="absolute left-0 w-full flex flex-col items-center justify-center pointer-events-none"
        style={{ top: "25%" }}
      >
        <span className="text-xs text-slate-400">Net Balance</span>
        <span
          className={`text-xl font-bold ${
            netBalance >= 0 ? "text-sky-400" : "text-orange-400"
          }`}
        >
          {formatCurrency(netBalance, { signDisplay: "auto" })}
        </span>
      </div>
      <div className="mt-4 space-y-1 text-center">
        {income > 0 && (
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-xs text-slate-300">
              Income: {formatCurrency(income)}
            </span>
          </div>
        )}
        {income === 0 && (
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 bg-slate-600 rounded-full"></span>
            <span className="text-xs text-slate-400">
              Income: {formatCurrency(income)}
            </span>
          </div>
        )}
        {expenses > 0 && (
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-xs text-slate-300">
              Expenses: {formatCurrency(expenses)}
            </span>
          </div>
        )}
        {expenses === 0 && (
          <div className="flex items-center justify-center space-x-2">
            <span className="w-3 h-3 bg-slate-600 rounded-full"></span>
            <span className="text-xs text-slate-400">
              Expenses: {formatCurrency(expenses)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { transactions, getSummary } = useTransactions();
  const summary = getSummary();

  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold text-sky-400 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-400 mt-1">
          Welcome back! Here's your financial overview.
        </p>
      </header>

      <section className="bg-slate-800 pt-6 pb-8 px-4 rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold text-slate-200 mb-4 text-center">
          Financial Snapshot
        </h2>
        <RingChart
          income={summary.totalIncome}
          expenses={summary.totalExpenses}
          netBalance={summary.netBalance}
        />
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setIsIncomeModalOpen(true)}
          className="flex items-center justify-center w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 text-lg"
          aria-label="Add new income"
        >
          {PlusIconSolid}
          <span className="ml-2">Add Income</span>
        </button>
        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="flex items-center justify-center w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 text-lg"
          aria-label="Add new expense"
        >
          {PlusIconSolid}
          <span className="ml-2">Add Expense</span>
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={IncomeIcon}
          colorClass="text-green-400"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={ExpenseIcon}
          colorClass="text-red-400"
        />
        <StatCard
          title="Total Investments Principal"
          value={formatCurrency(summary.totalInvestments)}
          icon={InvestmentIcon}
          colorClass="text-blue-400"
        />
        <StatCard
          title="Net Balance (Income - Expenses)"
          value={formatCurrency(summary.netBalance)}
          icon={WalletIcon}
          colorClass={
            summary.netBalance >= 0 ? "text-sky-400" : "text-orange-400"
          }
        />
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-200 mb-4">
          Recent Transactions
        </h2>
        {recentTransactions.length > 0 ? (
          <TransactionTable
            transactions={recentTransactions}
            showTypeColumn={true}
          />
        ) : (
          <div className="bg-slate-800 p-6 rounded-lg shadow-lg text-center">
            <p className="text-slate-400">No transactions recorded yet.</p>
            <p className="text-slate-500 text-sm mt-1">
              Add income, expenses, or investments to see them here.
            </p>
          </div>
        )}
      </section>

      <Modal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        title="Add New Income"
      >
        <TransactionForm
          transactionType={TransactionType.INCOME}
          onClose={() => setIsIncomeModalOpen(false)}
        />
      </Modal>
      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Add New Expense"
      >
        <TransactionForm
          transactionType={TransactionType.EXPENSE}
          onClose={() => setIsExpenseModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default DashboardPage;

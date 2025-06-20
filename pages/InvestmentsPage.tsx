
import React, { useState, useMemo } from 'react';
import { useTransactions } from '../contexts/TransactionContext';
import { TransactionType, Transaction, CertificateInvestmentTransaction, IncomeTransaction } from '../types';
import TransactionTable from '../components/TransactionTable';
import Modal from '../components/Modal';
import TransactionForm from '../components/TransactionForm';
import { PlusIconSolid, WalletIcon } from '../constants'; // Added WalletIcon

interface ClaimableIncome {
  investment: CertificateInvestmentTransaction;
  periodIdentifier: string; // YYYY-MM
  monthlyIncome: number;
  status: 'due' | 'upcoming';
  payableDate: Date;
  daysUntilDue?: number;
}

const InvestmentsPage: React.FC = () => {
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const investmentTransactions = transactions.filter(
    t => t.type === TransactionType.INVESTMENT
  ) as CertificateInvestmentTransaction[];

  const calculateCurrentAnnualRate = (
    investment: CertificateInvestmentTransaction,
    referenceDate: Date // Date for which to calculate the rate (e.g., today or end of a specific period)
  ): number => {
    const investmentStartDate = new Date(investment.date);
    investmentStartDate.setUTCHours(0, 0, 0, 0);
    const effectiveReferenceDate = new Date(referenceDate);
    effectiveReferenceDate.setUTCHours(0,0,0,0);

    if (effectiveReferenceDate < investmentStartDate) return investment.initialInterestRate; // or 0 if rate shouldn't apply before start

    const ageInMilliseconds = effectiveReferenceDate.getTime() - investmentStartDate.getTime();
    const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    const fullYearsPassed = Math.floor(ageInYears);

    let currentRate = investment.initialInterestRate;
    if (investment.interestStepDown) {
      const sortedStepDowns = [...investment.interestStepDown].sort((a, b) => a.yearTrigger - b.yearTrigger);
      for (const step of sortedStepDowns) {
        if (fullYearsPassed + 1 >= step.yearTrigger) {
          currentRate = step.newRate;
        }
      }
    }
    return currentRate;
  };
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const totalEstimatedCurrentMonthlyIncome = useMemo(() => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    let totalIncome = 0;

    investmentTransactions.forEach(inv => {
      const investmentStartDate = new Date(inv.date);
      investmentStartDate.setUTCHours(0, 0, 0, 0);
      const termEndDate = new Date(investmentStartDate);
      termEndDate.setUTCFullYear(termEndDate.getUTCFullYear() + inv.termYears);
      termEndDate.setUTCHours(0,0,0,0);

      // Only consider active investments
      if (today < termEndDate && today >= investmentStartDate) {
        const currentRate = calculateCurrentAnnualRate(inv, today);
        if (currentRate > 0) {
          totalIncome += (inv.amount * (currentRate / 100)) / 12;
        }
      }
    });
    return totalIncome;
  }, [investmentTransactions, transactions]); // Re-run if investments change


  const upcomingAndDueIncomes = useMemo(() => {
    const allPotentialIncomes: ClaimableIncome[] = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const currentMonth_0_idx = today.getUTCMonth();
    const currentYear = today.getUTCFullYear();

    let nextMonth_0_idx = currentMonth_0_idx + 1;
    let nextMonthYear = currentYear;
    if (nextMonth_0_idx > 11) { // If current month is December
      nextMonth_0_idx = 0; // Next month is January
      nextMonthYear = currentYear + 1;
    }


    investmentTransactions.forEach(inv => {
      const investmentStartDate = new Date(inv.date);
      investmentStartDate.setUTCHours(0, 0, 0, 0);
      const payoutAnchorDay = investmentStartDate.getUTCDate();

      const termEndDate = new Date(investmentStartDate);
      termEndDate.setUTCFullYear(termEndDate.getUTCFullYear() + inv.termYears);
      termEndDate.setUTCHours(0,0,0,0);


      let lastClaimedYear: number | undefined;
      let lastClaimedMonth_1_idx: number | undefined; 

      if (inv.lastIncomeClaimedDate) {
        [lastClaimedYear, lastClaimedMonth_1_idx] = inv.lastIncomeClaimedDate.split('-').map(Number);
      }

      let loopPeriodDate = new Date(investmentStartDate);

      for (let i = 0; i < inv.termYears * 12 + 2; i++) { // Iterate a bit beyond term for safety
        const currentPeriodYear = loopPeriodDate.getUTCFullYear();
        const currentPeriodMonth_1_idx = loopPeriodDate.getUTCMonth() + 1;
        const periodIdentifier = `${currentPeriodYear}-${currentPeriodMonth_1_idx.toString().padStart(2, '0')}`;
        
        const periodActualEndDate = new Date(Date.UTC(currentPeriodYear, currentPeriodMonth_1_idx, 0)); // End of the current income period
        periodActualEndDate.setUTCHours(0,0,0,0);

        const payableDate = new Date(Date.UTC(currentPeriodYear, currentPeriodMonth_1_idx -1, payoutAnchorDay));
        payableDate.setUTCMonth(payableDate.getUTCMonth() + 1);
        payableDate.setUTCHours(0,0,0,0);

        if (loopPeriodDate > termEndDate && payableDate > termEndDate) {
            // Optimization: if loopPeriod is past term and payable date is also past term, unlikely to find more valid income.
            // Break only if no 'due' items for THIS investment are pending, and current loop is beyond next month.
            const isBeyondNextMonth = loopPeriodDate.getUTCFullYear() > nextMonthYear || 
                                    (loopPeriodDate.getUTCFullYear() === nextMonthYear && loopPeriodDate.getUTCMonth() > nextMonth_0_idx);
            if (isBeyondNextMonth && !allPotentialIncomes.some(p => p.investment.id === inv.id && p.status === 'due')) {
                 break;
            }
        }
        
        if (periodActualEndDate < investmentStartDate) {
            loopPeriodDate.setUTCMonth(loopPeriodDate.getUTCMonth() + 1);
            continue;
        }

        let isClaimed = false;
        if (lastClaimedYear && lastClaimedMonth_1_idx) {
          if (currentPeriodYear < lastClaimedYear) isClaimed = true;
          else if (currentPeriodYear === lastClaimedYear && currentPeriodMonth_1_idx <= lastClaimedMonth_1_idx) isClaimed = true;
        }

        if (!isClaimed && payableDate <= termEndDate) { // Income must be payable within the term
          const rate = calculateCurrentAnnualRate(inv, periodActualEndDate); // Rate for that specific period
          const monthlyIncome = (inv.amount * (rate / 100)) / 12;

          if (monthlyIncome <= 0) {
            loopPeriodDate.setUTCMonth(loopPeriodDate.getUTCMonth() + 1);
            continue;
          }

          if (today >= payableDate) { // Item is DUE
            allPotentialIncomes.push({
                investment: inv,
                periodIdentifier,
                monthlyIncome,
                status: 'due',
                payableDate,
            });
          } else { // Item is UPCOMING
            const payableYear = payableDate.getUTCFullYear();
            const payableMonth_0_idx = payableDate.getUTCMonth();

            const isInCurrentMonth = payableYear === currentYear && payableMonth_0_idx === currentMonth_0_idx;
            const isInNextMonth = payableYear === nextMonthYear && payableMonth_0_idx === nextMonth_0_idx;

            if (isInCurrentMonth || isInNextMonth) {
              const daysUntilDue = Math.ceil((payableDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              allPotentialIncomes.push({
                investment: inv,
                periodIdentifier,
                monthlyIncome,
                status: 'upcoming',
                payableDate,
                daysUntilDue: daysUntilDue > 0 ? daysUntilDue : 0, // Ensure non-negative
              });
            }
          }
        }
        loopPeriodDate.setUTCMonth(loopPeriodDate.getUTCMonth() + 1);
      }
    });
    return allPotentialIncomes.sort((a,b) => a.payableDate.getTime() - b.payableDate.getTime());
  }, [transactions, investmentTransactions]); // Depends on all transactions for lastClaimedDate updates

  const handleAcceptIncome = (item: ClaimableIncome) => {
    const incomeTransaction: Omit<IncomeTransaction, 'id'> = {
      type: TransactionType.INCOME,
      date: item.payableDate.toISOString().split('T')[0],
      description: `Monthly income from ${item.investment.certificateName} for ${getMonthYearString(item.periodIdentifier)}`,
      amount: parseFloat(item.monthlyIncome.toFixed(2)),
      source: `Investment: ${item.investment.certificateName}`,
      accountId: item.investment.accountId // Preserve accountId if set on investment
    };
    addTransaction(incomeTransaction);

    const updatedInvestment: CertificateInvestmentTransaction = {
      ...item.investment,
      lastIncomeClaimedDate: item.periodIdentifier,
    };
    updateTransaction(updatedInvestment);
  };
  
  const getMonthYearString = (periodIdentifier: string) => {
    const [year, month] = periodIdentifier.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-400">Investments</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
        >
          {PlusIconSolid}
          <span className="ml-2">Add Investment</span>
        </button>
      </div>

      <section className="bg-slate-800 p-6 rounded-xl shadow-xl">
        <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-slate-700 text-sky-400">
                {WalletIcon} 
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">Total Estimated Current Monthly Income</p>
                <p className="text-2xl font-semibold text-sky-400">{formatCurrency(totalEstimatedCurrentMonthlyIncome)}</p>
            </div>
        </div>
      </section>

      {upcomingAndDueIncomes.length > 0 && (
        <section className="p-4 sm:p-6 bg-slate-800 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-sky-300 mb-4">Upcoming & Due Investment Income (This & Next Month)</h2>
          {investmentTransactions.length === 0 ? (
             <p className="text-slate-400 text-center py-4">Add investments to see upcoming income.</p>
          ) : upcomingAndDueIncomes.length === 0 ? (
            <p className="text-slate-400 text-center py-4">No investment income due or upcoming in the current or next month.</p>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {upcomingAndDueIncomes.map((item, index) => (
                <div key={`${item.investment.id}-${item.periodIdentifier}-${index}`} className="p-4 bg-slate-700 rounded-md shadow hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <p className="font-semibold text-slate-100">{item.investment.certificateName}</p>
                      <p className="text-sm text-slate-300">Income for: <span className="font-medium">{getMonthYearString(item.periodIdentifier)}</span></p>
                      <p className="text-sm text-slate-300">Payable on: <span className="font-medium">{item.payableDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-green-400">{formatCurrency(item.monthlyIncome)}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-right">
                    {item.status === 'due' ? (
                      <button
                        onClick={() => handleAcceptIncome(item)}
                        className="bg-green-500 hover:bg-green-400 text-white text-sm font-semibold py-2 px-3 rounded-md shadow transition-colors"
                      >
                        Accept Income
                      </button>
                    ) : (
                      <p className="text-sm text-sky-400">
                        Due in {item.daysUntilDue} day{item.daysUntilDue === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
       {investmentTransactions.length > 0 && upcomingAndDueIncomes.length === 0 && (
         <section className="p-4 sm:p-6 bg-slate-800 rounded-lg shadow-xl text-center">
            <p className="text-slate-400">No investment income due or upcoming in the current or next month for your active investments.</p>
         </section>
        )}


      <TransactionTable transactions={investmentTransactions} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Investment">
        <TransactionForm transactionType={TransactionType.INVESTMENT} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default InvestmentsPage;


import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass?: string; // e.g. text-green-500
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, colorClass = 'text-sky-400' }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex items-center space-x-4">
      <div className={`p-3 rounded-full bg-slate-700 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium">{title}</p>
        <p className={`text-2xl font-semibold ${colorClass}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatCard;

import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaDollarSign,
  FaMoneyBillWave,
  FaChartBar,
  FaList,
} from "react-icons/fa";

const navItems = [
  { to: "/", label: "Dashboard", icon: <FaHome className="w-6 h-6" /> },
  { to: "/accounts", label: "Accounts", icon: <FaUser className="w-6 h-6" /> },
  {
    to: "/income",
    label: "Income",
    icon: <FaDollarSign className="w-6 h-6" />,
  },
  {
    to: "/expenses",
    label: "Expenses",
    icon: <FaMoneyBillWave className="w-6 h-6" />,
  },
  {
    to: "/investments",
    label: "Investments",
    icon: <FaChartBar className="w-6 h-6" />,
  },
  {
    to: "/transactions",
    label: "Transactions",
    icon: <FaList className="w-6 h-6" />,
  },
];

const BottomNavBar: React.FC = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-700 flex justify-around items-center h-16 sm:hidden">
    {navItems.map((item) => (
      <NavLink
        key={item.to}
        to={item.to}
        className={({ isActive }) =>
          `flex flex-col items-center justify-center text-xs px-1 py-1 transition-colors duration-150 ${
            isActive
              ? "text-sky-400 font-bold"
              : "text-slate-400 hover:text-sky-300"
          }`
        }
        end={item.to === "/"}
      >
        {item.icon}
        {/* Hide label on mobile, show only icon */}
        <span className="mt-1 hidden xs:inline">{item.label}</span>
      </NavLink>
    ))}
  </nav>
);

export default BottomNavBar;
